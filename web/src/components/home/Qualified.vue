<template>
    <b-card class="container" border-variant="white">
       
            <b-row class="mt-4">
                <b-card style="border-radius: 10px; width: 80rem;" class="text-white bg-primary">                           
                    <h3 class="mt-3 ml-3">You need a BCeID account to use this service.</h3>                   
                </b-card>
            </b-row>
            <b-row class="mt-4 ml-4">
                <span>A Basic BCeID is a free online "ID" and password that lets you save your progress.
                </span>
            </b-row>
            <b-row>
                <b-col cols="6">
                    <b-card border-variant="white">
                        <b-row class="justify-content-center">
                            <b-button 
                                variant="success"                               
                                class="survey-button text-white" 
                                style="padding: 0.75rem 1rem; font-weight: bold; font-size: 15px;" 
                                @click="navigate('new')">
                                Create a new BCeID
                            </b-button>
                        </b-row>                       
                    </b-card>
                </b-col>

                <b-col cols="6">
                    <b-card border-variant="white">
                        <b-row class="justify-content-center">
                            <b-button 
                                variant="success"                                
                                class="survey-button text-white" 
                                style="padding: 0.75rem 1rem; font-weight: bold; font-size: 15px;" 
                                @click="navigate('returning')">
                                Use an existing BCeID
                            </b-button>
                        </b-row>                       
                    </b-card>                    
                </b-col>
            </b-row>

    </b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LandingPage extends Vue { 
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
