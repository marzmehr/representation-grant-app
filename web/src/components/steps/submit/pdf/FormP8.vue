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

            <div style="text-align:center;margin:4rem 0 0 -1.3rem;font-weight: 300;font-size:20px;">FORM P8 (RULE 25-3 (2) )</div>
            
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
                    <div class="mt-2">
                        <underline-form  textwidth="17rem" beforetext="" hint="Court Location (leave blank for Commissioner)" text="Victoria"/>
                        <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;"> Registry</div>
                    </div>
                    <div class="mt-2">
                        <underline-form  textwidth="19.6rem" beforetext="No." hint="File Number (leave blank for Registry)" text="2020REP_abc"/>
                    </div>
                </div>   
            </div>

            <div style="text-align:center;margin:1rem 0 1rem -1.3rem;font-weight: 600;font-size:24px;"><i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i></div>                    
            <div style="display:inline-block; text-indent: 5px;"> <i>In the Matter of the Estate of</i></div>
            <underline-form textwidth="42rem" beforetext="" hint="Deceased’s Legal Name" :text="deceased.fullName"/>
            <div style="display:inline-block; text-indent: 5px;"> <i>, deceased</i></div>   
            <div style="text-align:center;margin:2rem 0 5rem -1.3rem;font-weight: 600;font-size:20px;">AFFIDAVIT IN SUPPORT OF APPLICATION FOR ESTATE GRANT</div>            

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
        
            <ol style="margin:0rem 0 0 -1.5rem;">
                <li class=" text-justify ">
                    <div v-if="applicantList.length>1" style="display:inline;">We are the applicants/some of the applicants referred to in the submission for estate grant in relation to the estate of </div>   
                    <div v-else style="display:inline;">I am the applicant/one of the applicants referred to in the submission for estate grant in relation to the estate of </div> 
                    
                    <underline-form style="margin:0.5rem 0 0 0 ;display:inline-block; text-indent: 5px;" textwidth="29rem" beforetext="" hint="Deceased’s Legal Name" :text="deceased.fullName"/>
                    <div style="margin:0.5rem  0 0 0 ; display:inline; text-indent: 5px;"> (the "deceased").</div>                   
                </li>

                <li class="mt-4">
                    <underline-form style="display:inline-block;" textwidth="44.25rem" :beforetext="(applicantList.length>1?'We':'I') +' have read the affidavit in Form '" hint="" text="P5"/>                    
                    <div  style="display:inline-block; text-indent: 5px;"> sworn </div>
                    <underline-form style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;" textwidth="12rem" beforetext="" hint="Affidavit Date (dd mmm yyyy)" :text="form5Info.date"/>
                    <underline-form style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;" textwidth="43rem" beforetext="by" hint="Applicant(s) Name(s)" :text="form5Info.applicantFullName"/>
                    <div v-if="applicantList.length>1" style="margin:0 0 .25rem 0; display:inline-block; text-indent: 5px;"> and there is nothing in that affidavit that we know to be inaccurate.</div>
                    <div v-else style="margin:0 0 .25rem 0; display:inline-block; text-indent: 5px;"> and there is nothing in that affidavit that I know to be inaccurate.</div> 
                    
                </li>                

                <li class="mt-4 text-justify">
                    <div v-if="applicantList.length>1" style="display:inline;"> We have read the submission for estate grant and the other documents referred to in that document and we believe
                        that the information contained in that submission for estate grant and those documents is correct and complete.
                    </div>
                        
                    <div v-else style="display:inline;">I have read the submission for estate grant and the other documents referred to in that document and I believe
                        that the information contained in that submission for estate grant and those documents is correct and complete.
                    </div> 
                </li>
                
                <li class="mt-4 text-justify">
                    <div v-if="applicantList.length>1" style="display:inline;">We will administer according to law the deceased's estate to which the submission for estate grant relates and we
                        acknowledge that, in doing this, we will be subject to the legal responsibility of a personal representative.                         
                    </div>   
                    <div v-else style="display:inline;">I will administer according to law the deceased's estate to which the submission for estate grant relates and I
                        acknowledge that, in doing this, I will be subject to the legal responsibility of a personal representative.
                    </div> 
                </li>
            </ol>

            <div class="mt-5 row">
                <div class="col-6">  
                    <div style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;">SWORN (OR AFFIRMED) BEFORE ME</div>    
                    <underline-form textwidth="16rem" beforetext="at" hint="Commissioner City" text="Victoria"/>
                    <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">, British Columbia</div>

                    <underline-form style="margin:0.75rem 0 ;" textwidth="24rem" beforetext="on" hint="Swear/Affirm Date" text="20 Apr 2020"/>
                    <underline-form style="margin:0.5rem 0 ;" textwidth="25rem" beforetext="" hint="Commissioner Signature" text=""/>
                    <div style="margin:0.5rem 0 ; ">A commissioner for taking affidavits for British Columbia</div>
                    <underline-form style="margin:.5rem 0 ;" textwidth="25rem" beforetext="" hint="[print name or affix stamp of commissioner]" text=""/>

                </div>
                <div class="col-6 border-left">
                    <div  v-for="(name,i) in applicantList" :key="i+250">                        
                        <underline-form style="margin: 1rem 0 0 0;height:2rem;" textwidth="29rem" beforetext="" :hint="name.fullName+' Signature'" text=""/>                         
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

import UnderlineForm from "./components/UnderlineForm.vue"
import CheckBox from "./components/CheckBox.vue"

@Component({
    components:{
        UnderlineForm,
        CheckBox
    }
})

export default class FormP8 extends Vue {    

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    check = ""//"&#10003"
    check2= "&#10003"

    applicantList = []
    deceased={fullName:"Rest In Peace", first:"Rest", middle:"In",last:"Peace", address:"0-123 st, Victoria, BC, Canada V0i 8i8"}
    serviceContact={address:"0-123 st, Victoria, BC, Canada V0i 8i8", phone:"+1 123 456 7890", fax:"+1 123 456 7890", email:"ABC@yahoo.ca"}
    form5Info={applicantFullName:"Its first daughter", first:"Its", middle:"first",last:"Daughter", date:"20 March 2020"}
    
    mounted(){
        this.getRepGrantResultData()
        this.changeApplicantList()
    }
    multipleApplicant=false
    public changeApplicantList(){
        this.applicantList=[]
        if(this.multipleApplicant){
            this.applicantList.push(
                {fullName:"Its first Son",first:"Its", middle:"first",last:"Son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"worker", city:"Victoria", state:"BC", country:"Canada", section130:"(b)" },
                {fullName:"Its first Daughter",first:"Its", middle:"first",last:"Daughter", address:"1-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"work", city:"Seattle", state:"WA", country:"USA", section130:"(a)"  },
                {fullName:"Its second Son",first:"Its", middle:"second",last:"Son", address:"0000 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"Its good lawyer", occupation:"working" , city:"Seattle", state:"WA", country:"USA", section130:"(c)" },
                {fullName:"Its second Daughter",first:"Its", middle:"second",last:"Daughter", address:"1111 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"worker" , city:"Vancouver", state:"BC", country:"Canada", section130:"(d)" }, 
                {fullName:"Its third Son",first:"Its", middle:"third",last:"Son", address:"43-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"work", city:"Seattle", state:"WA", country:"USA" , section130:"(d)" },
                {fullName:"Its third Daughter",first:"Its", middle:"third",last:"Daughter", address:"100-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"worker", city:"Victoria", state:"BC", country:"Canada", section130:"(e)"  },
                {fullName:"Its fourth Son",first:"Its", middle:"fourth",last:"Son", address:"7777 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", lawyer:"Its good lawyer", occupation:"work" , city:"Victoria", state:"BC", country:"Canada", section130:"(f)" },
                {fullName:"Its fourth Daughter",first:"Its", middle:"fourth",last:"Daughter", address:"9999 st, Vancouver, BC, Canada V0v 0v0", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"working", city:"Seattle", state:"WA", country:"USA" , section130:"(f)" }, 
                {fullName:"Its fifth Son",first:"Its", middle:"fifth",last:"Son", address:"80-123 st, Vancouver, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"worker", city:"Seattle", state:"WA", country:"USA" , section130:"(f)" },
                {fullName:"Its fifth Daughter",first:"Its", middle:"fifth",last:"Daughter", address:"780-123 st, Vancouver, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"yes", differentMail:"", differentAddress:"", occupation:"work", city:"Victoria", state:"BC", country:"Canada", section130:"(a)"  },
            )
        }else{
            this.applicantList.push(
                {fullName:"Its first Son",first:"Its", middle:"first",last:"Son", address:"0-123 st, Victoria, BC, Canada V0i 8i8", notIndividual:"", individual:"yes", sameMail:"", differentMail:"yes", differentAddress:"New York, USA", occupation:"work", city:"Victoria", state:"BC", country:"Canada", section130:"(a)"    },
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
        const body = Vue.filter('printPdf')(el.innerHTML,`"SCCRPF  02/2021 \a         Form P8";`)
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
            link.download = "FormP8.pdf";
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);            
        },err => {
            console.error(err);
        
        });
    }

 
    public getRepGrantResultData() {  
        
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
