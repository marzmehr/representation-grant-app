import { applicantCitorInfoType } from "@/types/Application/Applicant";
import { childDetailsDataInfoType } from "@/types/Application/Children";
import { creditorOrgInfoType, creditorPersonInfoType } from "@/types/Application/Creditor";
import { spouseInfoType } from "@/types/Application/Spouse";


export function getRelatedSpouses(step, includePrinciple, includeDescription){
    const related = [];
    let spouseList: spouseInfoType[] = [];
    
    if (step.result){
        const resultInfo = step.result;
        if(resultInfo.spouseExists && resultInfo.spouseExists == 'Yes'){
            spouseList = step.result.spouseSurvey?.data?step.result.spouseSurvey.data:[];
        }
    }       

    for (const spouse of spouseList){

        // Alive and adult and competent

        if(spouse.spouseIsAlive == 'y' && spouse.spouseIsAdult == 'y' && spouse.spouseIsCompetent == 'y'){
            related.push(spouse.spouseName);
        }
        
        // Alive and minor

        if(spouse.spouseIsAlive == 'y' && spouse.spouseIsAdult == 'n'){

            if(spouse.spouseHasGuardian == 'y' && spouse.spouseGuardianName?.length>0){

                if(includeDescription)
                    related.push(spouse.spouseGuardianName + ' ('+ spouse.spouseName + "'s Guardian)");
                else
                    related.push(spouse.spouseGuardianName);
                if(includePrinciple){
                    related.push(spouse.spouseName);
                }
            } else {
                related.push(spouse.spouseName);
            }
        }        

        //Alive and adult and incompetent

        if(spouse.spouseIsAlive == 'y' && spouse.spouseIsAdult == 'y' && spouse.spouseIsCompetent == 'n'){

            if(spouse.spouseHasNominee == 'y' && spouse.spouseNomineeName?.length>0){

                if(includeDescription)
                    related.push(spouse.spouseNomineeName + ' ('+ spouse.spouseName + "'s Nominee)");
                else
                    related.push(spouse.spouseNomineeName);

                if(spouse.spouseNomineeFormal == 'n' || (spouse.spouseNomineeFormal == 'y' && includePrinciple)){
                    related.push(spouse.spouseName);
                }
            } else if(spouse.spouseHasNominee == 'n'){
                related.push(spouse.spouseName);
            }
        } 
        //Deceased after

        if(spouse.spouseIsAlive == 'n'){

            if(spouse.spouseDied5DaysAfter == 'y'){

                if(spouse.spouseHasPersonalRep == 'y' && spouse.spousePersonalRepName?.length>0){

                    if(includePrinciple){
                        related.push(spouse.spouseName);
                    }           

                    if(includeDescription)
                        related.push(spouse.spousePersonalRepName + ' ('+ spouse.spouseName + "'s Personal Representative)");
                    else
                        related.push(spouse.spousePersonalRepName);
                } else {
                    related.push(spouse.spouseName);
                }

            } else if(spouse.spouseDied5DaysAfter == 'n' && includePrinciple){
                related.push(spouse.spouseName);
            }           
        }

    }
    return related;
}


export function getRelatedChildren(step, includePrinciple, includeDescription){
    const related = [];
    let childList: childDetailsDataInfoType[] = [];

    if (step.result){
        const resultInfo = step.result;
        if(resultInfo.childExists && resultInfo.childExists == 'Yes'){
            childList = step.result.childrenSurvey?.data?step.result.childrenSurvey.data:[];
        }
    }

    for (const child of childList){

        // Alive and adult and competent

        if(child.childIsAlive == 'y' && child.childIsAdult == 'y' && child.childIsCompetent == 'y'){
            related.push(child.childName);
        }        

        // Alive and minor

        if(child.childIsAlive == 'y' && child.childIsAdult == 'n'){

            if(child.childHasGuardian == 'y' && child.childGuardianName?.length>0){

                if(includeDescription)
                    related.push(child.childGuardianName + ' ('+ child.childName + "'s Guardian)");
                else
                    related.push(child.childGuardianName);
                if(includePrinciple){
                    related.push(child.childName);
                }
            } else {
                related.push(child.childName);
            }
        } 

        //Alive and adult and incompetent

        if(child.childIsAlive == 'y' && child.childIsAdult == 'y' && child.childIsCompetent == 'n'){

            if(child.childHasNominee == 'y' && child.childNomineeName?.length>0){

                if(includeDescription)
                    related.push(child.childNomineeName + ' ('+ child.childName + "'s Nominee)");
                else
                    related.push(child.childNomineeName);

                if(child.childNomineeFormal == 'n' || (child.childNomineeFormal == 'y' && includePrinciple)){
                    related.push(child.childName);
                }
            } else if(child.childHasNominee == 'n'){
                related.push(child.childName);
            }
        } 
        //Deceased after

        if(child.childIsAlive == 'n'){

            if(child.childDiedAfter == 'y'){

                if(child.childHasPersonalRep == 'y' && child.childPersonalRepName?.length>0){

                    if(includePrinciple){
                        related.push(child.childName);
                    } 

                    if(includeDescription)
                        related.push(child.childPersonalRepName + ' ('+ child.childName + "'s Personal Representative)");
                    else
                        related.push(child.childPersonalRepName);
                } else {
                    related.push(child.childName);
                }

            } else if(child.childDiedAfter == 'n' && includePrinciple){
                related.push(child.childName);
            }           
        }
       
    }
    return related;
}


export function getRelatedCreditor(step, includePrinciple, includeDescription){
    const related = [];
    let creditorPersonList: creditorPersonInfoType[] = [];

    if (step.result){
        const resultInfo = step.result;
        if(resultInfo.creditorPersonExists && resultInfo.creditorPersonExists == 'Yes'){
            creditorPersonList = step.result.creditorSurvey?.data?step.result.creditorSurvey.data:[];
        }
    }

    for (const creditorPerson of creditorPersonList){

        // Alive and adult and competent

        if(creditorPerson.creditorPersonIsAlive == 'y' && creditorPerson.creditorPersonIsAdult == 'y' && creditorPerson.creditorPersonIsCompetent == 'y'){
            related.push(creditorPerson.creditorPersonName);
        }
        
        // Alive and minor

        if(creditorPerson.creditorPersonIsAlive == 'y' && creditorPerson.creditorPersonIsAdult == 'n'){

            if(creditorPerson.creditorPersonHasGuardian == 'y' && creditorPerson.creditorPersonGuardianName?.length>0){

                if(includeDescription)
                    related.push(creditorPerson.creditorPersonGuardianName + ' ('+ creditorPerson.creditorPersonName + "'s Guardian)");
                else
                    related.push(creditorPerson.creditorPersonGuardianName);
                if(includePrinciple){
                    related.push(creditorPerson.creditorPersonName);
                }
            } else {
                related.push(creditorPerson.creditorPersonName);
            }
        }        

        //Alive and adult and incompetent

        if(creditorPerson.creditorPersonIsAlive == 'y' && creditorPerson.creditorPersonIsAdult == 'y' && creditorPerson.creditorPersonIsCompetent == 'n'){

            if(creditorPerson.creditorPersonHasNominee == 'y' && creditorPerson.creditorPersonNomineeName?.length>0){

                if(includeDescription)
                    related.push(creditorPerson.creditorPersonNomineeName + ' ('+ creditorPerson.creditorPersonName + "'s Nominee)");
                else
                    related.push(creditorPerson.creditorPersonNomineeName);

                if(creditorPerson.creditorPersonNomineeFormal == 'n' || (creditorPerson.creditorPersonNomineeFormal == 'y' && includePrinciple)){
                    related.push(creditorPerson.creditorPersonName);
                }
            } else if(creditorPerson.creditorPersonHasNominee == 'n'){
                related.push(creditorPerson.creditorPersonName);
            }
        } 
        //Deceased after

        if(creditorPerson.creditorPersonIsAlive == 'n'){
           
            if(creditorPerson.creditorPersonHasPersonalRep == 'y' && creditorPerson.creditorPersonPersonalRepName?.length>0){
                
                if(includePrinciple)
                    related.push(creditorPerson.creditorPersonName);
                
                if(includeDescription)
                    related.push(creditorPerson.creditorPersonPersonalRepName + ' ('+ creditorPerson.creditorPersonName + "'s Personal Representative)");
                else
                    related.push(creditorPerson.creditorPersonPersonalRepName);
            }                 
        }

    }
    return related;
}

export function getRelatedCreditorOrg(step){
    const related = [];
    let creditorOrgList: creditorOrgInfoType[] = [];

    if (step.result){
        const resultInfo = step.result;
        if(resultInfo.creditorOrgExists && resultInfo.creditorOrgExists == 'Yes'){
            creditorOrgList = step.result.creditorOrgSurvey?.data?step.result.creditorOrgSurvey.data:[];
        }
    }

    for (const creditorOrg of creditorOrgList){
        related.push(creditorOrg.creditorOrganizationName);
    }

    return related;
}

export function getRelatedCitor(step){
   
    const related = [];
    let citorList: applicantCitorInfoType[] = [];
   
    if (step.result?.applicantInfoSurvey?.data){
        const resultInfo = step.result.applicantInfoSurvey.data;
        if(resultInfo.applicantCited && resultInfo.applicantCited  == 'y' &&
            resultInfo.applicantCitorNewExists && resultInfo.applicantCitorNewExists == 'y'){
            citorList = step.result.applicantCitorSurvey?.data?step.result.applicantCitorSurvey.data:[];
        }
    }   

    for (const citor of citorList){

        // Alive and adult and competent

        if(citor.applicantCitorIsAlive == 'y' && citor.applicantCitorIsAdult == 'y' && citor.applicantCitorIsCompetent == 'y'){
            related.push(citor.applicantCitorName);
        }
        
        // Alive and minor

        if(citor.applicantCitorIsAlive == 'y' && citor.applicantCitorIsAdult == 'n'){

            if(citor.applicantCitorHasGuardian == 'y' && citor.applicantCitorGuardianName?.length>0){

                related.push(citor.applicantCitorGuardianName);               
            } else {
                related.push(citor.applicantCitorName);
            }
        }        

        //Alive and adult and incompetent

        if(citor.applicantCitorIsAlive == 'y' && citor.applicantCitorIsAdult == 'y' && citor.applicantCitorIsCompetent == 'n'){

            if(citor.applicantCitorHasNominee == 'y' && citor.applicantCitorNomineeName?.length>0){
                
                related.push(citor.applicantCitorNomineeName);

                if(citor.applicantCitorNomineeFormal == 'n'){
                    related.push(citor.applicantCitorName);
                }
                
            } else if(citor.applicantCitorHasNominee == 'n'){
                related.push(citor.applicantCitorName);
            }
        } 
        //Deceased

        if(citor.applicantCitorIsAlive == 'n'){
           
            if(citor.applicantCitorHasPersonalRep == 'y' && citor.applicantCitorPersonalRepName?.length>0){             
                
                related.push(citor.applicantCitorPersonalRepName);
            }                 
        }

    }
    return related;
}