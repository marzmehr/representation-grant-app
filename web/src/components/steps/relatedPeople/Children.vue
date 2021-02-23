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

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void

    @applicationState.Action
    public UpdatePageActive!: (newPageActive) => void

    @applicationState.Action
    public UpdateDeceasedChildrenInfo!: (newDeceasedChildrenInfo) => void

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
           
            if(options.name == "child"){
                if (options.value == "n") {
                    this.survey.setVariable("noChildren", true);
                    this.togglePages([2], true);
                    
                } else {
                    this.survey.setVariable("noChildren", false);
                    this.togglePages([2], false) 
                }
            }            
               
            const childrenInfo = this.survey.data.childInfoPanel
            const deceasedName = Vue.filter('getFullName')(this.deceasedName);
            const deceasedChildren = [];
            let deceasedChildrenExitMessage = "";
            const deceasedChildrenNames = [];
            console.log(childrenInfo)

            if ( childrenInfo && childrenInfo.length > 0) {

                for (let i = 0; i < childrenInfo.length; i++) {
                    if (childrenInfo[i].childIsAlive == "n" && 
                        childrenInfo[i].childHasPersonalRep == "n" && childrenInfo[i].childInformalPersonalRepName) {
                            childrenInfo[i].fullName = Vue.filter('getFullName')(childrenInfo[i].childName);
                            deceasedChildren.push(childrenInfo[i]);
                            deceasedChildrenNames.push(childrenInfo[i].childName);
                    }                       
                }

                if (deceasedChildren.length > 0) {

                    if (deceasedChildrenNames.length == 1){
                        deceasedChildrenExitMessage = "Because " + Vue.filter('getFullName')(deceasedChildrenNames[0]) + 
                        " has died, doesn't have a personal representative but has children who are alive," +
                        " lets move on to information about " + Vue.filter('getFullName')(deceasedChildrenNames[0]) + "'s children.";

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
            
        })
            
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
    
    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result['childrenSurvey']) {
            this.survey.data = this.step.result['childrenSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);            
        }

        this.thisStep = this.currentStep;
      
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
    
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

    public onComplete() {
        this.UpdateAllCompleted(true);
    }
  
    
    beforeDestroy() {
        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);        
        this.UpdateStepResultData({step:this.step, data: {childrenSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
