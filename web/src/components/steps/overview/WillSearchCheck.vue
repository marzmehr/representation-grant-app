<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary.ts";
import surveyJson from "./forms/willSearchCheck.json";

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

export default class WillSearchCheck extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public deceasedAliases!: string[];

    @applicationState.State
    public relatedPeopleInfo!: any;

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
    surveyJsonCopy; 
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
    }

    mounted(){
        this.initializeSurvey();
        this.addSurveyListener();
        this.reloadPageInformation();
    }

    public initializeSurvey(){
        this.adjustSurveyForAliases();
        this.survey = new SurveyVue.Model(this.surveyJsonCopy);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }

    public adjustSurveyForAliases(){

        this.surveyJsonCopy = JSON.parse(JSON.stringify(surveyJson));
        
        const temp = (this.surveyJsonCopy.pages[0].elements[2])       
        //console.log(temp)   
        let tmp = JSON.parse(JSON.stringify(temp));
       // console.log(tmp)
        this.surveyJsonCopy.pages[0].elements.splice(2,1);
        //console.log(this.surveyJsonCopy)
        for(const deceasedAlias in this.deceasedAliases){
            
            const aliasName = this.deceasedAliases[deceasedAlias]             
             
            let jsonText= JSON.stringify(temp)
            jsonText = jsonText.replace(/[0]/g, deceasedAlias);
            jsonText = jsonText.replace(/{alias}/g, aliasName);
            tmp = JSON.parse(jsonText);            

            // if(deceasedAlias == '0')
            //     this.surveyJsonCopy.pages[0].elements[2] = tmp;
            // else 
            this.surveyJsonCopy.pages[0].elements.splice(2+Number(deceasedAlias),0,tmp)
        }
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            //console.log(this.survey.data);
            this.UpdateGeneratedForms([]);
            // console.log(options)
            this.determinePrimaryApplicant();
            this.determineNumberOfAliases();
        })
    }
    
    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result['willSearchCheckSurvey']) {
            this.survey.data = this.step.result['willSearchCheckSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);            
        }

        this.thisStep = this.currentStep;
      
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
    
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.determinePrimaryApplicant();
        this.determineNumberOfAliases();
    }

    public determinePrimaryApplicant() {
        if (this.steps[3].result && this.steps[3].result["applicantInfoSurvey"] && this.steps[3].result["applicantInfoSurvey"].data) {
            const applicantInfoSurvey = this.steps[3].result["applicantInfoSurvey"].data;
            if (applicantInfoSurvey.applicant){
                if (applicantInfoSurvey.applicant.length == 1) {
                    const index = applicantInfoSurvey.applicant[0][14];                   
                    this.survey.setVariable("primaryApplicantName", Vue.filter('getFullName')(this.relatedPeopleInfo[index].name));
                }
            }
        }
    }

     public determineNumberOfAliases(){
        
        this.survey.setVariable("numberOfAliases",this.deceasedAliases?this.deceasedAliases.length:0)
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
        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);        
        this.UpdateStepResultData({step:this.step, data: {willSearchCheckSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}})
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
