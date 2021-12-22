<template>
  <div
    :key="
      isSurveyEditor
        ? question.localizableStrings.pastReferenceVariable.htmlValues.default ||
          question.localizableStrings.pastReferenceVariable.renderedText
        : question.localizableStrings.pastReferenceVariable.renderedHtml
    "
    class="form-inline date-select"
  >
    <div class="row">
      <div
        :key="
          isSurveyEditor
            ? question.localizableStrings.futureReferenceVariable.htmlValues.default ||
              question.localizableStrings.futureReferenceVariable.renderedText
            : question.localizableStrings.futureReferenceVariable.renderedHtml
        "
        class="col-sm-12 pb-1"
      >
        <select
          ref="yearRef"
          class="form-control date-select-year mr-1"
          :id="question.inputId"
          v-model="state.pendingValue['year']"
          @change="updated('year')"
        >
          <option value="">(Year)</option>
          <option v-for="year of yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
        <select
          ref="monthRef"
          class="form-control date-select-month mr-1"
          :id="question.inputId + '-month'"
          v-model="state.pendingValue['month']"
          @change="updated('month')"
        >
          <option value="">(Month)</option>
          <option
            v-for="(monthname, monthidx) of monthOptions"
            :key="monthidx"
            :value="'' + monthidx"
            >{{ monthname }}</option
          >
        </select>
        <select
          ref="dayRef"
          class="form-control date-select-day mr-1"
          :id="question.inputId + '-day'"
          v-model="state.pendingValue['day']"
          @change="updated('day')"
        >
          <option value="">(Day)</option>
          <option v-for="day of dayOptions" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, computed, ref } from "@vue/composition-api";
import { format, toDate } from "date-fns";
export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const q = props.question;

    const parseValue = val => {
      const pending = { year: "", month: "", day: "" };
      if (val) {
        const m = ("" + val).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        const dt = m ? new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])) : null;
        if (dt) {
          pending.year = "" + dt.getFullYear();
          pending.month = "" + (dt.getMonth() + 1);
          pending.day = "" + dt.getDate();
        }
      }
      return pending;
    };

    const state = reactive({
      pastDate: props.question.survey
        .getTextProcessor()
        .processText(props.question.pastReferenceVariable, true),
      futureDate: props.question.survey
        .getTextProcessor()
        .processText(props.question.futureReferenceVariable, true),
      pendingDate: "",
      pendingValue: parseValue(props.question.value)
    });
    const dayRef = ref();
    const monthRef = ref();
    const yearRef = ref();

    //Need to bind to these to be reactive.
    q.createLocalizableString("pastReferenceVariable", this);
    q.createLocalizableString("futureReferenceVariable", this);

    q.setLocalizableStringText("pastReferenceVariable", q.pastReferenceVariable);
    q.setLocalizableStringText("futureReferenceVariable", q.futureReferenceVariable);

    const pastReferenceVariable = q.localizableStrings.pastReferenceVariable;
    const futureReferenceVariable = q.localizableStrings.futureReferenceVariable;

    pastReferenceVariable.onGetTextCallback = text => {
      text = q.survey.getTextProcessor().processText(q.pastReferenceVariable, true);
      if (text?.includes("T")) text = text.split("T")[0];
      if (state.pastDate !== text) state.pastDate = text;
      return text;
    };

    futureReferenceVariable.onGetTextCallback = text => {
      text = q.survey.getTextProcessor().processText(q.futureReferenceVariable, true);
      if (text?.includes("T")) text = text.split("T")[0];
      if (state.futureDate !== text) state.futureDate = text;
      return text;
    };

    q.valueChangedCallback = () => {
      const pending = parseValue(q.value);
      if (pending.year) {
        state.pendingValue = pending;
      }
      q.value = pending;
    };

    const updated = field => {
      const p = state.pendingValue;
      if (p.day && dayOptions.value.indexOf(p.day) === -1) p.day = "";
      if (p.year && p.month && p.day) {
        let dt = "" + p.year + "-";
        dt += (p.month.length < 2 ? "0" : "") + p.month;
        dt += "-" + (p.day.length < 2 ? "0" : "") + p.day;
        props.question.value = dt;
      } else {
        props.question.value = null;
        if (field === "year") monthRef.value.focus();
        else if (field === "month") dayRef.value.focus();
      }
    };

    const yearOptions = computed(() => {
      let curYear = new Date().getFullYear();
      let firstYear = curYear;

      if (q.pastDateHandler === "Years Behind") {
        firstYear -= q.yearsBehind;
      } else if (q.pastDateHandler === "Earliest Date") {
        firstYear = q.earliestDate ? parseInt(q.earliestDate.split("-")[0]) : firstYear;
      } else if (q.pastDateHandler === "Past Reference Variable") {
        firstYear = state.pastDate ? parseInt(state.pastDate.split("-")[0]) : firstYear;
      }

      if (q.futureDateHandler === "Years Ahead") {
        curYear += q.yearsAhead;
      } else if (q.futureDateHandler === "Latest Date") {
        curYear = q.latestDate ? parseInt(q.latestDate.split("-")[0]) : curYear;
      } else if (q.futureDateHandler === "Future Reference Variable") {
        curYear = state.futureDate ? parseInt(state.futureDate.split("-")[0]) : curYear;
      }

      const opts = [];
      for (let yr = curYear; yr >= firstYear; yr--) {
        opts.push("" + yr);
      }
      return opts;
    });

    const monthOptions = computed(() => {
      const months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
      };

      const p = state.pendingValue;
      if (!p?.year) {
        return months;
      }

      let startMonth = 0;
      let endMonth = 12;

      if (q.pastDateHandler !== "Years Behind") {
        const pastDateItems = {
          "Earliest Date": q.earliestDate ? q.earliestDate.split("-") : "",
          "Past Reference Variable": state.pastDate ? state.pastDate.split("-") : ""
        }[q.pastDateHandler];

        const earliestDate = new Date(pastDateItems[0], pastDateItems[1] - 1, pastDateItems[2]);
        startMonth =
          parseInt(p.year) == earliestDate.getFullYear() ? earliestDate.getMonth() : startMonth;
      }

      if (q.futureDateHandler !== "Years Ahead") {
        const futureDateItems = {
          "Latest Date": q.latestDate ? q.latestDate.split("-") : "",
          "Future Reference Variable": state.futureDate ? state.futureDate.split("-") : ""
        }[q.futureDateHandler];

        const latestDate = new Date(futureDateItems[0], futureDateItems[1] - 1, futureDateItems[2]);
        endMonth =
          parseInt(p.year) == latestDate.getFullYear() ? latestDate.getMonth() + 1 : endMonth;
      }

      // this is to maintain the key-value pair such that we can use them later
      const calculatedMonths = {};
      for (const month of Object.entries(months).slice(startMonth, endMonth)) {
        calculatedMonths[month[0]] = month[1];
      }

      return calculatedMonths;
    });

    const dayOptions = computed(() => {
      const opts = [];
      const p = state.pendingValue;
      if (!p?.year || !p?.month) return opts;

      let startDay = 1;
      let endDay = new Date(parseInt(p.year), parseInt(p.month), 0).getDate();

      if (q.pastDateHandler !== "Years Behind") {
        const pastDateItems = {
          "Earliest Date": q.earliestDate ? q.earliestDate.split("-") : "",
          "Past Reference Variable": state.pastDate ? state.pastDate.split("-") : ""
        }[q.pastDateHandler];

        const earliestDate = new Date(pastDateItems[0], pastDateItems[1] - 1, pastDateItems[2]);
        startDay =
          parseInt(p.year) == earliestDate.getFullYear() &&
          parseInt(p.month) == earliestDate.getMonth() + 1
            ? earliestDate.getDate()
            : startDay;
      }

      if (q.futureDateHandler !== "Years Ahead") {
        const futureDateItems = {
          "Latest Date": q.latestDate ? q.latestDate.split("-") : "",
          "Future Reference Variable": state.futureDate ? state.futureDate.split("-") : ""
        }[q.futureDateHandler];

        const latestDate = new Date(futureDateItems[0], futureDateItems[1] - 1, futureDateItems[2]);
        endDay =
          parseInt(p.year) == latestDate.getFullYear() &&
          parseInt(p.month) == latestDate.getMonth() + 1
            ? latestDate.getDate()
            : endDay;
      }

      for (let day = startDay; day <= endDay; day++) {
        opts.push("" + day);
      }

      return opts;
    });

    return {
      updated,
      dayOptions,
      monthOptions,
      yearOptions,
      dayRef,
      monthRef,
      state,
      value: props.question.value
    };
  }
});
</script>
