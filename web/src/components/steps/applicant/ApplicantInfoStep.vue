<template>
    <step-base v-bind:step="step">
        <applicant-info v-bind:step="step" v-if="step.currentPage == stPgNo.APPLICANT.ApplicantInfo"></applicant-info>
        <applicant-citor v-bind:step="step" v-if="step.currentPage == stPgNo.APPLICANT.ApplicantCitor"></applicant-citor>
        <applicant-service v-bind:step="step" v-if="step.currentPage == stPgNo.APPLICANT.ApplicantService"></applicant-service>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import ApplicantInfo from "./ApplicantInfo.vue";
import ApplicantCitor from "./citorComponent/ApplicantCitor.vue";
import ApplicantService from "./ApplicantService.vue";
import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        StepBase,        
        ApplicantInfo,
        ApplicantCitor,
        ApplicantService
    }
})

export default class ApplicantInfoStep extends Vue {
    
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
