<template>
    <div class="m-0 mr-5">
        <b-row style="height: 10rem !important;">
            <b-col md="3">
                <sandbox-sidebar class="pb-4" :survey="survey" :changed="updatedKey" /> 
            </b-col>
            <b-col md="9">
                <survey v-bind:survey="survey"></survey>
            </b-col>
        </b-row>
    </div> 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import surveyJson from "../JsonFiles/sandbox5.json";
import * as surveyEnv from "./survey-glossary"

import SandboxSidebar from "./SandboxSidebar.vue"

@Component({
    components:{
        SandboxSidebar
    }
})
export default class SurveySandBox extends Vue {

    survey = new SurveyVue.Model(surveyJson); 
    updatedKey = 0;
    
    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();
    }
    
    mounted(){
        this.initializeSurvey();
        this.addSurveyListener();
       // this.reloadPageInformation();
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
       // this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }    
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            //console.log(options)
            //console.log(this.survey)
            this.updatedKey++;
            //this.survey.currentPageNo =3;
        })

        this.survey.onCurrentPageChanged.add((sender, options) => {
            this.updatedKey++;
            //Vue.nextTick(()=> window.scrollTo(0,0))
            Vue.nextTick(()=>
            {
                const el = document.getElementById('sidebar-title')
                if(el) el.scrollIntoView();
                //scrollTo(0,0); 
                //console.log(el)
            })
            // , 1000) 
        })
    }

}
</script>

