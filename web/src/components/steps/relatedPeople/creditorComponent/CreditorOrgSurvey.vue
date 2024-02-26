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
import surveyJson from "./forms/creditorsOrg.json";
import * as surveyEnv from "@/components/survey/survey-glossary";

import { nameInfoType } from '@/types/Common';
import { creditorOrgInfoType } from '@/types/Application/Creditor';

@Component
export default class CreditorOrgSurvey extends Vue {
    
    @Prop({required: true})
    editRowProp!: Object;   
    
    @Prop({required: true})
    deceasedName!: nameInfoType;   
    
    creditor = {} as creditorOrgInfoType;

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
            this.creditor.creditorOrganizationName = creditorData.creditorOrganizationName;
        }
    }

    public populateFormWithPreExistingValues(editRowProp, survey) {
        survey.data = {
            creditorOrganizationName: editRowProp.creditorOrganizationName
        };
       
        survey.setVariable("id", editRowProp.id);
    }

    beforeDestroy() {
        const progress = this.survey.isCurrentPageHasErrors? 50 : 100;
        this.$store.commit("Application/setPageProgress", { currentStep: this.currentStep, currentPage:this.currentPage, progress:progress })
    }
}
</script>
