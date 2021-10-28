<template>
  <div>
    <input v-bind:readonly="true">
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
      value: this.question.value,
      inputDevice: true,
      typeOfDays: true
    };
  },
  computed: {
    yearOptions() {
      const q = this.question || {};
      let curYear = new Date().getFullYear();
      const firstYear = curYear - (q.dateYearsBehind || 20);
      curYear += q.dateYearsAhead || 20;
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
        const lastDay = new Date(
          parseInt(p.year, 10),
          parseInt(p.month, 10),
          0
        ).getDate();
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
      console.log(p);
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

    const thisYear = () => {
      let year = new Date().getFullYear();
      return "" + year;
    }
    
    const thisMonth = () => {
      let month = new Date().getMonth() + 1;
      return "" + month;
    }
    const today = () => {
      let day = new Date().getDate();
      return "" + day;
    }

    q.valueChangedCallback = () => {
      const pending = this.parseValue(q.value);
      if (pending.year) {
        this.pendingValue = pending;
      }
      this.value = pending;
    };

    // set up pending
    this.pendingValue = {
      "year": thisYear(),
      "month": thisMonth(),
      "day": today()
    }
  }
};
</script>
