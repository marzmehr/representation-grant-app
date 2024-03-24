import { addressInfoType } from "@/types/Common";

export interface minorIncapableInfoType { 
  hasMinorOrIncapable: boolean;
  hasSpouse: boolean;
  hasChildren: boolean;
  hasCreditor: boolean;
  spouse: minorIncapableDataInfoType;
  children: minorIncapableDataInfoType;
  creditor: minorIncapableDataInfoType; 
};

export interface minorIncapableDataInfoType {
  related: string[]; 
  minor: string[]; 
  incapable: string[];
  minorAll: string[]; 
  incapableAll: string[];      
}
  


export interface minorPdfType {
  name?: string;
  relation?: string;
  dob?: string;
  residentialAddress?: addressInfoType;
  mailingAddress?: addressInfoType;
  email?: string;
  fax?: string;

  hasGuardian?: boolean;    
  guardianName?: string;
  guardianResidentialAddress?: addressInfoType;
  guardianMailingAddress?: addressInfoType;
  guardianEmail?: string;
  guardianFax?: string;
}

export interface incapablePdfType {
  name?: string;
  relation?: string;
  dob?: string;
  residentialAddress?: addressInfoType;
  mailingAddress?: addressInfoType;
  email?: string;
  fax?: string;

  hasNominee?: boolean;
  nomineeName?: string;
  nomineeFormal?: boolean;
  nomineeResidentialAddress?: addressInfoType;    
  nomineeMailingAddress?: addressInfoType;
  nomineeEmail?: string;
  nomineeFax?: string;
}
  


