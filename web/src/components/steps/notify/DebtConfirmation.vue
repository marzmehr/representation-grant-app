<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/debtConfirmation.json";
import * as surveyEnv from "@/components/survey/survey-glossary"

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class DebtConfirmation extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public relatedPeopleInfo!: any;

    @applicationState.State
    public noWillNotifyStepRequired!: boolean;

    @applicationState.State
    public landCompleted!: boolean;

    @applicationState.State
    public vehiclesCompleted!: boolean;

    @applicationState.State
    public bankAccountsCompleted!: boolean;

    @applicationState.State
    public pensionCompleted!: boolean;

    @applicationState.State
    public personalItemsCompleted!: boolean;

    @applicationState.Action
    public UpdateNoWillNotifyStepRequired!: (newNoWillNotifyStepRequired: boolean) => void

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateStepActive!: (newStepActive) => void

    @applicationState.Action
    public UpdatePageActive!: (newPageActive) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);
    disableNextButton = false;   
    currentPage=0;
    thisStep=0;

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
        if (this.step.result && this.step.result['debtConfirmationSurvey']) { 
            this.disableNextButton = false;           
        }
    }

    mounted(){
        this.initializeSurvey();
        this.addSurveyListener();
        this.reloadPageInformation();
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }    
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            this.UpdateGeneratedForms([]);
            console.log(this.survey.data);            
            this.determineRequiredNotice(); 
            this.determineNotifyCompleted();          
        })   
    }

    public determineNotifyCompleted(){

        if (this.survey.data.p1EarlyNoWillOwe10k && 
            this.survey.data.p1EarlyNoWillOwe10k == "y") {
                this.UpdateNoWillNotifyStepRequired(true);
        } else {
            this.UpdateNoWillNotifyStepRequired(false);
        }

        if (this.survey.data.applicantInfoCorrect && 
            this.survey.data.applicantInfoCorrect == "y" &&
            this.survey.data.deceasedInfoCorrect && 
            this.survey.data.deceasedInfoCorrect == "y") {            
            this.survey.setVariable("notifyCompleted", true);
            this.toggleSteps([5, 8], true);

            if (this.landCompleted && 
                this.vehiclesCompleted && 
                this.bankAccountsCompleted &&
                this.pensionCompleted &&
                this.personalItemsCompleted &&
                this.noWillNotifyStepRequired) {
                    this.toggleSteps([6], true);            
            } else if (!this.noWillNotifyStepRequired) {
                    this.toggleSteps([6], false); 
            }
        } else {
            this.survey.setVariable("notifyCompleted", false);            
            this.toggleSteps([5, 6, 7, 8], false);
        }        
        
    }

    public determineRequiredNotice(){

        if (this.relatedPeopleInfo.length>1){
            this.survey.setVariable("noticeRequired", true);
        } else {
            this.survey.setVariable("noticeRequired", false);
        }    
    }

    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result["debtConfirmationSurvey"]){
            this.survey.data = this.step.result["debtConfirmationSurvey"].data;
        } 
        
        this.thisStep = this.currentStep;
        
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.determineRequiredNotice();       
   }

    public activateStep(stepActive) {
        this.UpdateStepActive( {
            currentStep: 0,
            active: stepActive
        });
    }    

    public toggleSteps(stepArr, active) {
        for (let i = 0; i < stepArr.length; i++) {
            this.UpdateStepActive({
                currentStep: stepArr[i],
                active: active
            });
        }        
    }
   
    public onPrev() {
        this.UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors) {
            this.UpdateGotoNextStepPage()
        }
    }
    
    public onComplete() {
        this.UpdateAllCompleted(true);
    }

    public isDisableNext() {
        // demo
        return Object.keys(this.survey.data).length == 0;
    }       

    beforeDestroy() {

        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);
       
        this.UpdateStepResultData({step:this.step, data: {debtConfirmationSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
