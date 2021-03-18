<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary.ts";
import surveyJson from "./forms/children.json";

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

export default class Children extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public deceasedDateOfDeathPlus4!: string;

    @applicationState.State
    public childrenCompleted!: boolean;

    @applicationState.State
    public spouseCompleted!: boolean;

    @applicationState.State
    public relatedPeopleInfo!: any;

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
    public UpdateAllCompleted!: (newAllCompleted) => void

    @applicationState.Action
    public UpdateChildrenCompleted!: (newChildrenCompleted) => void

    @applicationState.Action
    public UpdatePageActive!: (newPageActive) => void

    @applicationState.Action
    public UpdateDeceasedChildrenInfo!: (newDeceasedChildrenInfo) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);  
    currentPage=0;
    thisStep=0;

    spouseExist = false;
   
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
            this.determineHasChild();
            this.determineChildrenCompleted();
            //console.log(options)
        })            
    }

    public determineChildrenCompleted(){
        
        if (this.survey.data.child && this.survey.data.child == "n") {
            this.UpdateChildrenCompleted(true);
        }else if(this.survey.data.childCompleted && this.survey.data.childCompleted == "y") {
            this.UpdateChildrenCompleted(true);
        }else{
            this.UpdateChildrenCompleted(false);
        }

        if (this.spouseCompleted && this.childrenCompleted && this.relatedPeopleInfo.length>0) {
            this.toggleSteps([3,8], true);            
        } else {
            this.toggleSteps([3, 4, 5, 6, 7, 8], false);
        }
    }

    public determineHasChild(){
        if (this.survey.data.child && this.survey.data.child == "n") { //No Children
            this.survey.setVariable("noChildren", true);
            this.survey.setVariable("spouseExist", this.spouseExist);
            if(!this.spouseExist){                
                this.togglePages([2], true);//parent page
                this.togglePages([3,4], false);
            }
            else{
                this.togglePages([2,3,4], false);
            }
            
        } else {//some Children
            this.survey.setVariable("noChildren", false);
            this.togglePages([2], false); 
            this.extractDeceasedChild();
        }
    }

    public extractDeceasedChild(){

        const childrenInfo = this.survey.data.childInfoPanel
        const deceasedName = Vue.filter('getFullName')(this.deceasedName);
        const deceasedChildren = [];
        let deceasedChildrenExitMessage = "";        
        console.log(childrenInfo)

        for (const child of childrenInfo) {
            if (child.childIsAlive == "n"           && 
                child.childDied5DaysAfter == "n"    &&
                child.childName) {
                    deceasedChildren.push(Vue.filter('getFullName')(child.childName));                    
            }                       
        }
        if (deceasedChildren.length > 0) {

            if (deceasedChildren.length == 1){
                deceasedChildrenExitMessage = "Because " + deceasedChildren[0] + 
                " has died, doesn't have a personal representative but has children who are alive," +
                " lets move on to information about " + deceasedChildren[0] + "'s children.";

            } else {
                deceasedChildrenExitMessage = "Because some of " + deceasedName + "'s children have died, don't have personal" + 
                " representatives but have children who are alive, lets move on to information about their children.";
            }
            
            this.survey.setVariable("needGrandChildrenInfo", true);
            this.survey.setVariable("deceasedChildrenExitMessage", deceasedChildrenExitMessage);
            this.UpdateDeceasedChildrenInfo(deceasedChildren);
            this.togglePages([3], true);

        } else {
            this.survey.setVariable("needGrandChildrenInfo", false);
            this.UpdateDeceasedChildrenInfo([]);
            this.togglePages([3], false);
        }

    }

    public togglePages(pageArr, activeIndicator) {
        
        for (let i = 0; i < pageArr.length; i++) {
            this.UpdatePageActive( {
                currentStep: this.currentStep,
                currentPage: pageArr[i],
                active: activeIndicator
            });
        }
    }

    public toggleSteps(stepArr, active) {
        for (let i = 0; i < stepArr.length; i++) {
            this.UpdateStepActive({
                currentStep: stepArr[i],
                active: active
            });
        }        
    }
    
    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result['childrenSurvey']) {
            this.survey.data = this.step.result['childrenSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);            
        }

        this.thisStep = this.currentStep;
      
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);

        //console.log(this.steps[2].result['spouseSurvey'].data.spouseExists)
        if(this.steps[2].result['spouseSurvey'].data.spouseExists == 'y'){
            this.spouseExist = true;
        }else{
            this.spouseExist = false;
        }

        if(this.survey.data.child){
            this.determineHasChild();
        } 
        this.determineChildrenCompleted();
    
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.survey.setVariable("deceasedDateOfDeathPlus4", this.deceasedDateOfDeathPlus4);     
   
    }

    public onPrev() {
        this.UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors) {
            this.UpdateGotoNextStepPage()
        }
    }

    public extractRelatedPeopleInfo(){
        const relatedPeopleInfo=[]
        if(this.steps[2].result && this.steps[2].result["spouseSurvey"]){
            const spouseSurvey = this.steps[2].result && this.steps[2].result["spouseSurvey"];
            //console.log(spouseSurvey)
            const spouseInfo = (spouseSurvey.data.spouseExists =='y' && spouseSurvey.data.spouseInfoPanel)?spouseSurvey.data.spouseInfoPanel:[];
                   
            for (const spouse of spouseInfo) {
                if (spouse.spouseIsAlive == "y") {
                    relatedPeopleInfo.push({relationShip: "spouse",name:spouse.spouseName, isAlive:spouse.spouseIsAlive, info: spouse});
                }                       
            }
        }

       
        const childrenInfo = (this.survey.data.child=='y'&& this.survey.data.childInfoPanel)?this.survey.data.childInfoPanel:[]
            
        for (const child of childrenInfo) {
            if (child.childIsAlive == "y") {
                relatedPeopleInfo.push({relationShip: "child", name:child.childName, isAlive:child.childIsAlive, info: child});
            }                       
        }
        
        this.UpdateRelatedPeopleInfo(relatedPeopleInfo)
    }

    public onComplete() {
        this.UpdateAllCompleted(true);
    }  
    
    beforeDestroy() {
        this.extractRelatedPeopleInfo()
        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);        
        this.UpdateStepResultData({step:this.step, data: {childrenSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
