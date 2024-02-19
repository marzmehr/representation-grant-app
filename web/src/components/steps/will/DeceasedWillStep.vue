<template>
  <step-base v-bind:step="step">
    <deceased-will v-bind:step="step" v-if="step.currentPage == stPgNo.WILL.DeceasedWill" ></deceased-will>
  </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import StepBase from "../StepBase.vue";
import DeceasedWill from "./DeceasedWill.vue";
import { stepInfoType } from "@/types/Application";
import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
      StepBase,
      DeceasedWill     
    }
})
export default class DeceasedWillStep extends Vue {
  
  @Prop({required: true})
  step!: stepInfoType;

  @applicationState.State
  public stPgNo!: stepsAndPagesNumberInfoType;

};
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
