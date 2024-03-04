<template>
    <div>
        <survey v-bind:survey="survey"></survey>
        <b-row class="mt-5 mb-n4">            
            <b-button type="button" class="ml-4 px-5 btn btn-secondary" @click="goBack()">Cancel</b-button>            
            <b-button type="button" class="mr-4 px-5 ml-auto btn btn-success" @click="saveChild()">Save</b-button>            
        </b-row>       
        <br />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/children.json";
import * as surveyEnv from "@/components/survey/survey-glossary";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

import {stepsAndPagesNumberInfoType} from "@/types/Application/StepsAndPages"
import { nameInfoType } from '@/types/Common';
import { childDetailsDataInfoType } from '@/types/Application/Children';

@Component
export default class ChildSurvey extends Vue {
    
    @Prop({required: true})
    editRowProp!: Object;   
    
    @Prop({required: true})
    deceasedName!: nameInfoType;

    @applicationState.State
    public deceasedDateOfDeathPlus4!: string;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;
    
    child = {} as childDetailsDataInfoType;

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
            this.populateChildModel(sender.data);
            let id = sender.getVariable("id");
            if (id === null || id === undefined) {
                this.$emit("surveyData", this.child);
            } else {
                this.$emit("editedData", { ...this.child, id });
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
        this.survey.setVariable("deceasedDateOfDeathPlus4", this.deceasedDateOfDeathPlus4);     
   
    }
  
    public goBack() {
        this.$emit("showTable", true);
    }
    
    public saveChild() {
        
        this.survey.completeLastPage();
    }

    public populateChildModel(childData) {
        if(childData){
            this.child.childName = childData.childName;       
            this.child.childIsAlive = childData.childIsAlive;
            this.child.childIsAdult = childData.childIsAdult;
            this.child.childIsAdultNoExplanation = childData.childIsAdultNoExplanation;
            this.child.childIsAdultNoDOB = childData.childIsAdultNoDOB; 
            this.child.childIsAdultNoResidentialAddress = childData.childIsAdultNoResidentialAddress;
            this.child.childIsAdultNoResidentialReceiveMail = childData.childIsAdultNoResidentialReceiveMail;
            this.child.childIsAdultNoHasMailingAddress = childData.childIsAdultNoHasMailingAddress;
            this.child.childIsAdultNoMailingAddress = childData.childIsAdultNoMailingAddress;
            this.child.childIsAdultNoEmail = childData.childIsAdultNoEmail;
            this.child.childIsAdultNoEmailAddress = childData.childIsAdultNoEmailAddress;
            this.child.childIsAdultNoFax = childData.childIsAdultNoFax;
            this.child.childIsAdultNoFaxNumber = childData.childIsAdultNoFaxNumber;
            this.child.childHasGuardian = childData.childHasGuardian;   
            this.child.childGuardianName = childData.childGuardianName;
            this.child.childGuardianResidentialAddress = childData.childGuardianResidentialAddress;
            this.child.childGuardianResidentialReceiveMail = childData.childGuardianResidentialReceiveMail;
            this.child.childGuardianHasMailingAddress = childData.childGuardianHasMailingAddress;
            this.child.childGuardianMailingAddress = childData.childGuardianMailingAddress;
            this.child.childGuardianEmail = childData.childGuardianEmail;
            this.child.childGuardianEmailAddress = childData.childGuardianEmailAddress;
            this.child.childGuardianFax = childData.childGuardianFax;
            this.child.childGuardianFaxNumber = childData.childGuardianFaxNumber;
            this.child.childIsCompetent = childData.childIsCompetent;
            this.child.childIsCompetentNoExplanation = childData.childIsCompetentNoExplanation;
            this.child.childIsCompetentNoDOB = childData.childIsCompetentNoDOB;
            this.child.childIsCompetentNoResidentialAddress = childData.childIsCompetentNoResidentialAddress;
            this.child.childIsCompetentNoResidentialReceiveMail = childData.childIsCompetentNoResidentialReceiveMail;
            this.child.childIsCompetentNoHasMailingAddress = childData.childIsCompetentNoHasMailingAddress;
            this.child.childIsCompetentNoMailingAddress = childData.childIsCompetentNoMailingAddress;
            this.child.childIsCompetentNoEmail = childData.childIsCompetentNoEmail;
            this.child.childIsCompetentNoEmailAddress = childData.childIsCompetentNoEmailAddress;
            this.child.childIsCompetentNoFax = childData.childIsCompetentNoFax;
            this.child.childIsCompetentNoFaxNumber = childData.childIsCompetentNoFaxNumber;
            this.child.childHasNominee = childData.childHasNominee;
            this.child.childNomineeName = childData.childNomineeName;
            this.child.childNomineeFormal = childData.childNomineeFormal;
            this.child.childNomineeFormalNoExplanation = childData.childNomineeFormalNoExplanation;
            this.child.childNomineeFormalYesExplanation = childData.childNomineeFormalYesExplanation;
            this.child.childNomineeResidentialAddress = childData.childNomineeResidentialAddress;
            this.child.childNomineeResidentialReceiveMail = childData.childNomineeResidentialReceiveMail;
            this.child.childNomineeHasMailingAddress = childData.childNomineeHasMailingAddress;
            this.child.childNomineeMailingAddress = childData.childNomineeMailingAddress;
            this.child.childNomineeEmail = childData.childNomineeEmail;
            this.child.childNomineeEmailAddress = childData.childNomineeEmailAddress;
            this.child.childNomineeFax = childData.childNomineeFax;
            this.child.childNomineeFaxNumber = childData.childNomineeFaxNumber;
            this.child.childDiedAfter = childData.childDiedAfter;
            this.child.childDiedAfterNoGchildExists = childData.childDiedAfterNoGchildExists;
            this.child.childHasPersonalRep = childData.childHasPersonalRep;
            this.child.childPersonalRepName = childData.childPersonalRepName;           
        }
    }

    public populateFormWithPreExistingValues(editRowProp, survey) {
        survey.data = {
            childName: editRowProp.childName
        };
        survey.setValue("childIsAlive", editRowProp.childIsAlive);
        survey.setValue("childIsAdult", editRowProp.childIsAdult);
        survey.setValue("childIsAdultNoExplanation", editRowProp.childIsAdultNoExplanation);
        survey.setValue("childIsAdultNoDOB", editRowProp.childIsAdultNoDOB);
        survey.setValue("childIsAdultNoResidentialAddress", editRowProp.childIsAdultNoResidentialAddress);
        survey.setValue("childIsAdultNoResidentialReceiveMail", editRowProp.childIsAdultNoResidentialReceiveMail);
        survey.setValue("childIsAdultNoHasMailingAddress", editRowProp.childIsAdultNoHasMailingAddress);
        survey.setValue("childIsAdultNoMailingAddress", editRowProp.childIsAdultNoMailingAddress);
        survey.setValue("childIsAdultNoEmail", editRowProp.childIsAdultNoEmail);
        survey.setValue("childIsAdultNoEmailAddress", editRowProp.childIsAdultNoEmailAddress);
        survey.setValue("childIsAdultNoFax", editRowProp.childIsAdultNoFax);
        survey.setValue("childIsAdultNoFaxNumber", editRowProp.childIsAdultNoFaxNumber);
        survey.setValue("childHasGuardian", editRowProp.childHasGuardian);   
        survey.setValue("childGuardianName", editRowProp.childGuardianName);
        survey.setValue("childGuardianResidentialAddress", editRowProp.childGuardianResidentialAddress);
        survey.setValue("childGuardianResidentialReceiveMail", editRowProp.childGuardianResidentialReceiveMail);
        survey.setValue("childGuardianHasMailingAddress", editRowProp.childGuardianHasMailingAddress);
        survey.setValue("childGuardianMailingAddress", editRowProp.childGuardianMailingAddress);
        survey.setValue("childGuardianEmail", editRowProp.childGuardianEmail);
        survey.setValue("childGuardianEmailAddress", editRowProp.childGuardianEmailAddress);
        survey.setValue("childGuardianFax", editRowProp.childGuardianFax);
        survey.setValue("childGuardianFaxNumber", editRowProp.childGuardianFaxNumber);
        survey.setValue("childIsCompetent", editRowProp.childIsCompetent);
        survey.setValue("childIsCompetentNoExplanation", editRowProp.childIsCompetentNoExplanation);
        survey.setValue("childIsCompetentNoDOB", editRowProp.childIsCompetentNoDOB);
        survey.setValue("childIsCompetentNoResidentialAddress", editRowProp.childIsCompetentNoResidentialAddress);
        survey.setValue("childIsCompetentNoResidentialReceiveMail", editRowProp.childIsCompetentNoResidentialReceiveMail);
        survey.setValue("childIsCompetentNoHasMailingAddress", editRowProp.childIsCompetentNoHasMailingAddress);
        survey.setValue("childIsCompetentNoMailingAddress", editRowProp.childIsCompetentNoMailingAddress);
        survey.setValue("childIsCompetentNoEmail", editRowProp.childIsCompetentNoEmail);
        survey.setValue("childIsCompetentNoEmailAddress", editRowProp.childIsCompetentNoEmailAddress);
        survey.setValue("childIsCompetentNoFax", editRowProp.childIsCompetentNoFax);
        survey.setValue("childIsCompetentNoFaxNumber", editRowProp.childIsCompetentNoFaxNumber);
        survey.setValue("childHasNominee", editRowProp.childHasNominee);
        survey.setValue("childNomineeName", editRowProp.childNomineeName);
        survey.setValue("childNomineeFormal", editRowProp.childNomineeFormal);
        survey.setValue("childNomineeFormalNoExplanation", editRowProp.childNomineeFormalNoExplanation);
        survey.setValue("childNomineeFormalYesExplanation", editRowProp.childNomineeFormalYesExplanation);
        survey.setValue("childNomineeResidentialAddress", editRowProp.childNomineeResidentialAddress);
        survey.setValue("childNomineeResidentialReceiveMail", editRowProp.childNomineeResidentialReceiveMail);
        survey.setValue("childNomineeHasMailingAddress", editRowProp.childNomineeHasMailingAddress);
        survey.setValue("childNomineeMailingAddress", editRowProp.childNomineeMailingAddress);
        survey.setValue("childNomineeEmail", editRowProp.childNomineeEmail);
        survey.setValue("childNomineeEmailAddress", editRowProp.childNomineeEmailAddress);
        survey.setValue("childNomineeFax", editRowProp.childNomineeFax);
        survey.setValue("childNomineeFaxNumber", editRowProp.childNomineeFaxNumber);
        survey.setValue("childDiedAfter", editRowProp.childDiedAfter);
        survey.setValue("childDiedAfterNoGchildExists", editRowProp.childDiedAfterNoGchildExists);
        survey.setValue("childHasPersonalRep", editRowProp.childHasPersonalRep);
        survey.setValue("childPersonalRepName", editRowProp.childPersonalRepName);
        survey.setVariable("id", editRowProp.id);
    }

    beforeDestroy() {
        const progress = this.survey.isCurrentPageHasErrors? 50 : 100;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })
    }
}
</script>
