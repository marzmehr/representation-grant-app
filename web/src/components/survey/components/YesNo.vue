<template>
  <div class="survey-yesno-outer">
    <template v-for="opt of choices">
      <label class="survey-yesno" :key="opt.value">
        <input
          type="radio"
          :name="question.name + '_' + question.id"
          :value="opt.value"
          :checked="question.value == opt.value"
          @click="checkValue(opt.value, $event.target.checked)"
        />
        <span
          class="survey-yesno-button"
          tabindex="0"
          role="button"
          :id="opt.value === 'y' ? question.inputId : null"
          @keydown.space.prevent="setValue(opt.value)"
          >{{ opt.label }}</span
        >
      </label>
    </template>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  props: {
    question: Object
  },
  setup(props) {
    const state = reactive({
      key: 1
    });
    const choices = [
      { label: "Yes", value: "y", button: null, input: null },
      { label: "No", value: "n", button: null, input: null }
    ];

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

        q.registerFunctionOnPropertyValueChanged("messageStyle", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("arraySourceQuestion", () => {
          state.key++;
        });
      }
    });
    return {
      state,
      choices
    };
  },
  methods: {
    checkValue(val, flag) {
      if (flag) this.setValue(val);
    },
    setValue(val) {
      this.question.value = val;
    },
    toggle() {
      this.question.value = this.question.value === "y" ? "n" : "y";
    }
  }
});
</script>
