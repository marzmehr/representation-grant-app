<template>
    <div>
        <survey v-bind:survey="survey"></survey>
        <div class="row">
            <div class="col-6">
                <button type="button" class="btn btn-secondary" @click="goBack()">Cancel</button>
            </div>
            <div class="col-6">
                <button type="button" class="btn btn-success" @click="saveSpouse()">Save</button>
            </div>
        </div>
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
import { spouseInfoType } from '@/types/Application/Spouse';
import { nameInfoType } from '@/types/Common';

@Component
export default class SpouseSurvey extends Vue {
    
    @Prop({required: true})
    editRowProp!: Object;   
    
    @Prop({required: true})
    deceasedName!: nameInfoType;

    @applicationState.State
    public deceasedDateOfDeathPlus4!: string;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;
    
    spouse = {} as spouseInfoType;

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
            this.populateSpouseModel(sender.data);
            let id = sender.getVariable("id");
            if (id === null || id === undefined) {
                this.$emit("surveyData", this.spouse);
            } else {
                this.$emit("editedData", { ...this.spouse, id });
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
    
    public saveSpouse() {
        
        this.survey.completeLastPage();
    }

    public populateSpouseModel(spouseData) {
        if(spouseData){
            this.spouse.spouseName = spouseData.spouseName;       
            this.spouse.spouseIsAlive = spouseData.spouseIsAlive;
            this.spouse.spouseIsAdult = spouseData.spouseIsAdult;
            this.spouse.spouseIsAdultNoExplanation = spouseData.spouseIsAdultNoExplanation;
            this.spouse.spouseIsAdultNoDOB = spouseData.spouseIsAdultNoDOB;
            this.spouse.spouseIsAdultNoResidentialAddress = spouseData.spouseIsAdultNoResidentialAddress;
            this.spouse.spouseIsAdultNoResidentialReceiveMail = spouseData.spouseIsAdultNoResidentialReceiveMail;
            this.spouse.spouseIsAdultNoHasMailingAddress = spouseData.spouseIsAdultNoHasMailingAddress;
            this.spouse.spouseIsAdultNoMailingAddress = spouseData.spouseIsAdultNoMailingAddress;
            this.spouse.spouseIsAdultNoEmail = spouseData.spouseIsAdultNoEmail;
            this.spouse.spouseIsAdultNoEmailAddress = spouseData.spouseIsAdultNoEmailAddress;
            this.spouse.spouseIsAdultNoFax = spouseData.spouseIsAdultNoFax;
            this.spouse.spouseIsAdultNoFaxNumber = spouseData.spouseIsAdultNoFaxNumber;
            this.spouse.spouseHasGuardian = spouseData.spouseHasGuardian;   
            this.spouse.spouseGuardianName = spouseData.spouseGuardianName;
            this.spouse.spouseGuardianResidentialAddress = spouseData.spouseGuardianResidentialAddress;
            this.spouse.spouseGuardianResidentialReceiveMail = spouseData.spouseGuardianResidentialReceiveMail;
            this.spouse.spouseGuardianHasMailingAddress = spouseData.spouseGuardianHasMailingAddress;
            this.spouse.spouseGuardianMailingAddress = spouseData.spouseGuardianMailingAddress;
            this.spouse.spouseGuardianEmail = spouseData.spouseGuardianEmail;
            this.spouse.spouseGuardianEmailAddress = spouseData.spouseGuardianEmailAddress;
            this.spouse.spouseGuardianFax = spouseData.spouseGuardianFax;
            this.spouse.spouseGuardianFaxNumber = spouseData.spouseGuardianFaxNumber;
            this.spouse.spouseIsCompetent = spouseData.spouseIsCompetent;
            this.spouse.spouseIsCompetentNoExplanation = spouseData.spouseIsCompetentNoExplanation;
            this.spouse.spouseIsCompetentNoDOB = spouseData.spouseIsCompetentNoDOB;
            this.spouse.spouseIsCompetentNoResidentialAddress = spouseData.spouseIsCompetentNoResidentialAddress;
            this.spouse.spouseIsCompetentNoResidentialReceiveMail = spouseData.spouseIsCompetentNoResidentialReceiveMail;
            this.spouse.spouseIsCompetentNoHasMailingAddress = spouseData.spouseIsCompetentNoHasMailingAddress;
            this.spouse.spouseIsCompetentNoMailingAddress = spouseData.spouseIsCompetentNoMailingAddress;
            this.spouse.spouseIsCompetentNoEmail = spouseData.spouseIsCompetentNoEmail;
            this.spouse.spouseIsCompetentNoEmailAddress = spouseData.spouseIsCompetentNoEmailAddress;
            this.spouse.spouseIsCompetentNoFax = spouseData.spouseIsCompetentNoFax;
            this.spouse.spouseIsCompetentNoFaxNumber = spouseData.spouseIsCompetentNoFaxNumber;
            this.spouse.spouseHasNominee = spouseData.spouseHasNominee;
            this.spouse.spouseNomineeName = spouseData.spouseNomineeName;
            this.spouse.spouseNomineeFormal = spouseData.spouseNomineeFormal;
            this.spouse.spouseNomineeFormalNoExplanation = spouseData.spouseNomineeFormalNoExplanation;
            this.spouse.spouseNomineeFormalYesExplanation = spouseData.spouseNomineeFormalYesExplanation;
            this.spouse.spouseNomineeResidentialAddress = spouseData.spouseNomineeResidentialAddress;
            this.spouse.spouseNomineeResidentialReceiveMail = spouseData.spouseNomineeResidentialReceiveMail;
            this.spouse.spouseNomineeHasMailingAddress = spouseData.spouseNomineeHasMailingAddress;
            this.spouse.spouseNomineeMailingAddress = spouseData.spouseNomineeMailingAddress;
            this.spouse.spouseNomineeEmail = spouseData.spouseNomineeEmail;
            this.spouse.spouseNomineeEmailAddress = spouseData.spouseNomineeEmailAddress;
            this.spouse.spouseNomineeFax = spouseData.spouseNomineeFax;
            this.spouse.spouseNomineeFaxNumber = spouseData.spouseNomineeFaxNumber;
            this.spouse.spouseDied5DaysAfter = spouseData.spouseDied5DaysAfter;
            this.spouse.spouseHasPersonalRep = spouseData.spouseHasPersonalRep;
            this.spouse.spousePersonalRepName = spouseData.spousePersonalRepName;
        }
    }

    public populateFormWithPreExistingValues(editRowProp, survey) {
        survey.data = {
            spouseName: editRowProp.spouseName
        };
        survey.setValue("spouseIsAlive", editRowProp.spouseIsAlive);
        survey.setValue("spouseIsAdult", editRowProp.spouseIsAdult);
        survey.setValue("spouseIsAdultNoExplanation", editRowProp.spouseIsAdultNoExplanation);
        survey.setValue("spouseIsAdultNoDOB", editRowProp.spouseIsAdultNoDOB);
        survey.setValue("spouseIsAdultNoResidentialAddress", editRowProp.spouseIsAdultNoResidentialAddress);
        survey.setValue("spouseIsAdultNoResidentialReceiveMail", editRowProp.spouseIsAdultNoResidentialReceiveMail);
        survey.setValue("spouseIsAdultNoHasMailingAddress", editRowProp.spouseIsAdultNoHasMailingAddress);
        survey.setValue("spouseIsAdultNoMailingAddress", editRowProp.spouseIsAdultNoMailingAddress);
        survey.setValue("spouseIsAdultNoEmail", editRowProp.spouseIsAdultNoEmail);
        survey.setValue("spouseIsAdultNoEmailAddress", editRowProp.spouseIsAdultNoEmailAddress);
        survey.setValue("spouseIsAdultNoFax", editRowProp.spouseIsAdultNoFax);
        survey.setValue("spouseIsAdultNoFaxNumber", editRowProp.spouseIsAdultNoFaxNumber);
        survey.setValue("spouseHasGuardian", editRowProp.spouseHasGuardian);   
        survey.setValue("spouseGuardianName", editRowProp.spouseGuardianName);
        survey.setValue("spouseGuardianResidentialAddress", editRowProp.spouseGuardianResidentialAddress);
        survey.setValue("spouseGuardianResidentialReceiveMail", editRowProp.spouseGuardianResidentialReceiveMail);
        survey.setValue("spouseGuardianHasMailingAddress", editRowProp.spouseGuardianHasMailingAddress);
        survey.setValue("spouseGuardianMailingAddress", editRowProp.spouseGuardianMailingAddress);
        survey.setValue("spouseGuardianEmail", editRowProp.spouseGuardianEmail);
        survey.setValue("spouseGuardianEmailAddress", editRowProp.spouseGuardianEmailAddress);
        survey.setValue("spouseGuardianFax", editRowProp.spouseGuardianFax);
        survey.setValue("spouseGuardianFaxNumber", editRowProp.spouseGuardianFaxNumber);
        survey.setValue("spouseIsCompetent", editRowProp.spouseIsCompetent);
        survey.setValue("spouseIsCompetentNoExplanation", editRowProp.spouseIsCompetentNoExplanation);
        survey.setValue("spouseIsCompetentNoDOB", editRowProp.spouseIsCompetentNoDOB);
        survey.setValue("spouseIsCompetentNoResidentialAddress", editRowProp.spouseIsCompetentNoResidentialAddress);
        survey.setValue("spouseIsCompetentNoResidentialReceiveMail", editRowProp.spouseIsCompetentNoResidentialReceiveMail);
        survey.setValue("spouseIsCompetentNoHasMailingAddress", editRowProp.spouseIsCompetentNoHasMailingAddress);
        survey.setValue("spouseIsCompetentNoMailingAddress", editRowProp.spouseIsCompetentNoMailingAddress);
        survey.setValue("spouseIsCompetentNoEmail", editRowProp.spouseIsCompetentNoEmail);
        survey.setValue("spouseIsCompetentNoEmailAddress", editRowProp.spouseIsCompetentNoEmailAddress);
        survey.setValue("spouseIsCompetentNoFax", editRowProp.spouseIsCompetentNoFax);
        survey.setValue("spouseIsCompetentNoFaxNumber", editRowProp.spouseIsCompetentNoFaxNumber);
        survey.setValue("spouseHasNominee", editRowProp.spouseHasNominee);
        survey.setValue("spouseNomineeName", editRowProp.spouseNomineeName);
        survey.setValue("spouseNomineeFormal", editRowProp.spouseNomineeFormal);
        survey.setValue("spouseNomineeFormalNoExplanation", editRowProp.spouseNomineeFormalNoExplanation);
        survey.setValue("spouseNomineeFormalYesExplanation", editRowProp.spouseNomineeFormalYesExplanation);
        survey.setValue("spouseNomineeResidentialAddress", editRowProp.spouseNomineeResidentialAddress);
        survey.setValue("spouseNomineeResidentialReceiveMail", editRowProp.spouseNomineeResidentialReceiveMail);
        survey.setValue("spouseNomineeHasMailingAddress", editRowProp.spouseNomineeHasMailingAddress);
        survey.setValue("spouseNomineeMailingAddress", editRowProp.spouseNomineeMailingAddress);
        survey.setValue("spouseNomineeEmail", editRowProp.spouseNomineeEmail);
        survey.setValue("spouseNomineeEmailAddress", editRowProp.spouseNomineeEmailAddress);
        survey.setValue("spouseNomineeFax", editRowProp.spouseNomineeFax);
        survey.setValue("spouseNomineeFaxNumber", editRowProp.spouseNomineeFaxNumber);
        survey.setValue("spouseDied5DaysAfter", editRowProp.spouseDied5DaysAfter);
        survey.setValue("spouseHasPersonalRep", editRowProp.spouseHasPersonalRep);
        survey.setValue("spousePersonalRepName", editRowProp.spousePersonalRepName);
        survey.setVariable("id", editRowProp.id);
    }

    beforeDestroy() {
        const progress = this.survey.isCurrentPageHasErrors? 50 : 100;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })
    }
}
</script>
