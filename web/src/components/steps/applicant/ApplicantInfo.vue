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

import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
import { togglePages } from '@/components/utils/TogglePages';


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

    @applicationState.State
    public steps!: stepInfoType[];    

    @applicationState.State
    public deceasedName!: string;    

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);
    surveyJsonCopy; 
    disableNextButton = false;   
    currentStep =0;
    currentPage =0;
    relatedPeopleInfo: string[]=[];

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
        this.disableNextButton = false;
        if (this.step.result?.applicantInfoSurvey) { 
            this.disableNextButton = false;
        }
    }

    mounted(){ 
        this.initializeSurvey();
        this.addSurveyListener();
        this.reloadPageInformation();
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

        this.relatedPeopleInfo = Vue.filter('getRelatedPeopleInfo')(this.steps[this.stPgNo.RELATIONS._StepNo]);
        this.surveyJsonCopy = JSON.parse(JSON.stringify(surveyJson)); 
        
        //TODO Depends on the Survey
        this.surveyJsonCopy.pages[0].elements[1].elements[0]["choices"]=this.relatedPeopleInfo;    
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {             

            const p = this.stPgNo.APPLICANT;           
            togglePages([p.ApplicantCitor], (this.survey.data.applicantCited == "y" && this.survey.data.applicantCitorNewExists == "y"), this.stPgNo.APPLICANT._StepNo);
            togglePages([p.ApplicantService], (this.survey.data.applicantCited && this.survey.data.applicantName), this.stPgNo.APPLICANT._StepNo);
                
            if(options.name=="applicantName") {
                this.$store.commit("Application/setApplicantName", this.survey.data["applicantName"]);
            }    
        })   
    }

    public reloadPageInformation() {
        
        if (this.step.result?.applicantInfoSurvey?.data){
            this.survey.data = this.step.result.applicantInfoSurvey.data;
        }

        let relatedPeopleList = "<ul>"

        for (const person of this.relatedPeopleInfo){           
            relatedPeopleList = relatedPeopleList + "<li>" + person + "</li>";            
        }

        relatedPeopleList = relatedPeopleList + "</ul>"
        
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);        
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));  
        this.survey.setVariable("relatedPeopleExist", this.relatedPeopleInfo.length>0);
        this.survey.setVariable("relatedPeopleInfo", relatedPeopleList);     
    }

    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors)    
            Vue.prototype.$UpdateGotoNextStepPage()
    }

    beforeDestroy() {
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, true);        
        this.UpdateStepResultData({step:this.step, data: {applicantInfoSurvey: Vue.filter('getSurveyResults')(this.survey, this.currentStep, this.currentPage)}});
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
