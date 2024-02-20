<template>
    <step-base v-bind:step="step">
        <deceased-info v-bind:step="step" v-if="step.currentPage == stPgNo.DECEASED.InformationAboutDeceased"></deceased-info>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import DeceasedInfo from "./DeceasedInfo.vue";
import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        StepBase,        
        DeceasedInfo
    }
})

export default class DeceasedStep extends Vue {
    
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
