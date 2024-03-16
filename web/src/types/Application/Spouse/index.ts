import { addressInfoType, questionInfoType } from "@/types/Common";

export interface spouseInfoType {
    spouseName?: string;
    spouseIsAlive?: string;
    spouseIsAdult?: string;
    spouseIsAdultNoExplanation?: boolean;
    spouseIsAdultNoDOB?: string;
    spouseIsAdultNoResidentialAddress?: addressInfoType;
    spouseIsAdultNoResidentialReceiveMail?: string;
    spouseIsAdultNoHasMailingAddress?: string;
    spouseIsAdultNoMailingAddress?: addressInfoType;
    spouseIsAdultNoEmail?: string;
    spouseIsAdultNoEmailAddress?: string;
    spouseIsAdultNoFax?: string;
    spouseIsAdultNoFaxNumber?: string;
    spouseHasGuardian?: string;    
    spouseGuardianName?: string;
    spouseGuardianResidentialAddress?: addressInfoType;
    spouseGuardianResidentialReceiveMail?: string;
    spouseGuardianHasMailingAddress?: string;
    spouseGuardianMailingAddress?: addressInfoType;
    spouseGuardianEmail?: string;
    spouseGuardianEmailAddress?: string;
    spouseGuardianFax?: string;
    spouseGuardianFaxNumber?: string;
    spouseIsCompetent?: string;
    spouseIsCompetentNoExplanation?: boolean;
    spouseIsCompetentNoDOB?: string;
    spouseIsCompetentNoResidentialAddress?: addressInfoType;
    spouseIsCompetentNoResidentialReceiveMail?: string;
    spouseIsCompetentNoHasMailingAddress?: string;
    spouseIsCompetentNoMailingAddress?: string;
    spouseIsCompetentNoEmail?: string;
    spouseIsCompetentNoEmailAddress?: string;
    spouseIsCompetentNoFax?: string;
    spouseIsCompetentNoFaxNumber?: string;
    spouseHasNominee?: string;
    spouseNomineeName?: string;
    spouseNomineeFormal?: string;
    spouseNomineeFormalNoExplanation?: boolean;
    spouseNomineeFormalYesExplanation?: boolean;
    spouseNomineeResidentialAddress?: addressInfoType;
    spouseNomineeResidentialReceiveMail?: string;
    spouseNomineeHasMailingAddress?: string;
    spouseNomineeMailingAddress?: addressInfoType;
    spouseNomineeEmail?: string;
    spouseNomineeEmailAddress?: string;
    spouseNomineeFax?: string;
    spouseNomineeFaxNumber?: string;
    spouseDied5DaysAfter?: string;
    spouseHasPersonalRep?: string;
    spousePersonalRepName?: string;
    id?: number;
  }
  
  export interface spouseInfoSurveyInfoType {
    data?: spouseInfoType[];
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
  }
