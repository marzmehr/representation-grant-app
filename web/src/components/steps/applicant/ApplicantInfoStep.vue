<template>
    <step-base v-bind:step="step">
        <applicant-info v-bind:step="step" v-if="step.currentPage == 0"></applicant-info>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import ApplicantInfo from "./ApplicantInfo.vue";


@Component({
    components:{
        StepBase,        
        ApplicantInfo
    }
})

export default class ApplicantInfoStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
