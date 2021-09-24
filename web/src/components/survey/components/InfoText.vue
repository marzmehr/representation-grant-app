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
        <span class="title-text" v-html="state.titleHtml"></span>
      </label>
    </div>
    <div class="panel-body" v-if="state.bodyHtml" v-html="state.bodyHtml"></div>
    <div class="row accept-row" v-if="question.isRequired && !state.value">
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
    const question = props.question;
    const state = reactive({
      key: 1,
      bodyHtml: "",
      titleHtml: "",
      value: ""
    });

    const updateContent = () => {
      const q = question;
      state.titleHtml = q.fullTitle;
      const bodyContent = q.body || "";
      const bodyHtmlT = q.getMarkdownHtml(bodyContent);
      if (bodyHtmlT !== null) {
        state.bodyHtml = q.getProcessedHtml(bodyHtmlT);
      } else {
        // FIXME should use v-text not v-html for this one?
        state.bodyHtml = q.getProcessedHtml(bodyContent);
      }
      state.key++;
    };

    onMounted(() => {
      const q = props.question;
      q.titleChangedCallback = () => {
        updateContent();
      };

      q.valueChangedCallback = () => {
        state.value = q.value;
      };

      //Hooks for SurveyEditor KO.
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("title", () => {
          updateContent();
        });

        q.registerFunctionOnPropertyValueChanged("body", () => {
          updateContent();
        });

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          updateContent();
        });

        q.registerFunctionOnPropertyValueChanged("messageStyle", () => {
          updateContent();
        });
      }
      updateContent();
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
