<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary.ts";
import surveyJson from "./forms/pension.json";

import PageBase from "../PageBase.vue";
import { belongingsInfoType, stepInfoType, stepResultInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class Pension extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

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

    @applicationState.State
    public belongingsInfo!: belongingsInfoType;

    @applicationState.Action
    public UpdateBelongingsInfo!: (newBelongingsInfo: belongingsInfoType) => void

    @applicationState.Action
    public UpdateStepActive!: (newStepActive) => void

    @applicationState.Action
    public UpdatePensionCompleted!: (newLandCompleted) => void

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);  
    currentPage=0;
    thisStep = 0;
   
    @Watch('pageIndex')
    pageIndexChange(newVal) 
    {
        this.survey.currentPageNo = newVal;        
    }

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
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
            this.determinePensionCompleted();
        })
    }

    public determinePensionCompleted(){
        if (this.survey.data.payCPP && this.survey.data.payCPP == "n" &&
            this.survey.data.otherPensionExists && this.survey.data.otherPensionExists == "n" &&
            this.survey.data.lifeInsuranceExists && this.survey.data.lifeInsuranceExists == "n") {
            this.UpdatePensionCompleted(true);
        }else{
            this.UpdatePensionCompleted(false);
        }

        const nextStep = this.noWillNotifyStepRequired?6:7;
        console.log(nextStep)

        if (this.landCompleted && 
            this.vehiclesCompleted && 
            this.bankAccountsCompleted &&
            this.pensionCompleted &&
            this.personalItemsCompleted) {
            this.toggleSteps([nextStep, 8], true);            
        } else {
            this.toggleSteps([6, 7, 8], false);
        }
    }
    
    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result['pensionSurvey']) {
            this.survey.data = this.step.result['pensionSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);            
        }

        this.thisStep = this.currentStep;
      
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);

        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.determinePensionCompleted();
    }

    public toggleSteps(stepArr, active) {
        for (let i = 0; i < stepArr.length; i++) {
            this.UpdateStepActive({
                currentStep: stepArr[i],
                active: active
            });
        }        
    }

    public extractBelongingInfo(){
        let belongingsInfo = this.belongingsInfo;
        belongingsInfo.pension = [];
        const pensionInfo = (this.survey.data)?this.survey.data:[];
        belongingsInfo.pension.push(pensionInfo);                
        this.UpdateBelongingsInfo(belongingsInfo);
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
    
    beforeDestroy() {
        this.extractBelongingInfo();
        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);
        
        this.UpdateStepResultData({step:this.step, data: {pensionSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}})

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
