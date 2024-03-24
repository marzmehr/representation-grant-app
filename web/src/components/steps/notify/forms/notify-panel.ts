export const notifyPanel = {
   "type": "panel",
   "name": "notifyPanel[0]",
   "elements": [
      {
         "type": "text",
         "name": "recipientName[0]",
         "title": " ",
         "visible": false     
      },
      {
         "type": "infotext",
         "name": "notifyP1PGTContact",
         "visible": false,
         "visibleIf": "{recipientName[0]} = 'The Public Guardian and Trustee (PGT)'",
         "title": "Here is how you can give the letter to the Public Guardian and Trustee (PGT).<br><br><b>In-person or Physical mail</b>:<ul><li>GARS<br>#700-808 W. Hastings Street<br>Vancouver BC<br>V6C 3L3</li></ul><b>Email:</b><ul><li>GARS@trustee.bc.ca</li><li>Use the subject title: \"Re: Representation Grant Application\"</ul><b>Fax:</b><ul><li>604-775-2429</li><li>Use the subject title: “GARS”</li></ul><br>The PGT will start their review when they receive the Form P1 and the letter explaining your application even if they don't get the $315.00 fee right away.<br><br>You can choose to:<ul><li>give the documents and the $315.00 fee together in-person or by physical mail,</li>or,<li> give them the documents by email or fax now and give them the $315.00 fee later.</li></ul>To do their review, someone from the PGT will be contacting you to ask for more information.<br><br>After the PGT does their review, they will send a document called \"PGT Comments\" to your mailing address. You will get the PGT Comments after the PGT receives the $315.00 fee.<br><br> This service will remind you to file the original signed copy of the PGT Comments at {applicantCourthouse} in a later step.",
         "titleLocation": "hidden",
      },
      {
         "type": "infotext",
         "name": "notifyP1FirstNationsExplanation",
         "visible": false,
         "visibleIf": "{isfirstNation[0]}",         
         "title": "{firstNationInfo}",
         "titleLocation": "hidden",
      },
      {
         "type": "yesno",
         "name": "notifyP1Delivered[0]",
         "title": "Was someone able to give {recipientName[0]} a Form P1?",
         "isRequired": true
      },
      {
         "type": "infotext",
         "name": "notifyP1DeliveredNoErrorTemp[0]",
         "visible": false,
         "visibleIf": "{notifyP1Delivered[0]} = 'n'",
         "title": "For now, this service has only been developed for a limited number of situations. At this time, this service cannot help you apply for a `Representation Grant`.",
         "titleLocation": "hidden",
         "requiredErrorText": "Please press Continue",
         "messageStyle": "error"
      },
      {
         "type": "radiogroup",
         "name": "notifyP1DelivererName[0]",
         "choices": [],
         "visible": false,
         "visibleIf": "{notifyP1Delivered[0]} = 'y'",
         "title": "Who gave {recipientName[0]} a Form P1?",
         "isRequired": true
      },
      {
         "type": "text",
         "inputType": "date",
         "name": "notifyP1DeliveryDate[0]",
         "visible": false,
         "visibleIf": "{notifyP1DelivererName[0]} notempty and {notifyP1Delivered[0]} = 'y'",
         "title": "When did {notifyP1DelivererName[0]} give the Form P1 to {recipientName[0]}?",
         "isRequired": true,
         "dateYearsBehind": 5                  
      } ,
      {
         "type": "radiogroup",
         "name": "notifyP1DeliveryMethod[0]",
         "visible": false,
         "visibleIf": "{notifyP1DelivererName[0]} notempty and {notifyP1Delivered[0]} = 'y'",
         "title": "How did {notifyP1DelivererName[0]} give the Form P1 to {recipientName[0]}?",
         "isRequired": true,
         "choices": [
            {
            "value": "inperson",
            "text": "In-person"
            },
            {
            "value": "mail",
            "text": "Physical Mail"
            },
            {
            "value": "electronic",
            "text": "Electronically (e-mail, fax, direct/private messages, etc)"
            }
         ]
      },
      {
         "type": "yesno",
         "name": "notifyP1DeliveryElectronicReceipt[0]",
         "visible": false,
         "visibleIf": "{notifyP1DeliveryMethod[0]} = 'electronic' and {notifyP1Delivered[0]} = 'y'",
         "title": "Did {notifyP1DelivererName[0]} get a written response from {recipientName[0]}?",
         "description": "A written response could simply be {recipientName[0]} saying \"I got the P1\" through the same electronic method or any other method.",
         "isRequired": true
      },
      {
         "type": "infotext",
         "name": "notifyP1DeliveryElectronicReceiptNoError[0]",
         "visible": false,
         "visibleIf": "{notifyP1DeliveryMethod[0]} = 'electronic' and {notifyP1DeliveryElectronicReceipt[0]} = 'n' and {notifyP1Delivered[0]} = 'y'",
         "title": "You need to make sure {recipientName[0]} writes a response confirming they received a Form P1.<br><br>If {recipientName[0]} will not write a response, consider giving them a Form P1 in person or in the mail. These methods do not require a written response.<br><br>If you choose a new method of delivering the Form P1 to {recipientName[0]}, remember to update the relevant information about who gave it to them and when.",
         "titleLocation": "hidden",
         "requiredErrorText": "Please press Continue",
         "messageStyle": "error"
      },
      {
         "type": "checkbox",
         "name": "notifyP1DeliveryElectronicReceiptRetain[0]",
         "visible": false,
         "visibleIf": "{notifyP1DeliveryMethod[0]} = 'electronic' and {notifyP1DeliveryElectronicReceipt[0]} = 'y' and {notifyP1Delivered[0]} = 'y'",
         "title": "You need to keep this written response in case someone asks you to prove that {recipientName[0]} actually received a Form P1.",
         "isRequired": true,
         "choices": [
            {
            "value": "confirmed",
            "text": "I confirm that I will keep the written response until I am done being a personal representative for {deceasedName}"
            }
         ]
      }               
   ]               
}