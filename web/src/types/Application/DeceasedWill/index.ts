import { nameInfoType, questionInfoType } from "@/types/Common";

export interface deceasedWillDataInfoType {
    willCheck: string;
    willGrantExists?: string;
    willExists?: string;
    willOtherDocExists?: string;
    willOtherDocRecognize?: string;
    willOtherDocRecognizeNoReasons?: willOtherDocRecognizeNoReasonsInfoDataType[];
}
  
export interface deceasedWillSurveyInfoType {
    data: deceasedWillDataInfoType;
    questions?: questionInfoType[];
    pageName?: string;
    currentStep?: number | string;
    currentPage?: number | string;
}

export interface willOtherDocRecognizeNoReasonsInfoDataType {
    'Column 1'?: string;
    'Column 3'?: string;
    reason?: string;
    reasonComment?: string;
    id?: number;
}