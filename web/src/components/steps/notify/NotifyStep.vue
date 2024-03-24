<template>
    <step-base v-bind:step="step">
        <review-your-answers v-bind:step="step" v-if="step.currentPage == stPgNo.NOTIFY.ReviewYourAnswers"></review-your-answers>
        <tell-people v-bind:step="step" v-if="step.currentPage == stPgNo.NOTIFY.TellPeople"></tell-people>
        <preview-p1 v-bind:step="step" v-if="step.currentPage == stPgNo.NOTIFY.PreviewP1"></preview-p1>
        <preview-pgt v-bind:step="step" v-if="step.currentPage == stPgNo.NOTIFY.PreviewPGT"></preview-pgt>
        <notify v-bind:step="step" v-if="step.currentPage == stPgNo.NOTIFY.NotifyPeople"></notify>
        <preview-p9 v-bind:step="step" v-if="step.currentPage == stPgNo.NOTIFY.PreviewP9"></preview-p9>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import Notify from "./Notify.vue";
import ReviewYourAnswers from "./ReviewYourAnswers.vue";
import PreviewP1 from "./PreviewP1.vue";
import PreviewPgt from "./PreviewPgt.vue";
import PreviewP9 from "./PreviewP9.vue";
import TellPeople from "./TellPeople.vue";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
const applicationState = namespace("Application");

@Component({
    components:{
        StepBase,        
        Notify,
        ReviewYourAnswers,
        PreviewP1,
        PreviewPgt,
        PreviewP9,
        TellPeople
    }
})

export default class NotifyStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
