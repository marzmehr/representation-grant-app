<template>
    <page-base :disableNext="disableNextButton" v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary";
import surveyJson from "./forms/deceased-will.json";

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";
import { toggleSteps, toggleAllSteps } from '@/components/utils/TogglePages';
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class DeceasedWill extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public deceasedName!: string;

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);  
    currentPage=0;
    currentStep=0;
    disableNextButton = false;   
   
    @Watch('pageIndex')
    pageIndexChange(newVal) 
    {
        this.survey.currentPageNo = newVal;        
    }

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
    }

    created() {
        this.disableNextButton = false;
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
            if(options.name == "willCheck")
                this.hideNextSteps(options.value == "n")

            if(options.name == "willExists")
                this.hideNextSteps(options.value == "y") 

            if(options.name == "willGrantExists")
                this.hideNextSteps(options.value == "y")

            if(options.name == "willOtherDocRecognize")
                this.hideNextSteps(this.survey?.data?.willOtherDocExists=="y" && options.value == "y");
        })
    }
    
    public reloadPageInformation() {        

        this.currentStep = this.$store.state.Application.currentStep;        
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;

        if (this.step.result && this.step.result['deceasedWillSurvey']) {
            this.survey.data = this.step.result['deceasedWillSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);            
        }
        
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);

        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
    } 
    
    public hideNextSteps(condition: boolean){
        if (condition) {
            this.disableNextButton = true;
            toggleAllSteps([this.stPgNo.DECEASED._StepNo, this.stPgNo.WILL._StepNo], false)
        } else {
            this.disableNextButton = false;
            toggleSteps([this.stPgNo.RELATIONS._StepNo,this.stPgNo.APPLICANT._StepNo, this.stPgNo.NOTIFY._StepNo], true)
        }      
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
        this.UpdateStepResultData({step:this.step, data: {deceasedWillSurvey: Vue.filter('getSurveyResults')(this.survey, this.currentStep, this.currentPage)}});
    }
}
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
