<template>
  <div class="card" style="margin: 1rem 0px; border-radius: 0px; border: 0px" :key="state.key">
    <div class="card-body">
      <button
        type="button"
        class="btn btn-primary"
        style="float: left; margin: 0.25rem 1rem; font-size: 16px;"
        @click="downloadPdf()"
      >
        <span class="fa fa-print btn-icon-left"></span>
        {{ question.buttonTitle }}
      </button>
      <div
        style="margin: 0.5rem 1rem;color: rgb(56 89 138); font-size: 16px; font-weight: bold;"
        v-html="question.fullTitle"
      ></div>
    </div>
  </div>
</template>

<script language="ts">
import { SurveyDataManager } from "@/services/survey-data-manager";
import { onMounted, defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  name: "infotext",
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1
    });
    onMounted(() => {
      const q = props.question;
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

        q.registerFunctionOnPropertyValueChanged("buttonTitle", () => {
          state.key++;
        });
      }
    });

    const downloadPdf = () => {
      SurveyDataManager.onPrint(question.pdfType);
    }

    return {
      state,
      downloadPdf
    };
  }
});
</script>
