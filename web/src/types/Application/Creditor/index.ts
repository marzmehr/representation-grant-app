import { addressInfoType, questionInfoType } from "@/types/Common";

export interface creditorInfoType {
    creditorName?: string;
    creditorIsAlive?: string;
    creditorIsAdult?: string;
    creditorIsAdultNoExplanation?: boolean;
    creditorIsAdultNoDOB?: string;
    creditorIsAdultNoResidentialAddress?: addressInfoType;
    creditorIsAdultNoResidentialReceiveMail?: string;
    creditorIsAdultNoHasMailingAddress?: string;
    creditorIsAdultNoMailingAddress?: addressInfoType;
    creditorIsAdultNoEmail?: string;
    creditorIsAdultNoEmailAddress?: string;
    creditorIsAdultNoFax?: string;
    creditorIsAdultNoFaxNumber?: string;
    creditorHasGuardian?: string;    
    creditorGuardianName?: string;
    creditorGuardianResidentialAddress?: addressInfoType;
    creditorGuardianResidentialReceiveMail?: string;
    creditorGuardianHasMailingAddress?: string;
    creditorGuardianMailingAddress?: addressInfoType;
    creditorGuardianEmail?: string;
    creditorGuardianEmailAddress?: string;
    creditorGuardianFax?: string;
    creditorGuardianFaxNumber?: string;
    creditorIsCompetent?: string;
    creditorIsCompetentNoExplanation?: boolean;
    creditorIsCompetentNoDOB?: string;
    creditorIsCompetentNoResidentialAddress?: addressInfoType;
    creditorIsCompetentNoResidentialReceiveMail?: string;
    creditorIsCompetentNoHasMailingAddress?: string;
    creditorIsCompetentNoMailingAddress?: string;
    creditorIsCompetentNoEmail?: string;
    creditorIsCompetentNoEmailAddress?: string;
    creditorIsCompetentNoFax?: string;
    creditorIsCompetentNoFaxNumber?: string;
    creditorHasNominee?: string;
    creditorNomineeName?: string;
    creditorNomineeFormal?: string;
    creditorNomineeFormalNoExplanation?: boolean;
    creditorNomineeFormalYesExplanation?: boolean;
    creditorNomineeResidentialAddress?: addressInfoType;
    creditorNomineeResidentialReceiveMail?: string;
    creditorNomineeHasMailingAddress?: string;
    creditorNomineeMailingAddress?: addressInfoType;
    creditorNomineeEmail?: string;
    creditorNomineeEmailAddress?: string;
    creditorNomineeFax?: string;
    creditorNomineeFaxNumber?: string;
    creditorDied5DaysAfter?: string;
    creditorHasPersonalRep?: string;
    creditorPersonalRepName?: string;
    id?: number;
  }
  
  export interface creditorInfoSurveyInfoType {
    data?: creditorInfoType[];
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
  }
