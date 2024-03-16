import store from '@/store/index'
import {applicationInfoType, stepInfoType, pageInfoType, resultInfoType} from "@/types/Application"
import { stepsAndPagesNumberInfoType } from "@/types/Application/StepsAndPages";
// import Vue from 'vue';

export class MigrateStore{
 
    currentApplication = {} as applicationInfoType;

    stPgNo = {} as stepsAndPagesNumberInfoType;

    public migrate(applicationData, currentVersion: string): applicationInfoType{
        console.log(currentVersion)

        this.currentApplication.id =  applicationData.id;

        this.currentApplication.allCompleted = applicationData.allCompleted;
        this.currentApplication.applicantName = applicationData.applicantName;
        this.currentApplication.lastUpdate = applicationData.lastUpdated;
        this.currentApplication.lastPrinted = applicationData.lastPrinted;
        this.currentApplication.deceasedName = applicationData.deceasedName;
        this.currentApplication.deceasedDateOfDeath = applicationData.deceasedDateOfDeath;
        this.currentApplication.dateOfWill = applicationData.dateOfWill;
        this.currentApplication.applicationLocation = applicationData.applicationLocation;
        
        this.currentApplication.type = applicationData.type;
        this.currentApplication.userId = applicationData.user;
        this.currentApplication.userName = applicationData.userName;
        this.currentApplication.userType = applicationData.userType;        

        const appVersion = applicationData.version
        
        if(appVersion == currentVersion){             
            console.log('Similar Version')
            this.currentApplication.currentStep = applicationData.currentStep;        
            this.currentApplication.steps = applicationData.steps;
            this.currentApplication.version = applicationData.version;
            
        }else{
            console.log('Old Version')
            this.currentApplication.steps = this.migrateSteps(applicationData.steps)
            this.currentApplication.currentStep = 0;
            this.currentApplication.version = currentVersion;
        }
               

        store.commit("Application/setCurrentApplication", this.currentApplication);
        store.commit("Common/setExistingApplication", true);
        store.dispatch("Application/UpdateStPgNo");
    

        return this.currentApplication
    }

    public migrateSteps(oldSteps: stepInfoType[]): stepInfoType[]{
        store.dispatch("Application/UpdateInit");
        const newSteps = store.state.Application.steps;
        this.stPgNo = store.state.Application.stPgNo;

        for(const newStepIndex in newSteps){
            const newStep = newSteps[newStepIndex]         
            const correspondingStep = oldSteps.filter(oldstep=>oldstep.name == newStep.name)[0]
            
            if(correspondingStep){                
                newSteps[newStepIndex].active = correspondingStep.active;

                newSteps[newStepIndex].pages = this.migratePages(newStep.pages,  correspondingStep.pages);
                
                if(correspondingStep.result)
                    newSteps[newStepIndex].result = this.migrateResult(newStep, correspondingStep);
            }
        }
        return newSteps
    }

    public migratePages(newPages: pageInfoType[] , oldPages: pageInfoType[]): pageInfoType[]{
        
        for(const newPageIndex in newPages){
            const newPage = newPages[newPageIndex];
            const correspondingPage = oldPages.filter(oldpage=>oldpage.name == newPage.name)[0];
            if(correspondingPage){
                newPages[newPageIndex].active = correspondingPage.active;
            }
        }
        return newPages
    }

    public migrateResult(newStep, correspondingStep){
        
        const result = {} as resultInfoType
        
        for (const [key, value] of Object.entries(correspondingStep.result)){
            
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1,-6);
            if(value && (value['currentStep'] || value['currentStep']==0) && (this.stPgNo[newStep.name][fieldName] || this.stPgNo[newStep.name][fieldName]==0)){
                value['currentStep'] = this.stPgNo[newStep.name]._StepNo
                value['currentPage'] = this.stPgNo[newStep.name][fieldName]
                result[key] = value;
            }
        }            
        
        return result
    }

}