<template>
  <step-base v-bind:step="step">
    <will-search-check v-bind:step="step" v-if="step.currentPage == 0"></will-search-check>
    <finalize-asset-values v-bind:step="step" v-if="step.currentPage == 1"></finalize-asset-values>        
  </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import WillSearchCheck from "./WillSearchCheck.vue";
import FinalizeAssetValues from "./FinalizeAssetValues.vue";


@Component({
    components:{
        StepBase,
        WillSearchCheck,
        FinalizeAssetValues        
    }
})
export default class OverviewStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
