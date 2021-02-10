import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { stepInfoType, pageInfoType } from "@/types/Application";

@Module({
  namespaced: true
})
class Application extends VuexModule {

    public id = ""
    public type = ""
    public steps = new Array<stepInfoType>()
    public lastUpdate = null
    public lastPrinted = null
    public lastFiled = null
    public currentStep = 1
    public allCompleted = false
    public userType = ""
    public userName = ""
    public userId = ""
    public applicantName = ""
    public respondentName = ""
    public protectedPartyName = ""
    public protectedChildName = ""
    public applicationLocation = ""
    public scrollToLocationName = ""
    public requiredDocuments: string[] = []
    public packageNumber = ""
    public eFilingHubLink = ""

    @Mutation
    public init(): void {
        this.allCompleted = false;
        this.currentStep = 0;
        this.type = "probate";
        this.userName = "";
        this.lastPrinted = null;
        this.lastUpdate = null;
        this.lastFiled = null;
        this.packageNumber = "";
        this.eFilingHubLink = "";
        this.steps = new Array<stepInfoType>();
        // Deceased Info START
        let s = {} as stepInfoType;
    
        s.active = true;
        s.id = "0";
        s.label = "Deceased";
        s.icon = "tomb-stone";
        s.lastUpdate = null;    
        s.type = "getInformationStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        let p = {} as pageInfoType;
        p.key = "0";
        p.label = "Information About Deceased";
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        this.steps.push(s);
    
        // Deceased Info STOP
        // Deceased Will START

        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "1";
        s.label = "Deceased's Will";
        s.icon = "book";
        s.lastUpdate = null;
        s.type = "deceasedWillStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "Deceased's Will";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        this.steps.push(s);
    
        // Deceased Will STOP
        // Related People START
        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "2";
        s.label = "Related People";
        s.icon = "users";
        s.lastUpdate = null;
        s.type = "relatedPeopleStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "Executors";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        p = {} as pageInfoType;
        p.key = "1";
        p.label = "Spouse";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        p = {} as pageInfoType;
        p.key = "2";
        p.label = "Children";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        p = {} as pageInfoType;
        p.key = "3";
        p.label = "Grand Children";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        p = {} as pageInfoType;
        p.key = "4";
        p.label = "Beneficiaries";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);   
       
    
        p = {} as pageInfoType;
        p.key = "5";
        p.label = "Creditors";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);    
       
        this.steps.push(s);
    
        //Related People STOP
        //Applicant START
        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "3";
        s.label = "Applicant";
        s.icon = "user-tie";
        s.lastUpdate = null;
        s.type = "applicantStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "Information About Applicant";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
        this.steps.push(s);
        //Applicant STOP

        // Notify START
        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "4";
        s.label = "Notify";
        s.icon = "envelope-open-text";
        s.lastUpdate = null;
        s.type = "notifyStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "Notify People";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
        this.steps.push(s);
        //Notify STOP
        //Deceased's Belongings START
        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "5";
        s.label = "Deceased's Belongings";
        s.icon = "coins";
        s.lastUpdate = null;
        s.type = "belongingsStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "Land and Buildings";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.label = "Vehicles";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "2";
        p.label = "Bank Accounts";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "3";
        p.label = "Pensions and Insurance";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "4";
        p.label = "Personal Items";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);



        this.steps.push(s);
        //Belongings STOP
        //No Will Notify START
        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "6";
        s.label = "No Will Notification";
        s.icon = "envelope-open-text";
        s.lastUpdate = null;
        s.type = "noWillNotifyStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "No Will Notification";
         //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
        this.steps.push(s);
        //No Will Notify STOP
        //Overview START
        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "7";
        s.label = "Overview";
        s.icon = "user-edit";
        s.lastUpdate = null;
        s.type = "overviewStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "Will Search Check";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.label = "Finalize Asset Values";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);


        this.steps.push(s);
        //Overview STOP
        //Submit START
        s = {} as stepInfoType;
        //TODO: turn active to false
        s.active = true;
        s.id = "8";
        s.label = "Review and File";
        s.icon = "paper-plane";
        s.lastUpdate = null;
        s.type = "submit";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;
    
        p = {} as pageInfoType;
        p.key = "0";
        p.label = "Review Your Answers";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.label = "Filing Options";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "2";
        p.label = "Review and Print";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        p = {} as pageInfoType;
        p.key = "3";
        p.label = "Review and Save";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
        
        p = {} as pageInfoType;
        p.key = "4";
        p.label = "Review and Submit";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        p = {} as pageInfoType;
        p.key = "5";
        p.label = "Next Steps";
        //TODO: turn active to false
        p.active = true;
        p.progress = 0;
    
        s.pages.push(p);
    
        this.steps.push(s);
    
        //console.log(this.steps)
        //Submit STOP
        
    }
    @Action
    public UpdateInit() {
        this.context.commit("init");
    }

    @Mutation
    public setUserType(userType): void {
        this.userType = userType;
    }
    @Action
    public UpdateUserType(newUserType) {
        this.context.commit("setUserType", newUserType);
    }
    
    @Mutation
    public  setCurrentStep(currentStep): void {
        this.currentStep = currentStep;
    }
    @Action
    public UpdateCurrentStep(newCurrentStep) {
        this.context.commit("setCurrentStep", newCurrentStep);
    }
    
    @Mutation
      public setCurrentStepPage({ currentStep, currentPage }): void {
        this.steps[currentStep].currentPage = currentPage;
    }
    @Action
    public UpdateCurrentStepPage({ currentStep, currentPage }) {
        this.context.commit("setCurrentStepPage", { currentStep, currentPage });
    }

    @Mutation
    public  setUserName(userName): void {
        this.userName = userName;
    }
    @Action
    public UpdateUserName(newUserName) {
        this.context.commit("setUserName", newUserName);
    }
    
    @Mutation
    public setUserId(userId): void {
        this.userId = userId;
    }
    @Action
    public UpdateUserId(newUserId) {
        this.context.commit("setUserId", newUserId);
    }

    @Mutation
    public setRequiredDocuments(requiredDocuments): void {
        this.requiredDocuments = requiredDocuments;
    }
    
    @Action
    public UpdateRequiredDocuments(newRequiredDocuments) {
        this.context.commit("setRequiredDocuments", newRequiredDocuments);
    }

    @Mutation
    public setPackageNumber(packageNumber): void {
        this.packageNumber = packageNumber;
    }
    
    @Action
    public UpdatePackageNumber(newPackageNumber) {
        this.context.commit("setPackageNumber", newPackageNumber);
    }

    @Mutation
    public setEFilingHubLink(eFilingHubLink): void {
        this.eFilingHubLink = eFilingHubLink;
    }
    
    @Action
    public UpdateEFilingHubLink(newEFilingHubLink) {
        this.context.commit("setEFilingHubLink", newEFilingHubLink);
    }
    
    @Mutation
    public setStepActive({ currentStep, active }): void {
        this.steps[currentStep].active = active;
    }
    @Action
    public UpdateStepActive({ currentStep, active }) {
        this.context.commit("setStepActive", { currentStep, active });
    }

    @Mutation
    public gotoPrevStepPage({ prevStep, prevPage }): void {
        if (prevStep != this.currentStep) {
          this.currentStep = prevStep;
        }
    
        if (prevPage != this.steps[prevStep].currentPage) {
          this.steps[prevStep].currentPage = prevPage;
        }
        window.scrollTo(0, 0);
    }
    @Action
    public UpdateGotoPrevStepPage() {
        const prevStepPage = this.context.getters["getPrevStepPage"];
    
        if (prevStepPage != null) {
          this.context.commit("gotoPrevStepPage", prevStepPage);
        }
    }    

    @Mutation
    public gotoNextStepPage({ nextStep, nextPage }): void {
        if (nextStep != this.currentStep) {
            this.currentStep = nextStep;
        }
    
        if (nextPage != this.steps[nextStep].currentPage) {
            this.steps[nextStep].currentPage = nextPage;
        }
        window.scrollTo(0, 0);
    }    
    @Action
    public UpdateGotoNextStepPage() {
        const nextStepPage = this.context.getters["getNextStepPage"];
    
        if (nextStepPage != null) {
            this.context.commit("gotoNextStepPage", nextStepPage);
        }
    }
    
    @Mutation
    public setPageActive({ currentStep, currentPage, active }): void {
        this.steps[currentStep].pages[currentPage].active = active;
    }
    @Action
    public UpdatePageActive({ currentStep, currentPage, active }) {
        this.context.commit("setPageActive", { currentStep, currentPage, active });
    }

    @Mutation
    public setPageProgress({ currentStep, currentPage, progress }): void {
        this.steps[currentStep].pages[currentPage].progress = progress;
    }
    @Action
    public UpdatePageProgress({ currentStep, currentPage, progress }) {
        this.context.commit("setPageProgress", { currentStep, currentPage, progress });
    }

    @Mutation
    public setStepResultData({ step, data }): void {
        step.result = {...step.result, ...data};
    }
    @Action
    public UpdateStepResultData({ step, data }) {
        this.context.commit("setScrollToLocationName","");
        this.context.commit("setStepResultData", { step, data });
    } 
    
    @Mutation
    public setAllCompleted(allCompleted): void {
        this.allCompleted = allCompleted;
    }
    @Action
    public UpdateAllCompleted(newAllCompleted) {
        this.context.commit("setAllCompleted", newAllCompleted);
    }    
    
    @Mutation
    public setApplicantName(applicantName): void {
        this.applicantName = applicantName;
    }
    @Action
    public UpdateApplicantName(newApplicantName) {
        this.context.commit("setApplicantName", newApplicantName);
    }
    
    @Mutation
    public setRespondentName(respondentName): void {
        this.respondentName = respondentName;
    }
    @Action
    public UpdateRespondentName(newRespondentName) {
        this.context.commit("setRespondentName", newRespondentName);
    }
    
    @Mutation
    public setProtectedPartyName(protectedPartyName): void {
        this.protectedPartyName = protectedPartyName;
    }
    @Action
    public UpdateProtectedPartyName(newProtectedPartyName) {
        this.context.commit("setProtectedPartyName", newProtectedPartyName);
    }  
    
    @Mutation
    public setProtectedChildName(protectedChildName): void {
        this.protectedChildName = protectedChildName;
    }
    @Action
    public UpdateProtectedChildName(newProtectedChildName) {
        this.context.commit("setProtectedChildName", newProtectedChildName);
    }

    @Mutation
    public setApplicationLocation(applicationLocation): void {
        this.applicationLocation = applicationLocation;
    }
    @Action
    public UpdateApplicationLocation(newApplicationLocation) {
        this.context.commit("setApplicationLocation", newApplicationLocation);
    }
    
    @Mutation
    public setApplicationId(id): void {
        this.id = id;
    }
    @Action
    public UpdateApplicationId(newId) {
        this.context.commit("setApplicationId", newId);
    }

    @Mutation
    public setApplicationType(type): void {
        this.type = type;
    }
    @Action
    public UpdateApplicationType(newType) {
        this.context.commit("setApplicationType", newType);
    }
    
    @Mutation
    public setLastUpdated(lastUpdated): void {
        this.lastUpdate = lastUpdated;
    }
    @Action
    public UpdateLastUpdated(newLastUpdated) {
        this.context.commit("setLastUpdated", newLastUpdated);
    }
    
    @Mutation
    public setLastPrinted(lastPrinted): void {
        this.lastPrinted = lastPrinted;
    }
    @Action
    public UpdateLastPrinted(newLastPrinted) {
        this.context.commit("setLastPrinted", newLastPrinted);
    }

    @Mutation
    public setLastFiled(lastFiled): void {
        this.lastFiled = lastFiled;
    }
    @Action
    public UpdateLastFiled(newLastFiled) {
        this.context.commit("setLastFiled", newLastFiled);
    }

    @Mutation
    public setScrollToLocationName(scrollToLocationName): void {
        this.scrollToLocationName = scrollToLocationName;
    }
    @Action
    public UpdateScrollToLocationName(newScrollToLocationName) {
        this.context.commit("setScrollToLocationName", newScrollToLocationName);
    }

    @Mutation
    public setCurrentApplication(application): void {
        this.id = application.id;    
        this.type = application.type;    
        this.steps = application.steps;
        this.lastUpdate = application.lastUpdate;    
        this.currentStep = application.currentStep;
        this.allCompleted = application.allCompleted;
        this.lastPrinted = application.lastPrinted;
        this.userType = application.userType;
        this.userName = application.userName;
        this.applicantName = application.applicantName;
        this.respondentName = application.respondentName; 
        this.protectedPartyName = application.protectedPartyName;
        this.protectedChildName = application.protectedChildName;
        this.applicationLocation = application.applicationLocation;  
    }
    @Action
    public UpdateCurrentApplication(newApplication) {
        this.context.commit("setCurrentApplication", newApplication);
    }


    get getPrevStepPage(): { prevStep: number; prevPage: number } {

        let prevStepPage: { prevStep: number; prevPage: number };    
        let sIndex = this.currentStep;
        let pIndex = this.steps[sIndex].currentPage - 1;
    
        while (prevStepPage == null && sIndex >= 0) {
          const s = this.steps[sIndex];
    
          if (s.active) {
            while (prevStepPage == null && pIndex >= 0) {
              if (s.pages[pIndex].active) {
                prevStepPage = { prevStep: sIndex, prevPage: pIndex };
              } else {
                pIndex--;
              }
            }
          }
    
          // go to previous step
          sIndex--;
    
          if (sIndex >= 0) {
            pIndex = this.steps[sIndex].pages.length - 1;
          }
        }
    
        return prevStepPage;
    }



    get getNextStepPage(): { nextStep: number; nextPage: number } {

        //console.log("nextStep")

        let nextStepPage: { nextStep: number; nextPage: number };    
        let sIndex = this.currentStep;
        let pIndex = this.steps[sIndex].currentPage + 1;
        while (nextStepPage == null && sIndex < this.steps.length) {
            const s = this.steps[sIndex];
        
            if (s.active) {
                while (nextStepPage == null && pIndex < s.pages.length) {
                    if (s.pages[pIndex] && s.pages[pIndex].active) {
                        nextStepPage = { nextStep: sIndex, nextPage: pIndex };
                    } else {
                        pIndex++;
                    }
                }
            }
    
            // go to next step
            sIndex++;
    
            if (sIndex < this.steps.length) {
                pIndex = 0;
            }
        }
        //console.log(nextStepPage)
        return nextStepPage;
    }

}

export default Application