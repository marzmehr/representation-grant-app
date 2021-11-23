<template>
    <b-card v-if="pageReady" border-variant="white" class="ml-5">
        <h1 class="text-primary">Representation Grants</h1>
        <span>You have not qualified for the survey.</span>
        <b-card border-variant="white" v-if="!isLoggedIn">            
            <b-button variant="primary" size="lg" class="survey-button text-white" @click="reTakeSurvey()">
                Retake Survey
            </b-button>            
        </b-card>
    </b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getUserId } from '@/state/application-state';
import { SessionManager } from '@/services/session-manager';

@Component
export default class LandingPage extends Vue {
    
    isLoggedIn= false
    pageReady = false
    safetyInst = false
      
    async mounted() {
        this.pageReady = false;
        this.safetyInst = false;
        await SessionManager.getUserInfo();
        if(getUserId.value !== ""){
            this.isLoggedIn = true
            
        }else{
            this.isLoggedIn = false;
            this.pageReady = true;
        } 
    }
  
    public reTakeSurvey() {
        this.$router.push({ name: "pre-qualification" });
    }    
  
};
</script>

<style scoped lang="scss">
    @import "@/styles/_common";
   
    .survey-button {
        color: black;
        border: 2px solid rgba($gov-pale-grey, 0.3);
        margin-top: 2.5rem;
        &:hover,
        &:focus {
            color: rgb(247, 214, 126);
        }
        &:active {
            border: 2px solid rgba($gov-white, 0.8);
        }
    }

</style>
