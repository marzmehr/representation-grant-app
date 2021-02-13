<template>
    <step-base v-bind:step="step">
        <no-will-notify v-bind:step="step" v-if="step.currentPage == 0"></no-will-notify>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import NoWillNotify from "./NoWillNotify.vue";


@Component({
    components:{
        StepBase,        
        NoWillNotify
    }
})

export default class NoWillNotifyStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
