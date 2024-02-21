<template>
    <page-base v-bind:hideNavButtons="!showTable" v-bind:disableNext="isDisableNext()" v-on:onPrev="onPrev()" v-on:onNext="onNext()" >
        <div class="home-content">
            <div class="row">
                <div class="col-md-12">
                    <h1>{{deceasedName | getFullName}}'s Children</h1>

                    <b-card class="mt-4">  
                        <b-row no-body class="info-box">
                            <b-col cols="1" class="m-0" style="padding-right: 0;">
                                <b-icon-exclamation-circle-fill class="text-primary"/>
                            </b-col>
                            <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                                <p>
                                    This page is to identify if {{deceasedName | getFullName}} had any children.
                                </p>
                            </b-col>
                        </b-row> 
                    </b-card>

                    <b-card class="mt-5">
                        <b-form-group>
                            <div style="color:#556077; font-size:1.40em; font-weight:bold;">
                                Did {{deceasedName | getFullName}} have any children when they died?
                            </div>                            
                            <b-form-radio-group
                                v-model="childExists"
                                @change="updated+1"
                                class="mt-2 ml-3 survey-yesno-vue"
                                style="font-size:1.40em; display: inline-block;">
                                <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                                <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                            </b-form-radio-group>
                        </b-form-group>

                        <div>
                            <div class="my-4 text-primary" @click="showAdoptedInfo= !showAdoptedInfo" style="border-bottom:1px solid; width: 26.5rem;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                Do I include deceased's legally adopted children?                                      
                                <span v-if="showAdoptedInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showAdoptedInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showAdoptedInfo">

                                <p>
                                    Yes, you must include the deceased's legally adopted children. 
                                    All of the deceased's biological and legally adopted children 
                                    need to know that you are applying for a <tooltip class="ml-1" size="xl" :index="0" title='Representation Grant'/>.
                                </p>
                                <p>
                                    If you are not sure if a person was legally adopted by the deceased 
                                    or not, it is safer for you to include this person. You want as much transparency in 
                                    your application as possible in case this person was legally adopted by the deceased.                                    
                                </p>
                                <p>
                                    Even though you are telling this person you are applying for a Representation Grant, 
                                    they don't automatically get part of the deceased's 
                                    <tooltip class="ml-1" size="xl" :index="0" title='estate'/>.
                                </p> 
                            </div>
                        </div>

                        <div class="mt-1">
                            <div class="my-4 text-primary" @click="showStepChildrenInfo= !showStepChildrenInfo" style="border-bottom:1px solid; width: 23rem;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                Do I include the deceased's step-children?
       
                                <span v-if="showStepChildrenInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showStepChildrenInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showStepChildrenInfo">

                                <p>
                                    No, you do not need to include deceased's step-children because they did not legally adopt them. 
                                    Only the deceased's biological or legally adopted children need to know that you are applying for 
                                    a <tooltip class="ml-1" size="xl" :index="1" title='Representation Grant'/>. 
                                </p>
                                <p>
                                    If you are not sure if a person was legally adopted by the deceased or not, it is safer for 
                                    you to include this person. You want as much transparency in your application as possible 
                                    in case this person was legally adopted by the deceased.
                                </p>
                                <p>
                                    Even though you are telling this person you are applying for a Representation Grant, 
                                    they don't automatically get part of the deceased's 
                                    <tooltip class="ml-1" size="xl" :index="1" title='estate'/>. 
                                </p>                               

                            </div>
                        </div>

                        <div class="mt-1">
                            <div class="my-4 text-primary" 
                                @click="showElseAdoptedChildInfo= !showElseAdoptedChildInfo" 
                                style="border-bottom:1px solid; width: 55rem;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                Do I include the deceased's children (biological or legally adopted) that were legally adopted by someone else?       
                                <span v-if="showElseAdoptedChildInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showElseAdoptedChildInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showElseAdoptedChildInfo">

                                <p>
                                    The answer depends if the deceased was alive when someone else legally adopted their children, 
                                    and, if the deceased gave up their parenting rights or not.
                                </p>
                                <p>
                                    If the deceased was alive at the time someone else legally adopted their children, 
                                    and they gave up their parenting rights, their former children <b>DO NOT</b> need to be included.
                                </p>
                                <p>
                                    If the deceased had already died when their children were legally adopted by someone else, 
                                    these children <b>DO</b> need to be included.
                                </p>
                                <p>
                                    If the deceased was alive when their children were legally adopted by someone else, 
                                    but they did not give up their parenting rights, these children <b>DO</b> need to be included.
                                </p>
                                <p>
                                    This last situation may happen if the children's other parent(s) gave up their parenting 
                                    rights but the deceased still kept their parenting rights.
                                </p>                                

                                <p>
                                    If you are not sure if someone who has been adopted is still considered 
                                    the deceased's child or not, it is safer for you to include this person. 
                                    You want as much transparency in your application as possible in case the 
                                    Court considers this person the deceased's child.
                                </p>
                                <p>
                                    Even though you are telling this person you are applying for a 
                                    <tooltip class="ml-1" size="xl" :index="2" title='Representation Grant'/>, 
                                    if they are not the deceased's child anymore, they don't automatically get part of 
                                    the deceased's <tooltip class="ml-1" size="xl" :index="2" title='estate'/>.
                                </p>
                                <p>
                                    <a 
                                        href='https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96005_01#section37' 
                                        target='_blank'>
                                        For more information, click here to read about who should be included as the deceased's children, 
                                        if they were adopted, from the <i>Adoption Act</i>.
                                    </a> (This link opens in a new tab)                                                

                                </p>

                            </div>
                        </div>

                        <div class="mt-1">
                            <div class="my-4 text-primary" 
                                @click="showChildInLawInfo= !showChildInLawInfo" 
                                style="border-bottom:1px solid; width: 28rem;">
                                <span style="font-size:1.2rem;" class="fa fa-question-circle" /> 
                                Do I need to include the deceased's children-in-law?
                                <span v-if="showChildInLawInfo" class='ml-2 fa fa-chevron-up'/>
                                <span v-if="!showChildInLawInfo" class='ml-2 fa fa-chevron-down'/>
                            </div>
                            <div v-if="showChildInLawInfo">
                                <p>
                                    No, you do not need to include the deceased's children-in-law 
                                    (the <tooltip class="ml-1" size="xl" :index="0" title='spouses'/> 
                                    of the deceased's biological or legally adopted children)."
                                </p>
                            </div>
                        </div>

                    </b-card>

                    <div class="mt-5" v-if="childExists == 'Yes'" :key="updated">
                        <h1>Children Details</h1>
                        <p>
                            You have indicated the deceased has child(ren).
                        </p>
                        <p>
                            Please enter the details of the child in the fields below. To add a child, 
                            click the “Add Child” button. If you are done entering all the children, 
                            click the “Next” button.
                        </p>
                        <div class="childSection" v-if="showTable">
                            <div class="childAlign">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                        <th scope="col">Child's name</th>                                       
                                        <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <div></div>
                                        
                                        <tr v-for="child in childData" :key="child.id">
                                        <td>{{child.childName}}</td>                                        
                                        <td><a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Delete" @click="deleteRow(child.id)"><i class="fa fa-trash"></i></a> &nbsp;&nbsp; 
                                        <a class="btn btn-light" v-b-tooltip.hover.noninteractive title="Edit" @click="openForm(child)"><i class="fa fa-edit"></i></a></td>
                                        </tr>
                                        <tr class="clickableRow" @click="openForm()">
                                        <td colspan = "7">
                                            <a :class="isDisableNext()?'text-danger h4 my-2':'h4 my-2'" style="cursor: pointer;"
                                            >+Add Child</a>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="col-md-12" v-if="!showTable" id="child-info-survey">
                    <child-survey :step="step" v-on:showTable="childComponentData" v-on:surveyData="populateSurveyData" v-on:editedData="editRow" :editRowProp="anyRowToBeEdited" :deceasedName="deceasedName" />
                </div>               
            </div>
        
       
            <b-card v-if="childExists== 'Yes' && incompleteError && showTable" name="incomplete-error" class="alert-danger p-3 my-4 " no-body>
                <div>Required Children information is missing. Click the "Edit button <div class="d-inline fa fa-edit"></div> " to fix it. </div>
            </b-card> 

            <b-card v-else-if="childExists== 'Yes' && !incompleteError && showTable" class="my-4">  
                <b-row no-body class="info-box">
                    <b-col cols="1" class="m-0" style="padding-right: 0;">
                        <b-icon-exclamation-circle-fill class="text-primary"/>
                    </b-col>
                    <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                        <p>
                            In this step you have identified that, {{deceasedName | getFullName}}'s children may include:                       
                            <ul>
                                <li v-for="child in childData" :key="child.id">
                                    {{ child.childName }}
                                </li>
                            </ul>                       
                        </p>
                        <p>
                            Before moving on to the next step, please make sure that you have identified everyone 
                            who may be considered {{deceasedName | getFullName}}'s child.
                        </p>
                        <p>
                            Sometimes people forget to include themselves while using this service. 
                            If you are {{deceasedName | getFullName}}'s child but you haven't included yourself yet, 
                            please add information about yourself.
                        </p>
                    </b-col>
                </b-row>
            </b-card>
    
            <b-card v-else-if="childExists== 'No'" class="mt-4">  
                <b-row no-body class="info-box">
                    <b-col cols="1" class="m-0" style="padding-right: 0;">
                        <b-icon-exclamation-circle-fill class="text-primary"/>
                    </b-col>
                    <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important;">
                        <p>
                            In this step, you have identified that there is no one who would be considered 
                            {{deceasedName | getFullName}}'s child at the time {{deceasedName | getFullName}} died.
                            
                        </p>
                        <p>
                            Before moving on to the next step, please make sure that you have identified everyone 
                            who may be considered {{deceasedName | getFullName}}'s child.
                        </p>
                        <p>
                            Sometimes people forget to include themselves while using this service. 
                            If you are {{deceasedName | getFullName}}'s child but you haven't included yourself yet, 
                            please add information about yourself.
                        </p>
                    </b-col>
                </b-row>
            </b-card> 

            <b-card v-if="childExists!= null" no-body class="my-4">  
                <b-row class="mx-4 mt-4">
                    <b-form-group>
                        <div style="color:#556077; font-size:1.40em; font-weight:bold;">
                            Have you identified everyone who may be considered {{deceasedName | getFullName}}'s child?
                        </div>
                        <b-form-radio-group
                            v-model="childCompleted"
                            @change="updatedChildren+1"
                            class="mt-2 ml-3 survey-yesno-vue"
                            style="font-size:1.40em; display: inline-block;">
                            <b-form-radio class="mr-5" value="Yes"><div style="transform:translate(5px,-5px);">Yes</div></b-form-radio>
                            <b-form-radio value="No"><div style="transform:translate(5px,-5px);">No</div></b-form-radio>               
                        </b-form-radio-group>
                    </b-form-group>                   

                </b-row>

                <b-card v-if="childCompleted == 'No'" no-body class="error-box my-4 mx-4">  
                    <b-row>
                        <b-col cols="1" class="m-0" style="padding-right: 0;">
                            <b-icon-slash-circle-fill class="text-danger"/>
                        </b-col>
                        <b-col cols="11" style="padding-left: 0 !important; margin-left: 0 !important; padding-right: 3rem !important;">
                            <p>
                                Please identify everyone who may be considered {{deceasedName | getFullName}}'s child 
                                at the time {{deceasedName | getFullName}} died. They should know that you are applying for a 
                                Representation Grant for {{deceasedName | getFullName}}.
                            </p>
                            <p>  
                                You want as much transparency in your application as possible in case the Court 
                                decides that this person should be considered {{deceasedName | getFullName}}'s child.
                            </p>
                            <p>
                                Just because you are giving this person notice, it may not mean that they get part of 
                                {{deceasedName | getFullName}}'s estate.                            
                            </p>

                            <p>
                                <a href='https://www.bclaws.gov.bc.ca/civix/document/id/lc/statreg/09013_01#section2' target='_blank'>
                                    For more information, click here to read about who should be included as {{deceasedName | getFullName}}'s child 
                                    from the <i>Wills, Estate and Succession Act</i> (WESA).
                                </a>
                                (This link opens in a new tab)
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
import ChildSurvey from './ChildSurvey.vue';
import Tooltip from "@/components/survey/Tooltip.vue";
 
import "@/store/modules/application";
const applicationState = namespace("Application");

import { stepInfoType, stepResultInfoType } from "@/types/Application";
import { stepsAndPagesNumberInfoType } from "@/types/Application/StepsAndPages";


@Component({
    components:{
      ChildSurvey,
      PageBase,
      Tooltip
    }
})
export default class ChildrenInfo extends Vue {

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
    showTable = true;
    childData = [];
    anyRowToBeEdited = null;
    editId = null; 
    incompleteError =  false;   
    childExists = null; 
    childCompleted = null;
    updated = 0;
    updatedChildren = 0;
    showAdoptedInfo = false;
    showStepChildrenInfo = false;
    showElseAdoptedChildInfo = false;
    showChildInLawInfo = false;
    showChildrenInfo = false;
    
    public openForm(anyRowToBeEdited?) {
        this.showTable = false;
         Vue.nextTick(()=>{
            const el = document.getElementById('child-info-survey')
            if(el) el.scrollIntoView();
        })
        if(anyRowToBeEdited) {
            this.editId = anyRowToBeEdited.id;
            this.anyRowToBeEdited = anyRowToBeEdited;
        } else {
            this.anyRowToBeEdited = null;
        }
    }

    public childComponentData(value) {       
        this.showTable = value;
    }

    public populateSurveyData(childValue) {

        const currentIndexValue = this.childData?.length > 0 ? this.childData[this.childData.length - 1].id : 0;
        const id = currentIndexValue + 1;
        const newChildren = { ...childValue, id };
        this.childData = [...this.childData, newChildren];

        this.showTable = true; 
        this.resetChildrenRelatedPages(this.childData);
    }

    public deleteRow(rowToBeDeleted) {
       
        this.childData = this.childData.filter(data => {
            return data.id !== rowToBeDeleted;
        }); 
        this.resetChildrenRelatedPages(this.childData);
        this.surveyHasError();
    }

    public editRow(editedRow) {
        this.childData = this.childData.map(data => {
            return data.id === this.editId ? editedRow : data;
        });
        this.showTable = true;
        this.surveyHasError();
        this.resetChildrenRelatedPages(this.childData);
    }

    public onPrev() {
        Vue.prototype.$UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.incompleteError)    
            Vue.prototype.$UpdateGotoNextStepPage()
    }

    created() {

        if (this.step.result?.childExists) {
            this.childExists = this.step.result.childExists;
        }

        if (this.step.result?.childrenSurvey?.data) {
            this.childData = this.step.result.childrenSurvey.data;
        }           
    }

    mounted(){
        this.updated = 0;
        Vue.nextTick(()=>this.surveyHasError());
        this.currentStep = this.$store.state.Application.currentStep;
        this.currentPage = this.$store.state.Application.steps[this.currentStep].currentPage;        
    }

    public surveyHasError(){
        let progress = this.childData.length==0? 50 : 100;
        
        if(this.childExists == 'No') progress =100;

        this.incompleteError =  false;        
        for(const child of this.childData){
            if (!child.childName || !child.childIsAlive){            
                this.incompleteError = true;  
                progress = 50;    
                break
            }
        }        
        Vue.filter('setSurveyProgress')(null, this.currentStep, this.currentPage, progress, false);
    }
    
    public isDisableNext() {
        return (this.childExists == null || (this.childExists == 'Yes' && this.childData?.length <= 0 ) || 
            !this.childCompleted || this.childCompleted == 'No');
    }

    beforeDestroy() {
        this.surveyHasError();  
        
        let childInfo = this.getChildrenResults();        
       
        if(this.childExists == 'No')
            childInfo = null

        this.UpdateStepResultData({step:this.step, data: {childExists: this.childExists, childrenSurvey: childInfo}})       
    }

    public getChildrenResults(){
        const questionResults: {name:string; value: any; title:string; inputType:string}[] =[];
        for(const child of this.childData)
        {
            questionResults.push({name:'childrenSurvey', value: this.getChildrenInfo(child), title:'Children '+child.id +' Information', inputType:''})
        }
        
        return {data: this.childData, questions:questionResults, pageName:'Children Information', currentStep: this.currentStep, currentPage:this.currentPage}
    }

    public getChildrenInfo(child){
        const resultString = [];

        resultString.push(Vue.filter('styleTitle')("Name: ")+child.childName);        
        
        return resultString;
    }  

    public resetChildrenRelatedPages(childData?) {
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
.childSection {
    border: 2px solid rgba($gov-pale-grey, 0.7);
    border-radius: 18px;
    width: 100%
}
.childAlign {
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
