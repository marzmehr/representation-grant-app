<template>
    <div>
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

import { nameInfoType } from '@/types/Common';
import { creditorPersonInfoType } from '@/types/Application/Creditor';

@Component
export default class CreditorSurvey extends Vue {
    
    @Prop({required: true})
    editRowProp!: Object;   
    
    @Prop({required: true})
    deceasedName!: nameInfoType;     
    
    creditor = {} as creditorPersonInfoType;

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
            this.creditor.creditorPersonName = creditorData.creditorPersonName;       
            this.creditor.creditorPersonIsAlive = creditorData.creditorPersonIsAlive;
            this.creditor.creditorPersonIsAdult = creditorData.creditorPersonIsAdult;
            this.creditor.creditorPersonIsAdultNoExplanation = creditorData.creditorPersonIsAdultNoExplanation;
            this.creditor.creditorPersonIsAdultNoDOB = creditorData.creditorPersonIsAdultNoDOB; 
            this.creditor.creditorPersonIsAdultNoResidentialAddress = creditorData.creditorPersonIsAdultNoResidentialAddress;
            this.creditor.creditorPersonIsAdultNoResidentialReceiveMail = creditorData.creditorPersonIsAdultNoResidentialReceiveMail;
            this.creditor.creditorPersonIsAdultNoHasMailingAddress = creditorData.creditorPersonIsAdultNoHasMailingAddress;
            this.creditor.creditorPersonIsAdultNoMailingAddress = creditorData.creditorPersonIsAdultNoMailingAddress;
            this.creditor.creditorPersonIsAdultNoEmail = creditorData.creditorPersonIsAdultNoEmail;
            this.creditor.creditorPersonIsAdultNoEmailAddress = creditorData.creditorPersonIsAdultNoEmailAddress;
            this.creditor.creditorPersonIsAdultNoFax = creditorData.creditorPersonIsAdultNoFax;
            this.creditor.creditorPersonIsAdultNoFaxNumber = creditorData.creditorPersonIsAdultNoFaxNumber;
            this.creditor.creditorPersonHasGuardian = creditorData.creditorPersonHasGuardian;   
            this.creditor.creditorPersonGuardianName = creditorData.creditorPersonGuardianName;
            this.creditor.creditorPersonGuardianResidentialAddress = creditorData.creditorPersonGuardianResidentialAddress;
            this.creditor.creditorPersonGuardianResidentialReceiveMail = creditorData.creditorPersonGuardianResidentialReceiveMail;
            this.creditor.creditorPersonGuardianHasMailingAddress = creditorData.creditorPersonGuardianHasMailingAddress;
            this.creditor.creditorPersonGuardianMailingAddress = creditorData.creditorPersonGuardianMailingAddress;
            this.creditor.creditorPersonGuardianEmail = creditorData.creditorPersonGuardianEmail;
            this.creditor.creditorPersonGuardianEmailAddress = creditorData.creditorPersonGuardianEmailAddress;
            this.creditor.creditorPersonGuardianFax = creditorData.creditorPersonGuardianFax;
            this.creditor.creditorPersonGuardianFaxNumber = creditorData.creditorPersonGuardianFaxNumber;
            this.creditor.creditorPersonIsCompetent = creditorData.creditorPersonIsCompetent;
            this.creditor.creditorPersonIsCompetentNoExplanation = creditorData.creditorPersonIsCompetentNoExplanation;
            this.creditor.creditorPersonIsCompetentNoDOB = creditorData.creditorPersonIsCompetentNoDOB;
            this.creditor.creditorPersonIsCompetentNoResidentialAddress = creditorData.creditorPersonIsCompetentNoResidentialAddress;
            this.creditor.creditorPersonIsCompetentNoResidentialReceiveMail = creditorData.creditorPersonIsCompetentNoResidentialReceiveMail;
            this.creditor.creditorPersonIsCompetentNoHasMailingAddress = creditorData.creditorPersonIsCompetentNoHasMailingAddress;
            this.creditor.creditorPersonIsCompetentNoMailingAddress = creditorData.creditorPersonIsCompetentNoMailingAddress;
            this.creditor.creditorPersonIsCompetentNoEmail = creditorData.creditorPersonIsCompetentNoEmail;
            this.creditor.creditorPersonIsCompetentNoEmailAddress = creditorData.creditorPersonIsCompetentNoEmailAddress;
            this.creditor.creditorPersonIsCompetentNoFax = creditorData.creditorPersonIsCompetentNoFax;
            this.creditor.creditorPersonIsCompetentNoFaxNumber = creditorData.creditorPersonIsCompetentNoFaxNumber;
            this.creditor.creditorPersonHasNominee = creditorData.creditorPersonHasNominee;
            this.creditor.creditorPersonNomineeName = creditorData.creditorPersonNomineeName;
            this.creditor.creditorPersonNomineeFormal = creditorData.creditorPersonNomineeFormal;
            this.creditor.creditorPersonNomineeFormalNoExplanation = creditorData.creditorPersonNomineeFormalNoExplanation;
            this.creditor.creditorPersonNomineeFormalYesExplanation = creditorData.creditorPersonNomineeFormalYesExplanation;
            this.creditor.creditorPersonNomineeResidentialAddress = creditorData.creditorPersonNomineeResidentialAddress;
            this.creditor.creditorPersonNomineeResidentialReceiveMail = creditorData.creditorPersonNomineeResidentialReceiveMail;
            this.creditor.creditorPersonNomineeHasMailingAddress = creditorData.creditorPersonNomineeHasMailingAddress;
            this.creditor.creditorPersonNomineeMailingAddress = creditorData.creditorPersonNomineeMailingAddress;
            this.creditor.creditorPersonNomineeEmail = creditorData.creditorPersonNomineeEmail;
            this.creditor.creditorPersonNomineeEmailAddress = creditorData.creditorPersonNomineeEmailAddress;
            this.creditor.creditorPersonNomineeFax = creditorData.creditorPersonNomineeFax;
            this.creditor.creditorPersonNomineeFaxNumber = creditorData.creditorPersonNomineeFaxNumber;
            this.creditor.creditorPersonIsDeadExplanation = creditorData.creditorPersonIsDeadExplanation;           
            this.creditor.creditorPersonHasPersonalRep = creditorData.creditorPersonHasPersonalRep;
            this.creditor.creditorPersonPersonalRepName = creditorData.creditorPersonPersonalRepName;           
        }
    }

    public populateFormWithPreExistingValues(editRowProp, survey) {
        survey.data = {
            creditorPersonName: editRowProp.creditorPersonName
        };
        survey.setValue("creditorPersonIsAlive", editRowProp.creditorPersonIsAlive);
        survey.setValue("creditorPersonIsAdult", editRowProp.creditorPersonIsAdult);
        survey.setValue("creditorPersonIsAdultNoExplanation", editRowProp.creditorPersonIsAdultNoExplanation);
        survey.setValue("creditorPersonIsAdultNoDOB", editRowProp.creditorPersonIsAdultNoDOB);
        survey.setValue("creditorPersonIsAdultNoResidentialAddress", editRowProp.creditorPersonIsAdultNoResidentialAddress);
        survey.setValue("creditorPersonIsAdultNoResidentialReceiveMail", editRowProp.creditorPersonIsAdultNoResidentialReceiveMail);
        survey.setValue("creditorPersonIsAdultNoHasMailingAddress", editRowProp.creditorPersonIsAdultNoHasMailingAddress);
        survey.setValue("creditorPersonIsAdultNoMailingAddress", editRowProp.creditorPersonIsAdultNoMailingAddress);
        survey.setValue("creditorPersonIsAdultNoEmail", editRowProp.creditorPersonIsAdultNoEmail);
        survey.setValue("creditorPersonIsAdultNoEmailAddress", editRowProp.creditorPersonIsAdultNoEmailAddress);
        survey.setValue("creditorPersonIsAdultNoFax", editRowProp.creditorPersonIsAdultNoFax);
        survey.setValue("creditorPersonIsAdultNoFaxNumber", editRowProp.creditorPersonIsAdultNoFaxNumber);
        survey.setValue("creditorPersonHasGuardian", editRowProp.creditorPersonHasGuardian);   
        survey.setValue("creditorPersonGuardianName", editRowProp.creditorPersonGuardianName);
        survey.setValue("creditorPersonGuardianResidentialAddress", editRowProp.creditorPersonGuardianResidentialAddress);
        survey.setValue("creditorPersonGuardianResidentialReceiveMail", editRowProp.creditorPersonGuardianResidentialReceiveMail);
        survey.setValue("creditorPersonGuardianHasMailingAddress", editRowProp.creditorPersonGuardianHasMailingAddress);
        survey.setValue("creditorPersonGuardianMailingAddress", editRowProp.creditorPersonGuardianMailingAddress);
        survey.setValue("creditorPersonGuardianEmail", editRowProp.creditorPersonGuardianEmail);
        survey.setValue("creditorPersonGuardianEmailAddress", editRowProp.creditorPersonGuardianEmailAddress);
        survey.setValue("creditorPersonGuardianFax", editRowProp.creditorPersonGuardianFax);
        survey.setValue("creditorPersonGuardianFaxNumber", editRowProp.creditorPersonGuardianFaxNumber);
        survey.setValue("creditorPersonIsCompetent", editRowProp.creditorPersonIsCompetent);
        survey.setValue("creditorPersonIsCompetentNoExplanation", editRowProp.creditorPersonIsCompetentNoExplanation);
        survey.setValue("creditorPersonIsCompetentNoDOB", editRowProp.creditorPersonIsCompetentNoDOB);
        survey.setValue("creditorPersonIsCompetentNoResidentialAddress", editRowProp.creditorPersonIsCompetentNoResidentialAddress);
        survey.setValue("creditorPersonIsCompetentNoResidentialReceiveMail", editRowProp.creditorPersonIsCompetentNoResidentialReceiveMail);
        survey.setValue("creditorPersonIsCompetentNoHasMailingAddress", editRowProp.creditorPersonIsCompetentNoHasMailingAddress);
        survey.setValue("creditorPersonIsCompetentNoMailingAddress", editRowProp.creditorPersonIsCompetentNoMailingAddress);
        survey.setValue("creditorPersonIsCompetentNoEmail", editRowProp.creditorPersonIsCompetentNoEmail);
        survey.setValue("creditorPersonIsCompetentNoEmailAddress", editRowProp.creditorPersonIsCompetentNoEmailAddress);
        survey.setValue("creditorPersonIsCompetentNoFax", editRowProp.creditorPersonIsCompetentNoFax);
        survey.setValue("creditorPersonIsCompetentNoFaxNumber", editRowProp.creditorPersonIsCompetentNoFaxNumber);
        survey.setValue("creditorPersonHasNominee", editRowProp.creditorPersonHasNominee);
        survey.setValue("creditorPersonNomineeName", editRowProp.creditorPersonNomineeName);
        survey.setValue("creditorPersonNomineeFormal", editRowProp.creditorPersonNomineeFormal);
        survey.setValue("creditorPersonNomineeFormalNoExplanation", editRowProp.creditorPersonNomineeFormalNoExplanation);
        survey.setValue("creditorPersonNomineeFormalYesExplanation", editRowProp.creditorPersonNomineeFormalYesExplanation);
        survey.setValue("creditorPersonNomineeResidentialAddress", editRowProp.creditorPersonNomineeResidentialAddress);
        survey.setValue("creditorPersonNomineeResidentialReceiveMail", editRowProp.creditorPersonNomineeResidentialReceiveMail);
        survey.setValue("creditorPersonNomineeHasMailingAddress", editRowProp.creditorPersonNomineeHasMailingAddress);
        survey.setValue("creditorPersonNomineeMailingAddress", editRowProp.creditorPersonNomineeMailingAddress);
        survey.setValue("creditorPersonNomineeEmail", editRowProp.creditorPersonNomineeEmail);
        survey.setValue("creditorPersonNomineeEmailAddress", editRowProp.creditorPersonNomineeEmailAddress);
        survey.setValue("creditorPersonNomineeFax", editRowProp.creditorPersonNomineeFax);
        survey.setValue("creditorPersonNomineeFaxNumber", editRowProp.creditorPersonNomineeFaxNumber);
        survey.setValue("creditorPersonIsDeadExplanation", editRowProp.creditorPersonIsDeadExplanation);       
        survey.setValue("creditorPersonHasPersonalRep", editRowProp.creditorPersonHasPersonalRep);
        survey.setValue("creditorPersonPersonalRepName", editRowProp.creditorPersonPersonalRepName);
        survey.setVariable("id", editRowProp.id);
    }

    beforeDestroy() {
        const progress = this.survey.isCurrentPageHasErrors? 50 : 100;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })
    }
}
</script>
