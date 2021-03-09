<template>
    <step-base v-bind:step="step">
        <debt-confirmation v-bind:step="step" v-if="step.currentPage == 0"></debt-confirmation>
        <review-p1 v-bind:step="step" v-if="step.currentPage == 1"></review-p1>
        <notify v-bind:step="step" v-if="step.currentPage == 2"></notify>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import Notify from "./Notify.vue";
import DebtConfirmation from "./DebtConfirmation.vue";
import ReviewP1 from "./ReviewP1.vue";


@Component({
    components:{
        StepBase,        
        Notify,
        DebtConfirmation,
        ReviewP1
    }
})

export default class NotifyStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
