<template>
  <step-base v-bind:step="step">    
    <spouse-info v-bind:step="step" v-if="step.currentPage == stPgNo.RELATIONS.Spouse"></spouse-info>
    <child-info v-bind:step="step" v-if="step.currentPage == stPgNo.RELATIONS.Children"></child-info>
    <parents v-bind:step="step" v-if="step.currentPage == stPgNo.RELATIONS.Parents"></parents>
    <grand-children v-bind:step="step" v-if="step.currentPage == stPgNo.RELATIONS.GrandChildren"></grand-children>
    <great-grand-children v-bind:step="step" v-if="step.currentPage == stPgNo.RELATIONS.GreatGrandChildren"></great-grand-children>
    
    <creditors v-bind:step="step" v-if="step.currentPage == stPgNo.RELATIONS.Creditors"></creditors>
  </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

import StepBase from "../StepBase.vue";
import Executors from "./Executors.vue";
import SpouseInfo from "./spouseComponent/SpouseInfo.vue";
import ChildInfo from "./childComponent/ChildrenInfo.vue";
import Parents from "./Parents.vue";
import GrandChildren from "./GrandChildren.vue";
import GreatGrandChildren from "./GreatGrandChildren.vue";
import Beneficiaries from "./Beneficiaries.vue";
import Creditors from "./Creditors.vue";

import { stepInfoType } from "@/types/Application";
import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");


@Component({
    components:{
        StepBase,
        Executors,
        SpouseInfo,
        ChildInfo,
        Parents,
        GrandChildren,
        GreatGrandChildren,
        Beneficiaries,
        Creditors
    }
})

export default class RelatedPeopleStep extends Vue {
    
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
