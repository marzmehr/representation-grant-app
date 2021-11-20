//This is here temp until we get the gen_typescript_reponse working. 
//That way we can generate the typescript models from the survey data. 
//We'll know right away if the survey has changed, it will break the compilation 
//of the project.
interface go {
    applicantCourtHouseDifferent: string
}

//This is for state.
interface PotentialApplicant {
    applicantRole: string;
    applicantName: string;
    key: string;
}

interface Applicant {
    applicantRole: string;
    applicantName: string;
    key: string;
}

interface Recipient {
    recipientRole: string;
    recipientName: string;
    key: string;
}