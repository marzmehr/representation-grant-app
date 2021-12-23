<!-- Extended this, so we can wrap survey-element-vue with animations. --> 
<template>
  <transition name="slide-fade" appear mode="out-in">
    <survey-element-vue :css="css" :survey="survey" :element="element"/>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel, SurveyElement, SurveyElementVue } from "survey-vue";

@Component({
  components: {
    SurveyElementVue
  }
})
export class SurveyElementVueWrapper extends Vue {
  @Prop() css: any;
  @Prop() survey: SurveyModel;
  @Prop() element: SurveyElement;
}
Vue.component("survey-element", SurveyElementVueWrapper);
export default SurveyElementVueWrapper;
</script>
