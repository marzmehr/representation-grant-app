<template>
  <div
    class="panel panel-default"
    :class="{
      error: question.messageStyle === 'error' || question.messageStyle === 'redinfo',
      'survey-infotext': question.messageStyle !== 'inline',
      'survey-inlinetext': question.messageStyle === 'inline'
    }"
    :key="state.key"
  >
    <div class="panel-heading">
      <label class="panel-title">
        <span
          class="heading-icon fa"
          v-if="question.messageStyle === 'error' || question.messageStyle === 'info'"
          :class="{
            'fa-ban': question.messageStyle === 'error',
            'fa-info-circle': question.messageStyle === 'info'
          }"
        ></span>
        <!-- question.fullTitle seemed to be causing an infinite loop when in the survey editor. -->
        <span
          class="title-text"
          v-html="
            isSurveyEditor
              ? question.locTitle.htmlValues.default || question.locTitle.renderedText
              : question.locTitle.renderedHtml
          "
        ></span>
      </label>
    </div>
    <div class="panel-body" v-if="question.body" v-html="handleBodyTemplate()"></div>
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
import { onMounted, onBeforeUnmount, defineComponent, reactive } from "@vue/composition-api";

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

    //Need to bind to this to be reactive.
    const body = props.question.createLocalizableString("body", this);
    const handleBodyTemplate = () => {
      return props.isSurveyEditor ? body.renderedText : body.renderedHtml;
    };

    //Used to re-render panel when panel count changes.
    //May need to revisit for performance issues.
    const onDynamicPanelAdded = (sender, options) => {
      state.key++;
    };

    onBeforeUnmount(() => {
      window.surveyInstance.onValueChanged.remove(onDynamicPanelAdded);
    });

    onMounted(() => {
      //Need this to assign our new body.
      body.onGetTextCallback = text => {
        text = window.surveyInstance.getTextProcessor().processText(props.question.body, true);
        return text;
      };

      //We need these, so it re-renders the panel counts.
      if (window.surveyInstance.onDynamicPanelAdded)
        window.surveyInstance.onDynamicPanelAdded.add(onDynamicPanelAdded);

      if (window.surveyInstance.onDynamicPanelRemoved)
        window.surveyInstance.onDynamicPanelRemoved.add(onDynamicPanelAdded);

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
