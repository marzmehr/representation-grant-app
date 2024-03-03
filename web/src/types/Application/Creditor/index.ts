import { addressInfoType, questionInfoType } from "@/types/Common";

export interface creditorPersonInfoType {
    creditorPersonName?: string;
    creditorPersonIsAlive?: string;
    creditorPersonIsAdult?: string;
    creditorPersonIsAdultNoExplanation?: boolean;
    creditorPersonIsAdultNoDOB?: string;
    creditorPersonIsAdultNoResidentialAddress?: addressInfoType;
    creditorPersonIsAdultNoResidentialReceiveMail?: string;
    creditorPersonIsAdultNoHasMailingAddress?: string;
    creditorPersonIsAdultNoMailingAddress?: addressInfoType;
    creditorPersonIsAdultNoEmail?: string;
    creditorPersonIsAdultNoEmailAddress?: string;
    creditorPersonIsAdultNoFax?: string;
    creditorPersonIsAdultNoFaxNumber?: string;
    creditorPersonHasGuardian?: string;
    creditorPersonGuardianName?: string;
    creditorPersonGuardianResidentialAddress?: addressInfoType;
    creditorPersonGuardianResidentialReceiveMail?: string;
    creditorPersonGuardianHasMailingAddress?: string;
    creditorPersonGuardianMailingAddress?: addressInfoType;
    creditorPersonGuardianEmail?: string;
    creditorPersonGuardianEmailAddress?: string;
    creditorPersonGuardianFax?: string;
    creditorPersonGuardianFaxNumber?: string;
    creditorPersonIsCompetent?: string;
    creditorPersonIsCompetentNoExplanation?: boolean;
    creditorPersonIsCompetentNoDOB?: string;
    creditorPersonIsCompetentNoResidentialAddress?: addressInfoType;
    creditorPersonIsCompetentNoResidentialReceiveMail?: string;
    creditorPersonIsCompetentNoHasMailingAddress?: string;
    creditorPersonIsCompetentNoMailingAddress?: string;
    creditorPersonIsCompetentNoEmail?: string;
    creditorPersonIsCompetentNoEmailAddress?: string;
    creditorPersonIsCompetentNoFax?: string;
    creditorPersonIsCompetentNoFaxNumber?: string;
    creditorPersonHasNominee?: string;
    creditorPersonNomineeName?: string;
    creditorPersonNomineeFormal?: string;
    creditorPersonNomineeFormalNoExplanation?: boolean;
    creditorPersonNomineeFormalYesExplanation?: boolean;
    creditorPersonNomineeResidentialAddress?: addressInfoType;
    creditorPersonNomineeResidentialReceiveMail?: string;
    creditorPersonNomineeHasMailingAddress?: string;
    creditorPersonNomineeMailingAddress?: addressInfoType;
    creditorPersonNomineeEmail?: string;
    creditorPersonNomineeEmailAddress?: string;
    creditorPersonNomineeFax?: string;
    creditorPersonNomineeFaxNumber?: string;
    creditorPersonIsDeadExplanation?: boolean;
    creditorPersonHasPersonalRep?: string;
    creditorPersonPersonalRepName?: string;
    id?: number;
  }

  export interface creditorOrgInfoType {
    creditorOrganizationName?: string;
    id?: number;
  }
  
  export interface creditorsSurveyInfoType {
    data?: creditorPersonInfoType[];
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
  }

  export interface creditorOrgsSurveyInfoType {
    data?: creditorOrgInfoType[];
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
  }