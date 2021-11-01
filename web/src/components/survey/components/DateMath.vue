<template>
  <div :key="state.key" :class="question.cssClasses.text">{{ state.result }}</div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import { convertTicksToToolTip } from "@/components/utils/utils";
import { HolidayHelper } from "@/components/utils/holiday";
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

    //Need to bind to this to be reactive.
    const nameOfVariable = props.question.createLocalizableString("nameOfVariable", this);
    props.question.setLocalizableStringText("nameOfVariable", props.question.nameOfVariable);
    const handleNameOfVariableTemplate = () => {
      return `<div>${nameOfVariable.renderedHtml}</div>`;
    };

    onMounted(() => {
      const q = props.question;

      //Need this to assign our new body.
      nameOfVariable.onGetTextCallback = text => {
        text = props.question.survey
          .getTextProcessor()
          .processText(props.question.nameOfVariable, true);
        text = convertTicksToToolTip(text);
        return text;
      };

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
        const range = 2; // some day we may want to make this more flexible
        let holidays = {};
        for (let i = -range; i <= range; i++) {
          holidays = Object.assign({}, holidays, HolidayHelper.bcStats(date.getFullYear() + i));
        }

        let daysAdded = 0;
        while (daysAdded < offset) {
          const dayOfWeek = date.getDay();
          let holiday = false;

          for (const holidate in holidays) {
            if (date == holidate) {
              holiday = true;
              break;
            }
          }

          // calc for weekends
          if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holiday) {
            daysAdded++;
          }

          date.setDate(date.getDate() + 1);
        }
        return date;
      };

      const calcWithDaysType = (date, offset, daysType) => {
        if (daysType === "Calendar Days") {
          date.setDate(date.getDate() + offset);
          return date;
        } else if (daysType === "Business Days") {
          return calcBusinessDays(date, offset);
        }
      };

      function dateFromNameOfVariable(stringDate) {
        if (stringDate.includes("{") || stringDate.includes("}")) {
          // just a dummy return to keep things moving
          return new Date();
        }

        const date = new Date(stringDate);
        // for some reason the date is one short, add it in
        date.setDate(date.getDate() + 1);
        return date;
      }

      const dateFormatter = date => {
        return date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
      };

      const dateMath = () => {
        const dateType = q.dateType;
        const offset = q.daysToOffset;
        const daysType = q.typeOfDays;

        if (dateType === "Reference Date") {
          return dateFormatter(calcWithDaysType(getDate(q.year, q.month, q.day), offset, daysType));
        } else if (dateType === "Name of Variable") {
          return dateFormatter(
            calcWithDaysType(
              dateFromNameOfVariable(q.localizableStrings.nameOfVariable.renderedHtml),
              offset,
              daysType
            )
          );
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

        q.registerFunctionOnPropertyValueChanged("nameOfVariable", () => {
          state.key++;
        });
      }
    });

    return {
      state,
      handleNameOfVariableTemplate
    };
  }
});
</script>
