<template>
  <div class="card" style="margin: 1rem 0px; border-radius: 0px; border: 0px" :key="state.key">
    <div class="card-body">
      <button
        type="button"
        class="btn btn-primary"
        style="float: left; margin: 0.25rem 1rem; font-size: 16px;"
        @click="downloadPdf()"
      >
        <b-spinner
          v-if="state.loading"
          small
          label="Small Spinner"
          style="margin-right: 3px; margin-bottom: 2px"
        ></b-spinner>
        <span v-else class="fa fa-print btn-icon-left"></span>
        {{ question.buttonTitle }}
      </button>
      <div
        style="margin: 0.5rem 1rem;color: rgb(56 89 138); font-size: 16px; font-weight: bold;"
        v-html="question.fullTitle"
      ></div>
    </div>
    <component
      v-show="false"
      v-if="state.component"
      :is="state.component"
      ref="form"
      :survey="question.survey"
      style="max-width: 1100px;"
    >
    </component>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, ref } from "@vue/composition-api";
import FormP1 from "@/components/pdf/FormP1.vue";
import FormP9 from "@/components/pdf/FormP9.vue";
import PGTLetter from "@/components/pdf/PGTLetter.vue";
import LoadingSpinner from "@/components/utils/LoadingSpinner.vue";
import { saveSurvey } from "@/utils/utils";

export default defineComponent({
  components: {
    FormP1: FormP1,
    FormP9: FormP9,
    PGTLetter: PGTLetter,
    LoadingSpinner: LoadingSpinner
  },
  name: "formdownloadbutton",
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const form = ref();
    const state = reactive({
      key: 1,
      component: "",
      loading: false
    });
    onMounted(() => {
      const q = props.question;
      state.component = props.question.formName;
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
    });

    const downloadPdf = async () => {
      state.loading = true;
      saveSurvey();
      //Not ideal for Typescript.
      await form.value.onPrint();
      state.loading = false;
    };

    return {
      form,
      state,
      downloadPdf
    };
  }
});
</script>
