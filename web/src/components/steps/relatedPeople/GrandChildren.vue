<template>
    <page-base
        v-on:onPrev="onPrev()"
        v-on:onNext="onNext()"
        v-on:onComplete="onComplete()"
    >
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary";
import surveyJson from "./forms/grandChildren.json";

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

export default class GrandChildren extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public deceasedChildrenInfo!: [];

    @applicationState.State
    public deceasedDateOfDeathPlus4!: string;

    @applicationState.Action
    public UpdateDeceasedGrandChildrenInfo!: (newDeceasedGrandChildrenInfo) => void

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    @applicationState.Action
    public UpdatePageActive!: (newPageActive) => void

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void

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
        this.adjustSurveyForMultipleDeceasedChild();
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
        console.log(this.survey);
    }

    public adjustSurveyForMultipleDeceasedChild(){
        
        const temp = (surveyJson.pages[0].elements[0])
        surveyJson.pages[0].elements=[];
        //console.log(temp)
        let tmp = JSON.parse(JSON.stringify(temp));
        for(const deceasedChild in this.deceasedChildrenInfo){
            
            tmp = JSON.parse(JSON.stringify(temp));
            tmp.name = "childPanel["+deceasedChild+"]";
            tmp.title = "Information about {deceasedChildrenInfo["+deceasedChild+"]}'s children"

            tmp.elements[0].name = "grandchildPanel["+deceasedChild+"]";
            tmp.elements[0].templateElements[0].title = "Please enter the full name of {deceasedChildrenInfo["+deceasedChild+"]}'s child.";

            tmp.elements[1].name = "grandchildExitCheckPanel["+deceasedChild+"]";
            tmp.elements[1].elements[0].name = "grandchildIsYou["+deceasedChild+"]";
            tmp.elements[1].elements[0].title = "Are you a child of {deceasedChildrenInfo["+deceasedChild+"]}?";
            tmp.elements[1].elements[1].name = "grandchildIsYouIncluded["+deceasedChild+"]";
            tmp.elements[1].elements[2].name = "grandchildIsYouIncludedNoError["+deceasedChild+"]";

            tmp.elements[2].name = "grandchildExitPanel["+deceasedChild+"]";
            tmp.elements[2].elements[0].name = "grandchildExitExplanation["+deceasedChild+"]";
            tmp.elements[2].elements[1].name = "grandchildExitGreatGrandchildrenExplanation["+deceasedChild+"]";
            tmp.elements[2].elements[2].name = "childExitParentsExplanation["+deceasedChild+"]";

            surveyJson.pages[0].elements.push(tmp)
        }
        //console.log(surveyJson)
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            console.log(this.survey.data);
            console.log(options)
            this.extractDeceasedGrandchildren();            
        })
    }

    public extractDeceasedGrandchildren(){

        const deceasedGrandChildren = [];
        
        for(const deceasedChild in this.deceasedChildrenInfo){
            const panel =  "grandchildPanel["+deceasedChild+"]";
            console.log(this.survey.data[panel])
            for(const result of this.survey.data[panel]){
                console.log(result) 
                if (result.grandchildIsAlive == "n"          && 
                    result.grandchildDied5DaysAfter == "n"   && 
                    result.grandchildName) {
                        //grandChildrenInfo[i].fullName = Vue.filter('getFullName')(grandChildrenInfo[i].childName);
                        deceasedGrandChildren.push(Vue.filter('getFullName')(result.grandchildName));
                        //deceasedGrandChildrenNames.push(grandChildrenInfo[i].childName);
                }     
            }
        }
        console.log(deceasedGrandChildren)
        if (deceasedGrandChildren.length > 0) {
            this.UpdateDeceasedGrandChildrenInfo(deceasedGrandChildren);
            this.togglePages([4], true);

        } else {
            
            this.UpdateDeceasedGrandChildrenInfo([]);
            this.togglePages([4], false);
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
    
    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result['grandChildrenSurvey']) {
            this.survey.data = this.step.result['grandChildrenSurvey'].data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);            
        }

        this.thisStep = this.currentStep;
      
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
    
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.survey.setVariable("deceasedDateOfDeathPlus4", this.deceasedDateOfDeathPlus4);
        this.survey.setVariable("deceasedChildrenInfo", this.deceasedChildrenInfo);      
   
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

        console.log(this.survey.data)
        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);        
        this.UpdateStepResultData({step:this.step, data: {grandChildrenSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}})

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
