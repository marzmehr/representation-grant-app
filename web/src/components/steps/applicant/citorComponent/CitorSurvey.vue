<template>
    <div>
        <survey v-bind:survey="survey"></survey>
        <b-row class="mt-5 mb-n4">            
            <b-button type="button" class="ml-4 px-5 btn btn-secondary" @click="goBack()">Cancel</b-button>            
            <b-button type="button" class="mr-4 px-5 ml-auto btn btn-success" @click="saveCitor()">Save</b-button>            
        </b-row>        
        <br />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/citor.json";
import * as surveyEnv from "@/components/survey/survey-glossary";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"

import { nameInfoType } from '@/types/Common';
import { applicantCitorInfoType } from '@/types/Application/Applicant';

@Component
export default class CitorSurvey extends Vue {
    
    @Prop({required: true})
    editRowProp!: Object;   
    
    @Prop({required: true})
    deceasedName!: nameInfoType;

    @Prop({required: true})
    applicantName!: string;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;
    
    applicantCitor = {} as applicantCitorInfoType;

    survey = new SurveyVue.Model(surveyJson);
    currentStep =0;
    currentPage =0;

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
        //TODO: Vue.filter('surveyChanged')('replyFlm')        
        this.survey.onComplete.add((sender, options) => {
            this.populateCitorModel(sender.data);
            let id = sender.getVariable("id");
            if (id === null || id === undefined) {
                this.$emit("surveyData", this.applicantCitor);
            } else {
                this.$emit("editedData", { ...this.applicantCitor, id });
                id = null;
            }
        });
    }
    
    public reloadPageInformation() {

        if (this.editRowProp != null) {
            this.populateFormWithPreExistingValues(this.editRowProp, this.survey);
        }
        
        let progress = 50;
        if(Object.keys(this.survey.data).length)
            progress = this.survey.isCurrentPageHasErrors? 50 : 100;
            
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })   
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));    
        this.survey.setVariable("applicantName", this.applicantName);   
   
    }
  
    public goBack() {
        this.$emit("showTable", true);
    }
    
    public saveCitor() {
        
        this.survey.completeLastPage();
    }

    public populateCitorModel(applicantCitorData) {
        if(applicantCitorData){
            this.applicantCitor.applicantCitorName = applicantCitorData.applicantCitorName;       
            this.applicantCitor.applicantCitorIsAlive = applicantCitorData.applicantCitorIsAlive;
            this.applicantCitor.applicantCitorIsAdult = applicantCitorData.applicantCitorIsAdult;
            this.applicantCitor.applicantCitorIsAdultNoExplanation = applicantCitorData.applicantCitorIsAdultNoExplanation;
            this.applicantCitor.applicantCitorIsAdultNoDOB = applicantCitorData.applicantCitorIsAdultNoDOB;
            this.applicantCitor.applicantCitorIsAdultNoResidentialAddress = applicantCitorData.applicantCitorIsAdultNoResidentialAddress;
            this.applicantCitor.applicantCitorIsAdultNoResidentialReceiveMail = applicantCitorData.applicantCitorIsAdultNoResidentialReceiveMail;
            this.applicantCitor.applicantCitorIsAdultNoHasMailingAddress = applicantCitorData.applicantCitorIsAdultNoHasMailingAddress;
            this.applicantCitor.applicantCitorIsAdultNoMailingAddress = applicantCitorData.applicantCitorIsAdultNoMailingAddress;
            this.applicantCitor.applicantCitorIsAdultNoEmail = applicantCitorData.applicantCitorIsAdultNoEmail;
            this.applicantCitor.applicantCitorIsAdultNoEmailAddress = applicantCitorData.applicantCitorIsAdultNoEmailAddress;
            this.applicantCitor.applicantCitorIsAdultNoFax = applicantCitorData.applicantCitorIsAdultNoFax;
            this.applicantCitor.applicantCitorIsAdultNoFaxNumber = applicantCitorData.applicantCitorIsAdultNoFaxNumber;
            this.applicantCitor.applicantCitorHasGuardian = applicantCitorData.applicantCitorHasGuardian;   
            this.applicantCitor.applicantCitorGuardianName = applicantCitorData.applicantCitorGuardianName;
            this.applicantCitor.applicantCitorGuardianResidentialAddress = applicantCitorData.applicantCitorGuardianResidentialAddress;
            this.applicantCitor.applicantCitorGuardianResidentialReceiveMail = applicantCitorData.applicantCitorGuardianResidentialReceiveMail;
            this.applicantCitor.applicantCitorGuardianHasMailingAddress = applicantCitorData.applicantCitorGuardianHasMailingAddress;
            this.applicantCitor.applicantCitorGuardianMailingAddress = applicantCitorData.applicantCitorGuardianMailingAddress;
            this.applicantCitor.applicantCitorGuardianEmail = applicantCitorData.applicantCitorGuardianEmail;
            this.applicantCitor.applicantCitorGuardianEmailAddress = applicantCitorData.applicantCitorGuardianEmailAddress;
            this.applicantCitor.applicantCitorGuardianFax = applicantCitorData.applicantCitorGuardianFax;
            this.applicantCitor.applicantCitorGuardianFaxNumber = applicantCitorData.applicantCitorGuardianFaxNumber;
            this.applicantCitor.applicantCitorIsCompetent = applicantCitorData.applicantCitorIsCompetent;
            this.applicantCitor.applicantCitorIsCompetentNoExplanation = applicantCitorData.applicantCitorIsCompetentNoExplanation;
            this.applicantCitor.applicantCitorIsCompetentNoDOB = applicantCitorData.applicantCitorIsCompetentNoDOB;
            this.applicantCitor.applicantCitorIsCompetentNoResidentialAddress = applicantCitorData.applicantCitorIsCompetentNoResidentialAddress;
            this.applicantCitor.applicantCitorIsCompetentNoResidentialReceiveMail = applicantCitorData.applicantCitorIsCompetentNoResidentialReceiveMail;
            this.applicantCitor.applicantCitorIsCompetentNoHasMailingAddress = applicantCitorData.applicantCitorIsCompetentNoHasMailingAddress;
            this.applicantCitor.applicantCitorIsCompetentNoMailingAddress = applicantCitorData.applicantCitorIsCompetentNoMailingAddress;
            this.applicantCitor.applicantCitorIsCompetentNoEmail = applicantCitorData.applicantCitorIsCompetentNoEmail;
            this.applicantCitor.applicantCitorIsCompetentNoEmailAddress = applicantCitorData.applicantCitorIsCompetentNoEmailAddress;
            this.applicantCitor.applicantCitorIsCompetentNoFax = applicantCitorData.applicantCitorIsCompetentNoFax;
            this.applicantCitor.applicantCitorIsCompetentNoFaxNumber = applicantCitorData.applicantCitorIsCompetentNoFaxNumber;
            this.applicantCitor.applicantCitorHasNominee = applicantCitorData.applicantCitorHasNominee;
            this.applicantCitor.applicantCitorNomineeName = applicantCitorData.applicantCitorNomineeName;
            this.applicantCitor.applicantCitorNomineeFormal = applicantCitorData.applicantCitorNomineeFormal;
            this.applicantCitor.applicantCitorNomineeFormalNoExplanation = applicantCitorData.applicantCitorNomineeFormalNoExplanation;
            this.applicantCitor.applicantCitorNomineeFormalYesExplanation = applicantCitorData.applicantCitorNomineeFormalYesExplanation;
            this.applicantCitor.applicantCitorNomineeResidentialAddress = applicantCitorData.applicantCitorNomineeResidentialAddress;
            this.applicantCitor.applicantCitorNomineeResidentialReceiveMail = applicantCitorData.applicantCitorNomineeResidentialReceiveMail;
            this.applicantCitor.applicantCitorNomineeHasMailingAddress = applicantCitorData.applicantCitorNomineeHasMailingAddress;
            this.applicantCitor.applicantCitorNomineeMailingAddress = applicantCitorData.applicantCitorNomineeMailingAddress;
            this.applicantCitor.applicantCitorNomineeEmail = applicantCitorData.applicantCitorNomineeEmail;
            this.applicantCitor.applicantCitorNomineeEmailAddress = applicantCitorData.applicantCitorNomineeEmailAddress;
            this.applicantCitor.applicantCitorNomineeFax = applicantCitorData.applicantCitorNomineeFax;
            this.applicantCitor.applicantCitorNomineeFaxNumber = applicantCitorData.applicantCitorNomineeFaxNumber;
            this.applicantCitor.applicantCitorIsDeadExplanation = applicantCitorData.applicantCitorIsDeadExplanation;
            this.applicantCitor.applicantCitorHasPersonalRep = applicantCitorData.applicantCitorHasPersonalRep;
            this.applicantCitor.applicantCitorPersonalRepName = applicantCitorData.applicantCitorPersonalRepName;
        }
    }

    public populateFormWithPreExistingValues(editRowProp, survey) {
        survey.data = {
            applicantCitorName: editRowProp.applicantCitorName
        };
        survey.setValue("applicantCitorIsAlive", editRowProp.applicantCitorIsAlive);
        survey.setValue("applicantCitorIsAdult", editRowProp.applicantCitorIsAdult);
        survey.setValue("applicantCitorIsAdultNoExplanation", editRowProp.applicantCitorIsAdultNoExplanation);
        survey.setValue("applicantCitorIsAdultNoDOB", editRowProp.applicantCitorIsAdultNoDOB);
        survey.setValue("applicantCitorIsAdultNoResidentialAddress", editRowProp.applicantCitorIsAdultNoResidentialAddress);
        survey.setValue("applicantCitorIsAdultNoResidentialReceiveMail", editRowProp.applicantCitorIsAdultNoResidentialReceiveMail);
        survey.setValue("applicantCitorIsAdultNoHasMailingAddress", editRowProp.applicantCitorIsAdultNoHasMailingAddress);
        survey.setValue("applicantCitorIsAdultNoMailingAddress", editRowProp.applicantCitorIsAdultNoMailingAddress);
        survey.setValue("applicantCitorIsAdultNoEmail", editRowProp.applicantCitorIsAdultNoEmail);
        survey.setValue("applicantCitorIsAdultNoEmailAddress", editRowProp.applicantCitorIsAdultNoEmailAddress);
        survey.setValue("applicantCitorIsAdultNoFax", editRowProp.applicantCitorIsAdultNoFax);
        survey.setValue("applicantCitorIsAdultNoFaxNumber", editRowProp.applicantCitorIsAdultNoFaxNumber);
        survey.setValue("applicantCitorHasGuardian", editRowProp.applicantCitorHasGuardian);   
        survey.setValue("applicantCitorGuardianName", editRowProp.applicantCitorGuardianName);
        survey.setValue("applicantCitorGuardianResidentialAddress", editRowProp.applicantCitorGuardianResidentialAddress);
        survey.setValue("applicantCitorGuardianResidentialReceiveMail", editRowProp.applicantCitorGuardianResidentialReceiveMail);
        survey.setValue("applicantCitorGuardianHasMailingAddress", editRowProp.applicantCitorGuardianHasMailingAddress);
        survey.setValue("applicantCitorGuardianMailingAddress", editRowProp.applicantCitorGuardianMailingAddress);
        survey.setValue("applicantCitorGuardianEmail", editRowProp.applicantCitorGuardianEmail);
        survey.setValue("applicantCitorGuardianEmailAddress", editRowProp.applicantCitorGuardianEmailAddress);
        survey.setValue("applicantCitorGuardianFax", editRowProp.applicantCitorGuardianFax);
        survey.setValue("applicantCitorGuardianFaxNumber", editRowProp.applicantCitorGuardianFaxNumber);
        survey.setValue("applicantCitorIsCompetent", editRowProp.applicantCitorIsCompetent);
        survey.setValue("applicantCitorIsCompetentNoExplanation", editRowProp.applicantCitorIsCompetentNoExplanation);
        survey.setValue("applicantCitorIsCompetentNoDOB", editRowProp.applicantCitorIsCompetentNoDOB);
        survey.setValue("applicantCitorIsCompetentNoResidentialAddress", editRowProp.applicantCitorIsCompetentNoResidentialAddress);
        survey.setValue("applicantCitorIsCompetentNoResidentialReceiveMail", editRowProp.applicantCitorIsCompetentNoResidentialReceiveMail);
        survey.setValue("applicantCitorIsCompetentNoHasMailingAddress", editRowProp.applicantCitorIsCompetentNoHasMailingAddress);
        survey.setValue("applicantCitorIsCompetentNoMailingAddress", editRowProp.applicantCitorIsCompetentNoMailingAddress);
        survey.setValue("applicantCitorIsCompetentNoEmail", editRowProp.applicantCitorIsCompetentNoEmail);
        survey.setValue("applicantCitorIsCompetentNoEmailAddress", editRowProp.applicantCitorIsCompetentNoEmailAddress);
        survey.setValue("applicantCitorIsCompetentNoFax", editRowProp.applicantCitorIsCompetentNoFax);
        survey.setValue("applicantCitorIsCompetentNoFaxNumber", editRowProp.applicantCitorIsCompetentNoFaxNumber);
        survey.setValue("applicantCitorHasNominee", editRowProp.applicantCitorHasNominee);
        survey.setValue("applicantCitorNomineeName", editRowProp.applicantCitorNomineeName);
        survey.setValue("applicantCitorNomineeFormal", editRowProp.applicantCitorNomineeFormal);
        survey.setValue("applicantCitorNomineeFormalNoExplanation", editRowProp.applicantCitorNomineeFormalNoExplanation);
        survey.setValue("applicantCitorNomineeFormalYesExplanation", editRowProp.applicantCitorNomineeFormalYesExplanation);
        survey.setValue("applicantCitorNomineeResidentialAddress", editRowProp.applicantCitorNomineeResidentialAddress);
        survey.setValue("applicantCitorNomineeResidentialReceiveMail", editRowProp.applicantCitorNomineeResidentialReceiveMail);
        survey.setValue("applicantCitorNomineeHasMailingAddress", editRowProp.applicantCitorNomineeHasMailingAddress);
        survey.setValue("applicantCitorNomineeMailingAddress", editRowProp.applicantCitorNomineeMailingAddress);
        survey.setValue("applicantCitorNomineeEmail", editRowProp.applicantCitorNomineeEmail);
        survey.setValue("applicantCitorNomineeEmailAddress", editRowProp.applicantCitorNomineeEmailAddress);
        survey.setValue("applicantCitorNomineeFax", editRowProp.applicantCitorNomineeFax);
        survey.setValue("applicantCitorNomineeFaxNumber", editRowProp.applicantCitorNomineeFaxNumber);
        survey.setValue("applicantCitorIsDeadExplanation", editRowProp.applicantCitorIsDeadExplanation);
        survey.setValue("applicantCitorHasPersonalRep", editRowProp.applicantCitorHasPersonalRep);
        survey.setValue("applicantCitorPersonalRepName", editRowProp.applicantCitorPersonalRepName);
        survey.setVariable("id", editRowProp.id);
    }

    beforeDestroy() {
        const progress = this.survey.isCurrentPageHasErrors? 50 : 100;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })
    }
}
</script>
