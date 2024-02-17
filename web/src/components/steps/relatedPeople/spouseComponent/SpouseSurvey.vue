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
import surveyJson from "./forms/spouse.json";
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
            this.spouse.spouseHasGuardian = spouseData.spouseHasGuardian;
            this.spouse.spouseGuardianName = spouseData.spouseGuardianName;
            this.spouse.spouseIsCompetent = spouseData.spouseIsCompetent;
            
        }
    }

    public populateFormWithPreExistingValues(editRowProp, survey) {
        survey.data = {
            spouseName: editRowProp.spouseName
        };
        survey.setValue("spouseDateOfBirth", editRowProp.dob);
        survey.setValue("relationToSpouse", editRowProp.relation);
        survey.setValue("spouseRelationToOtherParty", editRowProp.opRelation);
        survey.setValue("spouseCurrentlyLivingWith", editRowProp.currentLiving);
        survey.setValue("spouseInfoAckknowledge", editRowProp.ack);
        survey.setValue("spouseAdditionalInfo", editRowProp.additionalInfo);
        survey.setValue("additionInfoDetails", editRowProp.additionalInfoDetails);
        survey.setVariable("id", editRowProp.id);
    }

    beforeDestroy() {
        const progress = this.survey.isCurrentPageHasErrors? 50 : 100;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })
    }
}
</script>
