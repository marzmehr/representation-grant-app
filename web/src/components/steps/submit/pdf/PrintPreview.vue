<template>
   <form-p1/>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormP1 from "./FormP1.vue"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        FormP1
    }
})
export default class PrintPreview extends Vue {
    

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

  

    mounted(){

    }

    

}
</script>