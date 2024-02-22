<template>
    <div>
        hello
        <survey v-bind:survey="survey"></survey>
        <div class="row">
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="goBack()">Cancel</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-success" @click="saveCreditor()">Save</button>
            </div>
        </div>
        <br />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/creditors.json";
import * as surveyEnv from "@/components/survey/survey-glossary";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"
import { nameInfoType } from '@/types/Common';
import { creditorInfoType } from '@/types/Application/Creditor';

@Component
export default class CreditorSurvey extends Vue {
    
    @Prop({required: true})
    editRowProp!: Object;   
    
    @Prop({required: true})
    deceasedName!: nameInfoType;

    @applicationState.State
    public deceasedDateOfDeathPlus4!: string;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;
    
    creditor = {} as creditorInfoType;

    survey = new SurveyVue.Model(surveyJson);
    currentStep =0;
    currentPage =0;

    beforeCreate() {
        console.log('here')
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);       
    }

    mounted(){
        console.log('here')
        this.initializeSurvey();
        console.log('here2')
        this.addSurveyListener();
        this.reloadPageInformation();
    }

    public initializeSurvey(){
        console.log('here0')
        this.survey = new SurveyVue.Model(surveyJson);
        console.log('here1')
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }
    
    public addSurveyListener(){
        //TODO: Vue.filter('surveyChanged')('replyFlm')        
        this.survey.onComplete.add((sender, options) => {
            this.populateCreditorModel(sender.data);
            let id = sender.getVariable("id");
            if (id === null || id === undefined) {
                this.$emit("surveyData", this.creditor);
            } else {
                this.$emit("editedData", { ...this.creditor, id });
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
    }
  
    public goBack() {
        this.$emit("showTable", true);
    }
    
    public saveCreditor() {
        
        this.survey.completeLastPage();
    }

    public populateCreditorModel(creditorData) {
        if(creditorData){
            this.creditor.creditorName = creditorData.creditorName;       
            this.creditor.creditorIsAlive = creditorData.creditorIsAlive;
            this.creditor.creditorIsAdult = creditorData.creditorIsAdult;
            this.creditor.creditorIsAdultNoExplanation = creditorData.creditorIsAdultNoExplanation;
            this.creditor.creditorIsAdultNoDOB = creditorData.creditorIsAdultNoDOB; 
            this.creditor.creditorIsAdultNoResidentialAddress = creditorData.creditorIsAdultNoResidentialAddress;
            this.creditor.creditorIsAdultNoResidentialReceiveMail = creditorData.creditorIsAdultNoResidentialReceiveMail;
            this.creditor.creditorIsAdultNoHasMailingAddress = creditorData.creditorIsAdultNoHasMailingAddress;
            this.creditor.creditorIsAdultNoMailingAddress = creditorData.creditorIsAdultNoMailingAddress;
            this.creditor.creditorIsAdultNoEmail = creditorData.creditorIsAdultNoEmail;
            this.creditor.creditorIsAdultNoEmailAddress = creditorData.creditorIsAdultNoEmailAddress;
            this.creditor.creditorIsAdultNoFax = creditorData.creditorIsAdultNoFax;
            this.creditor.creditorIsAdultNoFaxNumber = creditorData.creditorIsAdultNoFaxNumber;
            this.creditor.creditorHasGuardian = creditorData.creditorHasGuardian;   
            this.creditor.creditorGuardianName = creditorData.creditorGuardianName;
            this.creditor.creditorGuardianResidentialAddress = creditorData.creditorGuardianResidentialAddress;
            this.creditor.creditorGuardianResidentialReceiveMail = creditorData.creditorGuardianResidentialReceiveMail;
            this.creditor.creditorGuardianHasMailingAddress = creditorData.creditorGuardianHasMailingAddress;
            this.creditor.creditorGuardianMailingAddress = creditorData.creditorGuardianMailingAddress;
            this.creditor.creditorGuardianEmail = creditorData.creditorGuardianEmail;
            this.creditor.creditorGuardianEmailAddress = creditorData.creditorGuardianEmailAddress;
            this.creditor.creditorGuardianFax = creditorData.creditorGuardianFax;
            this.creditor.creditorGuardianFaxNumber = creditorData.creditorGuardianFaxNumber;
            this.creditor.creditorIsCompetent = creditorData.creditorIsCompetent;
            this.creditor.creditorIsCompetentNoExplanation = creditorData.creditorIsCompetentNoExplanation;
            this.creditor.creditorIsCompetentNoDOB = creditorData.creditorIsCompetentNoDOB;
            this.creditor.creditorIsCompetentNoResidentialAddress = creditorData.creditorIsCompetentNoResidentialAddress;
            this.creditor.creditorIsCompetentNoResidentialReceiveMail = creditorData.creditorIsCompetentNoResidentialReceiveMail;
            this.creditor.creditorIsCompetentNoHasMailingAddress = creditorData.creditorIsCompetentNoHasMailingAddress;
            this.creditor.creditorIsCompetentNoMailingAddress = creditorData.creditorIsCompetentNoMailingAddress;
            this.creditor.creditorIsCompetentNoEmail = creditorData.creditorIsCompetentNoEmail;
            this.creditor.creditorIsCompetentNoEmailAddress = creditorData.creditorIsCompetentNoEmailAddress;
            this.creditor.creditorIsCompetentNoFax = creditorData.creditorIsCompetentNoFax;
            this.creditor.creditorIsCompetentNoFaxNumber = creditorData.creditorIsCompetentNoFaxNumber;
            this.creditor.creditorHasNominee = creditorData.creditorHasNominee;
            this.creditor.creditorNomineeName = creditorData.creditorNomineeName;
            this.creditor.creditorNomineeFormal = creditorData.creditorNomineeFormal;
            this.creditor.creditorNomineeFormalNoExplanation = creditorData.creditorNomineeFormalNoExplanation;
            this.creditor.creditorNomineeFormalYesExplanation = creditorData.creditorNomineeFormalYesExplanation;
            this.creditor.creditorNomineeResidentialAddress = creditorData.creditorNomineeResidentialAddress;
            this.creditor.creditorNomineeResidentialReceiveMail = creditorData.creditorNomineeResidentialReceiveMail;
            this.creditor.creditorNomineeHasMailingAddress = creditorData.creditorNomineeHasMailingAddress;
            this.creditor.creditorNomineeMailingAddress = creditorData.creditorNomineeMailingAddress;
            this.creditor.creditorNomineeEmail = creditorData.creditorNomineeEmail;
            this.creditor.creditorNomineeEmailAddress = creditorData.creditorNomineeEmailAddress;
            this.creditor.creditorNomineeFax = creditorData.creditorNomineeFax;
            this.creditor.creditorNomineeFaxNumber = creditorData.creditorNomineeFaxNumber;
            // this.creditor.creditorDiedAfter = creditorData.creditorDiedAfter;
            // this.creditor.creditorDiedAfterNoGcreditorExists = creditorData.creditorDiedAfterNoGcreditorExists;
            this.creditor.creditorHasPersonalRep = creditorData.creditorHasPersonalRep;
            this.creditor.creditorPersonalRepName = creditorData.creditorPersonalRepName;           
        }
    }

    public populateFormWithPreExistingValues(editRowProp, survey) {
        survey.data = {
            creditorName: editRowProp.creditorName
        };
        survey.setValue("creditorIsAlive", editRowProp.creditorIsAlive);
        survey.setValue("creditorIsAdult", editRowProp.creditorIsAdult);
        survey.setValue("creditorIsAdultNoExplanation", editRowProp.creditorIsAdultNoExplanation);
        survey.setValue("creditorIsAdultNoDOB", editRowProp.creditorIsAdultNoDOB);
        survey.setValue("creditorIsAdultNoResidentialAddress", editRowProp.creditorIsAdultNoResidentialAddress);
        survey.setValue("creditorIsAdultNoResidentialReceiveMail", editRowProp.creditorIsAdultNoResidentialReceiveMail);
        survey.setValue("creditorIsAdultNoHasMailingAddress", editRowProp.creditorIsAdultNoHasMailingAddress);
        survey.setValue("creditorIsAdultNoMailingAddress", editRowProp.creditorIsAdultNoMailingAddress);
        survey.setValue("creditorIsAdultNoEmail", editRowProp.creditorIsAdultNoEmail);
        survey.setValue("creditorIsAdultNoEmailAddress", editRowProp.creditorIsAdultNoEmailAddress);
        survey.setValue("creditorIsAdultNoFax", editRowProp.creditorIsAdultNoFax);
        survey.setValue("creditorIsAdultNoFaxNumber", editRowProp.creditorIsAdultNoFaxNumber);
        survey.setValue("creditorHasGuardian", editRowProp.creditorHasGuardian);   
        survey.setValue("creditorGuardianName", editRowProp.creditorGuardianName);
        survey.setValue("creditorGuardianResidentialAddress", editRowProp.creditorGuardianResidentialAddress);
        survey.setValue("creditorGuardianResidentialReceiveMail", editRowProp.creditorGuardianResidentialReceiveMail);
        survey.setValue("creditorGuardianHasMailingAddress", editRowProp.creditorGuardianHasMailingAddress);
        survey.setValue("creditorGuardianMailingAddress", editRowProp.creditorGuardianMailingAddress);
        survey.setValue("creditorGuardianEmail", editRowProp.creditorGuardianEmail);
        survey.setValue("creditorGuardianEmailAddress", editRowProp.creditorGuardianEmailAddress);
        survey.setValue("creditorGuardianFax", editRowProp.creditorGuardianFax);
        survey.setValue("creditorGuardianFaxNumber", editRowProp.creditorGuardianFaxNumber);
        survey.setValue("creditorIsCompetent", editRowProp.creditorIsCompetent);
        survey.setValue("creditorIsCompetentNoExplanation", editRowProp.creditorIsCompetentNoExplanation);
        survey.setValue("creditorIsCompetentNoDOB", editRowProp.creditorIsCompetentNoDOB);
        survey.setValue("creditorIsCompetentNoResidentialAddress", editRowProp.creditorIsCompetentNoResidentialAddress);
        survey.setValue("creditorIsCompetentNoResidentialReceiveMail", editRowProp.creditorIsCompetentNoResidentialReceiveMail);
        survey.setValue("creditorIsCompetentNoHasMailingAddress", editRowProp.creditorIsCompetentNoHasMailingAddress);
        survey.setValue("creditorIsCompetentNoMailingAddress", editRowProp.creditorIsCompetentNoMailingAddress);
        survey.setValue("creditorIsCompetentNoEmail", editRowProp.creditorIsCompetentNoEmail);
        survey.setValue("creditorIsCompetentNoEmailAddress", editRowProp.creditorIsCompetentNoEmailAddress);
        survey.setValue("creditorIsCompetentNoFax", editRowProp.creditorIsCompetentNoFax);
        survey.setValue("creditorIsCompetentNoFaxNumber", editRowProp.creditorIsCompetentNoFaxNumber);
        survey.setValue("creditorHasNominee", editRowProp.creditorHasNominee);
        survey.setValue("creditorNomineeName", editRowProp.creditorNomineeName);
        survey.setValue("creditorNomineeFormal", editRowProp.creditorNomineeFormal);
        survey.setValue("creditorNomineeFormalNoExplanation", editRowProp.creditorNomineeFormalNoExplanation);
        survey.setValue("creditorNomineeFormalYesExplanation", editRowProp.creditorNomineeFormalYesExplanation);
        survey.setValue("creditorNomineeResidentialAddress", editRowProp.creditorNomineeResidentialAddress);
        survey.setValue("creditorNomineeResidentialReceiveMail", editRowProp.creditorNomineeResidentialReceiveMail);
        survey.setValue("creditorNomineeHasMailingAddress", editRowProp.creditorNomineeHasMailingAddress);
        survey.setValue("creditorNomineeMailingAddress", editRowProp.creditorNomineeMailingAddress);
        survey.setValue("creditorNomineeEmail", editRowProp.creditorNomineeEmail);
        survey.setValue("creditorNomineeEmailAddress", editRowProp.creditorNomineeEmailAddress);
        survey.setValue("creditorNomineeFax", editRowProp.creditorNomineeFax);
        survey.setValue("creditorNomineeFaxNumber", editRowProp.creditorNomineeFaxNumber);
        survey.setValue("creditorDiedAfter", editRowProp.creditorDiedAfter);
        survey.setValue("creditorDiedAfterNoGcreditorExists", editRowProp.creditorDiedAfterNoGcreditorExists);
        survey.setValue("creditorHasPersonalRep", editRowProp.creditorHasPersonalRep);
        survey.setValue("creditorPersonalRepName", editRowProp.creditorPersonalRepName);
        survey.setVariable("id", editRowProp.id);
    }

    beforeDestroy() {
        const progress = this.survey.isCurrentPageHasErrors? 50 : 100;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })
    }
}
</script>
