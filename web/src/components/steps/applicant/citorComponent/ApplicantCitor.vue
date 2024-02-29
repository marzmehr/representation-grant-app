<template>
    <page-base v-bind:hideNavButtons="!showTable" v-bind:disableNext="isDisableNext()" v-on:onPrev="onPrev()" v-on:onNext="onNext()" >
        <div class="home-content">
            <div class="row">
                <div class="col-md-12">
                    <div >
                        <h1>Citor Details</h1>
                        <p>
                            You have indicated the applicant has citor(s).
                        </p>
                        <p>
                            Please enter the details of the citor in the 
                            fields below. To add a citor, click the “Add Citor” button. 
                            If you are done entering all the citor(s), click the “Next” button.
                        </p>
                        <div class="citorSection" v-if="showTable">
                            <div class="citorAlign">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                        <th scope="col">Applicant Citor's name</th>                                       
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <div></div>
                                        
                                        <tr v-for="citor in citorData" :key="citor.id">
                                        <td>{{citor.applicantCitorName}}</td>                                        
                                        <td><a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Delete" @click="deleteRow(citor.id)"><i class="fa fa-trash"></i></a> &nbsp;&nbsp; 
                                        <a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Edit" @click="openForm(citor)"><i class="fa fa-edit"></i></a></td>
                                        </tr>
                                        <tr class="clickableRow" @click="openForm()">
                                        <td colspan = "7">
                                            <a :class="isDisableNext()?'text-danger h4 my-2':'h4 my-2'" style="cursor: pointer;"
                                            >+Add Citor</a>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="col-md-12" v-if="!showTable" id="citor-info-survey">
                    <citor-survey 
                        :step="step" 
                        v-on:showTable="citorComponentData" 
                        v-on:surveyData="populateSurveyData" 
                        v-on:editedData="editRow" 
                        :editRowProp="anyRowToBeEdited" 
                        :deceasedName="deceasedName"
                        :applicantName="applicantName" />
                </div>               
            </div>
       
            <b-card v-if="incompleteError && showTable" name="incomplete-error" class="alert-danger p-3 my-4 " no-body :key="updated">
                <div>Required Citor information is missing. Click the "Edit button <div class="d-inline fa fa-edit"></div> " to fix it. </div>
            </b-card>           

            <b-card v-if="showTable" no-body class="my-4" :key="updated+1">  
                <b-row class="mx-4 mt-4">
                    <b-form-group>
                        <div style="color:#556077; font-size:1.40em; font-weight:bold;">                           
                            Have all the people who gave {{applicantName}} a citation now been identified?
                        </div>
                        <b-form-radio-group
                            v-model="citorCompleted"
                            @change="updatedCitor+1"
                            class="mt-2 ml-3 survey-yesno-vue"
                            style="font-size:1.40em; display: inline-block;">
                            <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                            <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                        </b-form-radio-group>
                    </b-form-group>                   

                </b-row>

                <b-card v-if="citorCompleted == 'No'" no-body class="error-box my-4 mx-4" :key="updatedCitor">  
                    <b-row>
                        <b-col cols="1" class="m-0" style="padding-right: 0;">
                            <b-icon-slash-circle-fill class="text-danger"/>
                        </b-col>
                        <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important; padding-right: 3rem !important;">
                            <p>
                                Please identify anyone who gave {{applicantName}} a citation. 
                                These people need to know that you are applying for a Representation 
                                Grant for {{deceasedName | getFullName}}. 
                            </p>
                            <p>  
                                You want as much transparency in your application as possible.
                            </p>
                            <p>
                                Even though you are telling this person you are applying for a Representation Grant, 
                                they don't automatically get part of {{deceasedName | getFullName}}'s estate.                            
                            </p>
                            
                            <p>
                                <a href='https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/168_2009_03_1#part25' target='_blank'>
                                    Click here to go to the <i>Supreme Court Civil Rules</i> for more information about citations.
                                </a> Scroll down to Rule 25-11 — Citations. (This link opens in a new tab)",
                            </p>

                        </b-col>
                    </b-row> 
                </b-card>

            </b-card> 
        </div>

    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import { namespace } from "vuex-class";  

import PageBase from "../../PageBase.vue";
import CitorSurvey from './CitorSurvey.vue';
import Tooltip from "@/components/survey/Tooltip.vue";
 
import "@/store/modules/application";
const applicationState = namespace("Application");

import { stepInfoType, stepResultInfoType } from "@/types/Application";
import { stepsAndPagesNumberInfoType } from "@/types/Application/StepsAndPages";


@Component({
    components:{
      CitorSurvey,
      PageBase,
      Tooltip
    }
})
export default class ApplicantCitor extends Vue {

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

    currentStep =0;
    currentPage =0;

    applicantName = "";
    
    showTable = true;
    citorData = [];
    anyRowToBeEdited = null;
    editId = null; 
    incompleteError =  false;   
    citorCompleted = null;
    updated = 0;
    updatedCitor = 0;

    showCitorInfo = false;
    
    public openForm(anyRowToBeEdited?) {
        this.showTable = false;
         Vue.nextTick(()=>{
            const el = document.getElementById('citor-info-survey')
            if(el) el.scrollIntoView();
        })
        if(anyRowToBeEdited) {
            this.editId = anyRowToBeEdited.id;
            this.anyRowToBeEdited = anyRowToBeEdited;
        } else {
            this.anyRowToBeEdited = null;
        }
    }

    public citorComponentData(value) {  
        this.updated ++;     
        this.showTable = value;
    }

    public populateSurveyData(citorValue) {

        const currentIndexValue = this.citorData?.length > 0 ? this.citorData[this.citorData.length - 1].id : 0;
        const id = currentIndexValue + 1;
        const newCitor = { ...citorValue, id };
        this.citorData = [...this.citorData, newCitor];

        this.showTable = true; 
        this.resetCitorRelatedPages(this.citorData);
    }

    public deleteRow(rowToBeDeleted) {
       
        this.citorData = this.citorData.filter(data => {
            return data.id !== rowToBeDeleted;
        }); 
        this.resetCitorRelatedPages(this.citorData);
        this.surveyHasError();
    }

    public editRow(editedRow) {
        this.citorData = this.citorData.map(data => {
            return data.id === this.editId ? editedRow : data;
        });
        this.showTable = true;
        this.surveyHasError();
        this.resetCitorRelatedPages(this.citorData);
    }

    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.incompleteError)    
            Vue.prototype.$UpdateGotoNextStepPage()
    }

    created() {

        if (this.step.result?.applicantCitorSurvey?.data) {
            this.citorData = this.step.result.applicantCitorSurvey.data;
        }       
        
        if (this.step.result?.citorCompleted) {
            this.citorCompleted = this.step.result.citorCompleted;
        }       
        
        if (this.step.result?.applicantInfoSurvey?.data?.applicantName){
            this.applicantName = this.step.result.applicantInfoSurvey.data.applicantName;
        }
    }

    mounted(){
        this.updated = 0;
        this.updatedCitor = 0;
        Vue.nextTick(()=>this.surveyHasError());
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;        
    }

    public surveyHasError(){
        let progress = this.citorData.length==0? 50 : 100;
    
        this.incompleteError =  false;        
        for(const citor of this.citorData){
            if (!citor.applicantCitorName || !citor.applicantCitorIsAlive){            
                this.incompleteError = true;  
                progress = 50;    
                break
            }
        }        
        Vue.filter('setSurveyProgress')(null, this.currentStep, this.currentPage, progress, false);
    }
    
    public isDisableNext() {
        return this.citorData?.length <= 0  || 
            !this.citorCompleted || this.citorCompleted == 'No';
    }

    beforeDestroy() {
        this.surveyHasError();  
        
        let citorInfo = this.getCitorResults(); 

        this.UpdateStepResultData({step:this.step, data: {applicantCitorSurvey: citorInfo, citorCompleted: this.citorCompleted}})       
    }

    public getCitorResults(){
        const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];
        for(const citor of this.citorData)
        {
            questionResults.push({name:'applicantCitorSurvey', value: this.getCitorInfo(citor), title:'Citor '+citor.id +' Information', inputType:''})
        }
        
        return {data: this.citorData, questions:questionResults, pageName:'Citor Information', currentStep: this.currentStep, currentPage:this.currentPage}
    }

    public getCitorInfo(citor){

        const resultString = [];
        resultString.push(Vue.filter('styleTitle')("Name: ")+citor.applicantCitorName);        
        
        return resultString;
    }  

    public resetCitorRelatedPages(citorData?) {
    //TODO
        // const stPgNo: stepsAndPagesNumberInfoType = this.$store.state.Application.stPgNo;   
        // const p = stPgNo.RFLM;

        // const pages = [ 
        //     p.ParentingArrangements,
        //     p.ParentalResponsibilities,
        //     p.ParentingTime,
        //     p.ParentingOrderAgreement,
        //     p.BestInterestsOfChild,
        //     p.ChildSupportCurrentArrangements,
        //     p.AboutChildSupportOrder,
        //     p.SpecialAndExtraordinaryExpenses,
        //     p.ContactWithChild,
        //     p.ContactWithChildOrder,
        //     p.AboutContactWithChildOrder,
        //     p.ContactWithChildBestInterestsOfChild,
        //     p.GuardianOfChild,           
        //     p.ReviewYourAnswersRFLM
        // ]
        // Vue.filter('setProgressForPages')(p._StepNo, pages,50);    

    }
}
</script>

<style scoped lang="scss">
@import "src/styles/common";
.home-content {
    padding-bottom: 20px;
    padding-top: 2rem;
    max-width: 950px;
    color: black;
}
.citorSection {
    border: 2px solid rgba($gov-pale-grey, 0.7);
    border-radius: 18px;
    width: 100%
}
.citorAlign {
    padding: 20px;
}
.table, td, th{
    border: 1px solid rgba($gov-pale-grey, 0.9);
  
}
.clickableRow {
    background-color: rgba($gov-pale-grey, 0.5);
    td a {
        display: block;
    }
}

.info-box {
    background: #e7efff;
    border: 1px solid #c9d0e3;
    border-radius: 4px;
    margin: 0.5em 0 0 0;
    padding: 0.5em;
    line-height: 1.4;
    font-size: 18px;
}

.error-box {
    background: #f5c8c3;
    border: 1px solid #c9d0e3;
    border-radius: 4px;
    margin: 0.5em 0 0 0;
    padding: 0.5em;
    line-height: 1.4;
    font-size: 18px;
}


</style>
