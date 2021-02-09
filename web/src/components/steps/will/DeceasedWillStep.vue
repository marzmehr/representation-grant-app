<template>
  <step-base v-bind:step="step">
    <deceased-will v-bind:step="step" v-if="step.currentPage == 0" ></deceased-will>
  </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';
import StepBase from "../StepBase.vue";
import DeceasedWill from "./DeceasedWill.vue";
import { stepInfoType } from "@/types/Application";
import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/deceased-will.json";


@Component({
    components:{
      StepBase,
      DeceasedWill     
    }
})
export default class DeceasedWillStep extends Vue {
  
  @Prop({required: true})
  step!: stepInfoType | Object

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
