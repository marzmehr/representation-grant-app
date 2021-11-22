<template>
  <component :is="state.component" :survey="question.survey"></component>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import FormP9 from "@/components/pdf/FormP9.vue";
import FormP1 from "@/components/pdf/FormP1.vue";

export default defineComponent({
  components: {
    'FormP1': FormP1,
    'FormP9': FormP9
  },
  props: {
    question: Object
  },
  setup(props) {
    const state = reactive({
      key: 1,
      component: ""
    });

    onMounted(() => {
      const q = props.question;
      state.component = q.formSelect;

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
  }
});
</script>
