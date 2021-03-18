<template>
    <div>

        <b-card v-for="(form,inx) in formsList" :key="inx" style="margin:1rem 0;border-radius:10px; border:2px solid #AABBDD;">
            <div style="float:left; margin: 0.5rem 1rem;color:#5050AA; font-size:16px; font-weight:bold;" > 
                {{form.title}}
            </div>
            <b-button 
                style="float:right; margin: 0.25rem 1rem;"                  
                v-on:click.prevent="onDownload(form.name, inx)"
                :variant="form.color">
                    <span class="fa fa-print btn-icon-left"/>
                    Review and {{type}}
            </b-button>
        </b-card> 
                
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import FormP1 from  "../pdf/FormP1.vue"
import FormP5 from  "../pdf/FormP5.vue"
import FormP8 from  "../pdf/FormP8.vue"
import FormP9 from  "../pdf/FormP9.vue"
import FormP10 from "../pdf/FormP10.vue"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        FormP1,
        FormP5,
        FormP8,
        FormP9,
        FormP10
    }
})
export default class FormList extends Vue {
    
    @Prop({required: true})
    type!: string;

    @Prop({required: true})
    currentPage!: number;

    @applicationState.State
    public generatedForms!: string[];
    @applicationState.Action
    public UpdateGeneratedForms!: (newGeneratedForms) => void

    selected=""
    currentStep = 0;

    showPDFformName = '';
    showPDFpreview = false;

    formsList =[
        { name:'P1', color:"danger", title:"Notice Of Proposed Application In Relation To Estate (FORM P1)"},
        //{ name:'P2', color:"danger", title:"Submission For Estate Grant (FORM P2)"},
        { name:'P5', color:"danger", title:"Affidavit Of Applicant For Grant Of Administration Without Will Annexed(FORM P5)"},
        { name:'P8', color:"danger", title:"Affidavit In Support Of Application For Estate Grant (FORM P8)"},
        { name:'P9', color:"danger", title:"Affidavit Of Delivery (FORM P9)" },
        { name:'P10',color:"danger", title:"Affidavit Of Assets And Liabilities For Domiciled Estate Grant (FORM P10)"}
    ]

    mounted(){
        this.currentStep = this.$store.state.Application.currentStep;
        this.initFormsTitle();
        Vue.nextTick(()=> this.setProgress());
        this.$emit('formsList',this.formsList)
    } 
    
    public initFormsTitle(){
        for(const formInx in this.formsList)
        {
            if(this.generatedForms.includes(this.formsList[formInx].name))
                this.formsList[formInx].color = "success"
        }
    }
    
    public onDownload(formName, inx) {
        console.log("downloading"+inx)
        console.log(this.formsList[inx])
        this.formsList[inx].color = "success";
        this.showPDFformName = formName;
        this.showPDFpreview = true;

        if(!this.generatedForms.includes(formName))
        {
            const forms= this.generatedForms;
            forms.push(formName)
            this.UpdateGeneratedForms(forms);
        }

        this.setProgress()

        // if(this.checkErrorOnPages()){ 
        //     const currentDate = moment().format();
        //     this.$store.commit("Application/setLastPrinted", currentDate); 
        //     this.loadPdf();
        // }
    }

    public setProgress(){
        // console.warn('Set Progress')
        // console.log(this.currentStep)
        // console.log(this.currentPage)
        if(this.currentPage <0) return
        Vue.filter('setSurveyProgress')(null, this.currentStep, this.currentPage, this.isFormReviewed()?100:50, false);
    }

    public isFormReviewed(){
        for(const form of this.formsList)
            if(!this.generatedForms.includes(form.name)){
                console.log(form)
                return false
            }
        return true
    }

}
</script>