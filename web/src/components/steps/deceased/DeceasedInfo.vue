<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/deceased-info.json";
import * as surveyEnv from "@/components/survey/survey-glossary.ts"

import PageBase from "../PageBase.vue";
import { stepInfoType, stepResultInfoType } from "@/types/Application";

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

@Component({
    components:{
        PageBase
    }
})

export default class DeceasedInfo extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.Action
    public UpdateGotoPrevStepPage!: () => void

    @applicationState.Action
    public UpdateGotoNextStepPage!: () => void

    @applicationState.Action
    public UpdateStepResultData!: (newStepResultData: stepResultInfoType) => void

    @applicationState.Action
    public UpdateStepActive!: (newStepActive) => void

    @applicationState.Action
    public UpdatePageActive!: (newPageActive) => void

    @applicationState.Action
    public UpdateAllCompleted!: (newAllCompleted) => void



    survey = new SurveyVue.Model(surveyJson);
    disableNextButton = false;   
    currentPage=0;

    @Watch('pageIndex')
    pageIndexChange(newVal) 
    {
        this.survey.currentPageNo = newVal;        
    }

    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
        surveyEnv.loadGlossary();
    }

    created() {
        this.disableNextButton = false
        if (this.step.result && this.step.result['deceasedInfoSurvey']) { 
            this.disableNextButton = false;           
            // this.determinePeaceBondAndBlock();
        }
    }

    mounted(){
        this.initializeSurvey();
        this.addSurveyListener();
        this.reloadPageInformation();
    }

    public initializeSurvey(){
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    }    
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            //console.log(this.survey.data);
            // console.log(options)
            let pagesArr = [];
            // if (options.name == "orderType") {                
            //     this.removePages();
            //     //console.log('__removed')
            //     const selectedOrder = options.value;
            //     this.$store.commit("Application/setApplicationType",this.getApplicationType(selectedOrder));
                
            //     this.UpdateStepResultData({step:this.step, data: {selectedPOOrder: sender.data}});

            //     pagesArr = [7, 8];
            //     if (selectedOrder !== "needPO" && selectedOrder !== "none") {
            //         this.togglePages(pagesArr, true);
            //         this.toggleOtherPartyPage(true); 
            //         this.$store.commit("Application/setCurrentStepPage", { currentStep:1, currentPage:0 })
            //         this.$store.commit("Application/setCurrentStepPage", { currentStep:2, currentPage:7 });
            //         this.$store.commit("Application/setPageProgress", { currentStep: 2, currentPage:7, progress:0 })
            //     } else {
            //         this.togglePages(pagesArr, false);
            //         this.toggleOtherPartyPage(false);
            //         this.$store.commit("Application/setCurrentStepPage", { currentStep:1, currentPage:0 })
            //         this.$store.commit("Application/setCurrentStepPage", { currentStep:2, currentPage:0 })
            //     }
            //     if (selectedOrder == "needPO") {
            //         this.populatePagesForNeedPO(sender);
            //     }
            //     this.determinePeaceBondAndBlock();
            // }
            // if (options.name == "PORConfirmed") {
            //     //console.log(this.survey.data)
            //     this.determinePeaceBondAndBlock();
            //     pagesArr = [0, 1, 2, 4, 5, 6, 8];
            //     if (options.value.length !== 0) {
            //     this.togglePages(pagesArr, true);
            //     } else {
            //     this.togglePages(pagesArr, false);
            //     }
            // }

            // if (options.name == "familyUnsafe" || options.name == "unsafe") {
            //     //console.warn(options.value)
            //     this.determinePeaceBondAndBlock();
            // }
            //console.log(this.survey.data)
            //console.log(options.name) 
        })   
    }

    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result["deceasedInfoSurvey"]){
            this.survey.data = this.step.result["deceasedInfoSurvey"];
        }        
        
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        // this.determinePeaceBondAndBlock();
   }

    public activateStep(stepActive) {
        this.UpdateStepActive( {
            currentStep: 0,
            active: stepActive
        });
    }


    public togglePages(pageArr, activeIndicator) {
        this.activateStep(activeIndicator);
        for (let i = 0; i < pageArr.length; i++) {
            this.UpdatePageActive({
                currentStep: 0,
                currentPage: pageArr[i],
                active: activeIndicator
            });
        }
    }

    public toggleOtherPartyPage(activeIndicator) {
        this.UpdatePageActive({
            currentStep: 1,
            currentPage: 1,
            active: activeIndicator
        });
    }

    public toggleStep(step, active) {
        this.UpdateStepActive({
            currentStep: step,
            active: active
        });
    }

    public removePages() {
        let allPageIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        this.togglePages(allPageIndex, false);
    }

    public populatePagesForNeedPO(sender) {
        if (sender.data.PORConfirmed) {
            if (sender.data.PORConfirmed.length !== 0) {
            let pagesArr = [0, 1, 2, 4, 5, 6, 8];
            this.togglePages(pagesArr, true);
            }
        }
    }

    public onPrev() {
        this.UpdateGotoPrevStepPage()
    }

    public onNext() {
        if(!this.survey.isCurrentPageHasErrors) {
            this.UpdateGotoNextStepPage()
        }
    }
    
    public onComplete() {
        this.UpdateAllCompleted(true);
    }

    public isDisableNext() {
        // demo
        return Object.keys(this.survey.data).length == 0;
    }

    public getDisableNextText() {
        // demo
        return "You will need to answer the question above to continue";
    }

    public getApplicationType(selectedOrder){
        if (selectedOrder == "needPO") return "New Protection Order";
        else if (selectedOrder == "changePO") return "Change Protection Order";
        else if (selectedOrder == "terminatePO") return "Terminate Protection Order";
        else return "Protection Order";
    }
    
    public determinePeaceBondAndBlock(){
        var pagesArr = [0, 1, 2, 4, 5, 6, 8];
        if((this.survey.data.familyUnsafe == 'n' && this.survey.data.orderType == 'needPO')||(this.survey.data.unsafe == 'n' && this.survey.data.orderType == 'needPO')){
            this.disableNextButton = true;
            this.togglePages(pagesArr, false);
            this.toggleStep(1, false);
            this.toggleStep(2, false);
            this.toggleStep(8, false);
            
        }else{
            this.disableNextButton = false;
            if (this.survey.data.PORConfirmed && this.survey.data.orderType == 'needPO') {            
            this.toggleStep(1, true);
            this.toggleStep(2, true);
            this.toggleStep(8, true);
            this.togglePages(pagesArr, true);
            }       
        }
    }

    beforeDestroy() {

        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, true);
       
        this.UpdateStepResultData({step:this.step, data: {deceasedInfoSurvey: this.survey.data}});

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
