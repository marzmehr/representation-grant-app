<template>
<div>
    <!-- <b-row class="mt-5">
        <b-button size="sm" class="mx-auto px-4" variant="primary" @click="onPrint(true)"><span class="fa fa-print btn-icon-left"/> Download the Form P1 PDF </b-button>
    </b-row> -->

    <b-card id="print" style="border:1px solid; border-radius:5px;" bg-variant="white" class="mt-4 mb-4 container" no-body>

        <div style="text-align:center;">
            <div style="margin:0rem 0 0 0;font-size:14px;"><b>FORM P1</b> (RULE 25-2 (3) )</div>            
            <div style="margin:1rem 0 0 0;font-weight: 600;font-size:14px;">NOTICE OF PROPOSED APPLICATION IN RELATION TO ESTATE</div>            
        </div>

        <div style="margin:1.5rem 0 0 0;font-weight: 600;font-size:14px;"> TAKE NOTICE THAT:</div>
        
        <div style="margin:1rem 0rem;">
            The applicant <b class="answer">{{applicantName}}</b> proposes to apply, in the <b class="answer">{{courtName}}</b> registry, 
            for a <b class="answer">{{grantType}}</b> in relation to the estate of the deceased 
            described below who died on <b class="answer">{{dateOfDeath |beautify-full-date}}</b>.
        </div>
  
        <div style="margin:0.5rem 0 0 0;">Full legal name of deceased:</div>
        <div><b class="answer">{{deceasedName}}</b></div>

        <div style="margin:1.5rem 0 0 0;">Last residential address of the deceased:</div>
        <div><b class="answer">{{deceasedAddress}}</b></div>



        <!-- <div class="new-page"> </div>

        <div style="margin:4rem 0 1rem 0rem;font-weight: 600;font-size:18px;">AND TAKE NOTICE THAT:</div>
        
        <ol class="resetcounter" >
            <li class="bracketnumber">
                Before obtaining the foregoing grant or resealing, the applicant may be granted an authorization to obtain
                estate information or an authorization to obtain resealing information, as the case may be, in relation to that
                grant or resealing for the purposes of obtaining financial information in relation to the grant or resealing.
            </li>
            <li class="bracketnumber">
                You have a right to oppose, by filing a notice of dispute in accordance with Rule 25-10 (1),
                <ol style="text-indent:2px; list-style-type:lower-alpha">
                    <li>if the intended application is for an estate grant, the granting of either or both of an authorization to obtain estate information and the estate grant, or</li>
                    <li>if the intended application is for a resealing, the granting of either or both of an authorization to obtain resealing information and the resealing.</li>
                </ol>
            </li>
            <li class="bracketnumber">
                You may or may not be entitled to claim against the estate for relief, including a claim under
                <ol style="text-indent:2px; list-style-type:lower-alpha">
                    <li>the Family Law Act, or</li>
                    <li>Division 6 of Part 4 of the Wills, Estates and Succession Act.</li>
                </ol>
            </li>
            <li class="bracketnumber">
                If you choose to take a step referred to in paragraph (2) or (3), you must do so within the time limited by any relevant rule of court or other enactment.
            </li>
            <li class="bracketnumber">
                You may consult with your own lawyer concerning your interest in, or rights against, the estate.
            </li>
            <li class="bracketnumber">
                After the applicant has filed a submission for estate grant or submission for resealing, you may
                apply for an order requiring the applicant to provide security unless the applicant is the Public Guardian and
                Trustee. Filing a notice of dispute will prevent a grant from being issued before you are able to apply for the
                order requiring security.
            </li>
            <li class="bracketnumber">
                An authorization to obtain estate information, an authorization to obtain resealing information or a grant may
                issue to the applicant, or a foreign grant may be resealed, on any date that is at least 21 days after the date
                on which this notice is delivered to you or on any earlier date ordered by the court.
            </li>
            <li class="bracketnumber">
                If an authorization to obtain estate information issues to the applicant, the applicant may apply for a grant
                without further notice. If an authorization to obtain resealing information issues to the
                applicant, the applicant may apply for the resealing of the foreign grant without further notice to you.
            </li>
            <li class="bracketnumber">
                If a grant issues to the applicant, the applicant must provide, if there is a will, to the beneficiaries or, if there
                is no will, to intestate successors of the deceased an accounting as to how the estate was administered and
                how the estate assets were distributed, and if a foreign grant is resealed as a result of the application,
                the intended applicant must provide, if there is a will, to the beneficiaries or, if there is no will, to intestate
                successors of the deceased, an accounting as to how the estate comprising the assets to which the
                resealed grant applies was administered and how those assets were distributed.
            </li>
        </ol>
        
        <div style="margin:2rem 0 0rem 0rem;font-weight: 600;font-size:18px;">INFORMATION ABOUT EACH APPLICANT</div>
      
        <div v-for="(name,i) in applicantList" :key="i+100">
            <underline-form class="mt-5" textwidth="17.5rem" beforetext="Name:" hint="First" :text="name.first"/>
            <underline-form class="mt-0" textwidth="17.5rem" beforetext="" hint="Middle" :text="name.middle"/>
            <underline-form class="mt-0" textwidth="17.5rem" beforetext="" hint="Last" :text="name.last"/>
            
            <underline-form class="my-3" textwidth="48.75rem" beforetext="Mailing address:" hint="Street Number or Post Office Box, City/Town, Province, Country and Postal Code" :text="name.address"/>
            
            <check-box :check="name.notIndividual" text="This applicant is not an individual"/>
            <check-box :check="name.individual" text="This applicant is an individual and ordinarily lives"/>
            
            <check-box shift="25" shiftmark="0" :check="name.sameMail" text="at the mailing address noted above"/>
            <check-box style="display:inline-block;" shift="25" shiftmark="0" :check="name.differentMail" text=""/>
            <underline-form style="text-indent: 26px;" class="mt-0" textwidth="30rem" beforetext="in the following city and country:" hint="City and Country" :text="name.differentAddress"/>
            <div v-if="i<1" class="new-page"> </div>
        </div>

        <div style="margin:2rem 0 0rem 0rem;font-weight: 600;font-size:18px;">ADDRESS FOR SERVICE OF APPLICANT(S)</div>
        <underline-form class="mt-4" textwidth="45rem" beforetext="Street address for service" hint="Street Number, City/Town, Province, Country and Postal Code" :text="serviceContact.address"/>
        <underline-form class="mt-3" textwidth="42.5rem" beforetext="Fax number for service (if any)" hint="Fax Number (+1 AreaCode XXX-XXXX )" :text="serviceContact.fax"/>
        <underline-form class="mt-3" textwidth="41rem" beforetext="E-mail address for service (if any)" hint="E-mail" :text="serviceContact.email"/>
        <underline-form class="mt-3 mb-5" textwidth="48.5rem" beforetext="Telephone number" hint="Phone Number (+1 AreaCode XXX-XXXX )" :text="serviceContact.phone"/>

        <div class="mt-5 row" v-for="(name,i) in applicantList" :key="i">
            <div class="col-4">                
                <underline-form textwidth="16rem" beforetext="Date" hint="Date (dd mmm yyyy)" text="20 Apr 2020"/>
            </div>
            <div class="col-8" >
                <underline-form textwidth="39rem" beforetext="" hint="" text=""/>
                <div style="display:inline-block;text-indent:10px;">Signature of</div>
                <check-box style="display:inline-block;" shift="10" :check="name.lawyer?'':'yes'" text=""/> 
                <underline-form  style="display:inline-block;margin-left:2.5rem;" textwidth="24.5rem" beforetext="applicant" hint="full name" :text="name.lawyer? '':name.fullName"/>
                <div>
                    <check-box style="display:inline-block;" shift="118" :check="name.lawyer?'yes':''" text=""/> 
                    <underline-form  style="display:inline-block;margin-left:9rem;" textwidth="19.55rem" beforetext="lawyer for applicant" hint="lawyer's full name" :text="name.lawyer"/>
                </div>
            </div>
        </div> -->
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

export default class FormP1 extends Vue {    

    @applicationState.State
    public stPgNo!: stepsAndPagesNumberInfoType;

    grantType = "Grant of Administration Without Will Annexed";
    applicantName = 'Temp Applicant';
    courtName = 'Vancouver court';
    dateOfDeath ='2024-01-01';
    deceasedName = 'Rest in peace';    
    deceasedAddress = '123 st, Victoria, BC, V2R 3R4, Canada'

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
        const body = Vue.filter('printPdf')(el.innerHTML,`"SCCRPF  02/2021         `+date+`         Form P1";`)
        this.$emit('onPrint',body,openDownload)
    }

}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
