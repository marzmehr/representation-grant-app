<template>
    <b-card style="margin:1rem 0;border-radius:10px; border:2px solid #AABBDD;">
        <div style="float:left; margin: 0.5rem 1rem;color:#5050AA; font-size:16px; font-weight:bold;" > 
            {{title}}
        </div>
        <b-button 
            style="float:right; margin: 0.25rem 1rem;"                  
            v-on:click.prevent="onDownload()"
            :variant="color">
                <span class="fa fa-print btn-icon-left"/>
                Review and Print
        </b-button>
    </b-card> 
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component({
    components:{
        
    }
})
export default class FormsRow extends Vue {
    

    @Prop({required: true})
    title!: string;

   @Prop({required: true})
    color!: string;

    mounted(){

    }    

    onDownload(){
        this.$emit('clicked')    
    }
}
</script>