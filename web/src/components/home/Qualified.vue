<template>
    <b-card v-if="pageReady" id="landing-page" class="container" border-variant="white">
       
            <b-row class="mt-3">
                <b-card style="border-radius: 10px; width: 80rem;" class="text-white bg-success">
                    <b-row>
                        <b-icon-check variant="white" font-scale="2.5"/>
                        <h3 class="mt-2">You have met the conditions for using the Apply for a Representation Grant service.
                        </h3>
                    </b-row>
                </b-card>
            </b-row>
            <b-row class="mt-3">
                <span>You will need a BCeID account to access this service. This is an online "ID" and password that 
                    enables you to securely access multiple online government services.
                </span>
                <b-col cols="6">
                    <b-card border-variant="white">
                        <p>You need a <strong>Basic BCeID</strong> to use this service. Once you have registered, you will be taken back to this website. 
                        </p>
                    </b-card>
                    <b-card border-variant="white" v-if="!isLoggedIn">
                        <b-row class="justify-content-center">
                            <b-button 
                                variant="success" 
                                size="lg" 
                                class="survey-button text-white" 
                                style="padding: 0.75rem 10rem; font-weight: bold; font-size: 25px;" 
                                @click="navigate('new')">
                                Register
                            </b-button>
                        </b-row>                       
                    </b-card>                   
                </b-col>

                <b-col cols="6">
                    <b-card border-variant="white">
                        <p>If you already have a <strong>Basic BCeID</strong> or <strong>Personal BCeID</strong>, then you can login now.</p>
                    </b-card>
                    <b-card border-variant="white" v-if="!isLoggedIn">
                        <b-row class="justify-content-center">
                            <b-button 
                                variant="success" 
                                size="lg" 
                                class="survey-button text-white" 
                                style="padding: 0.75rem 10rem; font-weight: bold; font-size: 25px;" 
                                @click="navigate('returning')">
                                Login
                            </b-button>
                        </b-row>                       
                    </b-card>                   
                </b-col>

            </b-row>

    </b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SessionManager } from "@/components/utils/utils";

@Component
export default class LandingPage extends Vue {
    
    isLoggedIn= false;
    pageReady = false;   
      
    async mounted() {
        this.pageReady = false;
       
        await SessionManager.getUserInfo(this.$store);
        if(this.$store.state.Common.userId !== ""){
            this.isLoggedIn = true
            
        }else{
            this.isLoggedIn = false;
            this.pageReady = true;
        } 
    }
  
    public navigate(userType) {

        this.$store.commit("Application/setUserType", userType);          
        if (userType === "new") {
              //Register a BCeID
        } else if (userType === "returning") {
              //Login BCeID
              this.$router.push({ name: "surveys" });
        }  
    }  
  
};
</script>

<style scoped lang="scss">
    @import "src/styles/common";

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
