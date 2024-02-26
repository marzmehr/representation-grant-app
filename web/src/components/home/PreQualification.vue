<template>
    <b-container class="container home-content" >
        <survey v-bind:survey="survey"></survey>
        <b-button v-if="displayButton" @click="onSubmit" variant="success">
            <b-icon-check-circle-fill/> Next
        </b-button>
       
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary";
import surveyJson from "./forms/survey-qualify.json";
import Tooltip from "@/components/survey/Tooltip.vue";

import { namespace } from "vuex-class";   
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
    components:{
        Tooltip
    }
})
export default class PreQualification extends Vue {

    @commonState.State
    public userId!: string;

    error = "";
    applicationId = 0;
    displayButton = false;
    survey = new SurveyVue.Model(surveyJson);  

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();    
    }

    mounted(){        
        this.displayButton = false;       
        this.initializeSurvey();
        this.addSurveyListener();
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }  
  
    public onSubmit(evt) {
        evt.preventDefault();      

        if(!this.survey.isCurrentPageHasErrors) 
        {
            if (this.survey.data.willExists == 'n' && this.survey.data.qualifyingDiedAfterWESA == 'y' && this.survey.data.qualifyingTerms > 0 ) 
            {
                if(this.userId !== ""){
                    this.$router.push({ name: "surveys" });
                } else {
                    this.$router.push({ name: "qualified" });
                }
                
            } else {
                this.$router.push({ name: "unqualified" });
            }
        }
    }

    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => { 
            console.log(this.survey.data) 
            console.log(options)        
            if (this.survey.data.willExists == 'n' && this.survey.data.qualifyingDiedAfterWESA == 'y' && this.survey.data.qualifyingTerms > 0 ) 
            {
                this.displayButton = true;
            } else {
                this.displayButton = false;
            }          
        })
    } 

    beforeDestroy() {       
        console.log(this.survey.data)        
    }
};
</script>

<style scoped lang="scss">
    @import "src/styles/common";
    .home-content {
        padding-bottom: 20px;
        padding-top: 2rem;
        max-width: 950px;
        color: black;
    }

</style>
