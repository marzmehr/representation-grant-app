<template>
  <div
    :key="question.localizableStrings.referenceVariable.renderedHtml"
    :class="question.cssClasses.text"
  >
    <span>{{ state.value }}</span>
  </div>
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
      value: ""
    });

    //Need to bind to this to be reactive.
    const referenceVariable = props.question.createLocalizableString("referenceVariable", this);
    props.question.setLocalizableStringText("referenceVariable", props.question.referenceVariable);

    onMounted(() => {
      const q = props.question;

      const calcBusinessDays = (date, offset) => {
        if (offset === 0) {
          return date;
        }

        const yearRange = 2; // some day we may want to make this more flexible
        let holidays = {};
        for (let i = -yearRange; i <= yearRange; i++) {
          holidays = Object.assign({}, holidays, HolidayHelper.bcStats(date.getFullYear() + i));
        }

        let daysCounted = 0;
        const crement = offset >= 0 ? 1 : -1;

        while (daysCounted !== offset) {
          date.setDate(date.getDate() + crement);
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
            daysCounted += crement;
          }
        }
        return date;
      };

      function dateFromNameOfVariable(dateString) {
        if (!dateString || (dateString.includes("{") && dateString.includes("}"))) {
          return;
        }

        // For some reason the date is one short, add it in.
        // Also taking the date from the string causes issues with time,
        // which is why we have to reset it afterwards.
        const dateFromStr = new Date(dateString);
        const date = new Date(
          dateFromStr.getFullYear(),
          dateFromStr.getMonth(),
          dateFromStr.getDate() + 1
        );
        return date;
      }

      function dateFormatter(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        let dt = year + "-";
        dt += (month < 10 ? "0" : "") + month;
        dt += "-" + (day < 10 ? "0" : "") + day;

        return dt;
      }

      const calcDate = dateString => {
        const date = dateFromNameOfVariable(dateString);
        const offset = q.daysToOffset;
        const daysType = q.typeOfDays;

        if (!date) {
          return "";
        }

        if (daysType === "Calendar Days") {
          date.setDate(date.getDate() + offset);
          return dateFormatter(date);
        } else if (daysType === "Business Days") {
          return dateFormatter(calcBusinessDays(date, offset));
        }
      }

      referenceVariable.onGetTextCallback = text => {
        text = props.question.survey
          .getTextProcessor()
          .processText(props.question.referenceVariable, true);
        text = convertTicksToToolTip(text);

        // We want to update value if we get here.
        state.value = calcDate(text);
        q.value = state.value;

        return text;
      };

      state.value = calcDate(q.localizableStrings.referenceVariable.renderedHtml);
      q.value = state.value;

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

        q.registerFunctionOnPropertyValueChanged("referenceVariable", () => {
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
