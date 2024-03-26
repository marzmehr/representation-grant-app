<template>
<div v-if="dataReady">
    <!-- <b-row class="mt-5">
        <b-button size="sm" class="mx-auto px-4" variant="primary" @click="onPrint(true)"><span class="fa fa-print btn-icon-left"/> Download the Form P1 PDF </b-button>
    </b-row> -->

    <b-card id="print-pgt" style="border:1px solid; border-radius:5px;" bg-variant="white" class="mt-4 mb-4 container" no-body>
        
        <div style="margin:0rem 0rem;">
            Dear Public Guardian and Trustee, Grant Application Review Services,
        </div>
        
        <div style="margin:1rem 0rem;">
            I, <b class="answer">{{applicantName}}</b> ({{deceasedName | getFullName}}'s {{applicantRelation}}), am requesting 
            you review my application for a Representation Grant for <b class="answer">{{deceasedName | getFullName}}</b>, 
            of <b class="answer">{{deceasedAddress | getFullAddress}}</b> who died on <b class="answer">{{deceasedDateOfDeath | beautify-full-date}}</b>.
        </div>

        <div style="margin:1rem 0rem;" v-if="minorsList.length>0">
            My application involves minors:
            <ul>
                <li v-for="minor,inx in minorsList" :key="'minor-'+inx" >
                    Minor: <b class="answer">{{minor.name}}</b> ({{deceasedName | getFullName}}'s {{minor.relation}})
                    <ul>
                        <li>Date of Birth: <b class="answer">{{minor.dob | beautify-full-date}}</b></li>
                        <li>Residential Address: <b class="answer">{{minor.residentialAddress | getFullAddress}}</b></li>
                        <li>Postal Address: <b class="answer">{{minor.mailingAddress | getFullAddress}}</b></li>
                        <li>Email: <b class="answer">{{minor.email}} </b></li>
                        <li>Fax: <b class="answer">{{minor.fax}}</b></li>
                        <li>Guardian: <b class="answer">{{minor.guardianName}}</b></li>
                        <ul v-if="minor.hasGuardian">
                            <li>Residential Address: <b class="answer">{{minor.guardianResidentialAddress | getFullAddress}}</b></li>
                            <li>Postal Address: <b class="answer">{{minor.guardianMailingAddress | getFullAddress}}</b></li>
                            <li>Email: <b class="answer">{{minor.guardianEmail}}</b></li>
                            <li>Fax: <b class="answer">{{minor.guardianFax}}</b></li>
                        </ul>
                    </ul>
                </li>
            </ul>
        </div>

        <div style="margin:1rem 0rem;" v-if="incapablesList.length>0">
            My application involves incapable adults:
            <ul>
                <li v-for="incapable,inx in incapablesList" :key="'incapabale-'+inx" >
                    Incapable Adult: <b class="answer">{{incapable.name}}</b> ({{deceasedName | getFullName}}'s {{incapable.relation}})
                    <ul>
                        <li>Date of Birth: <b class="answer">{{incapable.dob | beautify-full-date}}</b></li>
                        <li>Residential Address: <b class="answer">{{incapable.residentialAddress | getFullAddress}}</b></li>
                        <li>Postal Address: <b class="answer">{{incapable.mailingAddress | getFullAddress}}</b></li>
                        <li>Email: <b class="answer">{{incapable.email}} </b></li>
                        <li>Fax: <b class="answer">{{incapable.fax}}</b></li>
                        <li>Nominee: <b class="answer">{{incapable.nomineeName}}</b></li>
                        <ul v-if="incapable.hasNominee">
                            <li>Residential Address: <b class="answer">{{incapable.nomineeResidentialAddress | getFullAddress}}</b></li>
                            <li>Postal Address: <b class="answer">{{incapable.nomineeMailingAddress | getFullAddress}}</b></li>
                            <li>Email: <b class="answer">{{incapable.nomineeEmail}}</b></li>
                            <li>Fax: <b class="answer">{{incapable.nomineeFax}}</b></li>
                        </ul>
                    </ul>
                </li>
            </ul>
        </div>

        <div style="margin:1rem 0rem;">
            I can be contacted at the following:
            <ul>
                <li><b class="answer">{{applicantServiceAddress | getFullAddress}}</b></li>
                <li><b class="answer">{{applicantServicePhone}}</b></li>
                <li><b class="answer">{{applicantServiceEmail}}</b></li>
            </ul>
        </div>

        <div style="margin:1rem 0rem;">
            <div>Sincerely,</div> 
            <span class="answer" style="border-bottom:1px solid" >Signed Electronically by {{applicantName}}</span>
            <div>{{applicantName}}</div>
        </div>

    </b-card>
    <form-p1 :exhibit="false" />
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import FormP1 from "./FormP1.vue";
import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");
import UnderlineForm from "@/components/utils/PopulateForms/components/UnderlineForm.vue";
import CheckBox from "@/components/utils/PopulateForms/components/CheckBox.vue";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';
import moment from 'moment';
import { courtLocationInfoType } from '@/types/Common';
import { stepInfoType } from '@/types/Application';
import { incapablePdfType, minorIncapableInfoType, minorPdfType } from '@/types/Application/MinorIncapable';


@Component({
    components:{
        UnderlineForm,
        CheckBox,
        FormP1
    }
})

export default class FormPgt extends Vue {    

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
    applicantRelation = '';
    applicantMailingAddress = {};
    applicantServiceAddress = {};
    applicantServiceEmail = '';
    applicantServicePhone = '';
    currentDate = '';
    minorsList: minorPdfType[] = [];
    incapablesList: incapablePdfType[] = []; 


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

        //Minor and/or Incapable
        const relatedStep = this.steps[this.stPgNo.RELATIONS._StepNo]
        const minorAndIncapableInfo: minorIncapableInfoType = Vue.filter('getMinorAndIncapableInfo')(relatedStep);
        const spouseList = relatedStep.result.spouseSurvey?.data?? []
        const childList = relatedStep.result.childrenSurvey?.data?? []
        const creditorList = relatedStep.result.creditorSurvey?.data?? []
        this.applicantRelation = Vue.filter('getApplicantRelation')(relatedStep, this.applicantName)
        console.log(minorAndIncapableInfo)
        if(minorAndIncapableInfo.hasSpouse)
            spouseList.forEach(spouse => { 
                if(minorAndIncapableInfo.spouse.minorAll.includes(spouse.spouseName)){
                    let mailingAddress = spouse.spouseIsAdultNoResidentialAddress;                   
                    if(spouse.spouseIsAdultNoResidentialReceiveMail == 'n' && spouse.spouseIsAdultNoHasMailingAddress == 'y'){
                        mailingAddress = spouse.spouseIsAdultNoMailingAddress;
                    }
                    let guardianMailingAddress = spouse.spouseGuardianResidentialAddress;
                    if(spouse.spouseHasGuardian == 'y' && spouse.spouseGuardianResidentialReceiveMail == 'n' && spouse.spouseGuardianHasMailingAddress == 'y'){
                        guardianMailingAddress = spouse.spouseGuardianMailingAddress;
                    }
                    const minor: minorPdfType = {
                        name: spouse.spouseName,
                        relation: 'spouse',
                        dob: spouse.spouseIsAdultNoDOB,
                        residentialAddress: spouse.spouseIsAdultNoResidentialAddress,
                        mailingAddress: mailingAddress,
                        email: spouse.spouseIsAdultNoEmailAddress,
                        fax: spouse.spouseIsAdultNoFaxNumber,

                        hasGuardian: spouse.spouseHasGuardian == 'y',    
                        guardianName: spouse.spouseHasGuardian == 'y' && spouse.spouseGuardianName? spouse.spouseGuardianName: 'None', 
                        guardianResidentialAddress: spouse.spouseGuardianResidentialAddress,
                        guardianMailingAddress: guardianMailingAddress,
                        guardianEmail: spouse.spouseGuardianEmailAddress,
                        guardianFax: spouse.spouseGuardianFaxNumber
                    }
                    this.minorsList.push(minor)
                }
                else if(minorAndIncapableInfo.spouse.incapableAll.includes(spouse.spouseName)){
                    let mailingAddress = spouse.spouseIsCompetentNoResidentialAddress;                   
                    if(spouse.spouseIsCompetentNoResidentialReceiveMail == 'n' && spouse.spouseIsCompetentNoHasMailingAddress == 'y'){
                        mailingAddress = spouse.spouseIsCompetentNoMailingAddress;
                    }

                    let nomineeMailingAddress = spouse.spouseNomineeResidentialAddress;
                    if(spouse.spouseIsCompetent == 'n' && spouse.spouseHasNominee == 'y' && 
                        spouse.spouseNomineeResidentialReceiveMail == 'n' && spouse.spouseNomineeHasMailingAddress == 'y'){
                            nomineeMailingAddress = spouse.spouseNomineeMailingAddress;
                    }

                    const incapable: incapablePdfType = {
                        name: spouse.spouseName,
                        relation: 'spouse',
                        dob: spouse.spouseIsCompetentNoDOB,
                        residentialAddress: spouse.spouseIsCompetentNoResidentialAddress,
                        mailingAddress: mailingAddress,
                        email: spouse.spouseIsCompetentNoEmailAddress,
                        fax: spouse.spouseIsCompetentNoFaxNumber,

                        hasNominee: spouse.spouseHasNominee == 'y',
                        nomineeName: spouse.spouseHasNominee == 'y' && spouse.spouseNomineeName? spouse.spouseNomineeName: 'None',
                        nomineeFormal: spouse.spouseNomineeFormal =='y',
                        nomineeResidentialAddress: spouse.spouseNomineeResidentialAddress,    
                        nomineeMailingAddress: nomineeMailingAddress,
                        nomineeEmail: spouse.spouseNomineeEmailAddress,
                        nomineeFax: spouse.spouseNomineeFaxNumber
                    }
                    this.incapablesList.push(incapable)
                }
            })

        if(minorAndIncapableInfo.hasChildren)
            childList.forEach(child => { 
                if(minorAndIncapableInfo.children.minorAll.includes(child.childName)){
                    let mailingAddress = child.childIsAdultNoResidentialAddress;                   
                    if(child.childIsAdultNoResidentialReceiveMail == 'n' && child.childIsAdultNoHasMailingAddress == 'y'){
                        mailingAddress = child.childIsAdultNoMailingAddress;
                    }
                    let guardianMailingAddress = child.childGuardianResidentialAddress;
                    if(child.childHasGuardian == 'y' && child.childGuardianResidentialReceiveMail == 'n' && child.childGuardianHasMailingAddress == 'y'){
                        guardianMailingAddress = child.childGuardianMailingAddress;
                    }
                    const minor: minorPdfType = {
                        name: child.childName,
                        relation: 'child',
                        dob: child.childIsAdultNoDOB,
                        residentialAddress: child.childIsAdultNoResidentialAddress,
                        mailingAddress: mailingAddress,
                        email: child.childIsAdultNoEmailAddress,
                        fax: child.childIsAdultNoFaxNumber,

                        hasGuardian: child.childHasGuardian == 'y',    
                        guardianName: child.childGuardianName && child.childHasGuardian == 'y'? child.childGuardianName:'None',
                        guardianResidentialAddress: child.childGuardianResidentialAddress,
                        guardianMailingAddress: guardianMailingAddress,
                        guardianEmail: child.childGuardianEmailAddress,
                        guardianFax: child.childGuardianFaxNumber
                    }
                    this.minorsList.push(minor)
                }
                else if(minorAndIncapableInfo.children.incapableAll.includes(child.childName)){
                    let mailingAddress = child.childIsCompetentNoResidentialAddress;                   
                    if(child.childIsCompetentNoResidentialReceiveMail == 'n' && child.childIsCompetentNoHasMailingAddress == 'y'){
                        mailingAddress = child.childIsCompetentNoMailingAddress;
                    }

                    let nomineeMailingAddress = child.childNomineeResidentialAddress;
                    if(child.childIsCompetent == 'n' && child.childHasNominee == 'y' && 
                        child.childNomineeResidentialReceiveMail == 'n' && child.childNomineeHasMailingAddress == 'y'){
                            nomineeMailingAddress = child.childNomineeMailingAddress;
                    }

                    const incapable: incapablePdfType = {
                        name: child.childName,
                        relation: 'child',
                        dob: child.childIsCompetentNoDOB,
                        residentialAddress: child.childIsCompetentNoResidentialAddress,
                        mailingAddress: mailingAddress,
                        email: child.childIsCompetentNoEmailAddress,
                        fax: child.childIsCompetentNoFaxNumber,

                        hasNominee: child.childHasNominee=='y',
                        nomineeName: child.childHasNominee=='y' && child.childNomineeName? child.childNomineeName: 'None',
                        nomineeFormal: child.childNomineeFormal =='y',
                        nomineeResidentialAddress: child.childNomineeResidentialAddress,
                        nomineeMailingAddress: nomineeMailingAddress,
                        nomineeEmail: child.childNomineeEmailAddress,
                        nomineeFax: child.childNomineeFaxNumber
                    }
                    this.incapablesList.push(incapable)
                }
            })

        if(minorAndIncapableInfo.hasCreditor)
            creditorList.forEach(creditor => { 
                if(minorAndIncapableInfo.creditor.minorAll.includes(creditor.creditorPersonName)){
                    let mailingAddress = creditor.creditorPersonIsAdultNoResidentialAddress;                   
                    if(creditor.creditorPersonIsAdultNoResidentialReceiveMail == 'n' && creditor.creditorPersonIsAdultNoHasMailingAddress == 'y'){
                        mailingAddress = creditor.creditorPersonIsAdultNoMailingAddress;
                    }
                    let guardianMailingAddress = creditor.creditorPersonGuardianResidentialAddress;
                    if(creditor.creditorPersonHasGuardian == 'y' && creditor.creditorPersonGuardianResidentialReceiveMail == 'n' && creditor.creditorPersonGuardianHasMailingAddress == 'y'){
                        guardianMailingAddress = creditor.creditorPersonGuardianMailingAddress;
                    }
                    const minor: minorPdfType = {
                        name: creditor.creditorPersonName,
                        relation: 'creditor',
                        dob: creditor.creditorPersonIsAdultNoDOB,
                        residentialAddress: creditor.creditorPersonIsAdultNoResidentialAddress,
                        mailingAddress: mailingAddress,
                        email: creditor.creditorPersonIsAdultNoEmailAddress,
                        fax: creditor.creditorPersonIsAdultNoFaxNumber,

                        hasGuardian: creditor.creditorPersonHasGuardian == 'y',    
                        guardianName: creditor.creditorPersonHasGuardian == 'y' && creditor.creditorPersonGuardianName? creditor.creditorPersonGuardianName: 'None', 
                        guardianResidentialAddress: creditor.creditorPersonGuardianResidentialAddress,
                        guardianMailingAddress: guardianMailingAddress,
                        guardianEmail: creditor.creditorPersonGuardianEmailAddress,
                        guardianFax: creditor.creditorPersonGuardianFaxNumber
                    }
                    this.minorsList.push(minor)
                }
                else if(minorAndIncapableInfo.creditor.incapableAll.includes(creditor.creditorPersonName)){

                    let mailingAddress = creditor.creditorPersonIsCompetentNoResidentialAddress;                   
                    if(creditor.creditorPersonIsCompetentNoResidentialReceiveMail == 'n' && creditor.creditorPersonIsCompetentNoHasMailingAddress == 'y'){
                        mailingAddress = creditor.creditorPersonIsCompetentNoMailingAddress;
                    }

                    let nomineeMailingAddress = creditor.creditorPersonNomineeResidentialAddress;
                    if(creditor.creditorPersonIsCompetent == 'n' && creditor.creditorPersonHasNominee == 'y' && 
                        creditor.creditorPersonNomineeResidentialReceiveMail == 'n' && creditor.creditorPersonNomineeHasMailingAddress == 'y'){
                            nomineeMailingAddress = creditor.creditorPersonNomineeMailingAddress;
                    }
                    
                    const incapable: incapablePdfType = {
                        name: creditor.creditorPersonName,
                        relation: 'creditor',
                        dob: creditor.creditorPersonIsCompetentNoDOB,
                        residentialAddress: creditor.creditorPersonIsCompetentNoResidentialAddress,
                        mailingAddress: mailingAddress,
                        email: creditor.creditorPersonIsCompetentNoEmailAddress,
                        fax: creditor.creditorPersonIsCompetentNoFaxNumber,
                        
                        hasNominee: creditor.creditorPersonHasNominee == 'y',
                        nomineeName: creditor.creditorPersonHasNominee == 'y' && creditor.creditorPersonNomineeName? creditor.creditorPersonNomineeName : 'None',
                        nomineeFormal: creditor.creditorPersonNomineeFormal == 'y',
                        nomineeResidentialAddress: creditor.creditorPersonNomineeResidentialAddress,
                        nomineeMailingAddress: nomineeMailingAddress,
                        nomineeEmail: creditor.creditorPersonNomineeEmailAddress,
                        nomineeFax: creditor.creditorPersonNomineeFaxNumber
                    }
                    this.incapablesList.push(incapable)
                }
            })
        
    }

    mounted(){ 
        this.dataReady=false
        this.currentDate = moment().format("MMMM DD, yyyy")
        this.getFormData();
        this.dataReady=true
        Vue.nextTick(() => this.onPrint(false));
    }

    public onPrint(openDownload) {                
        const elPGT= document.getElementById("print-pgt");
        const elP1= document.getElementById("print");        
        const bodyPGT = Vue.filter('printPdf')(elPGT.innerHTML,`"Generated by “Representation Grant” on ${this.currentDate}.         "`,`"PGT Letter "`, `"Letter to the Public Guardian & Trustee (PGT) of British Columbia"`);
        const bodyP1 = Vue.filter('printPdf')(elP1.innerHTML,`"Generated by “Representation Grant” on ${this.currentDate}.         "`,`"P1 "`);
        this.$emit('onPrint',[...bodyPGT , ...bodyP1],openDownload)
    }

}
</script>

<style scoped lang="scss" src="@/styles/_pdf.scss">
</style>
