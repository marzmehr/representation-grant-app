<template>
    <page-base v-bind:hideNavButtons="!showTable" v-bind:disableNext="isDisableNext()" v-on:onPrev="onPrev()" v-on:onNext="onNext()" >
        <div class="home-content">
            <div class="row">
                <div class="col-md-12">
                    <h1>{{deceasedName | getFullName}}'s Spouse</h1>

                    <b-card no-body class="info-box mt-4">  
                        <b-row>
                            <b-col cols="1" class="m-0" style="padding-right: 0;">
                                <b-icon-exclamation-circle-fill class="text-primary"/>
                            </b-col>
                            <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                                <p>
                                    The next step is to identify the people in {{deceasedName | getFullName}}'s life who need to 
                                    know that you are applying for a <tooltip :index="0" title='Representation Grant'/>.
                                </p>
                                <p>  
                                    If anyone doesn't think you should manage {{deceasedName | getFullName}}'s belongings, 
                                    they will have a fair chance tell to the Court.
                                </p>
                                <p>
                                    This service will start by asking if {{deceasedName | getFullName}} had a <tooltip :index="0" title='spouse'/>.
                                    If you are {{deceasedName | getFullName}}'s spouse, make sure to include yourself.
                                </p>

                            </b-col>
                        </b-row> 
                    </b-card>

                    <b-card class="mt-5">
                        <b-form-group>
                            <div style="color:#556077; font-size:1.40em; font-weight:bold;">
                                Did {{deceasedName | getFullName}} have a spouse when they died?
                            </div>
                            <p>
                                You do not need to include a spouse that {{deceasedName | getFullName}} has divorced
                                 and has not resumed a marriage-like relationship.
                            </p>
                            <b-form-radio-group
                                v-model="spouseExists"
                                @change="updated+1"
                                class="mt-2 ml-3 survey-yesno-vue"
                                style="font-size:1.40em; display: inline-block;">
                                <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                                <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                            </b-form-radio-group>
                        </b-form-group>

                        <div>
                            <div class="my-4 text-primary" @click="showSeparatedInfo= !showSeparatedInfo" style="border-bottom:1px solid;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                Do I include someone who was married (with a marriage certificate) to {{deceasedName | getFullName}} 
                                if they had separated, but not yet divorced?        
                                <span v-if="showSeparatedInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showSeparatedInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showSeparatedInfo">

                                <p>
                                    Yes, you must include someone who {{deceasedName | getFullName}} had legally married but had not divorced. 
                                    This person should know that you are applying for a Representation Grant.
                                </p>
                                <p>
                                    You want as much transparency in your application as possible in case the Court decides 
                                    that this person should be considered {{deceasedName | getFullName}}'s spouse. 
                                </p>
                                <p>
                                    Even though you are telling this person you are applying for a Representation Grant, 
                                    they don't automatically get part of {{deceasedName | getFullName}}'s 
                                    <tooltip :index="0" title='estate'/>. 
                                </p>

                                <p>
                                    <a href='https://www.bclaws.gov.bc.ca/civix/document/id/lc/statreg/09013_01#section2' target='_blank'>
                                        For more information, click here to read about who should be included as {{deceasedName | getFullName}}'s spouse 
                                        from the <i>Wills, Estate and Succession Act</i> (WESA).
                                    </a>
                                    (This link opens in a new tab)
                                </p>

                            </div>
                        </div>

                        <div class="mt-1">
                            <div class="my-4 text-primary" @click="showCommonLawInfo= !showCommonLawInfo" style="border-bottom:1px solid;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                Do I include someone who was in marriage-like relationship (also know as a common-law marriage) 
                                with {{deceasedName | getFullName}}, but they broke up before {{deceasedName | getFullName}} died?
       
                                <span v-if="showCommonLawInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showCommonLawInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showCommonLawInfo">

                                <p>
                                    No, you do not need to include {{deceasedName | getFullName}}'s marriage-like partner (also known as a common-law partner) 
                                    if they broke up. 
                                </p>
                                <p>
                                    A marriage-like relationship ends immediately after the break up. {{deceasedName | getFullName}}'s 
                                    ex-partner would not be considered {{deceasedName | getFullName}}'s  spouse  anymore.
                                </p>
                                <p>
                                    However, if you are not sure if {{deceasedName | getFullName}} and their partner were broken up when 
                                    {{deceasedName | getFullName}} died, it is safer for you to include this person. This person should 
                                    know that you are applying for a Representation Grant.                                    
                                </p>

                                <p>
                                    You want as much transparency in your application as possible in case the Court decides 
                                    that this person should be considered {{deceasedName | getFullName}}'s spouse.
                                </p>
                                <p>
                                    Even though you are telling this person you are applying for a Representation Grant, 
                                    they don't automatically get part of {{deceasedName | getFullName}}'s <tooltip :index="0" title='estate'/>.
                                </p>

                                <p>
                                    <a href='https://www.bclaws.gov.bc.ca/civix/document/id/lc/statreg/09013_01#section2' target='_blank'>
                                        For more information, click here to read about who should be included as {{deceasedName | getFullName}}'s spouse 
                                        from the <i>Wills, Estate and Succession Act</i> (WESA).
                                    </a> 
                                    (This link opens in a new tab)      
                                </p>

                            </div>
                        </div>

                        <div class="mt-1">
                            <div class="my-4 text-primary" @click="showCommonLawOffInfo= !showCommonLawOffInfo" style="border-bottom:1px solid; width: 51.5rem;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                    Do I include someone who was in an on-again, off-again marriage-like 
                                    relationship with {{deceasedName | getFullName}}?       
                                <span v-if="showCommonLawOffInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showCommonLawOffInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showCommonLawOffInfo">

                                <p>
                                    If {{deceasedName | getFullName}} lived together with a marriage-like partner (also know as a common-law partner) 
                                    for at least 2 years, this person would be considered {{deceasedName | getFullName}}'s spouse.                                    
                                </p>
                                <p>
                                    A marriage-like (common law) relationship ends immediately after the break up. However, under 
                                    the law in British Columbia, this person could still be considered {{deceasedName | getFullName}}'s spouse if 
                                    they broke up and got back together again within a year.
                                </p>
                                <p>
                                    If you are not sure if {{deceasedName | getFullName}} and this person had gotten back together 
                                    before {{deceasedName | getFullName}} died, it is safer for you to include this person. This person should 
                                    know that you are applying for a Representation Grant.
                                </p>
                                <p>
                                    You want as much transparency in your application as possible in case the Court decides that 
                                    this person should be considered {{deceasedName | getFullName}}'s spouse. 
                                </p>
                                <p>
                                    Even though you are telling this person you are applying for a Representation Grant, 
                                    they don't automatically get part of {{deceasedName | getFullName}}'s <tooltip :index="0" title='estate'/>.
                                </p>                                

                                <p>
                                    <a href='https://www.bclaws.gov.bc.ca/civix/document/id/lc/statreg/09013_01#section2' target='_blank'>
                                        For more information, click here to read about who should be included as {{deceasedName | getFullName}}'s spouse 
                                        from the <i>Wills, Estate and Succession Act</i> (WESA).
                                    </a> 
                                    (This link opens in a new tab)      
                                </p>

                            </div>
                        </div>

                    </b-card>

                    <div class="mt-5" v-if="spouseExists == 'Yes'" :key="updated">
                        <h1>Spouse Details</h1>
                        <p>
                            You have indicated the deceased has spouse(s).
                        </p>
                        <p>
                            Please enter the details of the spouse in the 
                            fields below. To add a spouse, click the “Add Spouse” button. 
                            If you are done entering all the spouse(s), click the “Next” button.
                        </p>
                        <div class="spouseSection" v-if="showTable">
                            <div class="spouseAlign">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                        <th scope="col">Spouse's name</th>                                       
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <div></div>
                                        
                                        <tr v-for="spouse in spouseData" :key="spouse.id">
                                        <td>{{spouse.spouseName}}</td>                                        
                                        <td><a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Delete" @click="deleteRow(spouse.id)"><i class="fa fa-trash"></i></a> &nbsp;&nbsp; 
                                        <a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Edit" @click="openForm(spouse)"><i class="fa fa-edit"></i></a></td>
                                        </tr>
                                        <tr class="clickableRow" @click="openForm()">
                                        <td colspan = "7">
                                            <a :class="isDisableNext()?'text-danger h4 my-2':'h4 my-2'" style="cursor: pointer;"
                                            >+Add Spouse</a>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="col-md-12" v-if="!showTable" id="spouse-info-survey">
                    <spouse-survey :step="step" v-on:showTable="spouseComponentData" v-on:surveyData="populateSurveyData" v-on:editedData="editRow" :editRowProp="anyRowToBeEdited" :deceasedName="deceasedName" />
                </div>               
            </div>
        </div>
       
        <b-card v-if="spouseExists== 'Yes' && incompleteError && showTable" name="incomplete-error" class="alert-danger p-3 my-4 " no-body>
            <div>Required Spouse information is missing. Click the "Edit button <div class="d-inline fa fa-edit"></div> " to fix it. </div>
        </b-card> 

        <b-card v-else-if="spouseExists== 'Yes' && !incompleteError && showTable" >  
            <b-row no-body class="info-box my-4">
                <b-col cols="1" class="m-0" style="padding-right: 0;">
                    <b-icon-exclamation-circle-fill class="text-primary"/>
                </b-col>
                <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                    <p>
                        In this step you have identified that, {{deceasedName | getFullName}}'s spouses may include:                       
                        <ul>
                            <li v-for="spouse in spouseData" :key="spouse.id">
                                {{ spouse.spouseName }}
                            </li>
                        </ul>                       
                    </p>
                    <p>
                        Before moving on to the next step, please make sure that you have identified everyone 
                        who may be considered {{deceasedName | getFullName}}'s spouse.
                    </p>
                    <p>
                        Sometimes people forget to include themselves while using this service. 
                        If you are {{deceasedName | getFullName}}'s spouse but you haven't included yourself yet, 
                        please add information about yourself.
                    </p>
                </b-col>
            </b-row>
        </b-card>
   
        <b-card v-else-if="spouseExists== 'No'" no-body class="info-box mt-4">  
            <b-row>
                <b-col cols="1" class="m-0" style="padding-right: 0;">
                    <b-icon-exclamation-circle-fill class="text-primary"/>
                </b-col>
                <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                    <p>
                        In this step you have identified that there is no one who would be considered
                        {{deceasedName | getFullName}}'s at the time {{deceasedName | getFullName}} died.
                    </p>
                    <p>
                        Before moving on to the next step, please make sure that you have identified everyone 
                        who may be considered {{deceasedName | getFullName}}'s spouse.
                    </p>
                    <p>
                        Sometimes people forget to include themselves while using this service. 
                        If you are {{deceasedName | getFullName}}'s spouse but you haven't included yourself yet, 
                        please add information about yourself.
                    </p>
                </b-col>
            </b-row>
        </b-card> 

        <b-card v-if="spouseExists!= null" no-body class="my-4">  
            <b-row class="mx-4 mt-4">
                <b-form-group>
                    <div style="color:#556077; font-size:1.40em; font-weight:bold;">
                        Have you identified everyone who may be considered {{deceasedName | getFullName}}'s spouse?
                    </div>
                    <b-form-radio-group
                        v-model="spouseCompleted"
                        @change="updatedSpouse+1"
                        class="mt-2 ml-3 survey-yesno-vue"
                        style="font-size:1.40em; display: inline-block;">
                        <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                        <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                    </b-form-radio-group>
                </b-form-group>

                <div>
                    <div class="my-4 text-primary" @click="showSpouseInfo= !showSpouseInfo" style="border-bottom:1px solid; width: 24.5rem;">
                        <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                        How can someone have more than 1 spouse?        
                        <span v-if="showSpouseInfo" class='ml-2 fa fa-chevron-up'/>
                        <span v-if="!showSpouseInfo" class='ml-2 fa fa-chevron-down'/>
                    </div>
                    <div v-if="showSpouseInfo">
                        <p>
                            Someone can have more than 1 spouse depending on the laws where they live.
                        </p>
                        <p>
                            Under B.C. law, if a person is legally married and they separate from their spouse 
                            but did not get a divorce, the person they separated from is still considered their spouse. 
                            If that same person then starts a new marriage-like relationship with a new partner, 
                            this new partner could be considered a spouse.
                        </p>
                        <p>
                            In this situation, the person could have 2 spouses because they didn't divorce their first spouse.                           
                        </p>
                        <p>
                            <a href='https://www.bclaws.gov.bc.ca/civix/document/id/lc/statreg/09013_01#section2' target='_blank'>
                                For more information, click here to read about who should be included as {{deceasedName | getFullName}}'s spouse 
                                from the <i>Wills, Estate and Succession Act</i> (WESA).
                            </a>
                            (This link opens in a new tab)
                        </p>
                    </div>
                </div>

            </b-row>

            <b-card v-if="spouseCompleted == 'No'" no-body class="error-box my-4 mx-4">  
                <b-row>
                    <b-col cols="1" class="m-0" style="padding-right: 0;">
                        <b-icon-slash-circle-fill class="text-danger"/>
                    </b-col>
                    <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important; padding-right: 3rem !important;">
                        <p>
                            Please identify everyone who may be considered {{deceasedName | getFullName}}'s spouse 
                            at the time {{deceasedName | getFullName}} died. They should know that you are applying for a 
                            Representation Grant for {{deceasedName | getFullName}}.
                        </p>
                        <p>  
                            You want as much transparency in your application as possible in case the Court 
                            decides that this person should be considered {{deceasedName | getFullName}}'s spouse.
                        </p>
                        <p>
                            Just because you are giving this person notice, it may not mean that they get part of 
                            {{deceasedName | getFullName}}'s estate.                            
                        </p>

                        <p>
                            <a href='https://www.bclaws.gov.bc.ca/civix/document/id/lc/statreg/09013_01#section2' target='_blank'>
                                For more information, click here to read about who should be included as {{deceasedName | getFullName}}'s spouse 
                                from the <i>Wills, Estate and Succession Act</i> (WESA).
                            </a>
                            (This link opens in a new tab)
                        </p>

                    </b-col>
                </b-row> 
            </b-card>



        </b-card> 

    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import { namespace } from "vuex-class";  

import PageBase from "../../PageBase.vue";
import SpouseSurvey from './SpouseSurvey.vue';
import Tooltip from "@/components/survey/Tooltip.vue";
 
import "@/store/modules/application";
const applicationState = namespace("Application");

import { stepInfoType, stepResultInfoType } from "@/types/Application";
import { stepsAndPagesNumberInfoType } from "@/types/Application/StepsAndPages";


@Component({
    components:{
      SpouseSurvey,
      PageBase,
      Tooltip
    }
})
export default class SpouseInfo extends Vue {

    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public steps!: stepInfoType[]; 
    
    @applicationState.State
    public childrenCompleted!: boolean;

    @applicationState.State
    public relatedPeopleInfo!: any;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    @applicationState.Action
    public UpdateRelatedPeopleInfo!: (newRelatedPeopleInfo) => void

    @applicationState.Action
    public UpdateStepActive!: (newStepActive) => void

    @applicationState.Action
    public UpdateSpouseCompleted!: (newSpouseCompleted: boolean) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void

    @applicationState.Action
    public UpdateSpouseNames!: (newSpouseNames) => void

    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void    

    currentStep =0;
    currentPage =0;
    showTable = true;
    spouseData = [];
    anyRowToBeEdited = null;
    editId = null; 
    incompleteError =  false;   
    spouseExists = null; 
    spouseCompleted = null;
    updated = 0;
    updatedSpouse = 0;
    showSeparatedInfo = false;
    showCommonLawInfo = false;
    showCommonLawOffInfo = false;
    showSpouseInfo = false;
    
    public openForm(anyRowToBeEdited?) {
        this.showTable = false;
         Vue.nextTick(()=>{
            const el = document.getElementById('spouse-info-survey')
            if(el) el.scrollIntoView();
        })
        if(anyRowToBeEdited) {
            this.editId = anyRowToBeEdited.id;
            this.anyRowToBeEdited = anyRowToBeEdited;
        } else {
            this.anyRowToBeEdited = null;
        }
    }

    public spouseComponentData(value) {       
        this.showTable = value;
    }

    public populateSurveyData(spouseValue) {

        const currentIndexValue = this.spouseData?.length > 0 ? this.spouseData[this.spouseData.length - 1].id : 0;
        const id = currentIndexValue + 1;
        const newSpouse = { ...spouseValue, id };
        this.spouseData = [...this.spouseData, newSpouse];

        this.showTable = true; 
        this.resetSpouseRelatedPages(this.spouseData);
    }

    public deleteRow(rowToBeDeleted) {
       
        this.spouseData = this.spouseData.filter(data => {
            return data.id !== rowToBeDeleted;
        }); 
        this.resetSpouseRelatedPages(this.spouseData);
        this.surveyHasError();
    }

    public editRow(editedRow) {
        this.spouseData = this.spouseData.map(data => {
            return data.id === this.editId ? editedRow : data;
        });
        this.showTable = true;
        this.surveyHasError();
        this.resetSpouseRelatedPages(this.spouseData);
    }

    public onPrev() {
       this.UpdateGotoPrevStepPage();
    }

    public onNext() {
        this.UpdateGotoNextStepPage();
    }

    created() {

        if (this.step.result?.spouseExists) {
            this.spouseExists = this.step.result.spouseExists;
        }

        if (this.step.result?.spouseSurvey?.data) {
            this.spouseData = this.step.result.spouseSurvey.data;
        }           
    }

    mounted(){
        this.updated = 0;
        Vue.nextTick(()=>this.surveyHasError());
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;        
    }

    public surveyHasError(){
        let progress = this.spouseData.length==0? 50 : 100;
        
        if(this.spouseExists == 'No') progress =100;

        this.incompleteError =  false;        
        for(const spouse of this.spouseData){
            if (!spouse.spouseName || !spouse.spouseIsAlive){            
                this.incompleteError = true;  
                progress = 50;    
                break
            }
        }        
        Vue.filter('setSurveyProgress')(null, this.currentStep, this.currentPage, progress, false);
    }
    
    public isDisableNext() {
        return (!this.spouseExists || (this.spouseExists == 'Yes' && this.spouseData?.length <= 0 ) || 
            (this.spouseData?.length <= 0) || !this.spouseCompleted || this.spouseCompleted == 'No');
    }

    beforeDestroy() {
        this.surveyHasError();  
        
        let spouseInfo = this.getSpouseResults();        
       
        if(this.spouseExists == 'No')
            spouseInfo = null

        this.UpdateStepResultData({step:this.step, data: {spouseExists: this.spouseExists, spouseSurvey: spouseInfo}})       
    }

    public getSpouseResults(){
        const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];
        for(const spouse of this.spouseData)
        {
            questionResults.push({name:'spouseSurvey', value: this.getSpouseInfo(spouse), title:'Spouse '+spouse.id +' Information', inputType:''})
        }
        
        return {data: this.spouseData, questions:questionResults, pageName:'Spouse Information', currentStep: this.currentStep, currentPage:this.currentPage}
    }

    public getSpouseInfo(spouse){
        const resultString = [];

        resultString.push(Vue.filter('styleTitle')("Name: ")+spouse.spouseName);        
        
        return resultString;
    }  

    public resetSpouseRelatedPages(spouseData?) {
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
.spouseSection {
    border: 2px solid rgba($gov-pale-grey, 0.7);
    border-radius: 18px;
    width: 100%
}
.spouseAlign {
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
