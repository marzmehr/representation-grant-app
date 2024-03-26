<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/form-p5.json";
import * as surveyEnv from "@/components/survey/survey-glossary"

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
import { courtLocationInfoType } from '@/types/Common';
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class FormP5 extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;
    
    @applicationState.State
    public steps!: stepInfoType[]; 

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public applicantName!: string;

    @applicationState.State
    public applicationLocation!: courtLocationInfoType;

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

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
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }  
    
    public reloadPageInformation() {

        const relatedPeopleInfo = Vue.filter('getRelatedPeopleInfo')(this.steps[this.stPgNo.RELATIONS._StepNo], true, true, false, false, true, false);
        
        const firstNationsName = this.getFirstNationName();
        if(firstNationsName) relatedPeopleInfo.push(firstNationsName);

        const listOfNotifyingPeople = relatedPeopleInfo.filter(related => related != this.applicantName);       
        
        
        if (this.step.result?.formP5Survey?.data){
            this.survey.data = this.step.result.formP5Survey.data;
        }        
        
        // this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        const applicantInfo = this.steps[this.stPgNo.APPLICANT._StepNo].result?.applicantInfoSurvey?.data
        
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.survey.setVariable("applicantName", this.applicantName);
        this.survey.setVariable("applicantCourthouse", this.applicationLocation.name);
        this.survey.setVariable("applicantOrdinaryAddress", applicantInfo?.applicantOrdinaryAddress??'');
        this.survey.setVariable("applicantOccupation", applicantInfo?.applicantOccupation??'');
        this.survey.setVariable("onlyRelationSpouse", listOfNotifyingPeople.length == 0);
    }

    getFirstNationName(){
        //___Deceased        
        const deceasedInfo = this.steps[this.stPgNo.DECEASED._StepNo].result?.informationAboutDeceasedSurvey?.data;
        const isFirstNation = deceasedInfo.deceasedFirstNations =='y';
        return (isFirstNation? deceasedInfo.deceasedFirstNationsName: '');
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
        this.UpdateStepResultData({step:this.step, data: {formP5Survey: Vue.filter('getSurveyResults')(this.survey, this.currentStep, this.currentPage)}});
    }
};
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
