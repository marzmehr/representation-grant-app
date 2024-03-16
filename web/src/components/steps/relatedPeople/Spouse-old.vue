<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary";
import surveyJson from "./forms/spouse.json";

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

export default class Spouse extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public spouseCompleted!: boolean;

    @applicationState.State
    public childrenCompleted!: boolean;

    @applicationState.State
    public relatedPeopleInfo!: any;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public deceasedDateOfDeathPlus4!: string;

    @applicationState.Action
    public UpdateRelatedPeopleInfo!: (newRelatedPeopleInfo) => void

    @applicationState.Action
    public UpdateStepActive!: (newStepActive) => void

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateSpouseCompleted!: (newSpouseCompleted: boolean) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void

    @applicationState.Action
    public UpdateSpouseNames!: (newSpouseNames) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);  
    currentPage=0;
    thisStep=0;
   
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
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {

            this.UpdateGeneratedForms([]);
            //console.log(this.survey.data);
            this.determineSpouseCompleted();
            console.log(options)            
        })
    }

    public determineSpouseCompleted(){
        if (this.survey.data.spouseExists && this.survey.data.spouseExists == "n") {
            this.UpdateSpouseCompleted(true);
        } else if (this.survey.data.spouseCompleted && this.survey.data.spouseCompleted == "y") {
            this.UpdateSpouseCompleted(true);
        } else {
            this.UpdateSpouseCompleted(false);
        }

        if (this.spouseCompleted && this.spouseCompleted && this.relatedPeopleInfo.length>0) {
            this.toggleSteps([3,8], true);            
        } else {
            this.toggleSteps([3, 4, 5, 6, 7, 8], false);
        }
    }
    
    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result['spouseSurvey']) {
            this.survey.data = this.step.result['spouseSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);

            this.determineSpouseCompleted()
        }

        this.thisStep = this.currentStep;
      
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;

        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
    
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.survey.setVariable("deceasedDateOfDeathPlus4", this.deceasedDateOfDeathPlus4);     
   
    }

    public toggleSteps(stepArr, active) {
        for (let i = 0; i < stepArr.length; i++) {
            this.UpdateStepActive({
                currentStep: stepArr[i],
                active: active
            });
        }        
    }

    public extractRelatedPeopleInfo(){
        const relatedPeopleInfo=[]
        const spouseInfo = (this.survey.data.spouseExists =='y' && this.survey.data.spouseInfoPanel)?this.survey.data.spouseInfoPanel:[];
                
        for (const spouse of spouseInfo) {
            if (spouse.spouseIsAlive == "y") {
                relatedPeopleInfo.push({relationShip: "spouse",name:spouse.spouseName, isAlive:spouse.spouseIsAlive, info: spouse});
            }                       
        }        

        if(this.steps[2].result && this.steps[2].result["spouseSurvey"]){
            const spouseSurvey = this.steps[2].result && this.steps[2].result["spouseSurvey"];
            const spouseInfo = (this.steps[2].result.spouseExists=='y'&& spouseSurvey.data)?spouseSurvey.data:[]
                
            for (const spouse of spouseInfo) {
                if (spouse.spouseIsAlive == "y") {
                    relatedPeopleInfo.push({relationShip: "spouse", name:spouse.spouseName, isAlive:spouse.spouseIsAlive, info: spouse});
                }                       
            }
        }
        this.UpdateRelatedPeopleInfo(relatedPeopleInfo)
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
        this.extractRelatedPeopleInfo();
        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);        
        this.UpdateStepResultData({step:this.step, data: {spouseSurvey: Vue.filter('getSurveyResults')(this.survey, this.currentStep, this.currentPage)}})
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
