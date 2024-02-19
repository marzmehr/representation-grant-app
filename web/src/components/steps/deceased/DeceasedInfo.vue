<template>
    <page-base :disableNext="disableNextButton" v-on:onPrev="onPrev()" v-on:onNext="onNext()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';    
import moment from 'moment-timezone';
import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/deceased-info.json";
import * as surveyEnv from "@/components/survey/survey-glossary"

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";
import { toggleStep } from '@/components/utils/TogglePages';

import { namespace } from "vuex-class";   
import "@/store/modules/application";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
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
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public deceasedName!: string;


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
    public UpdatedeceasedDateOfDeathPlus4!: (newdeceasedDateOfDeathPlus4) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    survey = new SurveyVue.Model(surveyJson);
    currentStep =0;
    currentPage =0;

    disableNextButton = false;   
    earliestDeathDate = "";
    today = "";

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
            
            if(this.survey.data.deceasedIntroExplanation == true){
                toggleStep(this.stPgNo.WILL._StepNo, true)
            }

            // console.log(options)
            //console.log(this.steps[4].result['reviewP1Survey'].data.p1ReviewInfoCorrect)
            this.UpdateGeneratedForms([]);

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
                this.UpdatedeceasedDateOfDeathPlus4(Vue.filter('beautify-full-date')(deceasedDateOfDeathPlus4));
            }            
            
        })   
    }

    public reloadPageInformation() {
        //console.log(this.step.result)
        this.currentStep = this.$store.state.Application.currentStep;        
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;

        this.earliestDeathDate = moment("2014-03-30").format();
        this.today = moment().format();

        if (this.step.result?.informationAboutDeceasedSurvey){
            this.survey.data = this.step.result.informationAboutDeceasedSurvey.data;
            Vue.filter('scrollToLocation')(this.$store.state.Application.scrollToLocationName);
        }
        
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);        
    }

    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors)    
            Vue.prototype.$UpdateGotoNextStepPage()
    }

    beforeDestroy() {
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, true);       
        this.UpdateStepResultData({step:this.step, data: {informationAboutDeceasedSurvey: Vue.filter('getSurveyResults')(this.survey, this.currentStep, this.currentPage)}});
    }
};
</script>

<style lang="scss">
@import "../../../styles/survey";
</style>
