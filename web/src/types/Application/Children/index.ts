import { addressInfoType, contactInfoType, nameInfoType, questionInfoType } from "@/types/Common";

export interface childDetailsDataInfoType {
    childName: nameInfoType;
    childIsAlive: string;
    childDied5DaysAfter?: string;
    knowDob: string;
    lawyer?: string;
    dob?: string;
    opRelation?: string;
    livedTogether?: string;
    dateOfLivedTogether?: string;
    married?: string;
    dateOfMarriage?: string;
    separated?: string;
    dateSeparated?: string;
    address: addressInfoType;
    contactInfo: contactInfoType;
    id?: number;
    
}
  
export interface childCommonSurveyInfoType {
    data: childDetailsDataInfoType[];
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
}