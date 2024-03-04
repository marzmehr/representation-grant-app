<template>
    <b-card>        
        <b-card class="mt-n3 border-white">
           
            <h2 class="text-primary">Creditor Organizations Details</h2>
            <p class="mt-2">
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
                            <th class="border-right-0" scope="col">Creditor organization's name</th>                                       
                            <th class="border-left-0" scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <div></div>
                            
                            <tr class="border" v-for="creditor in creditorOrgList" :key="creditor.id">
                                <td class="border-0">{{creditor.creditorOrganizationName}}</td>                                        
                                <td class="float-right border-0">
                                    <b-button variant="transparant" v-b-tooltip.hover.noninteractive title="Delete" @click="deleteOrgRow(creditor.id)"><i style="font-size:15pt" class="fa fa-trash"></i></b-button> &nbsp;&nbsp; 
                                    <b-button variant="transparant" v-b-tooltip.hover.noninteractive title="Edit"  @click="openOrgForm(creditor)"><i style="font-size:15pt" class="fa fa-edit"></i></b-button>
                                </td>
                            </tr>                            
                            <tr class="clickableRow" @click="openOrgForm()">
                            <td colspan = "7">
                                <a :class="(creditorOrgList.length == 0)?'text-danger h4 my-2':'h4 my-2'" style="cursor: pointer;"
                                >+Add Creditor</a>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
        </b-card>

        <b-card class="m-0" v-if="!showOrgTable" id="creditor-org-info-survey">
            <creditor-org-survey
                :step="step" 
                v-on:showTable="creditorOrgComponentData" 
                v-on:surveyData="populateOrgSurveyData" 
                v-on:editedData="editOrgRow" 
                :editRowProp="anyOrgRowToBeEdited" 
                :deceasedName="deceasedName"/>
        </b-card>

        <b-row v-if="(creditorOrgList.length > 0) && incompleteOrgError && showOrgTable" name="incomplete-error" class="alert-danger p-3 my-4 " no-body :key="updatedOrg+1">
            <div>Required Creditors information is missing. Click the "Edit button <div class="d-inline fa fa-edit"></div> " to fix it. </div>
        </b-row>
    

    </b-card>           
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import { namespace } from "vuex-class"; 

import CreditorOrgSurvey from './CreditorOrgSurvey.vue';
 
import "@/store/modules/application";
const applicationState = namespace("Application");

import { stepInfoType } from "@/types/Application";
import { creditorOrgInfoType } from '@/types/Application/Creditor';

@Component({
    components:{
      CreditorOrgSurvey
    }
})
export default class CreditorOrgInfo extends Vue {   

    @Prop({required: true})
    step!: stepInfoType;
    
    @Prop({required: true})
    creditorOrgData!: creditorOrgInfoType[];   

    @applicationState.State
    public steps!: stepInfoType[];    

    @applicationState.State
    public deceasedName!: string;   
    
    showOrgTable = true;
    anyOrgRowToBeEdited = null; 
    editOrgId = null;
    incompleteOrgError =  false; 
    updatedOrg = 0;

    creditorOrgList: creditorOrgInfoType[] = [];
    
    mounted(){
        this.updatedOrg = 0;
        this.creditorOrgList = JSON.parse(JSON.stringify(this.creditorOrgData));
        Vue.nextTick(()=>this.surveyHasError());
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

    public creditorOrgComponentData(value) {       
        this.showOrgTable = value;
    }

    public populateOrgSurveyData(creditorValue) {

        const currentIndexValue = this.creditorOrgList?.length > 0 ? this.creditorOrgList[this.creditorOrgList.length - 1].id : 0;
        const id = currentIndexValue + 1;
        const newCreditor = { ...creditorValue, id };
        this.creditorOrgList = [...this.creditorOrgList, newCreditor];
        this.updatedOrg++;
        
        this.$emit("creditorChange",this.creditorOrgList);
        this.showOrgTable = true; 
       
    }   

    public deleteOrgRow(rowToBeDeleted) {
       
       this.creditorOrgList = this.creditorOrgList.filter(data => {
           return data.id !== rowToBeDeleted;
       }); 
       this.updatedOrg++;
      this.$emit("creditorChange",this.creditorOrgList);
       this.surveyHasError();
    }

    public editOrgRow(editedRow) {
        this.creditorOrgList = this.creditorOrgList.map(data => {
            return data.id === this.editOrgId ? editedRow : data;
        });
        this.updatedOrg++;
        this.$emit("creditorChange",this.creditorOrgList);
        this.showOrgTable = true;
        this.surveyHasError();
    }  

    public surveyHasError(){       

        this.incompleteOrgError =  false;        
        for(const creditor of this.creditorOrgList){
            if (!creditor.creditorOrganizationName){            
                this.incompleteOrgError = true;
                break
            }
        }        
        
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

.card {
    border-radius: 8px;
    border: 1px solid #ccc;    
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

</style>
