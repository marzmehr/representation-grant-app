<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
        <b-button class="float-right" size="lg" @click="viewStatus()" variant="primary">Application complete <br> Return to Previous Applications</b-button>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/form-p2.json";
import * as surveyEnv from "@/components/survey/survey-glossary"

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
import { courtLocationInfoType } from '@/types/Common';
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class FormP2 extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[]; 

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;
    
    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public applicantName!: string;

    @applicationState.State
    public applicationLocation!: courtLocationInfoType;

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

  

    survey = new SurveyVue.Model(surveyJson);
    disableNextButton = false;   
    currentPage=0;
    currentStep=0;

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();
    }  

    mounted(){
        this.initializeSurvey();
        this.reloadPageInformation();
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }    

    public reloadPageInformation() {
        
        if (this.step.result?.formP2Survey?.data){
            this.survey.data = this.step.result.formP2Survey.data;
        }        
        
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
 
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.survey.setVariable("applicantName", this.applicantName);
        this.survey.setVariable("applicantCourthouse", this.applicationLocation.name);

//___Service 
        const serviceInfo = this.steps[this.stPgNo.APPLICANT._StepNo].result?.applicantServiceSurvey?.data;       
        this.survey.setVariable("applicantServiceAddress", serviceInfo?.applicantServiceAddress??'');        
        this.survey.setVariable("applicantServiceFax", serviceInfo?.applicantHasFax=='y' && serviceInfo?.applicantServiceFax?  serviceInfo?.applicantServiceFax :'no fax');
        this.survey.setVariable("applicantServiceEmail", serviceInfo?.applicantServiceEmail??'');
        this.survey.setVariable("applicantServicePhone", serviceInfo?.applicantServicePhone??''); 

//___Deceased        
        const deceasedInfo = this.steps[this.stPgNo.DECEASED._StepNo].result?.informationAboutDeceasedSurvey?.data;
        this.survey.setVariable("deceasedDateOfDeath", deceasedInfo?.deceasedDateOfDeath);
        this.survey.setVariable("deceasedAddress",deceasedInfo?.deceasedAddress);        
        let deceasedFirstNationsComment = "The deceased was neither a Nisg̱a'a citizen nor a member of a treaty first nation."
        if(deceasedInfo?.deceasedFirstNations == 'y' && deceasedInfo?.deceasedFirstNationsName == 'nisgaa') 
            deceasedFirstNationsComment = "The deceased was a Nisg̱a'a citizen.";
        else if(deceasedInfo?.deceasedFirstNations == 'y' && deceasedInfo?.deceasedFirstNationsName != 'nisgaa') 
            deceasedFirstNationsComment = "The deceased was a member of the treaty first nation.";
        this.survey.setVariable("deceasedFirstNationsComment", deceasedFirstNationsComment);

//___Relations
        const relationsStep = this.steps[this.stPgNo.RELATIONS._StepNo].result
        let spouseInfo = "<b>no spouse</b><br><br>"
        if(relationsStep?.spouseExists=="Yes" && relationsStep?.spouseSurvey?.data?.length>0){
            spouseInfo = "If any one of these people has died, write “(deceased)” next to their name. <ul>"
            for(const spouse of relationsStep?.spouseSurvey?.data){
                spouseInfo+=`<li><b>${spouse.spouseName}</b></li>`
            }
            spouseInfo+="</ul>"
        }
        this.survey.setVariable("spouseInfo",spouseInfo)
        
        let childrenInfo = "<b>no children</b><br><br>"
        if(relationsStep?.childExists=="Yes" && relationsStep?.childrenSurvey?.data?.length>0){
            childrenInfo = "If any one of these people has died, write “(deceased)” next to their name. <ul>"
            for(const child of relationsStep?.childrenSurvey?.data){
                childrenInfo+=`<li><b>${child.childName}</b></li>`
            }
            childrenInfo+="</ul>"
        }
        this.survey.setVariable("childrenInfo",childrenInfo)

        let creditorInfo = "<b>no creditors whose claim exceeds $10,000</b><br><br>"
        if(relationsStep?.creditorPersonExists=="Yes" || relationsStep?.creditorOrgExists=="Yes"){
            creditorInfo = "If any one of these people has died, write “(deceased)” next to their name. <ul>"
            if(relationsStep?.creditorSurvey?.data?.length>0)
                for(const creditor of relationsStep?.creditorSurvey?.data){
                    creditorInfo+=`<li><b>${creditor.creditorPersonName}</b></li>`
                }
            if(relationsStep?.creditorOrgSurvey?.data?.length>0)
                for(const creditorOrg of relationsStep?.creditorOrgSurvey?.data){
                    creditorInfo+=`<li><b>${creditorOrg.creditorOrganizationName}</b></li>`
                }
            creditorInfo+="</ul>"
        }
        this.survey.setVariable("creditorInfo", creditorInfo)

//___Citor
        const applicantStep = this.steps[this.stPgNo.APPLICANT._StepNo].result
        
        
        
        let citorInfo = "<b>no citors not named in paragraph (a), (b), (c), or (d)</b>";
        if(applicantStep?.applicantInfoSurvey?.data?.applicantCitorNewExists=='y' && applicantStep?.applicantCitorSurvey?.data?.length>0){
            citorInfo = "<ul>"
            for(const citor of applicantStep?.applicantCitorSurvey?.data){
                citorInfo+=`<li><b>${citor.applicantCitorName}</b></li>`
            }
            citorInfo+= "</ul>"
        }
        this.survey.setVariable("citorInfo", citorInfo);        
    }


    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors) {
            Vue.prototype.$UpdateGotoNextStepPage()
        }
    } 
    
    public viewStatus() {
        if(this.$route.name != "applicant-status")
            this.$router.push({ name: "applicant-status" });
    }

    beforeDestroy() {
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, true);
        this.UpdateStepResultData({step:this.step, data: {formP2Survey: Vue.filter('getSurveyResults')(this.survey, this.currentStep, this.currentPage)}});
    }
};
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
