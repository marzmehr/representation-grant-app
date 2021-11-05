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
import { first } from 'underscore';
export default {
  props: {
    question: Object
  },
  data() {
    return {
      pendingValue: this.parseValue(this.question.value),
      value: this.question.value
    };
  },
  computed: {
    yearOptions() {
      const q = this.question || {};
      let curYear = new Date().getFullYear();
      let firstYear = curYear;

      switch (q.pastDateHandler) {
        case "Years Behind":
          firstYear -= q.yearsBehind;
          break;

        case "Earliest Date":
          firstYear = parseInt(q.earliestDate.split("-")[0]);
          break;

        case "Past Reference Variable":
          console.log("using past reference variable");
          console.log(q.pastReferenceVariable);
          break;
      }

      switch (q.futureDateHandler) {
        case "Years Ahead":
          curYear += q.yearsAhead;
          break;

        case "Latest Date":
          curYear = parseInt(q.latestDate.split("-")[0]);
          break;

        case "Future Reference Variable":
          console.log("using future reference variable");
          console.log(q.futureReferenceVariable);
          break;
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
      const opts = [];

      if (p && p.year) {
        let start = 0;
        let end = 11;

        if (q.pastDateHandler === "Earliest Date") {
          const dateItems = q.earliestDate.split("-");
          const earliestDate = new Date(dateItems[0], dateItems[1] - 1, dateItems[2]);
          if (p.year == earliestDate.getFullYear()) {
            start = earliestDate.getMonth();
          }
        }

        if (q.futureDateHandler === "Latest Date") {
          const dateItems = q.latestDate.split("-");
          const latestDate = new Date(dateItems[0], dateItems[1] - 1, dateItems[2]);
          if (p.year == latestDate.getFullYear()) {
            end = latestDate.getMonth() + 1;
          }
        }

        // this is to maintain the key-value pair such that we can use them later
        const calculatedMonths = {};
        for (const month of Object.entries(months).slice(start, end)) {
          calculatedMonths[month[0]] = month[1];
        }

        return calculatedMonths;
      }

      return months;
    },
    dayOptions() {
      const q = this.question || {};
      const p = this.pendingValue;
      const opts = [];

      if (p && p.year && p.month) {
        let start = 1;
        let end = new Date(parseInt(p.year), parseInt(p.month), 0).getDate();

        if (q.pastDateHandler === "Earliest Date") {
          const dateItems = q.earliestDate.split("-");
          const earliestDate = new Date(dateItems[0], dateItems[1] - 1, dateItems[2]);
          if (p.year == earliestDate.getFullYear() && p.month == earliestDate.getMonth() + 1) {
            start = earliestDate.getDate();
          }
        }

        if (q.futureDateHandler === "Latest Date") {
          const dateItems = q.latestDate.split("-");
          const latestDate = new Date(dateItems[0], dateItems[1] - 1, dateItems[2]);
          if (p.year == latestDate.getFullYear() && p.month == latestDate.getMonth() + 1) {
            end = latestDate.getDate();
          }
        }

        for (let day = start; day <= end; day++) {
          opts.push("" + day);
        }
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
