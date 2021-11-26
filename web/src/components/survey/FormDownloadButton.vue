<template>
  <div class="card" style="margin: 1rem 0px; border-radius: 0px; border: 0px" :key="state.key">
    <span v-if="isSandBox" style="color:red">
      This is disabled in sandbox mode, use the Print button ontop of the PreviewForm instead.
    </span>
    <div class="card-body">
      <button
        type="button"
        class="btn btn-primary"
        style="float: left; margin: 0.25rem 1rem; font-size: 16px;"
        @click="downloadPdf()"
        :disabled="isSandBox"
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

<script lang="ts">
import { SurveyDataService } from "@/services/survey-data-service";
import { onMounted, defineComponent, reactive, ref } from "@vue/composition-api";

export default defineComponent({
  name: "formdownloadbutton",
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    let isSandBox = ref(false);
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

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("buttonTitle", () => {
          state.key++;
        });
      }
      isSandBox.value = window.location.pathname.includes('sandbox');
    });

    const downloadPdf = () => {
      SurveyDataService.onPrint(props.question.formName, {}, {});
    }

    return {
      state,
      downloadPdf,
      isSandBox
    };
  }
});
</script>
