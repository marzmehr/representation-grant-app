import { initAddressBlock } from "./address-block-type";
import { initContactInfoBlock } from "./contact-info-block-type";
import { initCustomDate } from "./custom-date-type";
import { initHelpText } from "./help-text-type";
import { initInfoText } from "./info-text-type";
import { initPersonName } from "./person-name-type";
import { initYesNo } from "./yes-no-type";
import { initFormDownloadButton } from "./form-download-button-type";
import { initReviewAnswers } from "./review-answers-type";
import { fixExpression } from "./fix-expression-type";
import { addToInputText } from "./add-to-input-text-type";
import { addCustomExpressions } from "../survey-expressions";

export enum WidgetValueName {
  HelpText,
  InfoText,
  FormDownloadButton,
  YesNo,
  AddressInfo,
  PersonName,
  ContactInfo,
  CustomDate,
  ReviewAnswers,
  EarliestSubmissionDate,
  expressionFix,
  textImprovements,
  DateMath
}

export function addQuestionTypes(Survey: any) {
  // fixCheckboxes(Survey);
  addToInputText(Survey);
  fixExpression(Survey);
  initReviewAnswers(Survey);
  initFormDownloadButton(Survey);
  initYesNo(Survey);
  initInfoText(Survey);
  initHelpText(Survey);
  initPersonName(Survey);
  initAddressBlock(Survey);
  initContactInfoBlock(Survey);
  initCustomDate(Survey);
  addCustomExpressions(Survey);
}

export function addToolboxOptions(editor: any) {
  editor.toolbox.addItem({
    title: "---Custom---"
  });
  editor.toolbox.addItem({
    name: "yesno",
    title: "Yes/No Choice",
    isCopied: true,
    iconName: "icon-radiogroup",
    json: {
      type: "yesno"
    }
  });
  editor.toolbox.addItem({
    name: "helptext",
    title: "Expanding FAQ",
    isCopied: true,
    iconName: "icon-panel",
    json: {
      type: "helptext",
      titleLocation: "hidden"
    }
  });
  editor.toolbox.addItem({
    name: "infotext",
    title: "Message Text",
    isCopied: true,
    iconName: "icon-panel",
    json: {
      type: "infotext",
      titleLocation: "hidden"
    }
  });
  editor.toolbox.addItem({
    name: "personname",
    title: "Name Input",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "personname"
    }
  });
  editor.toolbox.addItem({
    name: "address",
    title: "Postal Address",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "address"
    }
  });
  editor.toolbox.addItem({
    name: "contactinfo",
    title: "Contact Information",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "contactinfo"
    }
  });
  editor.toolbox.addItem({
    name: "formdownloadbutton",
    title: "Form Download/Print button",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "formdownloadbutton"
    }
  });
  editor.toolbox.addItem({
    name: "reviewanswers",
    title: "Review Answers",
    isCopied: true,
    iconName: "icon-checkbox",
    json: {
      type: "reviewanswers"
    }
  });
  editor.toolbox.addItem({
    name: "earliestsubmissiondate",
    title: "Longest Date from Panel",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "earliestsubmissiondate"
    }
  });
  editor.toolbox.addItem({
    name: "customdate",
    title: "Custom Date",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "customdate"
    }
  });
  editor.toolbox.addItem({
    name: "datemath",
    title: "Date Math",
    isCopied: true,
    iconName: "icon-checkbox",
    json: {
      type: "datemath"
    }
  });
}
