export interface applicationInfoType {   
    id?: string;
    type: string;
    steps: stepInfoType[];
    lastUpdate: Date;
    currentStep: number;
    allCompleted: boolean;
    lastPrinted: Date;
    userType: string;
    userName: string;
    userId: string;
    applicantName: string;
    deceasedName: string;
    deceasedDateOfDeath: string;
    DeceasedDateOfDeathPlus4: string;
    dateOfWill: string;
    deceasedChildrenInfo: [];
    deceasedGrandChildrenInfo: [];
    applicationLocation: string;
}

export interface stepInfoType {
    id?: string;
    type: string;
    label: string;
    icon: string;
    result: {};
    metadata?: object;
    pages?: pageInfoType[];
    currentPage: number;
    active: boolean;
    lastUpdate: Date;
  }

  export interface pageInfoType {
    key: string;
    label: string;
    progress: number;
    active: boolean;
    clickable: boolean;
  }

  export interface stepResultInfoType {
    step: stepInfoType;
    data: any;
  }

  export interface belongingsInfoType {
    land: any[];
    vehicle: any[];
    bankAccount: any[];
    pension: any[];
    personalItem: any[];
  }

export interface ApplicantInfoPanel {
  courthouse: string;
  address: string;
  fullName: string;
  occupation: string;
  individual: string;
  sameMail: string;
  differentMail: string;
  differentAddress: string;
  recipients: any[];
}

export interface P1Panel {
  recipientName: string;
  p1DelivererName: string;
  p1DeliveryMethod: string;
  p1DeliveryDate: string;
  p1DeliveryElectronicReceipt: string;
  p1DeliveryElectronicReceiptRetain: string;
}
