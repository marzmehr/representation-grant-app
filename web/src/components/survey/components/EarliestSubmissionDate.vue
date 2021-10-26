<template>
  <div>
    TODO fill in 
    {{ question.value }}
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, onBeforeUnmount } from "@vue/composition-api";

import { ExpressionRunner } from "survey-vue";

export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1
    });

    const determineLatestDate = dates => {
      const lastestDate = new Date();
      props.question.value = lastestDate;
    };

    const onValueChanged = (sender, options) => {
      if (options.name == props.question.name) return;
    };

    onBeforeUnmount(() => {
      window.surveyInstance.onValueChanged.remove(onValueChanged);
    });

    onMounted(() => {
      const q = props.question;

      if (window.surveyInstance.onValueChanged)
        window.surveyInstance.onValueChanged.add(onValueChanged);

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
