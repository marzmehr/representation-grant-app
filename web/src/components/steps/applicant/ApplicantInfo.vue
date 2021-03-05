<template>
    <page-base v-on:onPrev="onPrev()" v-on:onNext="onNext()" v-on:onComplete="onComplete()">
        <survey v-bind:survey="survey"></survey>
    </page-base>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';    

import * as SurveyVue from "survey-vue";
import surveyJson from "./forms/applicant-info.json";
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

export default class ApplicantInfo extends Vue {
        
    @Prop({required: true})
    step!: stepInfoType;

    @applicationState.State
    public steps!: stepInfoType[];

    @applicationState.State
    public currentStep!: number;

    @applicationState.State
    public deceasedName!: string;

    @applicationState.State
    public relatedPeopleInfo!: any;

    @applicationState.Action
    public UpdateRelatedPeopleInfo!: (newRelatedPeopleInfo) => void

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
    thisStep = 0;

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
        if (this.step.result && this.step.result['applicantInfoSurvey']) { 
            this.disableNextButton = false;           
            // this.determinePeaceBondAndBlock();
        }
    }

    mounted(){        
        this.extractRelatedPeopleInfo();
        console.log(this.relatedPeopleInfo);

        this.initializeSurvey();
        this.addSurveyListener();
        this.reloadPageInformation();
    }

    public extractRelatedPeopleInfo(){
        const relatedPeopleInfo=[]
        if(this.steps[2].result && this.steps[2].result["spouseSurvey"]){
            const spouseSurvey = this.steps[2].result && this.steps[2].result["spouseSurvey"];
            //console.log(spouseSurvey)
            const spouseInfo = (spouseSurvey.data.spouseExists =='y' && spouseSurvey.data.spouseInfoPanel)?spouseSurvey.data.spouseInfoPanel:[];
                   
            for (const spouse of spouseInfo) {
                if (spouse.spouseIsAlive == "y") {
                    relatedPeopleInfo.push({relationShip: "spouse",name:spouse.spouseName, isAlive:spouse.spouseIsAlive, info: spouse});
                }                       
            }
        }

        if(this.steps[2].result && this.steps[2].result["childrenSurvey"]){
            const childrenSurvey = this.steps[2].result && this.steps[2].result["childrenSurvey"];
            const childrenInfo = (childrenSurvey.data.child=='y'&& childrenSurvey.data.childInfoPanel)?childrenSurvey.data.childInfoPanel:[]
                
            for (const child of childrenInfo) {
                if (child.childIsAlive == "y") {
                    relatedPeopleInfo.push({relationShip: "child", name:child.childName, isAlive:child.childIsAlive, info: child});
                }                       
            }
        }
        this.UpdateRelatedPeopleInfo(relatedPeopleInfo)
    }

    public initializeSurvey(){
        this.adjustSurveyForRelatedPeople();
        this.survey = new SurveyVue.Model(surveyJson);
        this.survey.commentPrefix = "Comment";
        this.survey.showQuestionNumbers = "off";
        this.survey.showNavigationButtons = false;
        surveyEnv.setGlossaryMarkdown(this.survey);
    } 
    
    public adjustSurveyForRelatedPeople(){
        
        const temp = (surveyJson.pages[0].elements[6])        
        console.log(temp)
        let tmp = JSON.parse(JSON.stringify(temp));
        surveyJson.pages[0].elements[4].elements[0]["choices"]=[];
        for(const relatedPerson in this.relatedPeopleInfo){
            const applicantName = Vue.filter('getFullName')(this.relatedPeopleInfo[relatedPerson].name)+' ('+this.relatedPeopleInfo[relatedPerson].relationShip+')'
            surveyJson.pages[0].elements[4].elements[0]["choices"].push({value:'relatedPerson['+relatedPerson+']', text: applicantName})
            
            tmp = JSON.parse(JSON.stringify(temp));
            tmp.name = "applicantInfoPanel["+relatedPerson+"]";
            tmp.visibleIf = "{applicant} contains 'relatedPerson["+relatedPerson+"]'"

            tmp.elements[3].name = "applicantNewPartOfOrg["+relatedPerson+"]";
            tmp.elements[3].title = "Is "+ applicantName +" applying on behalf of an organization that has been asked to manage {deceasedName}'s `estate`"
           
            tmp.elements[11].name = "applicantOccupation["+relatedPerson+"]";
            tmp.elements[11].title = "What is "+ applicantName +"'s job or profession?"

            tmp.elements[12].name = "applicantMailingAddress["+relatedPerson+"]";
            tmp.elements[12].title = "What is "+ applicantName +" mailing address?"
            
            if(relatedPerson == '0')
                surveyJson.pages[0].elements[6] = tmp;
            else 
                surveyJson.pages[0].elements.splice(6+Number(relatedPerson),0,tmp)
        }
        //console.log(surveyJson)
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            //console.log(this.survey.data);
            // console.log(options)
            let pagesArr = [];            
        })   
    }

    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result["applicantInfoSurvey"]){
            this.survey.data = this.step.result["applicantInfoSurvey"].data;
        }
        
        this.thisStep = this.currentStep;
        
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        // this.determinePeaceBondAndBlock();
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
    
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

        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);
       
        this.UpdateStepResultData({step:this.step, data: {applicantInfoSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
