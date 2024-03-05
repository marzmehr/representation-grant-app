<template>
<div>
    <b-row class="mt-5">
        <b-button size="sm" class="mx-auto px-4" variant="primary" @click="onPrint(true)"><span class="fa fa-print btn-icon-left"/> Download the Form P9 PDF </b-button>
    </b-row>

    <b-card id="print" style="border:1px solid; border-radius:5px;" bg-variant="white" class="mt-4 mb-4 container" no-body>

        <div style="text-align:center; margin:0rem 0 -3rem 0;">
            <div style="margin:0rem 0 0 0;font-size:14px;"><b>FORM P9</b> (RULE 25-3 (2) )</div>                        
        </div>            
        <div class="m-0 p-0 row margintop-5vue">
            
            <div style="margin:0rem 0 0 auto;">
                <div class="float-right">
                    This is the <b class="answer">1st</b> affidavit of <b class="answer">{{applicantName}}</b> in this case
                </div>
                <div class="mt-2 float-right">
                    <underline-form  textwidth="14.5rem" beforetext="and was made on" hint="Affidavit Date (dd mmm yyyy)" text=""/>
                </div>
                <div class="mt-2 float-right">
                    <b class="answer">{{courtLocation}}</b> Registry                
                    <underline-form  textwidth="9rem" beforetext="No." hint="File Number (leave blank for Registry)" text=""/>
                </div>
            </div>   
        </div>
        <div style="text-align:center;margin:2rem 0 1rem -1.3rem;font-size:14px;"> 
            <span>In the Matter of the Estate of </span>
            <b class="answer">{{deceasedName}}</b>
            <span>, deceased</span>
        </div>
        <div style="text-align:center;margin:0rem 0 2rem -1.3rem;font-weight: 600;font-size:15px;">AFFIDAVIT OF DELIVERY</div>            
            
        <div style="display:inline-block; text-indent: 5px;"> I, 
            <b class="answer">{{applicantName}}</b>, of   
            <b class="answer">{{applicantAddress}}</b>, 
            <b class="answer">{{applicantOccupation}}</b>,
            <span style="font-size:14px;" > AFFIRM / SWEAR THAT:</span>
        </div>

        <ol style="margin:0rem 0 0 -1rem;">
            <!-- <1> -->
            <li class="mt-4 text-justify">
                <div style="display:inline;"> 
                    Attached to this affidavit and marked as Exhibit A is a copy of 
                    a notice of proposed application in Form P1 (the "notice").
                </div> 
            </li>
            <!-- <1> -->
            <li class="mt-4 text-justify">
                <div style="display:inline;"> 
                    I delivered a copy of the notice to the following persons as follows:
                </div> 
            </li>
        </ol>

        <div class=" m-0 mt-5 row">
            <div style="width:50%">  
                <div style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:14px;">AFFIRMED / SWORN BEFORE ME</div>
                <underline-form textwidth="12rem" beforetext="at" hint="Commissioner City" text="Victoria"/>
                <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">, British Columbia</div>

                <underline-form style="margin:0.75rem 0 ;" textwidth="18.75rem" beforetext="on" hint="Swear/Affirm Date" text=""/>
                <underline-form style="margin:0.5rem 0 ;" textwidth="20rem" beforetext="" hint="" text=""/>
                <div style="margin:-0.75rem 0 ;font-size:10px;"><i>A commissioner for taking affidavits for British Columbia</i></div>
                

            </div>
            <div style="width:49%" class="border-left">
                <div>                        
                    <underline-form style="margin:7.3rem 0 0 1.25rem;" textwidth="18.75rem" beforetext="" hint="" text=""/>
                    <div style="margin:-0.25rem 0 0 1.25rem;">{{'Signature of '+applicantName}}</div>
                </div>
            </div>
        </div>

            
    </b-card>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");
import UnderlineForm from "@/components/utils/PopulateForms/components/UnderlineForm.vue";
import CheckBox from "@/components/utils/PopulateForms/components/CheckBox.vue";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
import moment from 'moment';


@Component({
    components:{
        UnderlineForm,
        CheckBox
    }
})

export default class FormP9 extends Vue {    

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    grantType = "Grant of Administration Without Will Annexed";
    applicantName = 'Temp Applicant';
    applicantAddress = '800 Howe St Vancouver BC '
    applicantOccupation = "Lawyer"
    courtName = 'Vancouver court';
    dateOfDeath ='2024-01-01';
    deceasedName = 'Rest in peace';    
    deceasedAddress = '123 st, Victoria, BC, V2R 3R4, Canada'
    courtLocation = "Vancouver Law court";
    public getFormData() {
        //this.stPgNo.DECEASED
    }

    mounted(){
        this.getFormData();
        Vue.nextTick(() => this.onPrint(false));
    }

    public onPrint(openDownload) {        
        const el= document.getElementById("print");
        // console.log(el)        
        const date = moment().format("MMMM DD, yyyy")
        const body = Vue.filter('printPdf')(el.innerHTML,`"SCCRPF  02/2021         `+date+`         Form P9";`)
        this.$emit('onPrint',body,openDownload)
    }

}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
