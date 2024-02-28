<template>
    <step-base v-bind:step="step">
        <applicant-info v-bind:step="step" v-if="step.currentPage == stPgNo.APPLICANT.InformationAboutApplicant"></applicant-info>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import ApplicantInfo from "./ApplicantInfo.vue";
import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        StepBase,        
        ApplicantInfo
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
