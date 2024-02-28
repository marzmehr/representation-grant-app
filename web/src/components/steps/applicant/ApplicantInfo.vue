<template>
    <page-base :disableNext="disableNextButton" v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/applicant-info.json";
import * as surveyEnv from "@/components/survey/survey-glossary"

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

import "@/store/modules/common";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
const commonState = namespace("Common");

@Component({
    components:{
        PageBase
    }
})
export default class ApplicantInfo extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @commonState.State
    public locationsInfo!: any[];

    @applicationState.State
    public steps!: stepInfoType[];    

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public relatedPeopleInfo!: any;

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);
    surveyJsonCopy; 
    disableNextButton = false;   
    currentStep =0;
    currentPage =0;
    thisStep = 0;
    relatedPeopleNames: string[]=[];

    @Watch('pageIndex')
    pageIndexChange(newVal) 
    {
        this.survey.currentPageNo = newVal;        
    }

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();
    }

    created() {
        this.disableNextButton = false
        if (this.step.result && this.step.result['applicantInfoSurvey']) { 
            this.disableNextButton = false;           
           
        }
    }

    mounted(){        
        // this.extractRelatedPeopleInfo();
        this.initializeSurvey();
        this.addSurveyListener();
        this.reloadPageInformation();
    }

    public initializeSurvey(){
        this.adjustSurveyForRelatedPeople();
        this.adjustSurveyForLocations();
        this.survey = new SurveyVue.Model(this.surveyJsonCopy);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    } 
    
    public adjustSurveyForRelatedPeople(){

        this.surveyJsonCopy = JSON.parse(JSON.stringify(surveyJson));            
     
     
        this.surveyJsonCopy.pages[0].elements[1].elements[0]["choices"]=[];      
        
        for(const relatedPerson of this.relatedPeopleInfo){
            this.surveyJsonCopy.pages[0].elements[1].elements[0]["choices"].push(relatedPerson)
        }        
       
    }

    public adjustSurveyForLocations(){ 
        
        this.surveyJsonCopy.pages[0].elements[4].elements[11]["choices"] = [];
        
        for(const location of this.locationsInfo){
            
            this.surveyJsonCopy.pages[0].elements[4].elements[11]["choices"].push({value:location["name"], text: location["name"]})
        }
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {

            this.UpdateGeneratedForms([]); 
            console.log(this.survey.data);
            // console.log(options)
            this.determineApplicantInfoCompleted();

            //TODO: add functionality to toggle citor page
            // if(this.survey.data.deceasedIntroExplanation == true){
            //     toggleStep(this.stPgNo.WILL._StepNo, true)
            // }
        })   
    }

//TODO: determine required behaviour
    public determineApplicantInfoCompleted(){        

        if (this.survey.data.applicantCourthouse && this.survey.data.applicantCourthouse != "") {
           
            //this.toggleSteps([4,8], true);
        } else{
            //this.toggleSteps([4, 5, 6, 7, 8], false);
        }        
    }

    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result["applicantInfoSurvey"]){
            this.survey.data = this.step.result["applicantInfoSurvey"].data;
        }
        
        this.thisStep = this.currentStep;
        
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        this.determineApplicantInfoCompleted();
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        
        this.survey.setValue("relatedPeopleNames",this.relatedPeopleNames);
    }

    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors)    
            Vue.prototype.$UpdateGotoNextStepPage()
    }

    beforeDestroy() {

        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);
        this.UpdateStepResultData({step:this.step, data: {applicantInfoSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
