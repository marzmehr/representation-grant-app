<template>
    <div>
       
        <forms-row v-for="(form,inx) in formsTitle" :key="inx" :color="form.color" :title="form.title" @clicked="onDownload(form.name, inx)" />
               
        <b-modal size="xl" v-model="showPDFpreview" header-class="bg-white" hide-footer>
            <template v-slot:modal-title>
                <h1 class="mb-0 text-primary">Preview the PDF form</h1> 
            </template>
             
            <form-p1  v-if="showPDFformName=='P1'" />
            <form-p5  v-if="showPDFformName=='P5'" />
            <form-p8  v-if="showPDFformName=='P8'" />
            <form-p9  v-if="showPDFformName=='P9'" />  
            <form-p10 v-if="showPDFformName=='P10'" /> 
            <!-- <template v-slot:modal-footer>
                <b-button variant="primary" @click="showPDFpreview=false">Close</b-button>
                <b-button variant="success" @click="onPrint();showPDFpreview=false">Save and Close</b-button>
            </template>             -->
            <template v-slot:modal-header-close>                 
                <b-button variant="outline-dark" class="closeButton" @click="showPDFpreview=false">&times;Close</b-button>
            </template>
        </b-modal>

    </div> 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormP1 from  "../pdf/FormP1.vue"
import FormP5 from  "../pdf/FormP5.vue"
import FormP8 from  "../pdf/FormP8.vue"
import FormP9 from  "../pdf/FormP9.vue"
import FormP10 from "../pdf/FormP10.vue"
import FormsRow from "./FormsRow.vue"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        FormP1,
        FormP5,
        FormP8,
        FormP9,
        FormP10,
        FormsRow
    }
})
export default class FormList extends Vue {    

    @applicationState.State
    public generatedForms!: string[];
    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    selected=""

    showPDFformName = '';
    showPDFpreview = false;

    formsTitle =[
        { name:'P1', color:"danger", title:"Notice Of Proposed Application In Relation To Estate (FORM P1)"},
        //{ name:'P2', color:"danger", title:"Submission For Estate Grant (FORM P2)"},
        { name:'P5', color:"danger", title:"Affidavit Of Applicant For Grant Of Administration Without Will Annexed(FORM P5)"},
        { name:'P8', color:"danger", title:"Affidavit In Support Of Application For Estate Grant (FORM P8)"},
        { name:'P9', color:"danger", title:"Affidavit Of Delivery (FORM P9)" },
        { name:'P10',color:"danger", title:"Affidavit Of Assets And Liabilities For Domiciled Estate Grant (FORM P10)"}
    ]

    mounted(){
        this.initFormsTitle();
    } 
    
    public initFormsTitle(){
        for(const formInx in this.formsTitle)
        {
            if(this.generatedForms.includes(this.formsTitle[formInx].name))
                this.formsTitle[formInx].color = "success"
        }
    }
    
    public onDownload(formName, inx) {
        console.log("downloading"+inx)
        console.log(this.formsTitle[inx])
        this.formsTitle[inx].color = "success";
        this.showPDFformName = formName;
        this.showPDFpreview = true;

        if(!this.generatedForms.includes(formName))
        {
            const forms= this.generatedForms;
            forms.push(formName)
            this.UpdateGeneratedForms(forms);
        }

        // if(this.checkErrorOnPages()){ 
        //     const currentDate = moment().format();
        //     this.$store.commit("Application/setLastPrinted", currentDate); 
        //     this.loadPdf();
        // }
    }

}
</script>