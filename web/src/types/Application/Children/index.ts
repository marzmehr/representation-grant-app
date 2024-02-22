import { addressInfoType, contactInfoType, nameInfoType, questionInfoType } from "@/types/Common";

export interface childDetailsDataInfoType {
    childName?: string;
    childIsAlive?: string;
    childIsAdult?: string;
    childIsAdultNoExplanation?: boolean;
    childIsAdultNoDOB?: string;
    childIsAdultNoResidentialAddress?: addressInfoType;
    childIsAdultNoResidentialReceiveMail?: string;
    childIsAdultNoHasMailingAddress?: string;
    childIsAdultNoMailingAddress?: addressInfoType;
    childIsAdultNoEmail?: string;
    childIsAdultNoEmailAddress?: string;
    childIsAdultNoFax?: string;
    childIsAdultNoFaxNumber?: string;
    childHasGuardian?: string;
    childGuardianName?: string;
    childGuardianResidentialAddress?: addressInfoType;
    childGuardianResidentialReceiveMail?: string;
    childGuardianHasMailingAddress?: string;
    childGuardianMailingAddress?: addressInfoType;
    childGuardianEmail?: string;
    childGuardianEmailAddress?: string;
    childGuardianFax?: string;
    childGuardianFaxNumber?: string;
    childIsCompetent?: string;
    childIsCompetentNoExplanation?: boolean;
    childIsCompetentNoDOB?: string;
    childIsCompetentNoResidentialAddress?: addressInfoType;
    childIsCompetentNoResidentialReceiveMail?: string;
    childIsCompetentNoHasMailingAddress?: string;
    childIsCompetentNoMailingAddress?: addressInfoType;
    childIsCompetentNoEmail?: string;
    childIsCompetentNoEmailAddress?: string;
    childIsCompetentNoFax?: string;
    childIsCompetentNoFaxNumber?: string;
    childHasNominee?: string;
    childNomineeName?: string;
    childNomineeFormal?: string;
    childNomineeFormalNoExplanation?: boolean;
    childNomineeFormalYesExplanation?: boolean;
    childNomineeResidentialAddress?: addressInfoType;
    childNomineeResidentialReceiveMail?: string;
    childNomineeHasMailingAddress?: string;
    childNomineeMailingAddress?: addressInfoType;
    childNomineeEmail?: string;
    childNomineeEmailAddress?: string;
    childNomineeFax?: string;
    childNomineeFaxNumber?: string;
    childDiedAfter?: string;
    childDiedAfterNoGchildExists?: string;
    childHasPersonalRep?: string;
    childPersonalRepName?: string;   
    id?: number;
}
  
export interface childCommonSurveyInfoType {
    data: childDetailsDataInfoType[];
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
}