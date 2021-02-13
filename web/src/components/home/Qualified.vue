<template>
    <b-card class="container" border-variant="white">
       
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
                <span>You will need a BCeID account to access this service to apply to represent a person who died. This is an online "ID" and password that 
                    enables you to securely access multiple online government services with a single user ID and password.
                </span>
                <b-col cols="6">
                    <b-card border-variant="white">
                        <h4>Register for a Basic BCeID</h4>
                        <p>You need a <strong>Basic BCeID</strong> to use this service to Apply to Represent a Person Who Died. 
                        Once you have registered, you will be taken back to this website. 
                        </p>
                    </b-card>                   
                </b-col>

                <b-col cols="6">
                    <b-card border-variant="white">
                        <h4>I have a BCeID</h4>
                        <p>If you already have a <strong>Basic BCeID</strong>, then you can login now.</p>
                    </b-card>                  
                </b-col>

            </b-row>
            <b-row>
                <b-col cols="6">
                    <b-card border-variant="white">
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
import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component
export default class LandingPage extends Vue { 
    
    @applicationState.Action
    public UpdateUserType!: (newUserType) => void
    
  
    public navigate(userType) {      

        //this.UpdateUserType(userType);          
        if (userType === "new") {
              //Register a BCeID
              this.$router.push({ name: "surveys" });
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
