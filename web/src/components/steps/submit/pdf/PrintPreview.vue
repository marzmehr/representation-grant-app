<template>
    <div>
        <b-form-group >
            <b-form-radio-group                
                v-model="selected"
                :options="[{value:'P1', text:'Form P1'},{value:'P5', text:'Form P5'},{value:'P8', text:'Form P8'}]"
                button-variant="outline-primary"
                buttons
            ></b-form-radio-group>            
        </b-form-group>

        <form-p1 v-if="selected=='P1'" />
        <form-p5 v-if="selected=='P5'" />
        <form-p8 v-if="selected=='P8'" /> 
    </div> 
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormP1 from "./FormP1.vue"
import FormP5 from "./FormP5.vue"
import FormP8 from "./FormP8.vue"

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        FormP1,
        FormP5,
        FormP8
    }
})
export default class PrintPreview extends Vue {
    

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    selected=""

    mounted(){

    }

    

}
</script>