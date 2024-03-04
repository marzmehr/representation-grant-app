import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';
import { stepInfoType, pageInfoType, belongingsInfoType } from "@/types/Application";
import { supportingDocumentInfoType } from "@/types/Common";
import { stepsAndPagesNumberInfoType } from '@/types/Application/StepsAndPages';

@Module({
    namespaced: true
})
class Application extends VuexModule {

    public id = ""
    public type = ""
    public version = "";
    public steps = new Array<stepInfoType>()
    public lastUpdate = null
    public lastPrinted = null
    public lastFiled = null
    public currentStep = 1
    public allCompleted = false
    public spouseCompleted = false
    public childrenCompleted = false
    public landCompleted = false
    public vehiclesCompleted = false
    public bankAccountsCompleted = false
    public pensionCompleted = false
    public personalItemsCompleted = false
    public noWillNotifyStepRequired = false;
    public userType = ""
    public userName = ""
    public userId = ""
    public applicantName = ""
    public deceasedName = {"first":"(the person","middle":"who","last":"died)"};
    public deceasedDateOfDeath = null
    public deceasedDateOfDeathPlus4 = "(the Five-day survival rule)"
    public dateOfWill = null
    public relatedPeopleInfo = []
    public deceasedChildrenInfo = []
    public deceasedGrandChildrenInfo = []
    public belongingsInfo = {} as belongingsInfoType;
    public deceasedAliases = [];
    public applicationLocation = ""
    public scrollToLocationName = ""
    public requiredDocuments: string[] = []
    public spouseNames: string[] = []
    public packageNumber = ""
    public eFilingHubLink = ""
    public documentTypesJson = [];
    public supportingDocuments: supportingDocumentInfoType[] = [];
    public generatedForms: string[] = [];

    public stPgNo = {} as stepsAndPagesNumberInfoType;

    @Mutation
    public init(): void {
        this.allCompleted = false;
        this.spouseCompleted = false;
        this.childrenCompleted = false;
        this.landCompleted = false;
        this.vehiclesCompleted = false;
        this.bankAccountsCompleted = false;
        this.pensionCompleted = false;
        this.personalItemsCompleted = false;
        this.noWillNotifyStepRequired = false;
        this.currentStep = 0;
        this.type = "probate";
        this.deceasedName = {"first":"(the person","middle":"who","last":"died)"};
        this.belongingsInfo = {} as belongingsInfoType;
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
        s.name = "DECEASED"
        s.label = "Deceased";
        s.icon = "tomb-stone";
        s.lastUpdate = null;
        s.type = "getInformationStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        let p = {} as pageInfoType;
        p.key = "0";
        p.name = "InformationAboutDeceased";
        p.label = "Information About Deceased";
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        // Deceased Info STOP
        // Deceased Will START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "1";
        s.name = "WILL";
        s.label = "Deceased's Will";
        s.icon = "book";
        s.lastUpdate = null;
        s.type = "deceasedWillStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "DeceasedWill";
        p.label = "Deceased's Will";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        // Deceased Will STOP
        // Related People START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "2";
        s.name = "RELATIONS";
        s.label = "Related People";
        s.icon = "users";
        s.lastUpdate = null;
        s.type = "relatedPeopleStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "Spouse";
        p.label = "Spouse";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.name = "Children";
        p.label = "Children";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "2";
        p.name = "Parents";
        p.label = "Parents";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "3";
        p.name = "GrandChildren";
        p.label = "Grand Children";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "4";
        p.name = "GreatGrandChildren";
        p.label = "Great Grand Children";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "5";
        p.name = "Creditors";
        p.label = "Creditors";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        //Related People STOP
        //Applicant START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "3";
        s.name = "APPLICANT";
        s.label = "Applicant";
        s.icon = "user-tie";
        s.lastUpdate = null;
        s.type = "applicantStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "ApplicantInfo";
        p.label = "Information About Applicant";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.name = "ApplicantCitor";
        p.label = "Citor";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "2";
        p.name = "ApplicantService";
        p.label = "Applicant Service";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);
        
        //Applicant STOP
        // Notify START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "4";
        s.name = "NOTIFY";
        s.label = "Notify";
        s.icon = "envelope-open-text";
        s.lastUpdate = null;
        s.type = "notifyStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "ReviewYourAnswers";
        p.label = "Review Your Answers";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.name = "TellPeople";
        p.label = "Tell People You Are Applying";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "2";
        p.name = "PreviewP1";
        p.label = "Preview P1";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "3";
        p.name = "NotifyPeople";
        p.label = "Notify People";       
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "4";
        p.name = "PreviewP9";
        p.label = "Preview P9";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        //Notify STOP
        //Deceased's Belongings START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "5";
        s.name = "BELONGINGS";
        s.label = "Deceased's Belongings";
        s.icon = "coins";
        s.lastUpdate = null;
        s.type = "belongingsStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "LandBuildings";
        p.label = "Land and Buildings";        
        p.active = true;
        p.progress = 1;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.name = "Vehicles";
        p.label = "Vehicles";       
        p.active = false;
        p.progress = 1;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "2";
        p.name = "BankAccounts";
        p.label = "Bank Accounts";        
        p.active = false;
        p.progress = 1;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "3";
        p.name = "PensionsInsurance";
        p.label = "Pensions and Insurance";        
        p.active = false;
        p.progress = 1;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "4";
        p.name = "PersonalItems";
        p.label = "Personal Items";        
        p.active = false;
        p.progress = 1;
        s.pages.push(p);

        this.steps.push(s);

        //Belongings STOP
        //No Will Notify START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "6";
        s.name = "NOWILL";
        s.label = "No Will Notification";
        s.icon = "envelope-open-text";
        s.lastUpdate = null;
        s.type = "noWillNotifyStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "NoWillNotification";
        p.label = "No Will Notification";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        //No Will Notify STOP
        //Overview START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "7";
        s.name = "OVERVIEW";
        s.label = "Overview";
        s.icon = "file-lines";
        s.lastUpdate = null;
        s.type = "overviewStep";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "WillSearchCheck";
        p.label = "Will Search Check";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.name = "FinalizeAssetValues";
        p.label = "Finalize Asset Values";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        //Overview STOP
        //Review START
        s = {} as stepInfoType;
        
        s.active = false;
        s.id = "8";
        s.name = "REVIEW";
        s.label = "Review";
        s.icon = "file-circle-check";
        s.lastUpdate = null;
        s.type = "review";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "ReviewYourAnswers";
        p.label = "Review Your Answers";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        //Review STOP
        //Submit START
        s = {} as stepInfoType;
        
        s.active = false;        
        s.id = "9";
        s.name = "SUBMIT";
        s.label = "File";
        s.icon = "paper-plane";
        s.lastUpdate = null;
        s.type = "submit";
        s.pages = new Array<pageInfoType>();
        s.currentPage = 0;

        p = {} as pageInfoType;
        p.key = "0";
        p.name = "FilingOptions";
        p.label = "Filing Options";        
        p.active = true;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "1";
        p.name = "ReviewAndPrint";
        p.label = "Review and Print";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "2";
        p.name = "ReviewAndSave";
        p.label = "Review and Save";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "3";
        p.name = "ReviewAndSubmit";
        p.label = "Review and Submit";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        p = {} as pageInfoType;
        p.key = "4";
        p.name = "NextSteps";
        p.label = "Next Steps";        
        p.active = false;
        p.progress = 0;
        s.pages.push(p);

        this.steps.push(s);

        //console.log(this.steps)
        //Submit STOP

    }
    @Action
    public UpdateInit(newVersion: string) {
        this.context.commit("init");
        this.context.commit("setVersion", newVersion)
        this.context.dispatch("UpdateStPgNo");
    }

    @Mutation
    public setVersion(version: string): void {
        this.version = version;
    }
    @Action
    public UpdateVersion(newVersion: string) {
        this.context.commit("setVersion", newVersion);
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
    public setCurrentStep(currentStep): void {
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
    public setUserName(userName): void {
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
    public setStPgNo(stPgNo): void {
        this.stPgNo = stPgNo;
    }
    @Action
    public UpdateStPgNo(newStPgNo) {
        const stepsAndPagesNumber = {DECEASED: {}, WILL:{}, RELATIONS: {}, APPLICANT: {}, NOTIFY: {}, 
            BELONGINGS: {}, NOWILL: {}, OVERVIEW: {}, REVIEW: {}, SUBMIT: {}
        } as stepsAndPagesNumberInfoType;
        const steps = this.steps
        for(const step of steps){
            stepsAndPagesNumber[step.name]._StepNo = Number(step.id)           
            for(const page of step.pages){
                stepsAndPagesNumber[step.name][page.name] = Number(page.key)
            }
        }
        this.context.commit("setStPgNo", stepsAndPagesNumber);
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
        step.result = { ...step.result, ...data };
    }
    @Action
    public UpdateStepResultData({ step, data }) {
        this.context.commit("setScrollToLocationName", "");
        console.log(step) //TODO REMOVE
        console.log(data) //TODO REMOVE
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
    public setSpouseCompleted(spouseCompleted): void {
        this.spouseCompleted = spouseCompleted;
    }
    @Action
    public UpdateSpouseCompleted(newSpouseCompleted) {
        this.context.commit("setSpouseCompleted", newSpouseCompleted);
    }

    @Mutation
    public setChildrenCompleted(childrenCompleted): void {
        this.childrenCompleted = childrenCompleted;
    }
    @Action
    public UpdateChildrenCompleted(newChildrenCompleted) {
        this.context.commit("setChildrenCompleted", newChildrenCompleted);
    }

    @Mutation
    public setLandCompleted(landCompleted): void {
        this.landCompleted = landCompleted;
    }
    @Action
    public UpdateLandCompleted(newLandCompleted) {
        this.context.commit("setLandCompleted", newLandCompleted);
    }

    @Mutation
    public setVehiclesCompleted(vehiclesCompleted): void {
        this.vehiclesCompleted = vehiclesCompleted;
    }
    @Action
    public UpdateVehiclesCompleted(newVehiclesCompleted) {
        this.context.commit("setVehiclesCompleted", newVehiclesCompleted);
    }

    @Mutation
    public setBankAccountsCompleted(bankAccountsCompleted): void {
        this.bankAccountsCompleted = bankAccountsCompleted;
    }
    @Action
    public UpdateBankAccountsCompleted(newBankAccountsCompleted) {
        this.context.commit("setBankAccountsCompleted", newBankAccountsCompleted);
    }

    @Mutation
    public setPensionCompleted(pensionCompleted): void {
        this.pensionCompleted = pensionCompleted;
    }
    @Action
    public UpdatePensionCompleted(newPensionCompleted) {
        this.context.commit("setPensionCompleted", newPensionCompleted);
    }

    @Mutation
    public setPersonalItemsCompleted(personalItemsCompleted): void {
        this.personalItemsCompleted = personalItemsCompleted;
    }
    @Action
    public UpdatePersonalItemsCompleted(newPersonalItemsCompleted) {
        this.context.commit("setPersonalItemsCompleted", newPersonalItemsCompleted);
    }

    @Mutation
    public setNoWillNotifyStepRequired(noWillNotifyStepRequired): void {
        this.noWillNotifyStepRequired = noWillNotifyStepRequired;
    }
    @Action
    public UpdateNoWillNotifyStepRequired(newNoWillNotifyStepRequired) {
        this.context.commit("setNoWillNotifyStepRequired", newNoWillNotifyStepRequired);
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
    public setDeceasedName(deceasedName): void {
        this.deceasedName = deceasedName;
    }
    @Action
    public UpdateDeceasedName(newDeceasedName) {
        this.context.commit("setDeceasedName", newDeceasedName);
    }

    @Mutation
    public setDeceasedDateOfDeath(deceasedDateOfDeath): void {
        this.deceasedDateOfDeath = deceasedDateOfDeath;
    }
    @Action
    public UpdateDeceasedDateOfDeath(newDeceasedDateOfDeath) {
        this.context.commit("setDeceasedDateOfDeath", newDeceasedDateOfDeath);
    }

    @Mutation
    public setdeceasedDateOfDeathPlus4(deceasedDateOfDeathPlus4): void {
        this.deceasedDateOfDeathPlus4 = deceasedDateOfDeathPlus4;
    }
    @Action
    public UpdatedeceasedDateOfDeathPlus4(newdeceasedDateOfDeathPlus4) {
        this.context.commit("setdeceasedDateOfDeathPlus4", newdeceasedDateOfDeathPlus4);
    }

    @Mutation
    public setSpouseNames(spouseNames): void {
        this.spouseNames = spouseNames;
    }
    @Action
    public UpdateSpouseNames(newSpouseNames) {
        this.context.commit("setSpouseNames", newSpouseNames);
    }

    @Mutation
    public setDateOfWill(dateOfWill): void {
        this.dateOfWill = dateOfWill;
    }
    @Action
    public UpdateDateOfWill(newDateOfWill) {
        this.context.commit("setDateOfWill", newDateOfWill);
    }

    @Mutation
    public setDeceasedChildrenInfo(deceasedChildrenInfo): void {
        this.deceasedChildrenInfo = deceasedChildrenInfo;
    }
    @Action
    public UpdateDeceasedChildrenInfo(newDeceasedChildrenInfo) {
        this.context.commit("setDeceasedChildrenInfo", newDeceasedChildrenInfo);
    }

    @Mutation
    public setRelatedPeopleInfo(relatedPeopleInfo): void {
        this.relatedPeopleInfo = relatedPeopleInfo;
    }
    @Action
    public UpdateRelatedPeopleInfo(newRelatedPeopleInfo) {
        this.context.commit("setRelatedPeopleInfo", newRelatedPeopleInfo);
    }

    @Mutation
    public setBelongingsInfo(belongingsInfo: belongingsInfoType): void {
        this.belongingsInfo = belongingsInfo;
    }
    @Action
    public UpdateBelongingsInfo(newBelongingsInfo: belongingsInfoType) {
        this.context.commit("setBelongingsInfo", newBelongingsInfo);
    }

    @Mutation
    public setDeceasedGrandChildrenInfo(deceasedGrandChildrenInfo): void {
        this.deceasedGrandChildrenInfo = deceasedGrandChildrenInfo;
    }
    @Action
    public UpdateDeceasedGrandChildrenInfo(newDeceasedGrandChildrenInfo) {
        this.context.commit("setDeceasedGrandChildrenInfo", newDeceasedGrandChildrenInfo);
    }

    @Mutation
    public setDeceasedAliases(deceasedAliases): void {
        this.deceasedAliases = deceasedAliases;
    }
    @Action
    public UpdateDeceasedAliases(newDeceasedAliases) {
        this.context.commit("setDeceasedAliases", newDeceasedAliases);
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
    public setSupportingDocuments(supportingDocuments): void {
        this.supportingDocuments = supportingDocuments;
    }
    @Action
    public UpdateSupportingDocuments(newSupportingDocuments) {
        this.context.commit("setSupportingDocuments", newSupportingDocuments);
    }

    @Mutation
    public setDocumentTypesJson(documentTypesJson): void {
        this.documentTypesJson = documentTypesJson;
    }
    @Action
    public UpdateDocumentTypesJson(newDocumentTypesJson) {
        this.context.commit("setDocumentTypesJson", newDocumentTypesJson);
    }

    @Mutation
    public setGeneratedForms(generatedForms): void {
        this.generatedForms = generatedForms;
    }
    @Action
    public UpdateGeneratedForms(newGeneratedForms) {
        this.context.commit("setGeneratedForms", newGeneratedForms);
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
        this.deceasedName = application.deceasedName;
        this.deceasedDateOfDeath = application.deceasedDateOfDeath;
        this.relatedPeopleInfo = [];
        this.belongingsInfo = {land: [], vehicle:[], bankAccount:[], pension:[], personalItem:[]};
        if (this.deceasedDateOfDeath) {
            this.deceasedDateOfDeathPlus4 = Vue.filter('beautify-full-date')(moment(this.deceasedDateOfDeath, "YYYY-MM-DD").add(4, 'days').format());
        }
        this.dateOfWill = application.dateOfWill;
        // console.log(this.steps[1]);
        console.log(this.steps[2]); 

        this.applicationLocation = application.applicationLocation;
        this.version = application.version;
    }
    @Action
    public UpdateCurrentApplication(newApplication) {
        this.context.commit("setCurrentApplication", newApplication);
        // this.context.commit("loadSpouseInfo");
        // this.context.commit("loadChildrenInfo")
        // this.context.commit("loadGrandChildrenInfo");
        // this.context.commit("loadNotifyInfo");
        // // this.context.commit("loadBelongingsInfo");
        // this.context.commit("loadLandInfo");
        // this.context.commit("loadVehicleInfo");
        // this.context.commit("loadBankAccountInfo");
        // this.context.commit("loadPensionInfo");
        // this.context.commit("loadPersonalItemInfo");


    }
    // @Mutation
    // public loadSpouseInfo(): void{
    //     if(this.steps[2].result && this.steps[2].result["spouseSurvey"]){
    //         const spouseSurvey = this.steps[2].result["spouseSurvey"];
    //         const spouseInfo = (this.steps[2].result.spouseExists=='y' && spouseSurvey.data)? spouseSurvey.data:[];    
    //         for (const spouse of spouseInfo) {
    //             if (spouse.spouseIsAlive == "y") {
    //                 this.relatedPeopleInfo.push({relationShip: "spouse",name:spouse.spouseName, isAlive:spouse.spouseIsAlive, info: spouse});
    //             }                       
    //         }
            
    //         if (spouseSurvey.data && this.steps[2].result.spouseExists == "n") {
    //             this.spouseCompleted = true;
    //         } else if (this.steps[2].result.spouseCompleted && this.steps[2].result.spouseCompleted == "y") {
    //             this.spouseCompleted = true;
    //         } else {
    //             this.spouseCompleted = false;
    //         }
    //     } 
    // }    
    // @Mutation
    // public loadChildrenInfo(): void{
    //     if(this.steps[2].result && this.steps[2].result["childrenSurvey"]){
    //         const childrenSurvey = this.steps[2].result && this.steps[2].result["childrenSurvey"];
    //         const childrenInfo = (this.steps[2].result.childExists=='y'&& childrenSurvey.data)? childrenSurvey.data:[]
    //         const deceasedChildren = [];        
    //         for (const child of childrenInfo) {
    //             if (child.childIsAlive == "n"           && 
    //                 child.childDied5DaysAfter == "n"    &&
    //                 child.childName) {
    //                     deceasedChildren.push(Vue.filter('getFullName')(child.childName));                    
    //             } else if (child.childIsAlive == "y") {
    //                 this.relatedPeopleInfo.push({relationShip: "child", name:child.childName, isAlive:child.childIsAlive, info: child});
    //             }                       
    //         }
    //         if (deceasedChildren.length > 0) {
    //             this.deceasedChildrenInfo = deceasedChildren;        
    //         } else {
    //             this.deceasedChildrenInfo = [];
    //         }

    //         if (this.steps[2].result.childExists) {
    //             if (this.steps[2].result.childExists == "n") {
    //                 this.childrenCompleted = true;
    //             }else if (this.steps[2].result.childCompleted && this.steps[2].result.childCompleted == "y") {
    //                 this.childrenCompleted = true;
    //             } else {
    //                 this.childrenCompleted = false;
    //             }
    //         }
    //     } 
    // }       
    // @Mutation
    // public loadGrandChildrenInfo(): void{
    //     if(this.steps[2].result && this.steps[2].result["grandChildrenSurvey"]){
    //         const deceasedGrandChildren = []; 
    //         const grandChildrenSurvey = this.steps[2].result["grandChildrenSurvey"];
    //         console.log(grandChildrenSurvey)
            
    //         for(const deceasedChild in this.deceasedChildrenInfo){
    //             const panel =  "grandchildPanel["+deceasedChild+"]";
    //             console.log(grandChildrenSurvey.data[panel])
    //             for (const grandChild of grandChildrenSurvey.data[panel]) {
    //                 if (grandChild.grandchildIsAlive == "n"           && 
    //                     grandChild.grandchildDied5DaysAfter == "n"    &&
    //                     grandChild.grandchildName) {
    //                     deceasedGrandChildren.push(Vue.filter('getFullName')(grandChild.grandchildName));                    
    //                 }                      
    //             }
    //         }
    //         if (deceasedGrandChildren.length > 0) {
    //             this.deceasedGrandChildrenInfo = deceasedGrandChildren;        
    //         } else {
    //             this.deceasedGrandChildrenInfo = [];
    //         }
    //     }       
    //     console.log(this.deceasedGrandChildrenInfo)
    // }

    // @Mutation
    // public loadLandInfo(): void{
    //     console.log(this.steps[5].result)
    //     if(this.steps[5].result && this.steps[5].result["landSurvey"] && this.steps[5].result["landSurvey"].data){

    //         const landSurvey = this.steps[5].result["landSurvey"].data;
    //         if (landSurvey.landExists && landSurvey.landExists == "n") {
    //             this.landCompleted = true;
    //         }else if(landSurvey.landCompleted && landSurvey.landCompleted == "y") {
    //             this.landCompleted = true;
    //         }else{
    //             this.landCompleted = false;
    //         }

    //         this.belongingsInfo.land = [];

    //         const landInfo = (landSurvey.landExists && landSurvey.landExists == "y" && landSurvey.landInfoPanel)?landSurvey.landInfoPanel:[];
            
    //         for (const land of landInfo) {            
    //             this.belongingsInfo.land.push(land);                                   
    //         }
    //     }
    // }

    // @Mutation
    // public loadVehicleInfo(): void{        

    //     if(this.steps[5].result && this.steps[5].result["vehiclesSurvey"] && this.steps[5].result["vehiclesSurvey"].data){

    //         const vehiclesSurvey = this.steps[5].result["vehiclesSurvey"].data;
    //         if (vehiclesSurvey.vehicleExists && vehiclesSurvey.vehicleExists == "n") {
    //             this.vehiclesCompleted = true;
    //         }else{
    //             this.vehiclesCompleted = false;
    //         }

    //         this.belongingsInfo.vehicle = [];
    //         const vehicleInfo = (vehiclesSurvey.vehicleExists && vehiclesSurvey.vehicleExists == "y" && vehiclesSurvey.vehicleInfoPanel)?vehiclesSurvey.vehicleInfoPanel:[];
            
    //         for (const vehicle of vehicleInfo) {            
    //             this.belongingsInfo.vehicle.push(vehicle);                                   
    //         }
    //     }
    // }

    // @Mutation
    // public loadBankAccountInfo(): void{
    //     console.log(this.steps[5].result)       

    //     if(this.steps[5].result && this.steps[5].result["bankAccountsSurvey"] && this.steps[5].result["bankAccountsSurvey"].data){

    //         const bankAccountsSurvey = this.steps[5].result["bankAccountsSurvey"].data;
    //         if (bankAccountsSurvey.bankAccountExists && bankAccountsSurvey.bankAccountExists == "n") {
    //             this.bankAccountsCompleted = true;
    //         }else if(bankAccountsSurvey.bankAccountExists && 
    //                 bankAccountsSurvey.bankAccountExists == "y" &&
    //                 bankAccountsSurvey.banksCompleted && 
    //                 bankAccountsSurvey.banksCompleted == "y") {
    //                     this.bankAccountsCompleted = true;
    //         }else{
    //             this.bankAccountsCompleted = false;
    //         }

    //         this.belongingsInfo.bankAccount = [];
    //         this.deceasedAliases = [];
    //         const bankAccountInfo = (bankAccountsSurvey.bankAccountExists && bankAccountsSurvey.bankAccountExists == "y" && bankAccountsSurvey.bankAccountInfoPanel)?bankAccountsSurvey.bankAccountInfoPanel:[];
            
    //         for (const bankAccount of bankAccountInfo) {            
    //             this.belongingsInfo.bankAccount.push(bankAccount);
    //             if (bankAccount.bankNameMatch == 'n' && bankAccount.alias) {
    //                 this.deceasedAliases.push(bankAccount.alias);
    //             } 
    //         } 
    //     }
    // }

    // @Mutation
    // public loadPensionInfo(): void{       

    //     if(this.steps[5].result && this.steps[5].result["pensionSurvey"] && this.steps[5].result["pensionSurvey"].data){

    //         const pensionSurvey = this.steps[5].result["pensionSurvey"].data;

    //         if (pensionSurvey.payCPP && pensionSurvey.payCPP == "n" &&
    //             pensionSurvey.otherPensionExists && pensionSurvey.otherPensionExists == "n" &&
    //             pensionSurvey.lifeInsuranceExists && pensionSurvey.lifeInsuranceExists == "n") {
    //             this.pensionCompleted = true;
    //         }else{
    //             this.pensionCompleted = false;
    //         }

    //         this.belongingsInfo.pension = [];
    //         const pensionInfo = (pensionSurvey)?pensionSurvey:[];
    //         this.belongingsInfo.pension.push(pensionInfo);                
    //     }
    // }

    // @Mutation
    // public loadPersonalItemInfo(): void{
        
    //     if(this.steps[5].result && this.steps[5].result["personalItemsSurvey"] && this.steps[5].result["personalItemsSurvey"].data){

    //         const personalItemsSurvey = this.steps[5].result["personalItemsSurvey"].data;

    //         if (personalItemsSurvey.otherAssetsExists && personalItemsSurvey.otherAssetsExists == "n") {
    //             this.personalItemsCompleted = true;
    //         }else if(personalItemsSurvey.otherAssetsExists && 
    //             personalItemsSurvey.otherAssetsExists == "y" &&
    //             personalItemsSurvey.otherAssetsCompleted && 
    //             personalItemsSurvey.otherAssetsCompleted == "y") {
    //                 this.personalItemsCompleted = true;
    //         }else{
    //             this.personalItemsCompleted = false;
    //         }

    //         this.belongingsInfo.personalItem = [];
    //         const personalItemInfo = (personalItemsSurvey.otherAssetsExists && personalItemsSurvey.otherAssetsExists == "y")?personalItemsSurvey:[];
                            
    //         this.belongingsInfo.personalItem.push(personalItemInfo);  

    //     }
    // }
    // @Mutation
    // public loadNotifyInfo(): void{

    //     //console.log(this.steps[4].result["notifySurvey"].data)

    //     if(this.steps[4].result && this.steps[4].result["notifySurvey"]){
    //         const notifySurvey = this.steps[4].result["notifySurvey"].data;
            
    //         if (notifySurvey.p1EarlyNoWillOwe10k && 
    //             notifySurvey.p1EarlyNoWillOwe10k == "y") {
    //                 this.noWillNotifyStepRequired = true;
    //         } else {
    //             this.noWillNotifyStepRequired = false;
    //         }
    //     } 
    // } 


    get getPrevStepPage(): { prevStep: number; prevPage: number } {

        let prevStepPage: { prevStep: number; prevPage: number };    
        let sIndex = Number(this.currentStep);
        let pIndex = Number(this.steps[sIndex].currentPage) - 1;
    
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

        let nextStepPage: { nextStep: number; nextPage: number };    
        let sIndex = Number(this.currentStep);       
        let pIndex = Number(this.steps[sIndex].currentPage) + 1;
        
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

        return nextStepPage;
    }
}

export default Application