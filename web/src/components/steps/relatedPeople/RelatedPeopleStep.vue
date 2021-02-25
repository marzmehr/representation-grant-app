<template>
  <step-base v-bind:step="step">
    <!-- <executors v-bind:step="step" v-if="step.currentPage == 0"></executors> -->
    <spouse v-bind:step="step" v-if="step.currentPage == 0"></spouse>
    <children v-bind:step="step" v-if="step.currentPage == 1"></children>
    <parents v-bind:step="step" v-if="step.currentPage == 2"></parents>
    <grand-children v-bind:step="step" v-if="step.currentPage == 3"></grand-children>
    <great-grand-children v-bind:step="step" v-if="step.currentPage == 4"></great-grand-children>
    <!-- <beneficiaries v-bind:step="step" v-if="step.currentPage == 5"></beneficiaries> -->
    <!-- <creditors v-bind:step="step" v-if="step.currentPage == 5"></creditors> -->
  </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import Executors from "./Executors.vue";
import Spouse from "./Spouse.vue";
import Children from "./Children.vue";
import Parents from "./Parents.vue";
import GrandChildren from "./GrandChildren.vue";
import GreatGrandChildren from "./GreatGrandChildren.vue";
import Beneficiaries from "./Beneficiaries.vue";
import Creditors from "./Creditors.vue";


@Component({
    components:{
        StepBase,
        Executors,
        Spouse,
        Children,
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


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
