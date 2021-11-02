<template>
  <div :key="state.key" :class="question.cssClasses.text">
    <span>{{ state.result }}</span>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import VRuntimeTemplate from "v-runtime-template";
import { convertTicksToToolTip } from "@/components/utils/utils";
import { HolidayHelper } from "@/components/utils/holiday";
export default defineComponent({
  name: "datemath",
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
      result: ""
    });

    //Need to bind to this to be reactive.
    const nameOfVariable = props.question.createLocalizableString("nameOfVariable", this);
    props.question.setLocalizableStringText("nameOfVariable", props.question.nameOfVariable);
    const handleNameOfVariableTemplate = () => {
      return `<div>${nameOfVariable.renderedHtml}</div>`;
    };
    
    onMounted(() => {
      debugger;
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
        if ((stringDate.includes("{") && stringDate.includes("}")) || !stringDate) {
          // If we don't have the value set yet, then just default to today for now.
          // Extra steps are to ensure time is at midnight for holiday matching.
          const today = new Date();
          return new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }

        // For some reason the date is one short, add it in.
        // Also taking the date from the string causes issues with time,
        // which is why we have to reset it afterwards.
        const dateFromStr = new Date(stringDate);
        const date = new Date(
          dateFromStr.getFullYear(),
          dateFromStr.getMonth(),
          dateFromStr.getDate() + 1
        );
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

      nameOfVariable.onGetTextCallback = text => {
        text = props.question.survey
          .getTextProcessor()
          .processText(props.question.nameOfVariable, true);
        text = convertTicksToToolTip(text);

        // We want to update result if we get here.
        if (props.question.dateType === "Name of Variable") {
          state.result = dateFormatter(
            calcWithDaysType(
              dateFromNameOfVariable(text),
              props.question.daysToOffset,
              props.question.typeOfDays
            )
          );
          q.value = state.result;
          q.calculatedResult = state.result;
        }
        return text;
      };

      state.result = dateMath();
      q.value = state.result;
      q.calculatedResult = state.result;

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
