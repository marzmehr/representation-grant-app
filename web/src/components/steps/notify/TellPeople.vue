<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';    
import { namespace } from "vuex-class";   

import "@/store/modules/application";
const applicationState = namespace("Application");

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/tell-people.json";
import * as surveyEnv from "@/components/survey/survey-glossary";

import PageBase from "../PageBase.vue";
import { stepInfoType } from "@/types/Application";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';

@Component({
    components:{
        PageBase
    }
})

export default class TellPeople extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[]; 

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public deceasedName!: string;  

    @applicationState.State
    public applicantName!: string;

    survey = new SurveyVue.Model(surveyJson);
    disableNextButton = false;   
    currentPage=0;
    currentStep=0;

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

        const minorAndIncapableInfo = Vue.filter('getMinorAndIncapableInfo')(this.steps[this.stPgNo.RELATIONS._StepNo]);
        if(minorAndIncapableInfo?.hasMinorOrIncapable) relatedPeopleInfo.push('The Public Guardian and Trustee (PGT)')

        const listOfNotifyingPeople = relatedPeopleInfo.filter(related => !this.applicantName.includes(related))
        
        if (this.step.result && this.step.result["notifySurvey"]){
            this.survey.data = this.step.result["notifySurvey"].data;
        } 
        
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
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
    }
};
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
