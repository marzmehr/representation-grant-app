<template>
  <div>
    <span>{{ state.result }}</span>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import VRuntimeTemplate from "v-runtime-template";
export default defineComponent({
  name: "dateMath",
  components: {
    VRuntimeTemplate
  },
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
      const q = this.question;

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

      const calcFromReferenceDate = (year, month, day, offset, daysType) => {
        const date = getDate(year, month, day);
        console.log(date);
        date.setDate(date.getDate() + offset);
        console.log(date);
        return date;
      };

      const dateMath = q => {
        const dateType = q.dateType;
        const offset = q.daysToOffset;
        const daysType = q.typeOfDays;

        console.log(dateType);
        console.log(offset);
        console.log(daysType);

        if (dateType === "Reference Date") {
          return calcFromReferenceDate(q.year, q.month, q.day, offset, daysType);
        }
        return 0;
      };

      dateMath(q);

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
