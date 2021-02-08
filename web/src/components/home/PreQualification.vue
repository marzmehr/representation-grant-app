<template>
    <b-container class="container home-content" >
        <survey v-bind:survey="survey"></survey>
        <b-button v-if="displayButton" @click="onSubmit" variant="success">
            <b-icon-check-circle-fill/> Complete
        </b-button>
       
    </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import store from "@/store";

import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/components/survey/survey-glossary.ts";
import surveyJson from "./forms/survey-qualify.json";

@Component
export default class PreQualification extends Vue {

    error = "";
    applicationId = 0;
    displayButton = true;
    survey = new SurveyVue.Model(surveyJson);
  

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();    
    }

    mounted(){
        this.displayButton = true;       
        this.initializeSurvey();
        // this.addSurveyListener();
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
            if (this.survey.data.diedAfterWESA == 'y' && this.survey.data.complicationsExplanation > 0) 
            {
                this.$router.push({ name: "qualified" });
            } else {
                this.$router.push({ name: "unqualified" });
            }
        }
    }

    // public addSurveyListener(){
    //     this.survey.onValueChanged.add((sender, options) => {            
    //         if (this.survey.data.diedAfterWESA == 'y' && this.survey.data.complicationsExplanation > 0) 
    //         {
    //             this.displayButton = true;
    //         }          
    //     })
    // }

    public saveUserLocation(){
        const url = "/user-info/"
        const header = {
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
            }
        }
        this.$http.put(url, {location:this.survey.data.ServiceLocation}, header)            
        .then(() => {        
            this.error = "";
            this.saveApplication()
        }, err => {
            console.error(err);
            this.error = err;
        });
    }

    public saveApplication(){

        this.$store.commit("Application/init");
        const userType = store.state.Application.userType;      
        store.commit("Application/setUserType", userType);
        const application = store.state.Application;
        //console.log(store.state.Application)
        const url = "/app/"
        const header = {
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
            }
        }
        this.$http.post(url, application, header)
        .then(res => {
            this.applicationId = res.data.app_id;  
            store.commit("Application/setApplicationId", this.applicationId);
            this.error = "";
            this.$router.push({name: "flapp-surveys" }) 
        }, err => {
            console.error(err);
            this.error = err;
        });
    }

    beforeDestroy() {
        //console.log(this.step)
        //console.log(this.survey.data)
        this.$store.commit("Application/setApplicationLocation", this.survey.data.ServiceLocation);
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


    .locator-button {
    margin-top: 2.5rem;
    margin-left: 1rem;
    float: left;
    width: 8rem;
    }
</style>
