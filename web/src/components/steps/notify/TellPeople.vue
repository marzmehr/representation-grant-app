<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/tell-people.json";
import * as surveyEnv from "@/components/survey/survey-glossary"

import PageBase from "../PageBase.vue";
import { stepInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class TellPeople extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

  

    survey = new SurveyVue.Model(surveyJson);
    disableNextButton = false;   
    currentPage=0;

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();
    }  

    mounted(){
        this.initializeSurvey();
        this.reloadPageInformation();

        console.log(this.step)
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }    


    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result["notifySurvey"]){
            this.survey.data = this.step.result["notifySurvey"].data;
        } 
        
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
    }

    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors) {
            Vue.prototype.$UpdateGotoNextStepPage()
        }
    }

    beforeDestroy() {
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, true);
    }
};
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
