<template>
    <div v-if="surveyInitiated" class="fill-body" id="surveys">
        <main class="app-content">
            <navigation-sidebar />
            <deceased-info-step v-if="getCurrentStepIndex() == 0" v-bind:step="getStep(0)"></deceased-info-step>
            <deceased-will-step v-if="getCurrentStepIndex() == 1" v-bind:step="getStep(1)"></deceased-will-step>
            <related-people-step v-if="getCurrentStepIndex() == 2" v-bind:step="getStep(2)"></related-people-step>
            <applicant-info-step v-if="getCurrentStepIndex() == 3" v-bind:step="getStep(3)"></applicant-info-step>
            <notify-step v-if="getCurrentStepIndex() == 4" v-bind:step="getStep(4)"></notify-step>           
            <belongings-step v-if="getCurrentStepIndex() == 5" v-bind:step="getStep(5)"></belongings-step>
            <no-will-notify-step v-if="getCurrentStepIndex() == 6" v-bind:step="getStep(6)"></no-will-notify-step>
            <overview-step v-if="getCurrentStepIndex() == 7" v-bind:step="getStep(7)"></overview-step>           
            <submit v-if="getCurrentStepIndex() == 8" v-bind:step="getStep(8)"></submit>
    
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import { namespace } from "vuex-class";
import moment from 'moment-timezone';   
import "@/store/modules/application";
const applicationState = namespace("Application");

import "@/store/modules/common";
const commonState = namespace("Common");

import NavigationSidebar from "./NavigationSidebar.vue";
import DeceasedInfoStep from "./steps/deceased/DeceasedInfoStep.vue";
import DeceasedWillStep from "./steps/will/DeceasedWillStep.vue";
import RelatedPeopleStep from "./steps/relatedPeople/RelatedPeopleStep.vue";
import ApplicantInfoStep from "./steps/applicant/ApplicantInfoStep.vue";
import NotifyStep from "./steps/notify/NotifyStep.vue";
import BelongingsStep from "./steps/belongings/BelongingsStep.vue";
import NoWillNotifyStep from "./steps/noWillNotify/NoWillNotifyStep.vue";
import OverviewStep from "./steps/overview/OverviewStep.vue";
import Submit from "./steps/submit/StepSubmit.vue";

import * as surveyEnv from "@/components/survey/survey-glossary.ts"
import { stepInfoType } from '@/types/Application';

@Component({
    components: {
        NavigationSidebar,
        DeceasedInfoStep,
        DeceasedWillStep,
        RelatedPeopleStep,
        ApplicantInfoStep,
        NotifyStep,
        BelongingsStep,
        NoWillNotifyStep,
        OverviewStep,
        Submit        
    }
})

export default class Surveys extends Vue {

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public userType!: string;

    @applicationState.State
    public currentStep!: number;

    @commonState.State
    public existingApplication!: Boolean;

    @applicationState.Action
    public UpdateApplicationId!: (newApplicationId) => void

    @applicationState.Action
    public UpdateLastUpdated!: (newLastUpdated) => void

    error = "";
    surveyInitiated = false;
  
    beforeCreate() {    
        surveyEnv.loadGlossary();
        console.log('here in survey')
    }

    mounted() {
        this.surveyInitiated = false;
        if (this.existingApplication){
            this.surveyInitiated = true;
        } else {
            this.initiateApplication();
        }
        
    }

    public getCurrentStepIndex() {
        return this.currentStep;
    }

    public getStep(stepIndex) {
        const step = this.steps[stepIndex];
        console.log(stepIndex);
        console.log(step)
        return step;
    }

    public initiateApplication() {

        this.$store.commit("Application/init");
        const lastUpdated = moment().format();
        this.UpdateLastUpdated(lastUpdated);
        
        const application = this.$store.state.Application;
        const url = "/app/"
        const header = {
            responseType: "json",
            headers: {
                "Content-Type": "application/json",
            }
        }
        this.$http.post(url, application, header)
        .then(res => {
            this.UpdateApplicationId(res.data.app_id)
            this.error = "";
            this.surveyInitiated = true;
            
        }, err => {
            console.error(err);
            this.error = err;
        });
    }

};
</script>
