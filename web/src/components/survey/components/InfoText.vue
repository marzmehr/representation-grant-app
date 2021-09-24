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
    :key="key"
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
        <span class="title-text" v-html="titleHtml"></span>
      </label>
    </div>
    <div class="panel-body" v-if="bodyHtml" v-html="bodyHtml"></div>
    <div class="row accept-row" v-if="question.isRequired && !value">
      <div class="col-sm-12">
        <button class="btn btn-primary" type="button" @click="toggle">
          <span>Continue</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Question } from "survey-core";
export default {
  props: {
    question: Question,
    isSurveyEditor: Boolean
  },
  data() {
    return {
      key: 0,
      bodyHtml: null,
      titleHtml: null,
      value: this.question.value
    };
  },
  methods: {
    setValue(val) {
      this.question.value = val;
    },
    toggle() {
      this.question.value = !this.question.value;
    },
    updateContent() {
      const q = this.question;
      this.titleHtml = q.fullTitle;
      const bodyContent = q.body || "";
      const bodyHtml = q.getMarkdownHtml(bodyContent);
      if (bodyHtml !== null) {
        this.bodyHtml = q.getProcessedHtml(bodyHtml);
      } else {
        // FIXME should use v-text not v-html for this one?
        this.bodyHtml = q.getProcessedHtml(bodyContent);
      }
      this.key++;
    }
  },
  mounted() {
    const q = this.question;
    q.titleChangedCallback = () => {
      this.updateContent();
    };

    q.valueChangedCallback = () => {
      this.value = q.value;
    };

    //Hooks for SurveyEditor KO.
    if (this.isSurveyEditor) {
      q.registerFunctionOnPropertyValueChanged("title", () => {
        this.updateContent();
      });

      q.registerFunctionOnPropertyValueChanged("body", () => {
        this.updateContent();
      });

      q.registerFunctionOnPropertyValueChanged("isRequired", () => {
        this.updateContent();
      });

      q.registerFunctionOnPropertyValueChanged("messageStyle", () => {
        this.updateContent();
      });
    }
    this.updateContent();
  }
};
</script>
