<template>
<div v-if="dataReady">
    <!-- <b-row class="mt-5">
        <b-button size="sm" class="mx-auto px-4" variant="primary" @click="onPrint(true)"><span class="fa fa-print btn-icon-left"/> Download the Form P1 PDF </b-button>
    </b-row> -->

    <b-card id="print" style="border:1px solid; border-radius:5px;" bg-variant="white" class="mt-4 mb-4 container" no-body>
        <div v-if="exhibit" style="margin:-1.5rem 0 0rem 0;font-weight: 600;font-size:18px;text-align:right;">P9 Exhibit A</div>
        <div style="text-align:center;">
            <div style="margin:0rem 0 0 0;font-size:14px;"><b>FORM P1</b> (RULE 25-2 (3) )</div>            
            <div style="margin:1rem 0 0 0;font-weight: 600;font-size:14px;">NOTICE OF PROPOSED APPLICATION IN RELATION TO ESTATE</div>            
        </div>

        <div style="margin:1.5rem 0 0 0;font-weight: 600;font-size:14px;"> TAKE NOTICE THAT:</div>
        
        <div style="margin:1rem 0rem;">
            The applicant <b class="answer">{{applicantName}}</b> proposes to apply, in the <b class="answer">{{courtName}}</b> registry, 
            for a <b class="answer">{{grantType}}</b> in relation to the estate of the deceased 
            described below who died on <b class="answer">{{deceasedDateOfDeath | beautify-full-date}}</b>.
        </div>
  
        <div style="margin:0.5rem 0 0 0;">Full legal name of deceased:</div>
        <div><b class="answer">{{deceasedName | getFullName}}</b></div>

        <div style="margin:1.5rem 0 0 0;">Last residential address of the deceased:</div>
        <div><b class="answer">{{deceasedAddress | getFullAddress}}</b></div>

        <div class="mt-4"><b class="answer">This application does not relate to a will or a foreign grant.</b></div>

        <!-- <div class="new-page"> </div> -->

        <div style="margin:3rem 0 1rem 0rem;font-weight: 600;font-size:18px;">AND TAKE NOTICE THAT:</div>
        
        <ol class="resetcounter" >
            <li class="bracketnumber">
                Before obtaining the foregoing grant, the applicant may be granted an authorization to
                obtain estate information in relation to that grant for the purposes of obtaining financial
                information in relation to the grant.
            </li>
            <li class="bracketnumber">
                You have a right to oppose, by filing a notice of dispute in accordance with Rule 25-10 (1),
                the granting of either or both of an authorization to obtain estate information and the
                estate grant.
            </li>
            <li class="bracketnumber">
                You may or may not be entitled to claim against the estate for relief, including a claim under
                <ol style="text-indent:2px; margin-left:-1rem; list-style-type:lower-alpha">
                    <li>the <i>Family Law Act,</i> or</li>
                    <li>Division 6 of Part 4 of the <i>Wills, Estates and Succession Act.</i></li>
                </ol>
            </li>
            <li class="bracketnumber">
                If you choose to take a step referred to in paragraph (2) or (3), you must do so within the
                time limited by any relevant rule of court or other enactment.
            </li>
            <li class="bracketnumber">
                You may consult with your own lawyer concerning your interest in, or rights against, the
                estate.
            </li>
            <li class="bracketnumber">
                After the applicant has filed a submission for estate grant, you may apply for an order
                requiring the applicant to provide security unless the applicant is the Public Guardian and
                Trustee. Filing a notice of dispute will prevent a grant from being issued before you are able
                to apply for the order requiring security.
            </li>
            <li class="bracketnumber">
                An authorization to obtain estate information or a grant may issue to the applicant on any
                date that is at <i style="text-decoration: underline">least 21 days</i> after the date on which this notice is delivered to you or on any
                earlier date ordered by the court.
            </li>
            <li class="bracketnumber">
                If an authorization to obtain estate information issues to the applicant, the applicant may
                apply for a grant without further notice.
            </li>
            <li class="bracketnumber">
                If a grant issues to the applicant, the applicant must provide, to intestate successors of the
                deceased, an accounting as to how the estate was administered and how the estate assets
                were distributed.
            </li>
        </ol>
        
        <div style="margin:2rem 0 1rem 0rem;font-weight: 600;font-size:16px;">INFORMATION ABOUT EACH APPLICANT</div>
      
        <div style="margin:.1rem 0rem;">Name: <b class="answer">{{applicantName}}</b></div>
        <div style="margin:.1rem 0rem;">Mailing address: <b class="answer">{{applicantMailingAddress| getFullAddress}}</b></div>
        <div style="margin:.1rem 0rem;">This applicant is an individual and ordinarily lives at the mailing address noted above.</div>
       

        <div style="margin:2rem 0 1rem 0rem;font-weight: 600;font-size:16px;">INFORMATION FOR SERVICE</div>
        
        <div style="margin:.1rem 0rem;">Street address: <b class="answer">{{applicantServiceAddress| getFullAddress}}</b></div>
        <div style="margin:.1rem 0rem;">Telephone number: <b class="answer">{{applicantServicePhone}}</b></div>
        <div style="margin:.1rem 0rem;">E-mail address: <b class="answer">{{applicantServiceEmail}}</b></div>

        <div style="margin:2rem 0 0rem 0rem;font-weight: 600;font-size:16px;"></div>

        <div class="row m-0">
            <div style="width:6%; margin:0.1rem 0 0 0;"> Date:</div>
            <div style="width:20%;"> 
                <b class="answer" style="border-bottom:1px solid" >{{currentDate}}</b>
            </div>
            <div style="width:60%"> 
                <b class="answer" style="border-bottom:1px solid" >Signed Electronically by {{applicantName}}</b>
                <div>Signature of {{applicantName}}</div>
            </div>
        </div>

    </b-card>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';


import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");
import UnderlineForm from "@/components/utils/PopulateForms/components/UnderlineForm.vue";
import CheckBox from "@/components/utils/PopulateForms/components/CheckBox.vue";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
import moment from 'moment';
import { courtLocationInfoType } from '@/types/Common';
import { stepInfoType } from '@/types/Application';


@Component({
    components:{
        UnderlineForm,
        CheckBox
    }
})

export default class FormP1 extends Vue {    

    @Prop({required:false, default:false})
    exhibit!: boolean
    
    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    @applicationState.State
    public steps!: stepInfoType[]; 

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public applicantName!: string;

    @applicationState.State
    public applicationLocation!: courtLocationInfoType;

    grantType = "Grant of Administration Without Will Annexed";

    courtName = '';
    deceasedDateOfDeath ='';  
    deceasedAddress = {};
    applicantMailingAddress = {};
    applicantServiceAddress = {};
    applicantServiceEmail = '';
    applicantServicePhone = '';
    currentDate = '';

    dataReady=false

    public getFormData() {

        this.courtName = this.applicationLocation.name??''

        //___Deceased        
        const deceasedInfo = this.steps[this.stPgNo.DECEASED._StepNo].result?.informationAboutDeceasedSurvey?.data;
        this.deceasedDateOfDeath = deceasedInfo?.deceasedDateOfDeath;
        this.deceasedAddress = deceasedInfo?.deceasedAddress??{};

        //___Applicant
        const applicantInfo = this.steps[this.stPgNo.APPLICANT._StepNo].result?.applicantInfoSurvey?.data;
        this.applicantMailingAddress = applicantInfo?.applicantMailingAddress && applicantInfo?.applicantOrdinaryAddressReceiveMail=='y'?
            applicantInfo?.applicantMailingAddress : (applicantInfo?.applicantOrdinaryAddress??{})

        //___Service
        const serviceInfo = this.steps[this.stPgNo.APPLICANT._StepNo].result?.applicantServiceSurvey?.data;       
        this.applicantServiceAddress = serviceInfo?.applicantServiceAddress??{}        
        
        this.applicantServiceEmail = serviceInfo?.applicantServiceEmail??'';
        this.applicantServicePhone = serviceInfo?.applicantServicePhone??''; 
    }

    mounted(){ 
        this.dataReady=false
        this.currentDate = moment().format("MMMM DD, yyyy")
        this.getFormData();
        this.dataReady=true
        Vue.nextTick(() => this.onPrint(false));
    }

    public onPrint(openDownload) {        
        const el= document.getElementById("print");
        // console.log(el)
        const body = Vue.filter('printPdf')(el.innerHTML,`"Generated by “Representation Grant” on ${this.currentDate}.         "`,`"P1 "`);
        this.$emit('onPrint',body,openDownload)
    }

}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
