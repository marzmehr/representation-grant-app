//FormP1
export interface FormP1Applicant {
  fullName: string;
  first: string;
  middle: string;
  last: string;
  address: string;
  individual: boolean;
  sameMail: boolean;
  differentMail: boolean;
  differentAddress: string;
  lawyer: string;
}

export interface FormP1Deceased {
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  dateOfDeath: string;
}

export interface FormP1ServiceContact {
  address?: string;
  phone?: string;
  fax?: string;
  email?: string;
  courtLocation?: string;
  poBox?: string;
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