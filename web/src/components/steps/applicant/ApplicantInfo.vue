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
    relatedPeopleNames: string[]=[];

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
        
        const temp = (surveyJson.pages[0].elements[2])        
        console.log(temp)        
        let tmp = JSON.parse(JSON.stringify(temp));
        surveyJson.pages[0].elements[1].elements[0]["choices"]=[];
        
        for(const relatedPerson in this.relatedPeopleInfo){
            
            const applicantNameAndRelation = Vue.filter('getFullName')(this.relatedPeopleInfo[relatedPerson].name)+' ('+this.relatedPeopleInfo[relatedPerson].relationShip+')'
            const applicantName = Vue.filter('getFullName')(this.relatedPeopleInfo[relatedPerson].name)
            this.relatedPeopleNames.push(applicantNameAndRelation)
            surveyJson.pages[0].elements[1].elements[0]["choices"].push({value:'relatedPerson['+relatedPerson+']', text: applicantNameAndRelation})
            
            let jsonText= JSON.stringify(temp)
            jsonText = jsonText.replace(/[0]/g, relatedPerson);
            jsonText = jsonText.replace(/{applicantName}/g, applicantName);
            jsonText = jsonText.replace(/{applicantRelationship}/g,"'"+this.relatedPeopleInfo[relatedPerson].relationShip+"'");
            tmp = JSON.parse(jsonText);
            //console.log(tmp)

            if(relatedPerson == '0')
                surveyJson.pages[0].elements[2] = tmp;
            else 
                surveyJson.pages[0].elements.splice(2+Number(relatedPerson),0,tmp)
        }
        //console.log(surveyJson)
    }
    
    public addSurveyListener(){
        this.survey.onValueChanged.add((sender, options) => {
            console.log(this.survey.data);
            // console.log(options)
            this.determineApplicantInfoCompleted();
            this.determineLengthOfApplicants();

            // console.log(options.question.visibleChoices)
            // console.log(options.value)
        })   
    }

    public determineLengthOfApplicants(){
        //console.log(this.survey.data.applicant.length)
        this.survey.setVariable("multipleApplicants",this.survey.data.applicant?this.survey.data.applicant.length:0)
    }

    public determineApplicantInfoCompleted(){        

        if (this.survey.data.applicantCourthouse && this.survey.data.applicantCourthouse != "") {
           
            this.toggleSteps([4,8], true);
        } else{
            this.toggleSteps([4, 5, 6, 7, 8], false);
        }        
    }

    public reloadPageInformation() {
        //console.log(this.step.result)
        if (this.step.result && this.step.result["applicantInfoSurvey"]){
            this.survey.data = this.step.result["applicantInfoSurvey"].data;
        }
        
        this.thisStep = this.currentStep;
        
        this.currentPage = this.steps[this.currentStep].currentPage;
        Vue.filter('setSurveyProgress')(this.survey, this.currentStep, this.currentPage, 50, false);
        this.determineApplicantInfoCompleted();
        this.survey.setVariable("deceasedName", Vue.filter('getFullName')(this.deceasedName));
        this.determineLengthOfApplicants();
        this.survey.setValue("relatedPeopleNames",this.relatedPeopleNames)
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

    public toggleSteps(stepArr, active) {
        for (let i = 0; i < stepArr.length; i++) {
            this.UpdateStepActive({
                currentStep: stepArr[i],
                active: active
            });
        }        
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
    
   

    beforeDestroy() {

        console.log(this.relatedPeopleInfo)
        console.log(this.survey.data)

        Vue.filter('setSurveyProgress')(this.survey, this.thisStep, this.currentPage, 50, true);
       
        this.UpdateStepResultData({step:this.step, data: {applicantInfoSurvey: Vue.filter('getSurveyResults')(this.survey, this.thisStep, this.currentPage)}});

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../../styles/survey";
</style>
