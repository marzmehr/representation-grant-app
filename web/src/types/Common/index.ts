export interface supportingDocumentInfoType {   
    fileName: string;
    file: File;
    documentType: string;
}

export interface questionInfoType {
    name: string;
    value: any;
    title: string;
    inputType?: string;
}

export interface nameInfoType {
    first: string;
    middle: string;
    last: string;
}
  
export interface fullNameInfoType {
    name: string;
}
  
export interface contactInfoType {
    phone?: string;
    fax?: string;
    email?: string;
}
  
export interface addressInfoType {
    street: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
}