<template>
    <page-base v-bind:hideNavButtons="!showTable || !showOrgTable" v-bind:disableNext="isDisableNext()" v-on:onPrev="onPrev()" v-on:onNext="onNext()" >
        <div class="home-content">
            <div class="row">
                <div class="col-md-12">
                    <h1>{{deceasedName | getFullName}}'s Creditor</h1>

                    <b-card class="mt-4">  
                        <b-row no-body class="info-box">
                            <b-col cols="1" class="m-0" style="padding-right: 0;">
                                <b-icon-exclamation-circle-fill class="text-primary"/>
                            </b-col>
                            <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                                <p>
                                    Because {{deceasedName | getFullName}} did not make a <tooltip class="ml-1" size="xl" :index="0" title='Will'/>,  
                                    if {{deceasedName | getFullName}} owed more than $10,000 to a single 
                                    person or single organization, they need know that you are applying for a 
                                    <tooltip class="ml-1" size="xl" :index="0" title='Representation Grant'/>.                                    
                                </p>
                                <p>
                                    If any of these people or organizations don't think you should manage 
                                    {{deceasedName | getFullName}}'s belongings, they will have a fair chance 
                                    tell to the Court.
                                </p>
                                <p>
                                    This step will start by asking about people first, and then follow up with 
                                    organizations second.                            
                                </p>
                            </b-col>
                        </b-row> 
                    </b-card>
<!-- relatives info -->
                    <b-card class="mt-4" >  
                        <b-row no-body class="info-box">
                            <b-col cols="1" class="m-0" style="padding-right: 0;">
                                <b-icon-exclamation-circle-fill class="text-primary"/>
                            </b-col>
                            <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                                
                                <p v-if="!relativesExist">
                                    In past steps, you have not yet identified anyone who needs to know that 
                                    you are applying for a Representation Grant for {{deceasedName | getFullName}}.                                    
                                </p>
                                <p v-else>
                                    In past steps, you have already identified the following people:
                                    <ul>
                                        <li>
                                            
                                        </li>
                                        <!-- <b>\n{bullets(spouseInfoPanel.spouseName)}\n{bullets(spouseInfoPanel.spouseGuardianName)}\n
                                            {bullets(spouseInfoPanel.spouseNomineeName)}\n{bullets(spouseInfoPanel.spousePersonalRepName)}
                                            \n{bullets(childInfoPanel.childName)}\n{bullets(childInfoPanel.childGuardianName)}
                                            \n{bullets(childInfoPanel.childNomineeName)}\n{bullets(childInfoPanel.childPersonalRepName)}\n</b>\n -->
                                    </ul>
                                    Because you are already letting these people know that you are applying for a Representation Grant, 
                                    do not identify them again in this step.                            
                                </p>                               
                            </b-col>
                        </b-row> 
                    </b-card>

                    <b-card class="mt-5">
                        <b-form-group>
                            <div style="color:#556077; font-size:1.40em; font-weight:bold;" v-if="!relativesExist">                                
                                Did {{deceasedName | getFullName}} owe more than $10,000 to any one person?
                            </div>     
                            <div style="color:#556077; font-size:1.40em; font-weight:bold;" v-else>
                               Not including the people already identified in the list above, 
                               did {{deceasedName | getFullName}} owe more than $10,000 to any one person?                            
                            </div>                        
                            <b-form-radio-group
                                v-model="creditorPersonExists"
                                @change="updated+1"
                                class="mt-2 ml-3 survey-yesno-vue"
                                style="font-size:1.40em; display: inline-block;">
                                <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                                <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                            </b-form-radio-group>
                        </b-form-group>                       

                        <div>
                            <div class="my-4 text-primary" @click="showLessMoneyInfo= !showLessMoneyInfo" style="border-bottom:1px solid; width: 33.5rem;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                What if the deceased owed less than $10,000 to a single person?                                      
                                <span v-if="showLessMoneyInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showLessMoneyInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showLessMoneyInfo">

                                <p>
                                    If the deceased owed less than $10,000 to a single person, you do not need to include that person here. 
                                    
                                </p>
                                <p>
                                    However, if you are not sure if the deceased owed a single person more than $10,000 or not, it is 
                                    safer for you to include this person. 
                                </p>
                                <p>
                                    You want as much transparency in your application as possible in case the Court decides that you 
                                    should have let this person know you were applying for a `Representation Grant` for {deceasedName}.
                                </p>
                                <p>
                                    Even though you are telling this person you are applying for a Representation Grant, they don't 
                                    automatically get part of the deceased's <tooltip class="ml-1" size="md" :index="0" title='estate'/>.
                                </p>
                               
                                <p>
                                    <a href='https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/168_2009_03_1#part25' 
                                        target='_blank'>
                                        Click here to go to the <i>Supreme Court Civil Rules</i> for more information about who 
                                        should know you are applying for a Representation Grant.
                                    </a> Scroll down to Rule 25-2, Subrule (2) (b) (ii). (This link opens in a new tab)                                                       
                                </p>
                            </div>
                        </div>                        

                    </b-card>

                    <div class="mt-5" v-if="creditorPersonExists == 'Yes'" :key="updated">
                        <h1>Creditors Details</h1>
                        <p>
                            You have indicated the deceased has creditor(s).
                        </p>
                        <p>
                            Please enter the details of the creditor in the fields below. To add a creditor, 
                            click the “Add Creditor” button. If you are done entering all the creditors, 
                            click the “Next” button.
                        </p>
                        <div class="creditorSection" v-if="showTable">
                            <div class="creditorAlign">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                        <th scope="col">Creditor's name</th>                                       
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <div></div>
                                        
                                        <tr v-for="creditor in creditorData" :key="creditor.id">
                                        <td>{{creditor.creditorPersonName}}</td>                                        
                                        <td><a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Delete" @click="deleteRow(creditor.id)"><i class="fa fa-trash"></i></a> &nbsp;&nbsp; 
                                        <a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Edit" @click="openForm(creditor)"><i class="fa fa-edit"></i></a></td>
                                        </tr>
                                        <tr class="clickableRow" @click="openForm()">
                                        <td colspan = "7">
                                            <a :class="isDisableNext()?'text-danger h4 my-2':'h4 my-2'" style="cursor: pointer;"
                                            >+Add Creditor</a>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="col-md-12" v-if="!showTable" id="creditor-info-survey">
                    <creditor-survey 
                        :step="step" 
                        v-on:showTable="creditorComponentData" 
                        v-on:surveyData="populateSurveyData" 
                        v-on:editedData="editRow" 
                        :editRowProp="anyRowToBeEdited" 
                        :deceasedName="deceasedName"/>
                </div>               
            </div>
            
            <b-card v-if="creditorPersonExists== 'Yes' && creditorData && (creditorData.length > 0) && incompleteError && showTable" name="incomplete-error" class="alert-danger p-3 my-4 " no-body :key="updated+1">
                <div>Required Creditors information is missing. Click the "Edit button <div class="d-inline fa fa-edit"></div> " to fix it. </div>
            </b-card> 

            <div class="row">
                <div class="col-md-12">

                    <b-card class="mt-5" v-if="showOrgTable">
                        <b-form-group>
                            <div style="color:#556077; font-size:1.40em; font-weight:bold;">                                
                                Did {{deceasedName | getFullName}} owe more than $10,000 to a single organization?
                            </div> 
                            <p> 
                                For example: 
                                <ul>
                                    <li>a bank for a mortgage or a line of credit,</li>
                                    <li>a city or town for property taxes,</li>
                                    <li>a utility like BC Hydro,</li>
                                    <li>a contractor for home repairs</li>
                                </ul>
                            </p>    
                                                
                            <b-form-radio-group
                                v-model="creditorOrgExists"
                                @change="updatedOrg+1"
                                class="mt-2 ml-3 survey-yesno-vue"
                                style="font-size:1.40em; display: inline-block;">
                                <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                                <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                            </b-form-radio-group>
                        </b-form-group>
                    </b-card>

                    <div class="mt-5" v-if="creditorOrgExists == 'Yes'" :key="updatedOrg">
                        <h1>Creditor Organizations Details</h1>
                        <p>
                            You have indicated the deceased has organization creditor(s).
                        </p>
                        <p>
                            Please enter the details of the organization in the fields below. To add an organization, 
                            click the “Add Creditor” button. If you are done entering all the organizations, 
                            click the “Next” button.
                        </p>
                        <div class="creditorSection" v-if="showOrgTable">
                            <div class="creditorAlign">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                        <th scope="col">Creditor organization's name</th>                                       
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <div></div>
                                        
                                        <tr v-for="creditor in creditorOrgData" :key="creditor.id">
                                        <td>{{creditor.creditorOrganizationName}}</td>                                        
                                        <td><a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Delete" @click="deleteOrgRow(creditor.id)"><i class="fa fa-trash"></i></a> &nbsp;&nbsp; 
                                        <a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Edit" @click="openOrgForm(creditor)"><i class="fa fa-edit"></i></a></td>
                                        </tr>
                                        <tr class="clickableRow" @click="openOrgForm()">
                                        <td colspan = "7">
                                            <a :class="isDisableNext()?'text-danger h4 my-2':'h4 my-2'" style="cursor: pointer;"
                                            >+Add Creditor</a>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12" v-if="!showOrgTable" id="creditor-org-info-survey">
                    <creditor-org-survey
                        :step="step" 
                        v-on:showTable="creditorOrgComponentData" 
                        v-on:surveyData="populateOrgSurveyData" 
                        v-on:editedData="editOrgRow" 
                        :editRowProp="anyOrgRowToBeEdited" 
                        :deceasedName="deceasedName"/>
                </div>

            </div>

            <b-card v-if="(creditorPersonExists== 'Yes' && creditorData && (creditorData.length > 0) && !incompleteError && showTable) || 
                (creditorOrgExists== 'Yes' && creditorOrgData && (creditorOrgData.length > 0) && !incompleteOrgError && showOrgTable)" 
                class="my-4" :key="updated+2+updatedOrg">  
                <b-row no-body class="info-box">
                    <b-col cols="1" class="m-0" style="padding-right: 0;">
                        <b-icon-exclamation-circle-fill class="text-primary"/>
                    </b-col>
                    <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                        <p>
                            In this step, you have identified that {{deceasedName | getFullName}} may have owed more than $10,000 to
                             
                        </p>
                        <p v-if="creditorPersonExists = 'Yes' && creditorData && (creditorData.length > 0)"> 
                            each of the following people:                                      
                            <ul>
                                <li v-for="creditor in creditorData" :key="creditor.id">
                                    {{ creditor.creditorPersonName }}
                                </li>
                            </ul>                       
                        </p>
                        <p v-if="creditorOrgExists = 'Yes' && creditorOrgData && (creditorOrgData.length > 0)">
                            each of the following organizations:                            
                                                  
                            <ul>
                                <li v-for="creditor in creditorOrgData" :key="creditor.id">
                                    {{ creditor.creditorOrganizationName }}
                                </li>
                            </ul>                       
                        </p>
                        <p>                             
                            Before moving on to the next step, please make sure that you have identified
                            every single person or single organization who {{deceasedName | getFullName}} 
                            may have owed more than $10,000.
                        </p>
                        <p>
                            Sometimes people forget to include themselves while using this service. 
                            If you are someone who {{deceasedName | getFullName}} owed more than $10,000, but you haven't 
                            included yourself yet, please add information about yourself.
                        </p>
                    </b-col>
                </b-row>
            </b-card>
    
            <b-card v-else-if="creditorPersonExists== 'No' && creditorOrgExists== 'No'" class="mt-4" :key="updated+3+updatedOrg">  
                <b-row no-body class="info-box">
                    <b-col cols="1" class="m-0" style="padding-right: 0;">
                        <b-icon-exclamation-circle-fill class="text-primary"/>
                    </b-col>
                    <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                        <p>
                            In this step you have identified that {{deceasedName | getFullName}} did not owed more than $10,000 to a single person 
                            or single organization at the time {{deceasedName | getFullName}}
                            died.                            
                        </p>
                        <p>                             
                            Before moving on to the next step, please make sure that you have identified
                            every single person or single organization who {{deceasedName | getFullName}} 
                            may have owed more than $10,000.
                        </p>
                        <p>
                            Sometimes people forget to include themselves while using this service. 
                            If you are someone who {{deceasedName | getFullName}} owed more than $10,000, but you haven't 
                            included yourself yet, please add information about yourself.
                        </p>
                    </b-col>
                </b-row>
            </b-card> 

            <b-card v-if="creditorPersonExists!= null && showTable && creditorOrgExists!= null && showOrgTable" no-body class="my-4">  
                <b-row class="mx-4 mt-4">
                    <b-form-group>
                        <div style="color:#556077; font-size:1.40em; font-weight:bold;">
                            Have you identified each of the people and organizations who 
                            {{deceasedName | getFullName}} owed more than $10,000?
                        </div>
                        <b-form-radio-group
                            v-model="creditorCompleted"
                            @change="updatedCreditors+1"
                            class="mt-2 ml-3 survey-yesno-vue"
                            style="font-size:1.40em; display: inline-block;">
                            <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                            <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                        </b-form-radio-group>
                    </b-form-group>                   

                </b-row>

                <b-card v-if="creditorCompleted == 'No'" no-body class="error-box my-4 mx-4" :key="updatedCreditors">  
                    <b-row>
                        <b-col cols="1" class="m-0" style="padding-right: 0;">
                            <b-icon-slash-circle-fill class="text-danger"/>
                        </b-col>
                        <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important; padding-right: 3rem !important;">
                            <p>

                                Please identify everyone who {{deceasedName | getFullName}} may have owed $10,000. 
                                These people or organizations should know that you are applying for a Representation 
                                Grant for {{deceasedName | getFullName}}.                                
                            </p>
                            
                            <p>  
                                You want as much transparency in your application as possible in case the Court 
                                decides that you should have let a person or organization know you were applying 
                                for a Representation Grant for {{deceasedName | getFullName}}.                                
                            </p>
                            <p>
                                Even though you are telling this person or organization you are applying for a 
                                Representation Grant, they don't automatically get part of {{deceasedName | getFullName}}'s estate.
                            </p>
                           
                            <p>
                                <a href='https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/168_2009_03_1#part25' target='_blank'>
                                    Click here to go to the <i>Supreme Court Civil Rules</i> for more information about who should know 
                                    you are applying for a Representation Grant.
                                </a> Scroll down to Rule 25-2, Subrule (2) (b) (ii). (This link opens in a new tab)                            
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
import CreditorSurvey from './CreditorSurvey.vue';
import CreditorOrgSurvey from './CreditorOrgSurvey.vue';
import Tooltip from "@/components/survey/Tooltip.vue";
 
import "@/store/modules/application";
const applicationState = namespace("Application");

import { stepInfoType, stepResultInfoType } from "@/types/Application";
import { stepsAndPagesNumberInfoType } from "@/types/Application/StepsAndPages";


@Component({
    components:{
      CreditorSurvey,
      CreditorOrgSurvey,
      PageBase,
      Tooltip
    }
})
export default class CreditorInfo extends Vue {

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
    relativesExist = null;//TODO
    showTable = true;
    showOrgTable = true;
    creditorData = [];
    creditorOrgData = [];
    anyRowToBeEdited = null;
    anyOrgRowToBeEdited = null;
    editId = null; 
    editOrgId = null; 
    incompleteError =  false;  
    incompleteOrgError =  false; 
    creditorPersonExists = null; 
    creditorOrgExists = null; 
    creditorCompleted = null;
    updated = 0;
    updatedOrg = 0;
    updatedCreditors = 0;
    showLessMoneyInfo = false;
    
    public openForm(anyRowToBeEdited?) {
        this.showTable = false;
         Vue.nextTick(()=>{
            const el = document.getElementById('creditor-info-survey')
            if(el) el.scrollIntoView();
        })
        if(anyRowToBeEdited) {
            this.editId = anyRowToBeEdited.id;
            this.anyRowToBeEdited = anyRowToBeEdited;
        } else {
            this.anyRowToBeEdited = null;
        }
    }

    public openOrgForm(anyRowToBeEdited?) {
        this.showOrgTable = false;
         Vue.nextTick(()=>{
            const el = document.getElementById('creditor-org-info-survey')
            if(el) el.scrollIntoView();
        })
        if(anyRowToBeEdited) {
            this.editOrgId = anyRowToBeEdited.id;
            this.anyOrgRowToBeEdited = anyRowToBeEdited;
        } else {
            this.anyOrgRowToBeEdited = null;
        }
    }

    public creditorComponentData(value) {       
        this.showTable = value;
    }

    public creditorOrgComponentData(value) {       
        this.showOrgTable = value;
    }

    public populateSurveyData(creditorValue) {

        const currentIndexValue = this.creditorData?.length > 0 ? this.creditorData[this.creditorData.length - 1].id : 0;
        const id = currentIndexValue + 1;
        const newCreditor = { ...creditorValue, id };
        this.creditorData = [...this.creditorData, newCreditor];

        this.showTable = true; 
        this.resetCreditorRelatedPages(this.creditorData);
    }

    public populateOrgSurveyData(creditorValue) {

        const currentIndexValue = this.creditorOrgData?.length > 0 ? this.creditorOrgData[this.creditorOrgData.length - 1].id : 0;
        const id = currentIndexValue + 1;
        const newCreditor = { ...creditorValue, id };
        this.creditorOrgData = [...this.creditorOrgData, newCreditor];

        this.showOrgTable = true; 
        this.resetCreditorRelatedPages(this.creditorOrgData);
    }

    public deleteRow(rowToBeDeleted) {
       
        this.creditorData = this.creditorData.filter(data => {
            return data.id !== rowToBeDeleted;
        }); 
        this.resetCreditorRelatedPages(this.creditorData);
        this.surveyHasError();
    }

    public deleteOrgRow(rowToBeDeleted) {
       
       this.creditorOrgData = this.creditorOrgData.filter(data => {
           return data.id !== rowToBeDeleted;
       }); 
       this.resetCreditorRelatedPages(this.creditorOrgData);
       this.surveyHasError();
    }

    public editRow(editedRow) {
        this.creditorData = this.creditorData.map(data => {
            return data.id === this.editId ? editedRow : data;
        });
        this.showTable = true;
        this.surveyHasError();
        this.resetCreditorRelatedPages(this.creditorData);
    }

    public editOrgRow(editedRow) {
        this.creditorOrgData = this.creditorOrgData.map(data => {
            return data.id === this.editOrgId ? editedRow : data;
        });
        this.showOrgTable = true;
        this.surveyHasError();
        this.resetCreditorRelatedPages(this.creditorOrgData);
    }

    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.incompleteError && !this.incompleteOrgError)    
            Vue.prototype.$UpdateGotoNextStepPage()
    }

    created() {

        if (this.step.result?.creditorPersonExists) {
            this.creditorPersonExists = this.step.result.creditorPersonExists;
        }

        if (this.step.result?.creditorSurvey?.data) {
            this.creditorData = this.step.result.creditorSurvey.data.creditorPersons;
            this.creditorOrgData = this.step.result.creditorSurvey.data.creditorOrgs;
        }  
        
        if (this.step.result?.creditorOrgExists) {
            this.creditorOrgExists = this.step.result.creditorOrgExists;
        }        
    }

    mounted(){
        this.updated = 0;
        this.updatedOrg = 0;
        this.updatedCreditors = 0;
        Vue.nextTick(()=>this.surveyHasError());
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;        
    }

    public surveyHasError(){
        let progress = (this.creditorData.length==0 && this.creditorOrgData.length==0)? 50 : 100;
        
        if(this.creditorPersonExists == 'No' && this.creditorOrgExists == 'No') progress =100;

        this.incompleteError =  false;        
        for(const creditor of this.creditorData){
            if (!creditor.creditorPersonName || !creditor.creditorPersonIsAlive){            
                this.incompleteError = true;  
                progress = 50;    
                break
            }
        }        
        Vue.filter('setSurveyProgress')(null, this.currentStep, this.currentPage, progress, false);
    }
    
    public isDisableNext() {
        return (this.creditorPersonExists == null || (this.creditorPersonExists == 'Yes' && this.creditorData.length <= 0 ) || 
            !this.creditorCompleted || this.creditorCompleted == 'No' ||
            this.creditorOrgExists == null || (this.creditorOrgExists == 'Yes' && this.creditorOrgData.length <= 0 ));
    }

    beforeDestroy() {
        this.surveyHasError();  
        
        let creditorInfo = this.getCreditorResults();        
       
        if(this.creditorPersonExists == 'No')
            creditorInfo = null

        this.UpdateStepResultData({step:this.step, data: {creditorPersonExists: this.creditorPersonExists, creditorOrgExists: this.creditorOrgExists, creditorSurvey: creditorInfo}})       
    }

    public getCreditorResults(){
        const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];
        for(const creditor of this.creditorData)
        {
            questionResults.push({name:'creditorSurvey', value: this.getCreditorInfo(creditor), title:'Creditor '+creditor.id +' Information', inputType:''})
        }

        for(const creditor of this.creditorOrgData)
        {
            questionResults.push({name:'creditorOrgSurvey', value: this.getCreditorOrgInfo(creditor), title:'Creditor Organization '+creditor.id +' Information', inputType:''})
        }
        
        return {data: {creditorPersons: this.creditorData, creditorOrgs: this.creditorOrgData}, questions:questionResults, pageName:'Creditor Information', currentStep: this.currentStep, currentPage:this.currentPage}
    }

    public getCreditorInfo(creditor){
        const resultString = [];

        resultString.push(Vue.filter('styleTitle')("Name: ")+creditor.creditorName);        
        
        return resultString;
    }  

    public getCreditorOrgInfo(creditor){
        const resultString = [];

        resultString.push(Vue.filter('styleTitle')("Name: ")+creditor.creditorOrganizationName);        
        
        return resultString;
    }  

    public resetCreditorRelatedPages(creditorData?) {
    //TODO
        // const stPgNo: stepsAndPagesNumberInfoType = this.$store.state.Application.stPgNo;   
        // const p = stPgNo.RFLM;

        // const pages = [ 
        //     p.ParentingArrangements,
        //     p.ParentalResponsibilities,
        //     p.ParentingTime,
        //     p.ParentingOrderAgreement,
        //     p.BestInterestsOfCreditor,
        //     p.CreditorSupportCurrentArrangements,
        //     p.AboutCreditorSupportOrder,
        //     p.SpecialAndExtraordinaryExpenses,
        //     p.ContactWithCreditor,
        //     p.ContactWithCreditorOrder,
        //     p.AboutContactWithCreditorOrder,
        //     p.ContactWithCreditorBestInterestsOfCreditor,
        //     p.GuardianOfCreditor,           
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
.creditorSection {
    border: 2px solid rgba($gov-pale-grey, 0.7);
    border-radius: 18px;
    width: 100%
}
.creditorAlign {
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
