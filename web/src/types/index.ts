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

//Used by codegen:
interface AddressAndContact {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    fax?: string;
    phone?: string;
    email?: string;
}

interface PersonName {
    first?: string;
    middle?: string;
    last?: string;
}

interface ContactInfo {
    fax?: string;
    phone?: string;
    email?: string;
}