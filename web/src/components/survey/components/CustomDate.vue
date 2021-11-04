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
            :value="'' + (monthidx + 1)"
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
      monthOptions: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      value: this.question.value
    };
  },
  computed: {
    yearOptions() {
      const q = this.question || {};
      console.log(q);
      let curYear = new Date().getFullYear();
      let firstYear = curYear;

      // check selected cases
      switch (q.futureDateHandler) {
        case "Years Ahead":
          console.log("using years ahead");
          curYear += q.yearsAhead;
          break;

        case "Latest Date":
          console.log("using latest date");
          console.log(q.lastestDate);
          curYear += q.latestDate.split("-")[0];
          break;

        case "Future Reference Variable":
          console.log("using future reference variable");
          console.log(q.futureReferenceVariable);
          break;
      }

      switch (q.pastDateHandler) {
        case "Years Behind":
          console.log("using years behind");
          firstYear -= q.yearsBehind;
          break;

        case "Earliest Date":
          console.log("using earliest date");
          console.log(q.earliestDate);
          break;

        case "Past Reference Variable":
          console.log("using past reference variable");
          console.log(q.pastReferenceVariable);
          break;
      }

      const opts = [];
      for (let yr = curYear; yr >= firstYear; yr--) {
        opts.push("" + yr);
      }
      return opts;
    },
    dayOptions() {
      const p = this.pendingValue;
      const opts = [];
      if (p && p.year && p.month) {
        const lastDay = new Date(parseInt(p.year, 10), parseInt(p.month, 10), 0).getDate();
        for (let day = 1; day <= lastDay; day++) {
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
