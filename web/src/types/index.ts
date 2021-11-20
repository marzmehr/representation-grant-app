//This is here temp until we get the gen_typescript_reponse working. 
//That way we can generate the typescript models from the survey data. 
//We'll know right away if the survey has changed, it will break the compilation 
//of the project.

interface Deceased {
    deceasedDateOfDeath?: Date;
    deceasedName?: string;
    deceasedAddress?: string;
}

interface ServiceContact {

}

interface ApplicantPanel {
    applicantCourthouse?: string;
    applicantMailingAddress?: string;
    applicantMailingAddressIsOrdinary?: string;
    applicantOrdinaryAddress?: string;
    applicantServiceAddress?: string;
    applicantServicePOBox?: string;
    applicantServiceFax?: string;
    applicantServiceEmail?: string;
    applicantLawyer?: string;
    applicantLawyerName?: string;
    applicantName?: string;
}

//Replace above by generated models.


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