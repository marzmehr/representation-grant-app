<template>
<div>
    <b-button @click="onPrint()"> Save </b-button>
    <b-card id="print" style="border:1px solid; border-radius:5px;padding:2rem" bg-variant="white" class="mt-4 mb-3">
        
        <div style="position: relative; top: 0;left:0;width: 85%;display: inline-block; margin-bottom:3rem;" >
            <table >
                <tbody>
                <tr>
                <td>
                    <div style="margin:0 0 0 -1.3rem;font-weight: 600;font-size:28px;">Application About A Protection Order </div>
                    <div style="margin:0 0 0 -1.3rem;font-weight: 600;font-size:18px;">FORM K</div>                    
                    <div style="margin:0 0 0 -1.3rem;font-weight: 300;font-size:18px;">Provincial Court (Family) Rules </div>
                </td>
                </tr>
                </tbody>
            </table>
        </div>

        <section>
            <div style="display:inline-block; text-indent: 3px;">
                <div style="display:inline-block; margin-right:0.5rem;"> My name is </div>
                <div style="display:inline-block">
                    <div style="position: absolute; margin-top:-27px; font-size: 19px;">first middle last</div> 
                    <div :style="{borderBottom: '0.7px solid #000', minWidth: '15rem'}"></div>            
                    <div style="position: absolute; margin-top:-1px; font-size: 9px;">full name of party</div>
                </div>
            </div>
            <div style="display:inline-block; text-indent: 3px;">
                <div style="display:inline-block; margin-right:0.5rem;"> . My date of birth is </div>
                <div style="display:inline-block">
                    <div style="position: absolute; margin-top:-27px; font-size: 19px;">ApplicantDOB</div> 
                    <div :style="{borderBottom: '0.7px solid #000', minWidth: '15rem'}"></div>            
                    <div style="position: absolute; margin-top:-1px; font-size: 9px;">date of birth(mmm/dd/yyyy)</div>
                </div>
            </div>
            <div style="display:inline-block; text-indent: 3px;">. My contact information and  </div>
            <div style="display:inline-block; text-indent: 3px;">
                address for service of court documents by the other party and the court are:
            </div>
        </section> 

        <div style="margin:0 0 0 -1.3rem;font-weight: 600;font-size:18px;"> Children</div>
        
        <section>
            I believe the other party owns a weapon that is not a gun or explosive
            <div style="display:inline-block; text-indent: 3px;">              
                <span style="position: absolute;
                    border: 2px solid #000!important;
                    width: 1em; transform:translate(0px,4px);           
                    height: 1em;         
                    font-size: 1.0em;">
                    <div style="transform:translate(-3px,-6px);" v-html="check"/>
                </span>      
                <span class="ml-4 mr-2">Yes</span>
            </div>
            <div style="display:inline-block; text-indent: 3px;">              
                <span style="position: absolute;
                    border: 2px solid #000!important;
                    width: 1em; transform:translate(0px,4px);           
                    height: 1em;         
                    font-size: 1.0em;">
                    <div style="transform:translate(-3px,-6px);" v-html="check2"/>
                </span>      
                <span class="ml-4 mr-2">No</span>
            </div>
        </section>

        <section>
            The person I want protection from, or who had made an application for protection from me, is the other party. An application is usually made with notice to the other party. To give notice, they must be served with the application and supporting documents before the date set for the court appearance. An Application About a Protection Order can also be made without notice to the other party.     
    
        <div style="text-indent:0px;">
            <div style="font-style:italic">
            Select only one of the options below:
            </div>        
            <div>              
                <span style="position: absolute;
                    border: 2px solid #000!important;
                    width: 1em; transform:translate(0px,4px);           
                    height: 1em;         
                    font-size: 1.0em;">
                    <div style="transform:translate(0px,-6px);" v-html="check"/>
                </span>      
                <span class="ml-4">I am applying with notice to the other party1.</span>
            </div>
            <div>              
                <span style="position: absolute;
                    border: 2px solid #000!important;
                    width: 1em; transform:translate(0px,4px);           
                    height: 1em;           
                    font-size: 1.0em;">
                    <div style="transform:translate(0px,-6px);" v-html="check2"/>
                </span>      
                <span class="ml-4">I am applying with notice to the other party897569.</span>
            </div> 
            <div>              
                <span style="position: absolute;
                    border: 2px solid #000!important;
                    width: 1em; transform:translate(0px,4px);           
                    height: 1em;           
                    font-size: 1.0em;">
                    <div style="transform:translate(0px,-6px);" v-html="check2"/>
                </span>      
                <span class="ml-4">I am applying with notice to the other party897569.</span>
            </div>
            <div>              
                <span style="position: absolute;
                    border: 2px solid #000!important;
                    width: 1em; transform:translate(0px,4px);           
                    height: 1em;           
                    font-size: 1.0em;">
                    <div style="transform:translate(0px,-6px);" v-html="check2"/>
                </span>      
                <span style="display:inline-block">
                    <div style="display:inline-block; margin:0 0.5rem 0 1.5rem;"> Other (<i>specify</i>) </div>
                    <div style="display:inline-block">
                        <div style="position: absolute; margin-top:-22px; font-size: 16px;">First Middle Last</div> 
                        <div :style="{borderBottom: '0.7px solid #000', minWidth: '15rem'}"></div>            
                        <div style="position: absolute; margin-top:-1px; font-size: 9px;">full name of party</div>
                    </div>
                </span>
            </div>
        </div>

        <div style="margin-top:2rem;">
            <b-table :fields="[{key:'key',thClass:'border-dark', tdClass:'border-dark'},{key:'label',thClass:'border-dark', tdClass:'border-dark'},{key:'DOB',thClass:'border-dark', tdClass:'border-dark'}]" :items="[{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020},{key:'h','label':3,'DOB':2020}]"  small>
            </b-table>
        </div>
    </section>

    <section>
        Complete only if applicable. You may leave this section blank.abcdefghigh
    </section>
    

    <section>
        Complete only if applicable. You may leave this section blank.
    </section>

    </b-card>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';


import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component
export default class PrintPreview extends Vue {
    

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    check = ""//"&#10003"
    check2= "&#10003"

    mounted(){

    }

    public onPrint() {

        console.log("print") 
        const el= document.getElementById("print");

        console.log(el)
        const applicationId = this.$store.state.Application.id;

        const url = '/survey-print/'+applicationId+'/?name=application-about-a-protection-order'

        // const styles = [				
        //         "https://unpkg.com/bootstrap/dist/css/bootstrap.min.css",
        //         //"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"crossorigin="anonymous"
		// 		`@media print {
		// 			@page {
		// 				size:16.5in 11.7in;
		// 			}
		// 		}`+
		// 		`.card {border: white;}`,
		// 		`.table{border: 3px solid;}`,
		// 		`tr {border: 3px solid;}`,
		// 		`th {border: 3px solid black;}`,
		// 		`td {height: 2.5rem;border: 3px solid;}`

        //     ]
        // console.log(styles)
        const body = [`<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <link rel="stylesheet" href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css" >
                        <meta charset="UTF-8">
                        <title>Application About a Protection Order</title>`+
                        `<style>`+
                            `@page {
                                size: 12.5in 16.17in;
                                margin: .7in 0.7in 0.9in 0.7in;
                                @bottom-left {
                                    content: "PFA 720  02/2020 \a         Form K";
                                    white-space: pre;
                                    font-size: 6pt;
                                }
                                @bottom-right {
                                    content:counter(page);
                                    font-size: 8pt;
                                }
                            }`+
                            `td.border-dark {border: 1px solid black;}`+
                            `th.border-dark {border: 1px solid black;}`+
                            `section{ counter-increment: question-counter; text-indent: -20px; text-align: justify; text-justify: inter-word; margin: 1.0rem 0.5rem 0.5rem 0rem;}`+ 
                            `section:before {font-weight: bolder; content:counter(question-counter) ".";}`+
                            `section.resetquestion{counter-reset: question-counter;}`+
                        `</style>
                        </head>
                        <body>`+el.innerHTML+
                        `</body>\n</html>`]
                        
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
            link.download = "fpo.pdf";
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
  

</style>
