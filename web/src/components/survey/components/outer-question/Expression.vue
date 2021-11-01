<!-- Needed :key added, because it wouldn't update on value change. -->
<template>
  <div :key="key" :class="question.cssClasses.text">{{ question.displayValue }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export class Expression extends Vue {
  @Prop() question;

  key = 0;
  mounted() {
    this.question.registerFunctionOnPropertyValueChanged("value", () => {
      this.key++;
    });
  }
}
Vue.component("survey-expression", Expression);
export default Expression;
</script>
