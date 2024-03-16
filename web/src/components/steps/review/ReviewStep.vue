<template>
    <step-base v-bind:step="step">
        <review-your-answers v-bind:step="step" v-if="step.currentPage == 0"/>       
    </step-base>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    
    import { stepInfoType } from "@/types/Application";
    import StepBase from "../StepBase.vue";
    import ReviewYourAnswers from "./ReviewYourAnswers.vue"

    @Component({
        components:{
            StepBase,
            ReviewYourAnswers,
        }
    })

    export default class review extends Vue {
        
        @Prop({required: true})
        step!: stepInfoType;
        
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
