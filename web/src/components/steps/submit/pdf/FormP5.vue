<template>
<div>
    <b-form-group >
        <label style="display:inline-block; margin: 0 1rem 0 0;">Example of filled Form for:</label>
        <b-form-radio-group    
            style="display:inline-block"            
            v-model="multipleApplicant"
            :options="[{value:false, text:'Single Applicant'},{value:true, text:'10 (Multiple) Applicants'}]"
            @change="changeApplicantList()"                
        ></b-form-radio-group>            
    </b-form-group>
    <b-button style="transform:translate(500px,0px)" variant="success" @click="onPrint()"> Save </b-button>
    <b-card id="print" style="border:1px solid; border-radius:5px;padding:2rem" bg-variant="white" class="mt-4 mb-3">


            <div style="text-align:center;margin:4rem 0 0 -1.3rem;font-weight: 300;font-size:20px;">FORM P5 (RULE 25-3 (2) )</div>
            
            <div class="mt-3 m-0 p-0 row">
                <div class="col-7"/>
                <div class="col-5 mr-0 ml-auto">
                    <div>
                        <underline-form  textwidth="12.6rem" beforetext="This is the" hint="1st/2nd/3rd..." text="1st"/>
                        <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;"> affidavit</div>
                    </div>
                    <div class="mt-2">
                        <underline-form  textwidth="14.8rem" beforetext="of" hint="Applicant Name" :text="getAllApplicants(25)"/>
                        <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;"> in this case</div>
                    </div>
                    <div class="mt-2">
                        <underline-form  textwidth="13rem" beforetext="and was made on" hint="Affidavit Date (dd mmm yyyy)" text="20 Apr 2020"/>
                        
                    </div>
                </div>   
            </div>

            <div style="text-align:center;margin:1rem 0 1rem -1.3rem;font-weight: 600;font-size:24px;"><i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i></div>                    
            <div style="display:inline-block; text-indent: 5px;"> <i>In the Matter of the Estate of</i></div>
            <underline-form textwidth="42rem" beforetext="" hint="Deceased’s Legal Name" :text="deceased.fullName"/>
            <div style="display:inline-block; text-indent: 5px;"> <i>, deceased</i></div>   
            <div style="text-align:center;margin:2rem 0 5rem -1.3rem;font-weight: 600;font-size:20px;">AFFIDAVIT OF APPLICANT FOR GRANT OF ADMINISTRATION WITHOUT WILL ANNEXED</div>            

            <div v-if="applicantList.length>1" style="display:inline-block; text-indent: 5px;"> We</div>
            <div v-else style="display:inline-block; text-indent: 5px;"> I</div>
            <div style="display:inline-block; margin:0.5rem 0;" v-for="(name,i) in applicantList" :key="i+50">
                <div v-if="i>0" style="display:inline-block; width:1.9rem;"></div>
                <underline-form textwidth="20rem" beforetext="" hint="Full Name of Applicant(s)" :text="name.fullName"/>
                <underline-form textwidth="25em" beforetext=", of" hint="Street, City/Town, Province, Country and Postal Code" :text="name.address"/>
                <underline-form textwidth="10em" beforetext=", " hint="Occupation" :text="name.occupation"/>
                <div style="display:inline-block;"> ,</div>
            </div>
            <div v-if="applicantList.length>1" style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;"> SWEAR (OR AFFIRM) JOINTLY THAT:</div>
            <div v-else style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;"> SWEAR (OR AFFIRM) THAT:</div>
        
            <ol style="margin:0 0 0 -1.75rem;">
                <li style="margin:1rem 0;text-indent: 5px;" class="text-justify ">
                    <div v-if="applicantList.length>1" style="display:inline;">We are the applicants/some of the applicants referred to in the submission for estate grant in relation to the estate of </div>   
                    <div v-else style="display:inline;">I am the applicant/one of the applicants referred to in the submission for estate grant in relation to the estate of </div> 
                    
                    <underline-form style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;" textwidth="29rem" beforetext="" hint="Deceased’s Legal Name" :text="deceased.fullName"/>
                    <div v-if="applicantList.length>1" style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">(the "deceased") and are applying for a grant of administration</div>
                    <div v-else style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">(the "deceased") and am applying for a grant of administration</div>
                    <div style="display:inline-block; text-indent: 10px;">without will annexed.</div>
                </li>

                <li style="margin:1rem 0;text-indent: 5px;" >
                    <check-box style="display:inline-block;" shift="0" shiftmark="0" :check="check" text="The applicant on whose behalf this affidavit is sworn is not an individual and I am authorized by the applicant to swear"/>
                    <div  style="margin:0 0 .25rem 0; text-indent: 30px;"> this affidavit on the applicant's behalf.</div>
                    
                    <div style="display:inline-block; margin:0.5rem 0;" v-for="(name,i) in applicantList" :key="i+50">
                        <check-box v-if="applicantList.length>1" shift="0" shiftmark="0" :check="check2" :text="'I am <b>'+ name.fullName +  '</b> and ordinarily live at the following location:'"/>
                        <check-box v-else shift="0" shiftmark="-4" :check="check2" text="I am an individual and ordinarily live at the following location:"/>
                        <underline-form style="text-indent: 15px;" textwidth="15rem" beforetext="City/town:" hint="City/town" text="Vancouver"/> 
                        <underline-form style="text-indent: 15px;" textwidth="10rem" beforetext="Province/state:" hint="Province/state" text="BC"/>
                        <underline-form style="text-indent: 15px;" textwidth="10rem" beforetext="Country:" hint="Country" text="Canada"/>
                    </div>
                </li>

                <li style="margin:1rem 0;text-indent: 5px;">
                    <div style="display:inline-block; margin:0 0 1rem 0;" v-for="(name,i) in applicantList" :key="i+50">
                        <div v-if="applicantList.length>1" style="display:inline-block;"><b>{{name.fullName}}</b> is a person referred to in paragraph</div>   
                        <div v-else style="display:inline-block;">I am a person referred to in paragraph </div>                     
                        <underline-form style="text-indent:0px;" textwidth="2rem" beforetext="" hint="(a) ... (g)" text="(e)"/>
                        <div style="display:inline-block; text-indent: 10px;">of section 130 of the Wills, Estates and Succession Act.</div>
                    </div>
                </li>

                <li style="margin:1rem 0;text-indent: 5px;">
                    <check-box  shift="0" shiftmark="0" :check="check" :text="(applicantList.length>1?'We are':'I am') +' not obliged under Rule 25-3 (11) to deliver a filed copy of this submission for estate grant to the Public'"/>
                    <div  style="margin:0 0 .25rem 0; text-indent: 30px;"> Guardian and Trustee</div>
                    <check-box  shift="0" shiftmark="0" :check="check2" :text="(applicantList.length>1?'We are':'I am') +' obliged under Rule 25-3 (11) to deliver a filed copy of this submission for estate grant to the Public Guardian'"/>
                    <div  style="margin:0 0 .25rem 0; text-indent: 30px;"> and Trustee</div>
                </li>

                <li style="margin:1rem 0;text-indent: 5px;" class="text-justify">
                    <div v-if="applicantList.length>1" style="display:inline;">We are satisfied that a diligent search for a testamentary document of the deceased has been made in each place that could reasonably be considered to be a place where a testamentary document may be found, including, without limitation, in all places where the deceased usually kept his or her documents and</div>   
                    <div v-else style="display:inline;">I am satisfied that a diligent search for a testamentary document of the deceased has been made in each place that could reasonably be considered to be a place where a testamentary document may be found, including, without limitation, in all places where the deceased usually kept his or her documents and</div> 
                    <check-box style="margin:0.7rem 0 0 0;" shift="0" shiftmark="0" :check="check" text="no testamentary document of the deceased has been found"/>
                    <check-box style="display:inline;" shift="0" shiftmark="0" :check="check2" text=""/>
                    <div v-if="applicantList.length>1" style="display:inline-block;text-indent:1.8rem;">one or more testamentary documents have been found. A copy of the testamentary document(s) is/are attached as an exhibit to the affidavit. We believe that the testamentary document(s) is/are invalid or otherwise not relevant to this application for the following reasons:</div>   
                    <div v-else style="display:inline-block;text-indent:1.8rem;">one or more testamentary documents have been found. A copy of the testamentary document(s) is/are attached as an exhibit to the affidavit. I believe that the testamentary document(s) is/are invalid or otherwise not relevant to this application for the following reasons:</div> 
                    
                    <underline-form style="margin:1rem 0 1rem 0rem;" textwidth="60rem" beforetext="" hint="Explain why Will is invalid/irrelevant" text=""/>
                    <underline-form style="margin:0 0 1rem 0rem;" textwidth="60rem" beforetext="" hint="" text=""/>
                </li>

                <li class="mt-4 pl-3 text-justify">
                    <div v-if="applicantList.length>1" style="display:inline;">We believe that there is no will of the deceased.</div>
                    <div v-else style="display:inline;">I believe that there is no will of the deceased.</div>
                </li>

                <div v-if="applicantList.length<2" class="new-page"> </div>

                <li class="mt-4 pl-3">
                    <check-box  shift="0" shiftmark="0" :check="check2" :text="(applicantList.length>1?'We are':'I am') +' not aware of any grant of probate or administration, or equivalent, having been issued in relation to the'"/>
                    <div  style="margin:0 0 .5rem 0; text-indent: 30px;"> deceased in British Columbia or in any other jurisdiction.</div>
                    <check-box  shift="0" shiftmark="0" :check="check2" text="The following grant(s) of probate or administration, or equivalent, has/have been issued in relation to the deceased"/>
                    <underline-form style="margin:0.35rem 0 1rem 0rem;" textwidth="36rem" beforetext=" in British Columbia or in another jurisdiction:" hint="Describe representation grant(s)" text=""/>
                
                    <div v-if="applicantList.length>1" style="">We believe that, that grant is/those grants are not relevant to this application for the following reasons:</div>
                    <div v-else style="">I believe that, that grant is/those grants are not relevant to this application for the following reasons:</div>

                    <underline-form style="margin:1rem 0 1rem 0rem;" textwidth="60rem" beforetext="" hint="Explain why representation grant(s) is/are invalid/irrelevant" text=""/>
                    <underline-form style="margin:0 0 1rem 0rem;" textwidth="60rem" beforetext="" hint="" text=""/>
                </li>


            </ol>



<!--         
        <underline-form textwidth="41rem" beforetext="The applicant(s)" hint="Full Name of Applicant(s)" :text="getAllApplicants"/>
        <div style="display:inline-block; text-indent: 5px;"> propose(s) to apply, in the</div>
        <underline-form class="mt-3" textwidth="20rem" beforetext="" hint="Court Location" text="Victoria court of appeal"/>
        <underline-form style="text-indent: 5px;" class="mt-3" textwidth="32rem" beforetext="court registry, for" hint="Application Type" text="Victoria court of appeal"/>
        <underline-form style="text-indent: 5px;" class="mt-3" textwidth="26rem" beforetext="in relation to the estate of the deceased described below who died on" hint="Deceased’s Date of Death (dd mmm yyyy)" text="20 Apr 2020"/>
          
        <div style="margin:2rem 0 1rem 0rem;"> Full legal name of deceased:</div>
        <underline-form class="mt-0" textwidth="20rem" beforetext="" hint="First" :text="deceased.first"/>
        <underline-form class="mt-0" textwidth="20rem" beforetext="" hint="Middle" :text="deceased.middle"/>
        <underline-form class="mt-0" textwidth="20rem" beforetext="" hint="Last" :text="deceased.last"/>

        <div style="margin:2rem 0 1rem 0rem;"> Last residential address of the deceased:</div>
        <underline-form class="mt-0" textwidth="61rem" beforetext="" hint="Street Number or Post Office Box, City/Town, Province, Country and Postal Code" :text="deceased.address"/>
        
        <div class="mt-5"><i>[Check whichever one of the immediately following 2 boxes is correct and provide any required information.]</i></div>

        <div class="mt-2">              
            <check-box style="display:inline-block;" :check="check2" text=""/> 
            <underline-form style="text-indent: 15px;" class="mt-0" textwidth="20rem" beforetext="This application relates to the will of the deceased dated" hint="Will Date (dd mmm yyyy)" text="20 Apr 2010"/>
            <div style="display:inline-block; text-indent: 5px;"> , a copy of which will</div>
            <div style="text-indent: 30px;"> is provided with this notice.</div>
        </div>

        <div class="mt-3">
            <check-box style="display:inline-block;" :check="check2" text="This application does not relate to a will."/>              
        </div>

        <div class="new-page"> </div>

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
            <underline-form class="mt-5" textwidth="19rem" beforetext="Name:" hint="First" :text="name.first"/>
            <underline-form class="mt-0" textwidth="19rem" beforetext="" hint="Middle" :text="name.middle"/>
            <underline-form class="mt-0" textwidth="19rem" beforetext="" hint="Last" :text="name.last"/>
            
            <underline-form class="my-3" textwidth="53rem" beforetext="Mailing address:" hint="Street Number or Post Office Box, City/Town, Province, Country and Postal Code" :text="name.address"/>
            
            <check-box :check="name.notIndividual" text="This applicant is not an individual"/>
            <check-box :check="name.individual" text="This applicant is an individual and ordinarily lives"/>
            
            <check-box shift="25" shiftmark="0" :check="name.sameMail" text="at the mailing address noted above"/>
            <check-box style="display:inline-block;" shift="25" shiftmark="0" :check="name.differentMail" text=""/>
            <underline-form style="text-indent: 26px;" class="mt-0" textwidth="30rem" beforetext="in the following city and country:" hint="City and Country" :text="name.differentAddress"/>
            <div v-if="i<1" class="new-page"> </div>
        </div>

        <div style="margin:2rem 0 0rem 0rem;font-weight: 600;font-size:18px;">ADDRESS FOR SERVICE OF APPLICANT(S)</div>
        <underline-form class="mt-4" textwidth="47rem" beforetext="Street address for service" hint="Street Number, City/Town, Province, Country and Postal Code" :text="serviceContact.address"/>
        <underline-form class="mt-3" textwidth="44.5rem" beforetext="Fax number for service (if any)" hint="Fax Number (+1 AreaCode XXX-XXXX )" :text="serviceContact.fax"/>
        <underline-form class="mt-3" textwidth="43rem" beforetext="E-mail address for service (if any)" hint="E-mail" :text="serviceContact.email"/>
        <underline-form class="mt-3 mb-5" textwidth="50.5rem" beforetext="Telephone number" hint="Phone Number (+1 AreaCode XXX-XXXX )" :text="serviceContact.phone"/>

        <div class="mt-5 row" v-for="(name,i) in applicantList" :key="i">
            <div class="col-4">                
                <underline-form textwidth="16rem" beforetext="Date" hint="Date (dd mmm yyyy)" text="20 Apr 2020"/>
            </div>
            <div class="col-8">
                <underline-form textwidth="39rem" beforetext="" hint="" text=""/>
                <div style="display:inline-block;text-indent:10px;">Signature of</div>
                <check-box style="display:inline-block;" shift="10" :check="name.lawyer?'':'yes'" text=""/> 
                <underline-form  style="display:inline-block;margin-left:2.5rem;" textwidth="20rem" beforetext="applicant" hint="full name" :text="name.lawyer? '':name.fullName"/>
                <div>
                    <check-box style="display:inline-block;" shift="118" :check="name.lawyer?'yes':''" text=""/> 
                    <underline-form  style="display:inline-block;margin-left:9rem;" textwidth="20rem" beforetext="lawyer for applicant" hint="lawyer's full name" :text="name.lawyer"/>
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

import UnderlineForm from "./components/UnderlineForm.vue"
import CheckBox from "./components/CheckBox.vue"

@Component({
    components:{
        UnderlineForm,
        CheckBox
    }
})

export default class FormP1 extends Vue {    

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    check = ""//"&#10003"
    check2= "&#10003"

    applicantList = [
    //    {fullName:"his first son",first:"his", middle:"first",last:"son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA" },
    //    {fullName:"his first daughter",first:"his", middle:"first",last:"daughter", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" },
    //    {fullName:"his second son",first:"his", middle:"second",last:"son", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"his good lawyer" },
    //    {fullName:"his second daughter",first:"his", middle:"second",last:"daughter", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" }, 
    //    {fullName:"his first son",first:"his", middle:"first",last:"son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA" },
    //    {fullName:"his first daughter",first:"his", middle:"first",last:"daughter", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" },
    //    {fullName:"his second son",first:"his", middle:"second",last:"son", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"his good lawyer" },
    //    {fullName:"his second daughter",first:"his", middle:"second",last:"daughter", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" }, 
    //    {fullName:"his first son",first:"his", middle:"first",last:"son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA" },
    //    {fullName:"his first daughter",first:"his", middle:"first",last:"daughter", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" },
    //    {fullName:"his second son",first:"his", middle:"second",last:"son", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"his good lawyer" },
    //    {fullName:"his second daughter",first:"his", middle:"second",last:"daughter", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" }, 
    //    {fullName:"his first son",first:"his", middle:"first",last:"son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA" },
    //    {fullName:"his first daughter",first:"his", middle:"first",last:"daughter", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" },
    //    {fullName:"his second son",first:"his", middle:"second",last:"son", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"his good lawyer" },
    //    {fullName:"his second daughter",first:"his", middle:"second",last:"daughter", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"" } 
    ]
    deceased={fullName:"Rest In Peace", first:"Rest", middle:"In",last:"Peace", address:"0-123 st, Victoria, BC, Canada V0i 8i8"}
    serviceContact={address:"0-123 st, Victoria, BC, Canada V0i 8i8", phone:"+1 123 456 7890", fax:"+1 123 456 7890", email:"ABC@yahoo.ca"}
    
    mounted(){
        this.getFPOResultData()
        this.changeApplicantList()
    }
    multipleApplicant=false
    public changeApplicantList(){
        this.applicantList=[]
        if(this.multipleApplicant){
            this.applicantList.push(
                {fullName:"his first son",first:"its", middle:"first",last:"son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"worker" },
                {fullName:"his first daughter",first:"its", middle:"first",last:"daughter", address:"1-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"work" },
                {fullName:"his second son",first:"its", middle:"second",last:"son", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"his good lawyer", occupation:"working" },
                {fullName:"his second daughter",first:"its", middle:"second",last:"daughter", address:"1111 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"worker" }, 
                {fullName:"his third son",first:"its", middle:"third",last:"son", address:"43-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"work" },
                {fullName:"his third daughter",first:"its", middle:"third",last:"daughter", address:"100-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"worker" },
                {fullName:"his forth son",first:"its", middle:"forth",last:"son", address:"7777 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"his good lawyer", occupation:"work" },
                {fullName:"his forth daughter",first:"its", middle:"forth",last:"daughter", address:"9999 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"working" }, 
                {fullName:"his fifth son",first:"its", middle:"fifth",last:"son", address:"80-123 st, Vancouver, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"worker" },
                {fullName:"his fifth daughter",first:"its", middle:"fifth",last:"daughter", address:"780-123 st, Vancouver, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"work" },
            )
        }else{
            this.applicantList.push(
                {fullName:"his first son",first:"its", middle:"first",last:"son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"work"  },
            )
        }
    }

    public getAllApplicants(len: number){
        let result="";
        for(const name of this.applicantList)
            result += name.fullName+', ';
        result = result.slice(0,-2);
        if(result.length>len)
            result = result.slice(0,len) +"..."
        return result
    }

    public onPrint() {
        
        const el= document.getElementById("print");
        console.log(el)
        const applicationId = this.$store.state.Application.id;
        
        const url = '/survey-print/'+applicationId+'/?name=representation-grant'
        const body = Vue.filter('printPdf')(el.innerHTML,`"SCCRPF  02/2021 \a         Form P5";`)
        const options = {
            responseType: "blob",
            headers: {
            "Content-Type": "application/json",
            }
        }  
        console.log(body)
        this.$http.post(url,body, options)
        .then(res => {
            const blob = res.data;
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.download = "FormP5.pdf";
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);            
        },err => {
            console.error(err);
        
        });
    }

 
    public getFPOResultData() {  
        
        let result = this.$store.state.Application.steps[0].result; 
        for(let i=1;i<9; i++){
            const stepResults = this.$store.state.Application.steps[i].result
            for(const stepResult in stepResults){
                //console.log(stepResults[stepResult])
                //console.log(stepResults[stepResult].data)
                result[stepResult]=stepResults[stepResult].data; 
            }
        }
        const protectedPartyName = {protectedPartyName: this.$store.state.Application.protectedPartyName}
        Object.assign(result, result, protectedPartyName);
        
        const applicationLocation = this.$store.state.Application.applicationLocation;
        const userLocation = this.$store.state.Common.userLocation;
        //console.log(applicationLocation)
        //console.log(userLocation)
        if(applicationLocation)
            Object.assign(result, result,{applicationLocation: applicationLocation}); 
        else
            Object.assign(result, result,{applicationLocation: userLocation});
        console.log(result)
        return result;
    }

}
</script>
<style scoped>

    .table >>> th.border-dark{border:1px solid #000;}
    .table >>> td.border-dark{border:1px solid #000;}

    section{counter-increment: question-counter;float:left; text-indent: -20px;text-align: justify;text-justify: inter-word;margin: 1.0rem 0.5rem 0.5rem 0rem;}
 
    section:before {
        font-weight: bolder;        
        content:counter(question-counter) ".";
    }

    dsection:after{
        float:none;white-space: pre;
    }
    
    section.resetquestion{counter-reset: question-counter;}

    
    ol.resetcounter{
        list-style: none;
        counter-reset: bracket-counter;
    }
    ol li.bracketnumber{
        text-indent: -25px;
        text-align: justify; 
        text-justify: inter-word;
        margin:1rem 0;
        counter-increment: bracket-counter;
    }
    ol li.bracketnumber:before {
        content:"(" counter(bracket-counter) ") ";
        font-weight: bold;
    }

    ol.resetlist {
        list-style: none;
        counter-reset: list-counter;
    }
    ol li.listnumber{
        text-indent: -25px;
        text-align: justify; 
        text-justify: inter-word;
        margin:1rem 0;
        counter-increment: list-counter;
    }
    ol li.listnumber:before {
        content:counter(list-counter) ". ";
        font-weight: bold;
    }

</style>
