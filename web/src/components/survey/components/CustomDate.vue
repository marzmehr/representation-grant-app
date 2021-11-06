<template>
  <div class="form-inline date-select">
    <div class="row">
      <div class="col-sm-12 pb-1">
        <select
          ref="year"
          class="form-control date-select-year mr-1"
          :id="question.inputId"
          v-model="pendingValue['year']"
          @change="updated('year')"
        >
          <option value="">(Year)</option>
          <option v-for="year of yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
        <select
          ref="month"
          class="form-control date-select-month mr-1"
          :id="question.inputId + '-month'"
          v-model="pendingValue['month']"
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
          ref="day"
          class="form-control date-select-day mr-1"
          :id="question.inputId + '-day'"
          v-model="pendingValue['day']"
          @change="updated('day')"
        >
          <option value="">(Day)</option>
          <option v-for="day of dayOptions" :key="day" :value="day">{{ day }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: Object
  },
  data() {
    return {
      pendingValue: this.parseValue(this.question.value),
      value: this.question.value,
      pastDate: this.question.survey
        .getTextProcessor()
        .processText(this.question.pastReferenceVariable, true),
      futureDate: this.question.survey
        .getTextProcessor()
        .processText(this.question.futureReferenceVariable, true)
    };
  },
  computed: {
    yearOptions() {
      const q = this.question || {};
      let curYear = new Date().getFullYear();
      let firstYear = curYear;

      if (q.pastDateHandler === "Years Behind") {
        firstYear -= q.yearsBehind;
      } else if (q.pastDateHandler === "Earliest Date") {
        firstYear = parseInt(q.earliestDate.split("-")[0]);
      } else if (q.pastDateHandler === "Past Reference Variable") {
        firstYear = parseInt(this.pastDate.split("-")[0]) || firstYear;
      }

      if (q.futureDateHandler === "Years Ahead") {
        curYear += q.yearsAhead;
      } else if (q.futureDateHandler === "Latest Date") {
        curYear = parseInt(q.latestDate.split("-")[0]);
      } else if (q.futureDateHandler === "Future Reference Variable") {
        curYear = parseInt(this.futureDate.split("-")[0]) || curYear;
      }

      const opts = [];
      for (let yr = curYear; yr >= firstYear; yr--) {
        opts.push("" + yr);
      }
      return opts;
    },
    monthOptions() {
      const q = this.question || {};
      const p = this.pendingValue;
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

      if (!p || !p.year) {
        return months;
      }

      let startMonth = 0;
      let endMonth = 12;

      if (q.pastDateHandler !== "Years Behind") {
        const pastDateItems = {
          "Earliest Date": q.earliestDate.split("-"),
          "Past Reference Variable": this.pastDate.split("-")
        }[q.pastDateHandler];

        const earliestDate = new Date(pastDateItems[0], pastDateItems[1] - 1, pastDateItems[2]);
        startMonth = p.year == earliestDate.getFullYear() ? earliestDate.getMonth() : startMonth;
      }

      if (q.futureDateHandler !== "Years Ahead") {
        const futureDateItems = {
          "Latest Date": q.latestDate.split("-"),
          "Future Reference Variable": this.futureDate.split("-")
        }[q.futureDateHandler];

        const latestDate = new Date(futureDateItems[0], futureDateItems[1] - 1, futureDateItems[2]);
        endMonth = p.year == latestDate.getFullYear() ? latestDate.getMonth() + 1 : endMonth;
      }

      // this is to maintain the key-value pair such that we can use them later
      const calculatedMonths = {};
      for (const month of Object.entries(months).slice(startMonth, endMonth)) {
        calculatedMonths[month[0]] = month[1];
      }

      return calculatedMonths;
    },
    dayOptions() {
      const q = this.question || {};
      const p = this.pendingValue;
      const opts = [];

      if (!p || !p.year || !p.month) {
        return opts;
      }

      let startDay = 1;
      let endDay = new Date(parseInt(p.year), parseInt(p.month), 0).getDate();

      if (q.pastDateHandler !== "Years Behind") {
        const pastDateItems = {
          "Earliest Date": q.earliestDate.split("-"),
          "Past Reference Variable": this.pastDate.split("-")
        }[q.pastDateHandler];

        const earliestDate = new Date(pastDateItems[0], pastDateItems[1] - 1, pastDateItems[2]);
        startDay =
          p.year == earliestDate.getFullYear() && p.month == earliestDate.getMonth() + 1
            ? earliestDate.getDate()
            : startDay;
      }

      if (q.futureDateHandler !== "Years Ahead") {
        const futureDateItems = {
          "Latest Date": q.latestDate.split("-"),
          "Future Reference Variable": this.futureDate.split("-")
        }[q.futureDateHandler];

        const latestDate = new Date(futureDateItems[0], futureDateItems[1] - 1, futureDateItems[2]);
        endDay =
          p.year == latestDate.getFullYear() && p.month == latestDate.getMonth() + 1
            ? latestDate.getDate()
            : endDay;
      }

      for (let day = startDay; day <= endDay; day++) {
        opts.push("" + day);
      }

      return opts;
    }
  },
  methods: {
    parseValue(val) {
      const pending = { year: "", month: "", day: "" };
      if (val) {
        const m = ("" + val).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        const dt = m ? new Date(m[1], m[2] - 1, m[3]) : null;
        if (dt) {
          pending.year = "" + dt.getFullYear();
          pending.month = "" + (dt.getMonth() + 1);
          pending.day = "" + dt.getDate();
        }
      }
      return pending;
    },
    updated(field) {
      const p = this.pendingValue;
      if (p.day && this.dayOptions.indexOf(p.day) === -1) p.day = "";
      if (p.year && p.month && p.day) {
        let dt = "" + p.year + "-";
        dt += (p.month.length < 2 ? "0" : "") + p.month;
        dt += "-" + (p.day.length < 2 ? "0" : "") + p.day;
        this.question.value = dt;
      } else {
        this.question.value = null;
        if (field === "year") this.$refs.month.focus();
        else if (field === "month") this.$refs.day.focus();
      }
    }
  },
  mounted() {
    const q = this.question;

    //Need to bind to these to be reactive.
    const pastReferenceVariable = q.createLocalizableString("pastReferenceVariable", this);
    const futureReferenceVariable = q.createLocalizableString("futureReferenceVariable", this);

    q.setLocalizableStringText("pastReferenceVariable", q.pastReferenceVariable);
    q.setLocalizableStringText("futureReferenceVariable", q.futureReferenceVariable);

    pastReferenceVariable.onGetTextCallback = text => {
      text = q.survey.getTextProcessor().processText(q.pastReferenceVariable, true);
      this.pastDate = text;
      return text;
    };

    futureReferenceVariable.onGetTextCallback = text => {
      text = q.survey.getTextProcessor().processText(q.futureReferenceVariable, true);
      this.futureDate = text;
      return text;
    };

    q.valueChangedCallback = () => {
      const pending = this.parseValue(q.value);
      if (pending.year) {
        this.pendingValue = pending;
      }
      this.value = pending;
    };
  }
};
</script>
