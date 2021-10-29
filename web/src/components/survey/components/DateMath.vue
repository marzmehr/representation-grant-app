<template>
  <div :class="question.cssClasses.text">{{ state.result }}</div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1,
      result: 0
    });

    onMounted(() => {
      const q = props.question;
      const getDate = (year, monthName, day) => {
        const months = [
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
        ];
        const month = months.indexOf(monthName);
        return new Date(year, month, day);
      };

      const calcHolidays = year => {
        const dateFactory = (year, month, day, range) => {
          // helper function to calc a series of holidays
          const holidates = [];
          for (let i = -range; i <= range; i++) {
            holidates.push(new Date(year + i, month, day));
          }
          return holidates;
        };

        const dateByRule = (year, rule, range) => {
          // Evaluate rules and send off to factory for creation
          const holidates = [];
          for (let i = -range; i <= range; i++) {
            const temp = new Date(year + i, rule.month, 1);
            let dayOfWeek = temp.getDay();

            while (dayOfWeek !== rule.dayOfWeek) {
              temp.setDate(temp.getDate() + 1);
              dayOfWeek = temp.getDay();
            }

            temp.setDate(temp.getDate() + 7 * rule.week);

            holidates.push(temp);
          }
          return holidates;
        };

        // for now lets just have a steady default range
        const range = 2;

        const holidates = {
          new_year: dateFactory(year, 0, 1, range),
          family_day: dateByRule(year, { month: 1, week: 2, dayOfWeek: 1 }, range),
          good_friday: [],
          easter_monday: [],
          victoria_day: [],
          canada_day: dateFactory(year, 6, 1, range),
          bc_day: dateByRule(year, { month: 7, week: 0, dayOfWeek: 1 }, range),
          labour_day: dateByRule( year, { month: 8, week: 0, dayOfWeek: 1 }, range),
          truth_and_rec: dateFactory(year, 8, 30, range),
          thanksgiving: dateByRule(year, { month: 9, week: 1, dayOfWeek: 1 }, range),
          remember_day: dateFactory(year, 10, 11, range),
          christmas: dateFactory(year, 11, 25, range)
        };

        let ret = [];
        for (const holiday in holidates) {
          ret = ret.concat(holidates[holiday]);
        }
        return ret;
      };

      const calcBusinessDays = (date, offset) => {
        const holidates = calcHolidays(date.getFullYear());
        let daysAdded = 0;

        while (daysAdded < offset) {
          const dayOfWeek = date.getDay();
          let holiday = false;

          for (const idx in holidates) {
            if (date.getTime() === holidates[idx].getTime()) {
              holiday = true;
              break;
            }
          }

          if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holiday) {
            daysAdded++;
          }

          date.setDate(date.getDate() + 1);
        }
        return date;
      };

      const calcFromReferenceDate = (year, month, day, offset, daysType) => {
        const date = getDate(year, month, day);

        if (daysType === "Calendar Days") {
          date.setDate(date.getDate() + offset);
          return date;
        } else if (daysType === "Business Days") {
          const ret = calcBusinessDays(date, offset);
          return ret;
        }
      };

      const dateFormatter = date => {
        return date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
      };

      const dateMath = () => {
        const dateType = q.dateType;
        const offset = q.daysToOffset;
        const daysType = q.typeOfDays;

        if (dateType === "Reference Date") {
          return dateFormatter(calcFromReferenceDate(q.year, q.month, q.day, offset, daysType));
        } else if (dateType === "Name of Variable") {
          // have to evaulate the var
          return "";
        }
      };

      state.result = dateMath();

      //Hooks for SurveyEditor KO.
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("title", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("body", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("messageStyle", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("arraySourceQuestion", () => {
          state.key++;
        });
      }
    });

    return {
      state
    };
  }
});
</script>
