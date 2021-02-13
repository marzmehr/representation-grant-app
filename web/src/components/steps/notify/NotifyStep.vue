<template>
    <step-base v-bind:step="step">
        <notify v-bind:step="step" v-if="step.currentPage == 0"></notify>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import Notify from "./Notify.vue";


@Component({
    components:{
        StepBase,        
        Notify
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
