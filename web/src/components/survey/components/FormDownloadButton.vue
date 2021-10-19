<template>
  <div
    class="card"
    style="margin: 1rem 0px; border-radius: 10px; border: 2px solid rgb(221, 238, 255);"
    :key="state.key"
  >
    <div class="card-body">
      <div
        style="float: left; margin: 0.5rem 1rem; color: rgb(80, 80, 170); font-size: 16px; font-weight: bold;"
        v-html="question.fullTitle"
      ></div>
      <button
        type="button"
        class="btn btn-danger"
        style="float: right; margin: 0.25rem 1rem;"
        @click="navigateToUrl()"
      >
        <span class="fa fa-print btn-icon-left"></span>
        {{ question.buttonTitle }}
      </button>
    </div>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import { axios } from "axios";

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

    const setValue = val => {
      this.question.value = val;
    };

    const toggle = () => {
      this.question.value = !this.question.value;
    };

    const navigateToUrl = () => {
      const applicationId = props.question.survey.applicationId; //TODO wire this state up.
      const pdfType = props.question.pdfType;
      const url = `/survey-print/${applicationId}/?pdf_type=${pdfType}`;
      const options = {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json"
        }
      };
      axios.get(url, options).then(
        res => {
          const blob = res.data;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.download = `${pdfType}.pdf`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        },
        err => {
          console.error(err);
        }
      );
    };

    return {
      state,
      setValue,
      toggle,
      navigateToUrl
    };
  }
});
</script>
