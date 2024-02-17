import { addressInfoType, nameInfoType, questionInfoType } from "@/types/Common";

export interface deceasedInfoDataInfoType {
    deceasedName: nameInfoType;
    deceasedDateOfDeath: string;
    deceasedAddress: addressInfoType;
    deceasedFirstNations: string;
    deceasedFirstNationsName?: string;
}
  
export interface deceasedInfoSurveyInfoType {
    data: deceasedInfoDataInfoType;
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
}