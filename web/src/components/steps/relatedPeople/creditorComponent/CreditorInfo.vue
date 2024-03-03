<template>
    <b-card>        
        <b-card class="mt-n3 border-white">
            
            <h2 class="text-primary">Creditors Details</h2>
            <p class="mt-2">
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
                                <th class="border-right-0" scope="col">Creditor's name</th>                                       
                                <th class="border-right-0 border-left-0">Alive</th>
                                <th class="border-right-0 border-left-0">Adult</th>                                        
                                <th class="border-left-0" scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <div></div>

                            <tr class="border" v-for="creditor in creditorPersonList" :key="creditor.id">
                                <td class="border-0">{{creditor.creditorPersonName}}</td>
                                <td class="border-0"><b-icon-check2 v-if="creditor.creditorPersonIsAlive=='y'"/> </td> 
                                <td class="border-0"><b-icon-check2 v-if="creditor.creditorPersonIsAlive=='y' && creditor.creditorPersonIsAdult=='y'"/> </td>
                                <td class="float-right border-0">
                                    <b-button variant="transparant" v-b-tooltip.hover.noninteractive title="Delete" @click="deleteRow(creditor.id)"><i style="font-size:15pt" class="fa fa-trash"></i></b-button> &nbsp;&nbsp; 
                                    <b-button variant="transparant" v-b-tooltip.hover.noninteractive title="Edit"  @click="openForm(creditor)"><i style="font-size:15pt" class="fa fa-edit"></i></b-button>
                                </td>
                            </tr>
                            <tr class="clickableRow" @click="openForm()">
                            <td colspan = "7">
                                <a :class="(creditorPersonList.length == 0)?'text-danger h4 my-2':'h4 my-2'" style="cursor: pointer;"
                                >+Add Creditor</a>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </b-card> 

        <b-card class="m-0" v-if="!showTable" id="creditor-info-survey">
            <creditor-survey 
                :step="step" 
                v-on:showTable="creditorComponentData" 
                v-on:surveyData="populateSurveyData" 
                v-on:editedData="editRow" 
                :editRowProp="anyRowToBeEdited" 
                :deceasedName="deceasedName"/>
        </b-card> 
            
        <b-card v-if="creditorPersonList.length > 0 && incompleteError && showTable" name="incomplete-error" class="alert-danger p-3 my-4 " no-body :key="updated+1">
            <div>Required Creditors information is missing. Click the "Edit button <div class="d-inline fa fa-edit"></div> " to fix it. </div>
        </b-card> 
        
    </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';
import { namespace } from "vuex-class";  

import CreditorSurvey from './CreditorSurvey.vue';
 
import "@/store/modules/application";
const applicationState = namespace("Application");

import { stepInfoType } from "@/types/Application";
import { creditorPersonInfoType } from '@/types/Application/Creditor';

@Component({
    components:{
      CreditorSurvey
    }
})
export default class CreditorInfo extends Vue {

    @Prop({required: true})
    step!: stepInfoType;

    @Prop({required: true})
    creditorData!: creditorPersonInfoType[];

    @applicationState.State
    public steps!: stepInfoType[];    

    @applicationState.State
    public deceasedName!: string;
    
    showTable = true;
    anyRowToBeEdited = null;
    editId = null; 
    incompleteError =  false;  
    updated = 0; 

    creditorPersonList: creditorPersonInfoType[] = [];

    mounted(){
        this.updated = 0;      
        this.creditorPersonList = JSON.parse(JSON.stringify(this.creditorData));
        Vue.nextTick(()=>this.surveyHasError());
    }   
    
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

    public creditorComponentData(value) {       
        this.showTable = value;
    }   

    public populateSurveyData(creditorValue) {

        const currentIndexValue = this.creditorPersonList?.length > 0 ? this.creditorPersonList[this.creditorPersonList.length - 1].id : 0;
        const id = currentIndexValue + 1;
        const newCreditor = { ...creditorValue, id };
        this.creditorPersonList = [...this.creditorPersonList, newCreditor];
        this.updated++;

        this.$emit("creditorChange",this.creditorPersonList);
        this.showTable = true; 
    }

    public deleteRow(rowToBeDeleted) {
       
        this.creditorPersonList = this.creditorPersonList.filter(data => {
            return data.id !== rowToBeDeleted;
        }); 
        this.$emit("creditorChange",this.creditorPersonList);
        this.surveyHasError();
    }  

    public editRow(editedRow) {
        this.creditorPersonList = this.creditorPersonList.map(data => {
            return data.id === this.editId ? editedRow : data;
        });
        this.showTable = true;
        this.$emit("creditorChange",this.creditorPersonList);
        this.surveyHasError();
    }    

    public surveyHasError(){        
        this.incompleteError =  false;        
        for(const creditor of this.creditorPersonList){
            if (!creditor.creditorPersonName || !creditor.creditorPersonIsAlive){            
                this.incompleteError = true;
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
