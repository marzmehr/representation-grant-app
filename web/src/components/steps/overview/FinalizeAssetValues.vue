<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary";
import surveyJson from "./forms/finalizeAssetPage.json";

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

export default class FinalizeAssetValues extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

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
    thisStep = 0;
    numberOfUnknownValueAssets = 0;
   
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
        this.adjustSurveyForUnknownValueAssets();
        this.survey = new SurveyVue.Model(this.surveyJsonCopy);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            //console.log(this.survey.data);
            this.UpdateGeneratedForms([]);
            console.log(options)
            
        })
    }
    
    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result['finalizeAssetValuesSurvey']) {
            this.survey.data = this.step.result['finalizeAssetValuesSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);            
        }

        this.thisStep = this.currentStep;
      
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
    
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));

        this.survey.setVariable("numberOfUnknownValueAssets", this.numberOfUnknownValueAssets);
        
    
    }

    public adjustSurveyForUnknownValueAssets() {
        console.log(this.steps[5]);

        this.surveyJsonCopy = JSON.parse(JSON.stringify(surveyJson));
    
        
        const temp = (this.surveyJsonCopy.pages[0].elements[2])        
        console.log(temp)        
        let tmp = JSON.parse(JSON.stringify(temp));
        this.surveyJsonCopy.pages[0].elements[0].elements[0]["items"]=[];
        this.numberOfUnknownValueAssets = 0;       

        if(this.steps[5].result && this.steps[5].result["bankAccountsSurvey"] && this.steps[5].result["bankAccountsSurvey"].data){

            const bankAccountsSurvey = this.steps[5].result["bankAccountsSurvey"].data;

            const bankAccountInfo = (bankAccountsSurvey.bankAccountExists && bankAccountsSurvey.bankAccountExists == "y" && bankAccountsSurvey.bankAccountInfoPanel)?bankAccountsSurvey.bankAccountInfoPanel:[];
            
            for (const bankAccount of bankAccountInfo) {                
                for (const account of bankAccount.accountPanel) {                   
                    if (account.accountValue == "willGetValueLater"){
                        this.surveyJsonCopy.pages[0].elements[0].elements[0]["items"].push({name:'Account Number "'+account.accountNumber + '" at ' + bankAccount.bankName, title: 'Account Number "'+account.accountNumber + '" at ' + bankAccount.bankName})
                    }
                }                
            } 

            this.numberOfUnknownValueAssets = this.surveyJsonCopy.pages[0].elements[0].elements[0]["items"].length;
            
        }

      

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
        
        this.UpdateStepResultData({step:this.step, data: {finalizeAssetValuesSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}})

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
