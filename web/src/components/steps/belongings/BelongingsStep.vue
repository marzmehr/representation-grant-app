<template>
  <step-base v-bind:step="step">
    <land v-bind:step="step" v-if="step.currentPage == 0"></land>
    <vehicles v-bind:step="step" v-if="step.currentPage == 1"></vehicles>
    <bank-accounts v-bind:step="step" v-if="step.currentPage == 2"></bank-accounts>
    <pension v-bind:step="step" v-if="step.currentPage == 3"></pension>
    <personal-items v-bind:step="step" v-if="step.currentPage == 4"></personal-items>    
  </step-base>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

import StepBase from "../StepBase.vue";
import { stepInfoType } from "@/types/Application";
import Land from "./Land.vue";
import Vehicles from "./Vehicles.vue";
import BankAccounts from "./BankAccounts.vue";
import Pension from "./Pension.vue";
import PersonalItems from "./PersonalItems.vue";


@Component({
    components:{
        StepBase,
        Land,
        Vehicles,
        BankAccounts,
        Pension,
        PersonalItems
    }
})
export default class BelongingsStep extends Vue {
    
    @Prop({required: true})
    step!: stepInfoType;

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
