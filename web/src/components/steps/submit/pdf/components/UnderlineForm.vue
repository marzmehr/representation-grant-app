<template>
    <div style="display:inline-block;">
        <div style="display:inline-block; margin-right:0.5rem;"> {{beforetext}} </div>
        <div style="display:inline-block">
            <div style="position: absolute; margin-top:-27px; font-size: 19px;">{{text}}</div> 
            <div :style="{borderBottom: '0.7px solid #000', minWidth: textwidth}"></div>            
            <div style="position: absolute; margin-top:-1px; font-size: 9px;">{{hint}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class UnderlineForm extends Vue {
    @Prop({required: true})
    beforetext!: string;
    @Prop({required: true})
    text!: string;
    @Prop({required: true})
    hint!: string;
    @Prop({required: true})
    textwidth!: string;
}
</script>