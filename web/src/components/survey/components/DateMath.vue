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

      const calcBusinessDays = (date, offset) => {
        console.log("in calc");
        console.log(date);
        let daysAdded = 0;

        while (daysAdded < offset) {
          const dayOfWeek = date.getDay();
          // We'll need to account for BC holidays somehow?
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            daysAdded++;
          }
          date.setDate(date.getDate() + 1);
        }
        return date;
      };

      const calcFromReferenceDate = (year, month, day, offset, daysType) => {
        const date = getDate(year, month, day);
        console.log(date);

        if (daysType === "Calendar Days") {
          date.setDate(date.getDate() + offset);
          console.log("calendar");
          console.log(date);
          return date;
        } else if (daysType === "Business Days") {
          const ret = calcBusinessDays(date, offset);
          console.log("business");
          console.log(ret);
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
