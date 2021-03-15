<template>
    <page-base :disableNext="!reviewed" v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <h2 class="mt-4">Review Form P1</h2>

        <b-card
            v-for="section in questionResults"
            v-bind:key="section.name"
            :header="beautifyQuestion(section.pageName)"
            header-class="h2"
            header-bg-variant="info"
            class="my-5">
                <b-table                    
                    :items="section.questions" 
                    :fields="fields"
                    small
                    head-variant="dark" 
                    striped
                    bordered
                    fixed>
                    
                        <template v-slot:table-colgroup>
                            <col style="width:35rem"> 
                            <col style="width:25rem"> 
                            <col style="width:2.5rem">                       
                        </template>
                        <template v-slot:cell(title)="data" > 
                            <b>{{beautifyQuestion(data.value)}}</b>
                        </template>
                        <template v-slot:cell(value)="data" >
                            <div style="white-space: pre-line;" :class="beautifyResponse(data.value, data.item)!='REQUIRED'?'':'bg-danger text-white px-2'">{{beautifyResponse(data.value, data.item)}}</div>
                        </template>
                        <template v-slot:cell(edit)="data" > 
                            <b-button style="border:white;" size="sm" variant="transparent" v-b-tooltip.hover.noninteractive title="Edit"  @click="edit(section,data)"><b-icon icon="pencil-square" font-scale="1.25" variant="primary"/></b-button>
                        </template>

                </b-table>
        </b-card>
        <b-card class="mb-5">
            <b-form-checkbox
                :class="reviewed?'text-success':'text-danger'"
                :disabled="pageHasError"
                @change="surveyReviewed()"
                v-model="reviewed"
                :value="true"
                :unchecked-value="false">
                    All of the information is correct.
            </b-form-checkbox>
        </b-card>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/notify.json";

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

export default class ReviewP1 extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public relatedPeopleInfo!: any;
   
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

    disableNextButton = false;   
    
    fields =[
        {key:'title', label:'Question', thClass:'border-right', tdClass:'border-top border-right ', thStyle:''},
        {key:'value', label:'Response', thClass:'', tdClass:'border-top border-right', thStyle:''},
        {key:'edit',  label:'',         thClass:'', tdClass:'border-top ', thStyle:''}
    ]

    questionResults = [];
    pageHasError = false;
    errorQuestionNames = [];
    reviewed = false

    thisStep = 0
    currentPage =0;
    survey = new SurveyVue.Model(surveyJson);

    beforeCreate() {
     
    }    

    mounted(){
        this.initializeSurvey();
        this.reloadPageInformation()
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
    }

    public reloadPageInformation() {
        this.reviewed = false;
        this.pageHasError = false;
        for(let i=0;i<4; i++){
            const step = this.$store.state.Application.steps[i]
            const stepResult = step.result
            console.log(step)
            console.log(stepResult);
            for (const [key, value] of Object.entries(stepResult))
            {
                // console.error("____________")
                // console.log(key)
                // console.log(value)
                if(value && value['data'] && value['data'].length == 0){
                    const isPageActive = step.pages[value['currentPage']]? step.pages[value['currentPage']].active : false; 
                    value['questions'][0]= {name: "require", value: "", title: value['pageName'], inputType: ""}                 
                    if(isPageActive){
                        this.questionResults.push(value);
                    }
                }
                else if(value && (value['currentPage'] || value['currentPage']==0)){ 
                    const isPageActive = step.pages[value['currentPage']]? step.pages[value['currentPage']].active : false; 
                    //console.log(isPageActive)
                    //value['sortOrder']=  (value['currentStep']*100+value['currentPage']);                   
                    if(value['questions'] && isPageActive){
                        this.questionResults.push(value);
                    }
                } 
            }
        }
        console.log(this.questionResults)

        if (this.step.result && this.step.result["reviewP1Survey"]){
            this.survey.data = this.step.result["reviewP1Survey"].data;
            //console.log(this.survey.data.p1ReviewInfoCorrect)            
            this.reviewed = this.survey.data.p1ReviewInfoCorrect==true?true:false;
        }

        this.thisStep = this.currentStep;        
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(null, this.currentStep, this.currentPage, 50, false);
    }

    public beautifyQuestion(question){
        //console.log(question)
        let adjQuestion = question
        adjQuestion = adjQuestion.replace(/{deceasedName}/g, Vue.filter('getFullName')(this.$store.state.Application.deceasedName));
        adjQuestion = adjQuestion.replace(/<br>/g,'');
        adjQuestion = adjQuestion.replace(/<br\/>/g,'');       
        return adjQuestion
    }

    public beautifyResponse(value, dataItem){
        //console.log(value)
        //console.log(dataItem)
        const inputType = dataItem?dataItem['inputType']:""
        const inputName = dataItem?dataItem['name']:""

        if(!value){
            this.pageHasError = true;
            this.reviewed = false;
            this.survey.setValue("p1ReviewInfoCorrect",this.reviewed)
            return "REQUIRED";
        }
        else if(this.errorQuestionNames.includes(inputName))
        {
            this.pageHasError = true;
            this.reviewed = false;
            this.survey.setValue("p1ReviewInfoCorrect",this.reviewed)
            return "REQUIRED";
        }
        else if(Array.isArray(value))
        {
            //console.log(value)
            if((typeof value[0] =='string' ||value[0] instanceof String) && value[0].includes('relatedPerson[')) return this.getRelatedPeopleNames(value)
            if(value[0].spouseName)return this.getSpouseInfo(value)
            if(value[0].childName)return this.getChildrenInfo(value)
            if(typeof value[0] === 'string' || value[0] instanceof String)
                return value.join(", \n ");
            else{
                this.pageHasError = true;
                this.reviewed = false;
                this.survey.setValue("p1ReviewInfoCorrect",this.reviewed)
                return "REQUIRED";
            } 
        }
        else if(value=='y')
            return 'Yes';
        else if(value=='n')
            return 'No';
        else if(value.first)
            return Vue.filter('getFullName')(value)
        else if(value.street)
            return Vue.filter('getFullAddress')(value)
        else if(value.phone)
            return Vue.filter('getFullContactInfo')(value)
        else if(inputType=="date")
            return Vue.filter('beautify-date')(value)
        else 
            return value;    
    }

    public getSpouseInfo(spouses){
        let resultString = "";
        for(const spouse of spouses ){            
            resultString +="Name: " + Vue.filter('getFullName')(spouse['spouseName']) +"\n";
            resultString +="Adult: " + (spouse['spouseIsAdult']=='y'?'Yes':'No') +"\n";
            resultString +="Alive: " + (spouse['spouseIsAlive']=='y'?'Yes':'No') +"\n";
            resultString +="Competent: " + (spouse['spouseIsCompetent']=='y'?'Yes':'No') +"\n";
        }
        return resultString;
    }

    public getChildrenInfo(children){
        let resultString = "";
        for(const child of children ){            
            resultString +="Name: " + Vue.filter('getFullName')(child['childName']) +"\n";
            resultString +="Adult: " + (child['childIsAdult']=='y'?'Yes':'No') +"\n";
            resultString +="Alive: " + (child['childIsAlive']=='y'?'Yes':'No') +"\n";
            resultString +="Competent: " + (child['childIsCompetent']=='y'?'Yes':'No') +"\n";
        }
        return resultString;
    }

    public getRelatedPeopleNames(relatedPeople){
        const relatedPeopleNames = this.$store.state.Application.steps[3].result['applicantInfoSurvey'].data.relatedPeopleNames
        console.log(relatedPeopleNames)
        console.log(relatedPeople)
        let resultString = "";
        for(const relatedPerson of relatedPeople ){
            const name = relatedPeopleNames[relatedPerson.match(/\d/g)]
            if(name) resultString +=name +"\n";            
        } 
        return resultString;
    }


    public edit(section, data){
        console.log(data)
        console.log(section)
        this.$store.commit("Application/setScrollToLocationName",data.item.name);
        this.$store.commit("Application/setCurrentStep", section.currentStep);
        this.$store.commit("Application/setCurrentStepPage", {currentStep: section.currentStep, currentPage: section.currentPage });
        const currPage = document.getElementById(this.getStepPageId(section.currentStep, section.currentPage));
        currPage.className="current";
    }

    public getStepId(stepIndex) {
        return "step-" + stepIndex;
    }

    public getStepPageId(stepIndex, pageIndex) {
        return this.getStepId(stepIndex) + "-page-" + pageIndex;
    }

    
    public activateStep(stepActive) {
        this.UpdateStepActive( {
            currentStep: 0,
            active: stepActive
        });
    }    

    public toggleSteps(stepArr, active) {
        for (let i = 0; i < stepArr.length; i++) {
            this.UpdateStepActive({
                currentStep: stepArr[i],
                active: active
            });
        }        
    }
   
    public onPrev() {
        this.UpdateGotoPrevStepPage()
    }

    public onNext() {
        
        this.UpdateGotoNextStepPage()
        
    }
    
    public onComplete() {
        this.UpdateAllCompleted(true);
    }

    public surveyReviewed() {
        Vue.nextTick(()=>this.survey.setValue("p1ReviewInfoCorrect",this.reviewed))
    }       

    beforeDestroy() {
        Vue.filter('setSurveyProgress')(null, this.thisStep, this.currentPage, this.reviewed?100:50, true);       
        this.UpdateStepResultData({step:this.step, data: {reviewP1Survey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
