<template>
  <div
    class="panel panel-default survey-expander"
    :class="{
      'survey-helptext': question.messageStyle === 'box',
      'survey-inlinetext': question.messageStyle !== 'box',
      expanded: question.value
    }"
    :key="state.key"
  >
    <div class="panel-heading">
      <label class="panel-title" tabindex="0" @keydown.space.prevent="toggle">
        <input type="checkbox" :checked="question.value" @click="setValue($event.target.checked)" />
        <span class="heading-icon fa fa-question-circle"></span>
        <span class="title-text" v-html="question.fullTitle"></span>
        <span
          class="heading-expand fa"
          :class="question.value ? 'fa-chevron-up' : 'fa-chevron-down'"
        ></span>
      </label>
    </div>
    <div class="panel-body" v-if="question.body">
      <v-runtime-template :template="handleBodyTemplate()"></v-runtime-template>
    </div>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import VRuntimeTemplate from "v-runtime-template";

export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  components: {
    VRuntimeTemplate
  },
  setup(props) {
    const state = reactive({
      key: 1
    });

    //Need to bind to this to be reactive.
    const body = props.question.createLocalizableString("body", this);
    props.question.setLocalizableStringText("body", props.question.body);
    const handleBodyTemplate = () => {
      return `<div>${body.renderedHtml}</div>`;
    };

    onMounted(() => {
      //Need this to assign our new body.
      body.onGetTextCallback = text => {
        text = window.surveyInstance.getTextProcessor().processText(props.question.body, true);
        return text;
      };

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
      handleBodyTemplate
    };
  },
  methods: {
    setValue(val) {
      this.question.value = val;
    },
    toggle() {
      this.question.value = !this.question.value;
    }
  }
});
</script>

<style type="css" scoped>
.panel-title {
  user-select: none;
}
.panel-title > input {
  visibility: hidden;
  width: 0px;
}
</style>
