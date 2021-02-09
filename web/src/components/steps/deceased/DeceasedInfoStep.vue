<template>
    <step-base v-bind:step="step">
        <deceased-info v-bind:step="step" v-if="step.currentPage == 0"></deceased-info>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import DeceasedInfo from "./DeceasedInfo.vue";


@Component({
    components:{
        StepBase,        
        DeceasedInfo
    }
})

export default class DeceasedInfoStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
