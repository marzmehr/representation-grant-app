<template>
    <page-base v-bind:hideNavButtons="!showOrgTable" v-bind:disableNext="isDisableNext()" v-on:onPrev="onPrev()" v-on:onNext="onNext()" >
        <div class="home-content">
            <div class="row">
                <div class="col-md-12">
                    <h2 class="page-header">{{deceasedName | getFullName}}'s Creditor</h2>

                    <b-card class="mt-4">  
                        <b-row no-body class="info-box">
                            <div style="width:1%;"/>
                            <div class="m-0" style="width:3%; padding-right: 0;">
                                <b-icon-exclamation-circle-fill class="text-primary"/>
                            </div>
                            <div style="width:96%; padding-left: 0 !important; margin-left: 0 !important;">
                                <p>
                                    Because {{deceasedName | getFullName}} did not make a <tooltip class="ml-1" size="lg" :index="0" title='Will'/>,  
                                    if {{deceasedName | getFullName}} owed more than $10,000 to a single 
                                    person or single organization, they need know that you are applying for a 
                                    <tooltip class="ml-1" size="lg" :index="0" title='Representation Grant'/>.                                    
                                </p>
                                <p>
                                    If any of these people or organizations don't think you should manage 
                                    {{deceasedName | getFullName}}'s belongings, they will have a fair chance 
                                    tell to the Court.
                                </p>
                                <p>
                                    This step will start by asking about persons first, followed by organizations.                            
                                </p>
                            </div>
                        </b-row> 
                    </b-card>
<!-- relatives info -->
                    <b-card style="margin-top:2rem">  
                        <b-row no-body class="info-box">
                            <div style="width:1%;"/>
                            <div class="m-0" style="width:3%; padding-right: 0;">
                                <b-icon-exclamation-circle-fill class="text-primary"/>
                            </div>
                            <div style="width:96%; padding-left: 0 !important; margin-left: 0 !important;">
                                
                                <p v-if="relativesList.length<=0">
                                    In past steps, you have not yet identified anyone who needs to know that 
                                    you are applying for a Representation Grant for {{deceasedName | getFullName}}.                                    
                                </p>
                                <p v-else>
                                    In past steps, you have already identified the following people:
                                    <ul class="mt-2 mb-4">
                                        <li v-for="relative, ind of relativesList" class="text-primary" :key="ind">
                                            <b>{{ relative }}</b>
                                        </li>
                                    </ul> 
                                    Because you are already letting these people know that you are applying for a Representation Grant, 
                                    do not identify them again in this step.                            
                                </p>                               
                            </div>
                        </b-row> 
                    </b-card>

                    <b-card style="margin-top:2rem">
                        <b-form-group>
                            <div style="color:#556077; font-size:1.40em; font-weight:bold;" v-if="relativesList.length<=0">                                
                                Did {{deceasedName | getFullName}} owe more than $10,000 to any one person?
                            </div>     
                            <div style="color:#556077; font-size:1.40em; font-weight:bold;" v-else>
                               Not including the people already identified in the list above, 
                               did {{deceasedName | getFullName}} owe more than $10,000 to any one person?                            
                            </div>                       
                            <b-form-radio-group
                                v-model="creditorPersonExists"
                                @change="updated=updated+1"
                                class="mt-2 ml-3 survey-yesno-vue"
                                style="font-size:1.40em; display: inline-block;">
                                <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                                <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                            </b-form-radio-group>
                        </b-form-group>                       

                        <div>
                            <div class="my-4 text-primary" @click="showLessMoneyInfo= !showLessMoneyInfo" style="border-bottom:1px solid; width: 33.5rem; cursor:pointer;">
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
                                    should have let this person know you were applying for a Representation Grant for {{deceasedName | getFullName}}.
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

                    <creditor-info 
                        style="margin-top:2rem"
                        v-if="creditorPersonExists == 'Yes'" 
                        :key="updated"
                        :step="step"
                        @creditorChange="creditorChange($event,'person')"
                        :creditorData="creditorData"/>

                </div>                            
            </div>            

            <div class="row">
                <div class="col-md-12">

                    <b-card class="mt-5">
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

                    <creditor-org-info 
                        class="mt-5" 
                        v-if="creditorOrgExists == 'Yes'" 
                        :key="updatedOrg"
                        :step="step"
                        @creditorChange="creditorChange($event,'org')"
                        :creditorOrgData="creditorOrgData"/>                    
                </div>               

            </div>

            <b-card v-if="(creditorPersonExists== 'Yes' && creditorData && (creditorData.length > 0) && !incompleteError) || 
                (creditorOrgExists== 'Yes' && creditorOrgData && (creditorOrgData.length > 0) && !incompleteOrgError && showOrgTable)" 
                class="my-4" :key="updated+2+updatedOrg">  
                <b-row no-body class="info-box">
                    <div style="width:1%;"/>
                    <div class="m-0" style="width:3%; padding-right: 0;">
                        <b-icon-exclamation-circle-fill class="text-primary"/>
                    </div>
                    <div style="width:96%; padding-left: 0 !important; margin-left: 0 !important;">
                        <p>
                            In this step, you have identified that {{deceasedName | getFullName}} may have owed more than $10,000 to
                             
                        </p>
                        <p v-if="creditorPersonExists == 'Yes' && creditorData && (creditorData.length > 0)"> 
                            each of the following people:                                      
                            <ul class="mt-2 mb-4">
                                <li v-for="creditor in creditorData" class="text-primary" :key="creditor.id">
                                    <b>{{ creditor.creditorPersonName }}</b>
                                </li>
                            </ul>                       
                        </p>
                        <p v-if="creditorOrgExists == 'Yes' && creditorOrgData && (creditorOrgData.length > 0)">
                            each of the following organizations: 
                            <ul class="mt-2 mb-4">
                                <li v-for="creditor in creditorOrgData" class="text-primary" :key="creditor.id">
                                    <b>{{ creditor.creditorOrganizationName }}</b>
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
                    </div>
                </b-row>
            </b-card>
    
            <b-card v-else-if="creditorPersonExists== 'No' && creditorOrgExists== 'No'" class="mt-4" :key="updated+3+updatedOrg">  
                <b-row no-body class="info-box">
                    <div style="width:1%;"/>
                    <div class="m-0" style="width:3%; padding-right: 0;">
                        <b-icon-exclamation-circle-fill class="text-primary"/>
                    </div>
                    <div style="width:96%; padding-left: 0 !important; margin-left: 0 !important;">
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
                    </div>
                </b-row>
            </b-card> 

            <b-card v-if="creditorPersonExists!= null && creditorOrgExists!= null && showOrgTable" no-body class="my-4">  
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
import CreditorInfo from './CreditorInfo.vue';
import CreditorOrgInfo from './CreditorOrgInfo.vue';
import Tooltip from "@/components/survey/Tooltip.vue";
 
import "@/store/modules/application";
const applicationState = namespace("Application");

import { stepInfoType, stepResultInfoType } from "@/types/Application";
import { stepsAndPagesNumberInfoType } from "@/types/Application/StepsAndPages";
import { nameInfoType } from '@/types/Common';
import { creditorPersonInfoType } from '@/types/Application/Creditor';

@Component({
    components:{
      CreditorInfo,
      CreditorOrgInfo,
      PageBase,
      Tooltip
    }
})
export default class Creditors extends Vue {

    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public steps!: stepInfoType[];    

    @applicationState.State
    public deceasedName!: nameInfoType;

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    currentStep =0;
    currentPage =0;

    showOrgTable = true;
    creditorData = [];
    creditorOrgData = [];
    relativesList = [];
   
    incompleteError =  false;  
    incompleteOrgError =  false; 
    creditorPersonExists = null; 
    creditorOrgExists = null; 
    creditorCompleted = null;
    updated = 0;
    updatedOrg = 0;
    updatedCreditors = 0;
    showLessMoneyInfo = false;     

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

        if (this.step.result?.creditorSurvey?.data)
            this.creditorData = this.step.result.creditorSurvey.data;

        if (this.step.result?.creditorOrgSurvey?.data)
            this.creditorOrgData = this.step.result.creditorOrgSurvey.data;
        
        if (this.step.result?.creditorOrgExists) {
            this.creditorOrgExists = this.step.result.creditorOrgExists;
        }        

        if (this.step.result?.creditorCompleted) {
            this.creditorCompleted = this.step.result.creditorCompleted;
        }   
    }

    mounted(){
        this.updated = 0;
        this.updatedOrg = 0;
        this.updatedCreditors = 0;
        this.relativesList = Vue.filter('getRelatedPeopleInfo')(this.step);
        Vue.nextTick(()=>this.surveyHasError());
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;        
    }

    public surveyHasError(){
        let progress = (this.creditorData?.length==0 && this.creditorOrgData?.length==0)? 50 : 100;
        
        if(this.creditorPersonExists == 'No' && this.creditorOrgExists == 'No' && this.creditorCompleted == 'Yes') progress =100;

        this.incompleteError =  false;        
        //TODO: update with data coming from the components    
        Vue.filter('setSurveyProgress')(null, this.currentStep, this.currentPage, progress, false);
    }
    
    public isDisableNext() {
        return (this.creditorPersonExists == null || (this.creditorPersonExists == 'Yes' && this.creditorData?.length <= 0 ) || 
            !this.creditorCompleted || this.creditorCompleted == 'No' ||
            this.creditorOrgExists == null || (this.creditorOrgExists == 'Yes' && this.creditorOrgData?.length <= 0 ));
    }

    public creditorChange(creditorList,type){               
        if(type=='org') this.creditorOrgData = creditorList;
        else this.creditorData = creditorList;
    }

    beforeDestroy() {
        this.surveyHasError();  
        
        let creditorInfo = this.getCreditorResults();               
        if(this.creditorPersonExists == 'No')  creditorInfo = null

        let creditorOrgInfo = this.getCreditorOrgResults();               
        if(this.creditorOrgExists == 'No')  creditorOrgInfo = null


        this.UpdateStepResultData({step:this.step, data: {
            creditorPersonExists: this.creditorPersonExists, 
            creditorOrgExists: this.creditorOrgExists, 
            creditorSurvey: creditorInfo,
            creditorOrgSurvey: creditorOrgInfo,
            creditorCompleted: this.creditorCompleted}
        })       
    }

    public getCreditorResults(){
        const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];
        for(const creditor of this.creditorData)
        {
            questionResults.push({name:'creditorSurvey', value: this.getCreditorInfo(creditor), title:'Creditor '+creditor.id +' Information', inputType:''})
        }        
        
        return {data: this.creditorData, questions:questionResults, pageName:'Creditor Information', currentStep: this.currentStep, currentPage:this.currentPage}
    }

    public getCreditorOrgResults(){
        const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];        

        for(const creditor of this.creditorOrgData)
        {
            questionResults.push({name:'creditorOrgSurvey', value: this.getCreditorOrgInfo(creditor), title:'Creditor Organization '+creditor.id +' Information', inputType:''})
        }
        
        return {data: this.creditorOrgData, questions:questionResults, pageName:'Creditor Organization Information', currentStep: this.currentStep, currentPage:this.currentPage}
    }

    public getCreditorInfo(creditor){
        const resultString = [];

        resultString.push(Vue.filter('styleTitle')("Name: ")+creditor.creditorPersonName);       
        resultString.push(Vue.filter('styleTitle')("Alive: ")+(creditor.creditorPersonIsAlive=='y'?'Yes':'No'));
        if(creditor.creditorPersonIsAlive=='y' && creditor.creditorPersonIsAdult)
            resultString.push(Vue.filter('styleTitle')("Adult: ")+(creditor.creditorPersonIsAdult=='y'?'Yes':'No'));      
        
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
    padding-top: 1.5rem;
    color: #494949;
}

.card {
    border-radius: 8px;
    border: 1px solid #ccc;    
}

.card-body{
    padding: 0.75rem 1.75rem 2rem 1.75rem;
}

.page-header {
    font-size: 1.6em
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
