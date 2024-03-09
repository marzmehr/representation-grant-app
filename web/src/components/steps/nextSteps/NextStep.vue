<template>
    <step-base v-bind:step="step">
        <form-p5 v-bind:step="step" v-if="step.currentPage == stPgNo.NEXT.FormP5"></form-p5>
        <form-p10 v-bind:step="step" v-if="step.currentPage == stPgNo.NEXT.FormP10"></form-p10>
        <notice-will-search v-bind:step="step" v-if="step.currentPage == stPgNo.NEXT.NoticeWillSearch"></notice-will-search>
        <form-p2 v-bind:step="step" v-if="step.currentPage == stPgNo.NEXT.FormP2"></form-p2>
    </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
  
import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import FormP5 from "./FormP5.vue";
import FormP10 from "./FormP10.vue";
import FormP2 from "./FormP2.vue";
import NoticeWillSearch from "./NoticeWillSearch.vue";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
const applicationState = namespace("Application");

@Component({
    components:{
        StepBase,        
        FormP5,
        FormP10,
        FormP2,
        NoticeWillSearch
    }
})

export default class NextStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;
    
};
</script>


<style lang="scss">
@import "../../../styles/survey";
</style>
