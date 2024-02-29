import { addressInfoType, questionInfoType } from "@/types/Common";

export interface applicantDataInfoType {
    applicantName?: string;
    applicantOccupation?: string;
    applicantOrdinaryAddress?: addressInfoType;
    applicantOrdinaryAddressReceiveMail?: string;
    applicantMailingAddress?: addressInfoType;
    applicantCited?: string;
    applicantCitedReviewCheckRelationsExist?: boolean;
    applicantCitedReviewCheckRelationsDontExist?: boolean;
    applicantCitorNewExists?: string;    
}
  
export interface applicantInfoSurveyInfoType {
    data: applicantDataInfoType;
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
}

export interface applicantCitorInfoType {
    applicantCitorName?: string;
    applicantCitorIsAlive?: string;
    applicantCitorIsAdult?: string;
    applicantCitorIsAdultNoExplanation?: boolean;
    applicantCitorIsAdultNoDOB?: string;
    applicantCitorIsAdultNoResidentialAddress?: addressInfoType;
    applicantCitorIsAdultNoResidentialReceiveMail?: string;
    applicantCitorIsAdultNoHasMailingAddress?: string;
    applicantCitorIsAdultNoMailingAddress?: addressInfoType;
    applicantCitorIsAdultNoEmail?: string;
    applicantCitorIsAdultNoEmailAddress?: string;
    applicantCitorIsAdultNoFax?: string;
    applicantCitorIsAdultNoFaxNumber?: string;
    applicantCitorHasGuardian?: string;    
    applicantCitorGuardianName?: string;
    applicantCitorGuardianResidentialAddress?: addressInfoType;
    applicantCitorGuardianResidentialReceiveMail?: string;
    applicantCitorGuardianHasMailingAddress?: string;
    applicantCitorGuardianMailingAddress?: addressInfoType;
    applicantCitorGuardianEmail?: string;
    applicantCitorGuardianEmailAddress?: string;
    applicantCitorGuardianFax?: string;
    applicantCitorGuardianFaxNumber?: string;
    applicantCitorIsCompetent?: string;
    applicantCitorIsCompetentNoExplanation?: boolean;
    applicantCitorIsCompetentNoDOB?: string;
    applicantCitorIsCompetentNoResidentialAddress?: addressInfoType;
    applicantCitorIsCompetentNoResidentialReceiveMail?: string;
    applicantCitorIsCompetentNoHasMailingAddress?: string;
    applicantCitorIsCompetentNoMailingAddress?: string;
    applicantCitorIsCompetentNoEmail?: string;
    applicantCitorIsCompetentNoEmailAddress?: string;
    applicantCitorIsCompetentNoFax?: string;
    applicantCitorIsCompetentNoFaxNumber?: string;
    applicantCitorHasNominee?: string;
    applicantCitorNomineeName?: string;
    applicantCitorNomineeFormal?: string;
    applicantCitorNomineeFormalNoExplanation?: boolean;
    applicantCitorNomineeFormalYesExplanation?: boolean;
    applicantCitorNomineeResidentialAddress?: addressInfoType;
    applicantCitorNomineeResidentialReceiveMail?: string;
    applicantCitorNomineeHasMailingAddress?: string;
    applicantCitorNomineeMailingAddress?: addressInfoType;
    applicantCitorNomineeEmail?: string;
    applicantCitorNomineeEmailAddress?: string;
    applicantCitorNomineeFax?: string;
    applicantCitorNomineeFaxNumber?: string;
    applicantCitorIsDeadExplanation?: boolean;   
    applicantCitorHasPersonalRep?: string;
    applicantCitorPersonalRepName?: string;
    id?: number;
  }
  
  export interface applicantCitorSurveyInfoType {
    data?: applicantCitorInfoType[];
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
  }

  export interface applicantServiceDataInfoType {    
    applicantHasLawyer?: string;    
    applicantServiceAddress?: addressInfoType;
    applicantServicePhone?: string;
    applicantServiceEmail?: string;
    applicantHasFax?: string;
    applicantServiceFax?: string;
    applicantCourthouse?: string;
}
  
export interface applicantServiceSurveyInfoType {
    data: applicantServiceDataInfoType;
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
}

