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
    
    <b-card id="print" style="border:1px solid; border-radius:5px;padding:2rem 3rem 2rem 2rem;" bg-variant="white" class="mt-4 mb-3">

            <div style="text-align:center;margin:4rem 0 0 -1.3rem;font-weight: 300;font-size:20px;">FORM P10 (RULE 25-3 (2) )</div>
            
            <div class="mt-3 m-0 p-0 row">
               
                <div style="margin:0 0 0 40rem;">
                    <div>
                        <underline-form  textwidth="10.6rem" beforetext="This is the" hint="1st/2nd/3rd..." text="1st"/>
                        <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;"> affidavit</div>
                    </div>
                    <div class="mt-2">
                        <underline-form  textwidth="12.8rem" beforetext="of" hint="Applicant Name" :text="getAllApplicants(25)"/>
                        <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;"> in this case</div>
                    </div>
                    <div class="mt-2">
                        <underline-form  textwidth="11rem" beforetext="and was made on" hint="Affidavit Date (dd mmm yyyy)" text="20 Apr 2020"/>
                    </div>
                    <div class="mt-2">
                        <underline-form  textwidth="15rem" beforetext="" hint="Court Location (leave blank for Commissioner)" text="Victoria"/>
                        <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;"> Registry</div>
                    </div>
                    <div class="mt-2">
                        <underline-form  textwidth="18rem" beforetext="No." hint="File Number (leave blank for Registry)" text="2020REP_abc"/>
                    </div>
                </div>   
            </div>

            <div style="text-align:center;margin:1rem 0 1rem -1.3rem;font-weight: 600;font-size:24px;"><i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i></div>                    
            <div style="display:inline-block; text-indent: 5px;"> <i>In the Matter of the Estate of</i></div>
            <underline-form textwidth="37rem" beforetext="" hint="Deceased’s Legal Name" :text="deceased.fullName"/>
            <div style="display:inline-block; text-indent: 5px;"> <i>, deceased</i></div>   
            <div style="text-align:center;margin:2rem 0 5rem -1.3rem;font-weight: 600;font-size:20px;">AFFIDAVIT OF ASSETS AND LIABILITIES FOR DOMICILED ESTATE GRANT </div>            

            <div v-if="applicantList.length>1" style="display:inline-block; text-indent: 5px;"> We</div>
            <div v-else style="display:inline-block; text-indent: 5px;"> I</div>
            <div style="display:inline-block; margin:0.5rem 0;" v-for="(name,i) in applicantList" :key="i+50">
                <div v-if="i>0" style="display:inline-block; width:1.9rem;"></div>
                <underline-form textwidth="20rem" beforetext="" hint="Full Name of Applicant(s)" :text="name.fullName"/>
                <underline-form textwidth="25rem" beforetext=", of" hint="Street, City/Town, Province, Country and Postal Code" :text="name.address"/>
                <underline-form textwidth="10.5rem" beforetext=", " hint="Occupation" :text="name.occupation"/>
                <div style="display:inline-block;"> ,</div>
            </div>
            <div v-if="applicantList.length>1" style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;"> SWEAR (OR AFFIRM) JOINTLY THAT:</div>
            <div v-else style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;"> SWEAR (OR AFFIRM) THAT:</div>
        
            <ol style="margin:0rem 0 0 -1.5rem;">
                <!-- <1> -->
                <li class=" text-justify ">                    
                    <underline-form v-if="applicantList.length>1" style="display:inline-block;" textwidth="47rem" beforetext="We are the applicants for" hint="a grant of probate/administration WWA/administration WOWA or an ancillary grant of probate/administration WWA/administration WOWA" text="a grant of probate"/>
                    <underline-form v-else style="display:inline-block;" textwidth="48rem" beforetext="I am an applicant for" hint="a grant of probate/administration WWA/administration WOWA or an ancillary grant of probate/administration WWA/administration WOWA" text="a grant of probate"/>
                   
                    <underline-form style="margin:1rem 0 0 0 ;display:inline-block;" textwidth="34rem" beforetext="in relation to the estate of" hint="Deceased’s Legal Name" :text="deceased.fullName"/>
                    <div style="margin:1rem  0 0 0 ; display:inline; text-indent: 5px;"> (the "deceased").</div>                   
                </li>
                
                <!-- <2> -->
                <li class="mt-4">
                    
                    <div v-if="applicantList.length>1" style="margin:0 0 .25rem 0; display:inline-block;">We have made a diligent search and inquiry to find the property and liabilities of the deceased.</div>
                    <div v-else style="margin:0 0 .25rem 0; display:inline-block;">I have made a diligent search and inquiry to find the property and liabilities of the deceased.</div> 
                    
                </li>                
                <!-- <3> -->
                <li class="mt-4 text-justify">
                    <div style="display:inline;"> Attached to this affidavit as Exhibit A is a Statement of Assets, Liabilities and Distribution that discloses
                        <ol style="list-style-type: lower-alpha;" >
                            <li class="mt-3">all of the property of the deceased, irrespective of its location, nature or value, that passes to the applicant in the applicant's capacity as the deceased's personal representative,</li>
                            <li class="mt-3">the value of that property, and</li>
                            <li class="mt-3">the liabilities that charge or encumber that property.</li>
                        </ol>
                    </div>
                        
                  
                </li>
                <!-- <4> -->
                <li class="mt-4 text-justify">
                    <div v-if="applicantList.length>1" style="display:inline;">
                        If we determine that there is any property or liability that has not been disclosed in Exhibit A, or that information contained in this affidavit is incorrect or incomplete, we will promptly after learning of the same file an affidavit of assets and liabilities in Form P14 to disclose the correct and complete information.
                    </div>   
                    <div v-else style="display:inline;">
                        If I determine that there is any property or liability that has not been disclosed in Exhibit A, or that information contained in this affidavit is incorrect or incomplete, I will promptly after learning of the same file an affidavit of assets and liabilities in Form P14 to disclose the correct and complete information.
                    </div> 
                </li>

                <!-- <4> -->
                <li class="mt-4 text-justify">
                    <div v-if="applicantList.length>1" style="display:inline;">
                        In addition to the probate fees payable in relation to any property disclosed in Exhibit A, we promise to pay the Minister of Finance the probate fees payable with respect to the value of any property that passes to us as the deceased's personal representative, and that is not disclosed in Exhibit A, on a determination being made as to the value of that asset.
                    </div>   
                    <div v-else style="display:inline;">
                        In addition to the probate fees payable in relation to any property disclosed in Exhibit A, I promise to pay the Minister of Finance the probate fees payable with respect to the value of any property that passes to me as the deceased's personal representative, and that is not disclosed in Exhibit A, on a determination being made as to the value of that asset.
                    </div> 
                </li>

            </ol>

            <div class="mt-5 row">
                <div class="col-6">  
                    <div style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;">SWORN (OR AFFIRMED) BEFORE ME</div>    
                    <underline-form textwidth="15rem" beforetext="at" hint="Commissioner City" text="Victoria"/>
                    <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">, British Columbia</div>

                    <underline-form style="margin:0.75rem 0 ;" textwidth="24rem" beforetext="on" hint="Swear/Affirm Date" text="20 Apr 2020"/>
                    <underline-form style="margin:0.5rem 0 ;" textwidth="25rem" beforetext="" hint="Commissioner Signature" text=""/>
                    <div style="margin:0.5rem 0; font-size:14px;">A commissioner for taking affidavits for British Columbia</div>
                    <underline-form style="margin:.5rem 0 ;" textwidth="25rem" beforetext="" hint="[print name or affix stamp of commissioner]" text=""/>

                </div>
                <div class="col-6 border-left">
                    <div  v-for="(name,i) in applicantList" :key="i+250">                        
                        <underline-form :style="{marginTop:getSignatureMargin()}" textwidth="29rem" beforetext="" :hint="name.fullName+' Signature'" text=""/>                         
                    </div>
                </div>
            </div>

            <!-- <TABLE PAGE> -->
            <div class="new-page"> </div>

            <div class="mt-3 m-0 p-0 row">
                
                <div style="margin:0 0 0 auto;">
                    <div>                        
                        <div style="display:inline-block;">This is Exhibit A referred to in the affidavit of</div>
                    </div>
                    <div class="mt-3">
                        <underline-form  textwidth="11.5rem" beforetext="" hint="Applicant Name" :text="getAllApplicants(25)"/>
                        <div style="display:inline-block; ">, sworn (or affirmed)</div>
                    </div>
                    <div class="mt-3">
                        <underline-form style="margin:0 0 0 .5rem;" textwidth="14rem" beforetext=" before me on" hint="Affidavit Date (dd mmm yyyy)" text="20 Apr 2020"/>
                    </div>                   
                    <div class="mt-3">
                        <underline-form  textwidth="21.25rem" beforetext="" hint="(leave blank for Commissioner’s Stamp and Signature)" text=""/>
                        <div style="margin:0.5rem 0; text-align:center; font-size:12px;">A commissioner for taking affidavits for British Columbia</div>                    
                    </div>
                </div>   
            </div>

            <div style="text-align:center;margin:1rem 0 1rem -1.3rem;font-weight: 600;font-size:24px;">Statement of Assets, Liabilities and Distribution</div> 
            <div style="margin-top:2rem;">
                <b-table :fields="fieldsI" :items="itemsI"  small>                  
                    <template v-slot:head(part)>
                        <div style="white-space: pre;">Part I <br/> </div>
                        <div>Real Property (including mortgages and vendors' and purchasers' interests in agreements for sale)</div>                        
                    </template>
                    <template v-slot:cell(scope)="data">
                        <div v-if="data.value=='TOTAL'" style="text-align:right;">{{data.value}}</div>
                        <div v-else>{{data.value}}</div>                        
                    </template>
                </b-table>

                <b-table :fields="fieldsII" :items="itemsII"  small>                    
                    <template v-slot:head(part)>
                        <div style="white-space: pre;">Part II <br/> </div>
                        <div>Personal Property (all assets except real property)</div>                        
                    </template>
                    <template v-slot:cell(scope)="data">
                        <div v-if="data.value=='TOTAL'" style="text-align:right;">{{data.value}}</div>
                        <div v-else>{{data.value}}</div>                        
                    </template>
                </b-table>
          
                <div style="margin:0.5rem 7rem 0.5rem 21.5rem;display:inline-block;"><b>GROSS VALUE OF ESTATE</b></div>
                <underline-form style="float:right; border:1px solid;height:2.75rem; margin:0rem 0 0.5rem 1.5rem;padding:1rem 0.5rem 0 0.5rem;" textwidth="14rem" beforetext="$" hint="" text=""/>
          
                <b-table :fields="fieldsIII" :items="itemsIII"  small>
                    <template v-slot:head(part)>
                        <div style="white-space: pre;">Part III <br/> </div>
                        <div>Liabilities</div>                        
                    </template>
                    <template v-slot:cell(scope)="data">
                        <div v-if="data.value=='TOTAL'" style="text-align:right;">{{data.value}}</div>
                        <div v-else>{{data.value}}</div>                        
                    </template>
                </b-table>
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

export default class FormP10 extends Vue {    

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
    
    fieldsI=[
        {key:'part', thClass:'border-dark',                          tdClass:'border-dark c1', label:'Part I, Real Property (including mortgages and vendors\' and purchasers\' interests in agreements for sale)'},
        {key:'scope',thClass:'border-dark text-center align-middle', tdClass:'border-dark c2', label:'Within or Without British Columbia'},
        {key:'value',thClass:'border-dark text-center align-middle', tdClass:'border-dark c3', label:'Value at Death'}
    ]
    itemsI = [
        {part:"",scope:"",value:""},
        {part:"",scope:"",value:""},
        {part:"",scope:"",value:""},
        {part:"",scope:"TOTAL",value:""}
    ]

    fieldsII=[
        {key:'part', thClass:'border-dark',                          tdClass:'border-dark c1', label:'Part II, Personal Property (all assets except real property)'},
        {key:'scope',thClass:'border-dark text-center align-middle', tdClass:'border-dark c2', label:'Within or Without British Columbia'},
        {key:'value',thClass:'border-dark text-center align-middle', tdClass:'border-dark c3', label:'Value at Death'}
    ]
    itemsII = [
        {part:"",scope:"",value:""},
        {part:"",scope:"",value:""},
        {part:"",scope:"",value:""},
        {part:"",scope:"TOTAL",value:""}
    ]

    fieldsIII=[
        {key:'part', thClass:'border-dark',                          tdClass:'border-dark c1', label:'Part III, Liabilities'},
        {key:'scope',thClass:'border-dark text-center align-middle', tdClass:'border-dark c2', label:'Paid or Unpaid'},
        {key:'value',thClass:'border-dark text-center align-middle', tdClass:'border-dark c3', label:'Amount'}
    ]
    itemsIII = [
        {part:"",scope:"",value:""},
        {part:"",scope:"",value:""},
        {part:"",scope:"",value:""},
        {part:"",scope:"TOTAL",value:""}
    ]

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

    public getSignatureMargin(){

        let margin = Number(10/this.applicantList.length);
        if(margin<1.0) margin = 1;
        return margin+'rem'
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
        const body = Vue.filter('printPdf')(el.innerHTML,`"SCCRPF  02/2021 \a         Form P10";`)
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
            link.download = "FormP10.pdf";
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
    .table >>> td.border-dark{
        height: 2.5rem;        
        border:1px solid #000;        
    }

    .table >>> td.c1{
        width: 40rem;
    }

    .table >>> td.c2{
        width: 11rem;
    }

    .table >>> td.c3{
        width: 11rem;
    }

    section{counter-increment: question-counter;float:left; text-indent: -20px;text-align: justify;text-justify: inter-word;margin: 1.0rem 0.5rem 0.5rem 0rem;}
 
    section:before {
        font-weight: bolder;        
        content:counter(question-counter) ".";
    }

    dsection:after{
        float:none;white-space: pre;
    }
    
    section.resetquestion{counter-reset: question-counter;}

    .new-page{
        margin-top:10rem;
    }
    
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
