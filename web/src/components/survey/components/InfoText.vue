<template>
  <div
    class="panel panel-default"
    :class="{
      error:
        question.messageStyle === 'error' ||
        question.messageStyle === 'redinfo',
      'survey-infotext': question.messageStyle !== 'inline',
      'survey-inlinetext': question.messageStyle === 'inline'
    }"
    :key="state.key"
  >
    <div class="panel-heading">
      <label class="panel-title">
        <span
          class="heading-icon fa"
          v-if="
            question.messageStyle === 'error' ||
              question.messageStyle === 'info'
          "
          :class="{
            'fa-ban': question.messageStyle === 'error',
            'fa-info-circle': question.messageStyle === 'info'
          }"
        ></span>
        <span class="title-text" v-html="question.fullTitle"></span>
      </label>
    </div>
    <div class="panel-body" v-if="question.body" v-html="question.body"></div>
    <div class="row accept-row" v-if="question.isRequired && !question.value">
      <div class="col-sm-12">
        <button class="btn btn-primary" type="button" @click="toggle">
          <span>Continue</span>
        </button>
      </div>
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
