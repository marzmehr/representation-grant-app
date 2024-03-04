<template>
    <div v-if="dataReady" class="survey-personname">       
        <b-button  
          style="height: 40px;"
          :variant="buttonVariant" 
          :class="textClass" 
          @click="inputChanged()" 
          :disabled="readOnly">
            <b-overlay :show="this.question.survey['data'].buttonSpinner" class=""  :variant="buttonVariant">
              <span v-if="buttonType=='print'" class="ml-1 fa fa-print btn-icon-left"></span> 
              {{buttonText}}
            </b-overlay>
        </b-button>       
    </div>
</template>

<script lang="ts">

import { Component, Vue, Prop} from 'vue-property-decorator';
import { Question } from "survey-vue";

@Component
export default class CustomButton extends Vue {
    
    @Prop({required: true})
    question!: Question
 
    textClass = "";   
    buttonText = "";
    buttonVariant = "";
    buttonType = "";
    hasSpinner = ""
    clickedNumber = 0;

    readOnly = false; 
    dataReady = false;

    mounted(){ 
      this.dataReady = false ;        
      this.textClass = this.question.textClass;        
      this.buttonText = this.question.buttonText;
      this.buttonVariant = this.question.variant;
      this.buttonType = this.question.buttonType;
      this.hasSpinner = this.question.spinner;
      this.readOnly = this.question.readOnly;
      this.dataReady = true
    }

    public inputChanged(){
      this.clickedNumber++;
      this.question.value = this.clickedNumber;
    }

}
</script>
