import { applicantSurveyInfoType } from "./Applicant";
import { childCommonSurveyInfoType } from "./Children";
import { deceasedInfoSurveyInfoType } from "./DeceasedInfo";
import { deceasedWillSurveyInfoType } from "./DeceasedWill";
import { spouseInfoSurveyInfoType } from "./Spouse";

export interface applicationInfoType {   
    id?: string;
    type: string;
    steps: stepInfoType[];
    lastUpdate: Date;
    currentStep: number;
    allCompleted: boolean;
    lastPrinted: Date;
    userType: string;
    userName: string;
    userId: string;
    applicantName: string;
    deceasedName: string;
    deceasedDateOfDeath: string;
    deceasedDateOfDeathPlus4: string;
    dateOfWill: string;
    deceasedChildrenInfo: [];
    deceasedGrandChildrenInfo: [];
    applicationLocation: string;
}

export interface stepInfoType {
    id?: string;
    name?: string;
    type: string;
    label: string;
    icon: string;
    result?: resultInfoType;    
    pages?: pageInfoType[];
    currentPage?: number | string;
    active: boolean;
    lastUpdate?: Date | null;
  }

  export interface pageInfoType {
    key: string;
    label: string;
    progress: number;
    active: boolean;
    clickable: boolean;
  }

  export interface stepResultInfoType {
    step: stepInfoType;
    data: any;
  }

  export interface belongingsInfoType {
    land: any[];
    vehicle: any[];
    bankAccount: any[];
    pension: any[];
    personalItem: any[];
  }

  export interface resultInfoType {

    //__Step 1 Deceased
    deceasedInfoSurvey?: deceasedInfoSurveyInfoType;

    //__Step 2 Will
    deceasedWillSurvey?: deceasedWillSurveyInfoType;

    //__Step 3 Related People
    spouseExists?: string;
    spouseSurvey?: spouseInfoSurveyInfoType;
    spouseCompleted?: string;
    childExists?: string;
    childrenSurvey?: childCommonSurveyInfoType;
    childCompleted?: string;
    applicantSurvey?: applicantSurveyInfoType;
  }