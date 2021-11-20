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
