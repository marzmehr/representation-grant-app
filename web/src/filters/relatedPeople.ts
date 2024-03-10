import { childDetailsDataInfoType } from "@/types/Application/Children";
import { creditorOrgInfoType, creditorPersonInfoType } from "@/types/Application/Creditor";
import { spouseInfoType } from "@/types/Application/Spouse";


export function getRelatedSpouses(step){
    const related = [];
    let spouseList: spouseInfoType[] = [];
    
    if (step.result?.spouseSurvey?.data) {
        spouseList = step.result.spouseSurvey.data;
    } 

    for (const spouse of spouseList){
        related.push(spouse.spouseName);

        if(spouse.spouseIsAlive == 'y' && spouse.spouseIsAdult == 'n' &&
        spouse.spouseHasGuardian == 'y' && spouse.spouseGuardianName?.length>0){

            related.push(spouse.spouseGuardianName);
        }

        if(spouse.spouseIsAlive == 'y' && spouse.spouseIsAdult == 'y' &&
            spouse.spouseIsCompetent == 'n' && spouse.spouseHasNominee == 'y' && spouse.spouseNomineeName?.length>0){
            related.push(spouse.spouseNomineeName);
        }

        if(spouse.spouseIsAlive == 'n' && spouse.spouseDied5DaysAfter == 'y' &&
        spouse.spouseHasPersonalRep == 'y' && spouse.spousePersonalRepName?.length>0){
            related.push(spouse.spousePersonalRepName);
        }
    }
    return related;
}


export function getRelatedChildren(step){
    const related = [];
    let childList: childDetailsDataInfoType[] = [];
    if (step.result?.childrenSurvey?.data) {
        childList = step.result.childrenSurvey.data;
    } 

    for (const child of childList){
        related.push(child.childName);

        if(child.childIsAlive == 'y' && child.childIsAdult == 'n' &&
            child.childHasGuardian == 'y' && child.childGuardianName?.length>0){

            related.push(child.childGuardianName);
        }

        if(child.childIsAlive == 'y' && child.childIsAdult == 'y' &&
            child.childIsCompetent == 'n' && child.childHasNominee == 'y' && child.childNomineeName?.length>0){
            related.push(child.childNomineeName);
        }

        if(child.childIsAlive == 'n' && child.childDiedAfter == 'y' &&
            child.childHasPersonalRep == 'y' && child.childPersonalRepName?.length>0){
            related.push(child.childPersonalRepName);
        }
    }
    return related;
}


export function getRelatedCreditor(step){
    const related = [];
    let creditorPersonList: creditorPersonInfoType[] = [];
    if (step.result?.creditorSurvey?.data) {
        creditorPersonList = step.result.creditorSurvey.data;
    } 

    for (const creditorPerson of creditorPersonList){
        related.push(creditorPerson.creditorPersonName);

        if(creditorPerson.creditorPersonIsAlive == 'y' && creditorPerson.creditorPersonIsAdult == 'n' &&
            creditorPerson.creditorPersonHasGuardian == 'y' && creditorPerson.creditorPersonGuardianName?.length>0){

                related.push(creditorPerson.creditorPersonGuardianName);
        }

        if(creditorPerson.creditorPersonIsAlive == 'y' && creditorPerson.creditorPersonIsAdult == 'y' &&
            creditorPerson.creditorPersonIsCompetent == 'n' && creditorPerson.creditorPersonHasNominee == 'y' && 
            creditorPerson.creditorPersonNomineeName?.length>0){
            
                related.push(creditorPerson.creditorPersonNomineeName);
        }

        if(creditorPerson.creditorPersonIsAlive == 'n' && creditorPerson.creditorPersonHasPersonalRep == 'y' && 
            creditorPerson.creditorPersonPersonalRepName?.length>0){

                related.push(creditorPerson.creditorPersonPersonalRepName);
        }
    }
    return related;
}

export function getRelatedCreditorOrg(step){
    const related = [];
    let creditorOrgList: creditorOrgInfoType[] = [];
    if (step.result?.creditorOrgSurvey?.data) {
        creditorOrgList = step.result.creditorOrgSurvey.data;
    }

    for (const creditorOrg of creditorOrgList){
        related.push(creditorOrg.creditorOrganizationName);
    }

    return related;
}