<template>
  <div
    class="card"
    style="margin: 1rem 0px; border-radius: 10px; border: 2px solid rgb(221, 238, 255);"
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
      >
        <span class="fa fa-print btn-icon-left"></span> Review and
        Download/Print
      </button>
    </div>
  </div>
</template>

<script language="ts">
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
      }
    });
    return {
      state
    };
  },
  methods: {
    setValue(val) {
      //TODO needs work
      this.question.value = val;
    },
    toggle() {
      //TODO needs work
      this.question.value = !this.question.value;
    }
  }
});
</script>
