<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/notify.json";
import * as surveyEnv from "@/components/survey/survey-glossary";
import {notifyPanel} from "./forms/notify-panel";

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class Notify extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public applicantName!: string;

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    survey = new SurveyVue.Model(surveyJson);
    surveyJsonCopy; 
    disableNextButton = false;   
    currentPage=0;
    // relatedPeopleInfo: string[]=[];
    listOfNotifyingPeople: string[]=[];

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();
    }  

    mounted(){
        this.initializeSurvey();
        this.addSurveyListener();
        this.reloadPageInformation();

        console.log(this.step)
    }

    public initializeSurvey(){
        this.adjustSurveyForRelatedPeople();       
        this.survey = new SurveyVue.Model(this.surveyJsonCopy);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    } 
    
    public adjustSurveyForRelatedPeople(){

        const relatedPeopleInfo = Vue.filter('getRelatedPeopleInfo')(this.steps[this.stPgNo.RELATIONS._StepNo], true, false);

        this.listOfNotifyingPeople = relatedPeopleInfo.filter(related => related != this.applicantName)
        this.surveyJsonCopy = JSON.parse(JSON.stringify(surveyJson)); 
        for(const inx in this.listOfNotifyingPeople){            
            // console.log(notifyingPerson)            
            const notifyPanelCopy = JSON.parse(JSON.stringify(notifyPanel).replace(/\[0\]/g,`[${inx}]`));            
            notifyPanelCopy.elements[3]["choices"].push({"value":this.applicantName, "text":this.applicantName});
            // console.log(notifyPanelCopy)            
            this.surveyJsonCopy.pages[0].elements.push(notifyPanelCopy)
        }  
    }   
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            console.log(this.survey.data);            
            // this.determineRequiredNotice(); 
            // this.determineNotifyCompleted();          
        })   
    }   

    public reloadPageInformation() {
        //console.log(this.step.result) 

        if (this.step?.result?.["notifySurvey"]?.data && 
            this.isRelatedPeopleSame(this.step?.result?.["notifySurvey"]?.data)
        ){
            this.survey.data = this.step.result["notifySurvey"].data;
        } 
        
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;        
        
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        for(const inx in this.listOfNotifyingPeople){
            const notifyingPerson = this.listOfNotifyingPeople[inx]
            this.survey.setValue(`recipientName[${inx}]`, notifyingPerson)
        } 
        
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        // this.determineRequiredNotice(); 
        // this.determineNotifyCompleted(); 
        // console.log(this.survey.isCurrentPageHasErrors)     
    }

    isRelatedPeopleSame(surveyData){
        for(const inx in this.listOfNotifyingPeople){
            const notifyingPerson = this.listOfNotifyingPeople[inx]
            if(surveyData[`recipientName[${inx}]`] != notifyingPerson) return false
        }
        return true
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
        this.UpdateStepResultData({step:this.step, data: {notifySurvey: Vue.filter('getSurveyResults')(this.survey, this.currentStep, this.currentPage)}});
    }

    // public determineNotifyCompleted(){
        
    //     if (this.steps[4].result['reviewP1Survey'] && 
    //         this.steps[4].result['reviewP1Survey'].data && 
    //         this.steps[4].result['reviewP1Survey'].data.p1ReviewInfoCorrect) {            
    //         this.survey.setVariable("notifyCompleted", true);
    //         this.toggleSteps([5, 8], true);

    //         if (this.landCompleted && 
    //             this.vehiclesCompleted && 
    //             this.bankAccountsCompleted &&
    //             this.pensionCompleted &&
    //             this.personalItemsCompleted &&
    //             this.noWillNotifyStepRequired) {
    //                 this.toggleSteps([6], true);            
    //         } else if (!this.noWillNotifyStepRequired) {
    //                 this.toggleSteps([6], false); 
    //         }
    //     } else {
    //         this.survey.setVariable("notifyCompleted", false);            
    //         this.toggleSteps([5, 6, 7, 8], false);
    //     }        
        
    // }

    // public determineRequiredNotice(){

    //     if (this.relatedPeopleInfo.length>1){
    //         this.survey.setVariable("noticeRequired", true);
    //     } else {
    //         this.survey.setVariable("noticeRequired", false);
    //     }    
    // }


};
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
