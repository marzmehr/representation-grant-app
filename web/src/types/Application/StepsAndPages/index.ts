//_______________________Migration_Rule________________________________
//  1. Step names (s.name) should not have duplicates.
//  2. Page names and page results must match: 
//      - assume  page name (p.name) is `PageName`
//      - then survey name must be `pageNameSurvey` first letter is lowercase and add Survey at the end. 
//_____________________________________________________________________

export interface stepsAndPagesNumberInfoType{
    DECEASED: DECEASEDstPgTypes;
    WILL: WILLstPgTypes;
    RELATED: RELATEDstPgTypes;    
    SUBMIT: SUBMITstPgTypes;
}
 
export interface DECEASEDstPgTypes{
    _StepNo: number;
    DeceasedInfo: number;
}

export interface WILLstPgTypes{
    _StepNo: number;
    DeceasedWill: number;
}

export interface RELATEDstPgTypes{
    _StepNo: number;
    Spouse: number;
    Children: number;
    Creditors: number;
    Applicant: number;
}

export interface SUBMITstPgTypes{
    _StepNo: number;

    FilingOptions: number;
    ReviewAndPrint: number;
    ReviewAndSave: number;
    ReviewAndSubmit: number;
    OtherFile: number;
    ResubmitAttachments: number;
    NextSteps: number;    
}