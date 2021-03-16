<template>
    <page-base :disableNext="disableNextButton" v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';    
import moment from 'moment-timezone';
import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/deceased-info.json";
import * as surveyEnv from "@/components/survey/survey-glossary.ts"

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

export default class DeceasedInfo extends Vue {
        
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
    public UpdateStepActive!: (newStepActive) => void

    @applicationState.Action
    public UpdatePageActive!: (newPageActive) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void

    @applicationState.Action
    public UpdateDeceasedName!: (newDeceasedName) => void

    @applicationState.Action
    public UpdateDeceasedDateOfDeath!: (newDeceasedDateOfDeath) => void

    @applicationState.Action
    public UpdateDeceasedDateOfDeathPlus4!: (newDeceasedDateOfDeathPlus4) => void

    survey = new SurveyVue.Model(surveyJson);
    disableNextButton = false;   
    currentPage=0;
    earliestDeathDate = "";
    today = "";
    thisStep = 0;

    @Watch('pageIndex')
    pageIndexChange(newVal) 
    {
        this.survey.currentPageNo = newVal;        
    }

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();
    }

    created() {
        this.disableNextButton = false;
        if (this.step.result && this.step.result['deceasedInfoSurvey']) { 
            this.disableNextButton = false;           
        }
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

            console.log(options)
            console.log(this.steps[4].result['reviewP1Survey'].data.p1ReviewInfoCorrect)

            if(options.name == "deceasedName") {
                this.UpdateDeceasedName(options.value);
            }

            if(options.name == "deceasedDateOfDeath") {
                if (this.earliestDeathDate < options.value && this.today > options.value) {

                    this.survey.setVariable("invalidDateOfDeathError", false);
                    this.disableNextButton = false;

                } else {

                    this.disableNextButton = true;
                    this.survey.setVariable("invalidDateOfDeathError", true);

                    if (this.earliestDeathDate > options.value) {
                        this.survey.setVariable("invalidDateOfDeathMessage", "The Date of Death should be after March 30, 2014.");
                    } else {
                        this.survey.setVariable("invalidDateOfDeathMessage", Vue.filter('getFullName')(this.deceasedName) + " cannot have died on a future date.");
                    }                   
                    
                }
                this.UpdateDeceasedDateOfDeath(options.value);
                const deceasedDateOfDeathPlus4 = moment(options.value, "YYYY-MM-DD").add(4, 'days').format();
                console.log(deceasedDateOfDeathPlus4)
                this.UpdateDeceasedDateOfDeathPlus4(Vue.filter('beautify-full-date')(deceasedDateOfDeathPlus4));
            }            
            
        })   
    }

    public reloadPageInformation() {
        //console.log(this.step.result)
        this.earliestDeathDate = moment("2014-03-30").format();
        this.today = moment().format();

        if (this.step.result && this.step.result["deceasedInfoSurvey"]){
            this.survey.data = this.step.result["deceasedInfoSurvey"].data;
        }
        
        this.thisStep = this.currentStep;
        
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);        
        
   }

    public activateStep(stepActive) {
        this.UpdateStepActive( {
            currentStep: 0,
            active: stepActive
        });
    }


    public togglePages(pageArr, activeIndicator) {
        this.activateStep(activeIndicator);
        for (let i = 0; i < pageArr.length; i++) {
            this.UpdatePageActive({
                currentStep: 0,
                currentPage: pageArr[i],
                active: activeIndicator
            });
        }
    }

    public toggleStep(step, active) {
        this.UpdateStepActive({
            currentStep: step,
            active: active
        });
    }

    public onPrev() {
        this.UpdateGotoPrevStepPage()
    }

    public onNext() {
        //if(!this.survey.isCurrentPageHasErrors) {
        if(this.survey.data.deceasedIntroExplanation == true)    
            this.UpdateGotoNextStepPage()
        //}
    }
    
    public onComplete() {
        this.UpdateAllCompleted(true);
    }

    public isDisableNext() {
        // demo
        return Object.keys(this.survey.data).length == 0;
    }

    public getDisableNextText() {
        // demo
        return "You will need to answer the question above to continue";
    }    

    beforeDestroy() {

        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);
       
        this.UpdateStepResultData({step:this.step, data: {deceasedInfoSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
