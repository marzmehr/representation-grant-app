//Needs to be function, otherwise this context wont work.
import { SurveyQuestionNames } from "@/types/survey-primary";
import { addDays, format, getDay, parseISO } from "date-fns";
import { ItemValue } from "survey-vue";
import { DayOfWeek } from "@/utils/holiday";
import { holidaysByDate } from "./survey-init";
import {
  getPotentialApplicants,
  setApplicants,
  setLastUpdated,
  setPotentialApplicants,
  setRecipients
} from "@/state/survey-state";

//Helper function, that either grabs value from the event, or from the survey via getQuestionByName.
const getValueFromOptionsOrGetQuestion = (sender, options, questionName: string) => {
  return options.name == questionName
    ? options.value
    : sender.getQuestionByName(questionName)?.value;
};

const populateApplicantInfoPanelAndP1DeliveryInfoPanel = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.applicantChoice,
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel
  ];
  if (!questionNamesToWatch.includes(options.name)) return;
  const applicantChoice =
    sender.getQuestionByName(SurveyQuestionNames.applicantChoice)?.value || [];
  const applicants = !Array.isArray(applicantChoice) ? [applicantChoice] : applicantChoice;
  const potentialApplicants = getPotentialApplicants.value || [];
  const applicantInfoPanel = sender.getQuestionByName(SurveyQuestionNames.applicantInfoPanel);
  if (applicantInfoPanel) {
    applicantInfoPanel.value = applicants.map(a => potentialApplicants.find(pa => pa.key == a));
    applicantInfoPanel.visible = applicants.length > 0;
    console.log(`applicantInfoPanel - Value: ${JSON.stringify(applicantInfoPanel.value)}`);
  }
  const p1DeliveryInfoPanel = sender.getQuestionByName(SurveyQuestionNames.p1DeliveryInfoPanel);
  if (p1DeliveryInfoPanel) {
    const choices = applicants
      .map(a => potentialApplicants.find(pa => pa.key == a))
      .map(p => new ItemValue(`${p.key}`, `${p.applicantName}`));
    for (const panel of p1DeliveryInfoPanel.panels) {
      for (const question of panel.questions) {
        if (question.name != SurveyQuestionNames.p1DelivererName) continue;
        question.choices = choices;
      }
    }
    console.log(`populatep1DeliveryInfoPanel - Value: ${JSON.stringify(choices)}`);
  }
};

const determinePotentialApplicants = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel
  ];
  if (!questionNamesToWatch.includes(options.name)) return;
  let spousePanel =
    getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[0]) || [];
  let childPanel = getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[1]) || [];

  spousePanel = spousePanel
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "y")
    .map(s => s.spouseName);
  childPanel = childPanel
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "y")
    .map(s => s.childName);

  const potentialApplicants = [
    ...spousePanel.map((sp, index) => ({
      applicantRole: "spouse",
      applicantName: sp,
      key: `s${index}`
    })),
    ...childPanel.map((c, index) => ({
      applicantRole: "child",
      applicantName: c,
      key: `c${index}`
    }))
  ];
  const applicantChoice = sender.getQuestionByName(SurveyQuestionNames.applicantChoice);
  if (applicantChoice) {
    applicantChoice.choices = potentialApplicants.map(
      p => new ItemValue(`${p.key}`, `${p.applicantName}`)
    );
    console.log(
      `combinePotentialApplicants - Applicant choices: ${JSON.stringify(applicantChoice.choices)}`
    );
  }
  setPotentialApplicants(potentialApplicants);
};

const determineRecipients = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.applicantChoice,
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel
  ];
  if (!questionNamesToWatch.includes(options.name)) return;

  let selectedApplicants =
    getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.applicantChoice) || [];
  const potentialApplicants = getPotentialApplicants.value;
  //Handle both Checkbox and Radiogroup cases.
  const recipients = potentialApplicants
    .filter(
      pa =>
        (Array.isArray(selectedApplicants) && !selectedApplicants.find(sa => sa == pa.key)) ||
        (!Array.isArray(selectedApplicants) && selectedApplicants != pa.key)
    )
    .map(pa => ({
      recipientRole: pa.applicantRole,
      recipientName: pa.applicantName,
      key: pa.key
    }));
  setRecipients(recipients);

  //Handle both Checkbox and Radiogroup cases.
  const applicants = potentialApplicants.filter(
    pa =>
      (Array.isArray(selectedApplicants) && selectedApplicants.find(sa => sa == pa.key)) ||
      (!Array.isArray(selectedApplicants) && selectedApplicants == pa.key)
  );
  setApplicants(applicants);

  //Going to have to combine objects here, not just replace.
  const targetPanel = sender.getQuestionByName(SurveyQuestionNames.p1DeliveryInfoPanel);
  if (targetPanel) {
    targetPanel.value = recipients;
    console.log(
      `determineRecipients - p1DeliveryInfoPanel value: ${JSON.stringify(targetPanel.value)}`
    );
  }
};

export const determineEarliestSubmissionDate = (sender, options) => {
  const questionNamesToWatch = [SurveyQuestionNames.p1DeliveryInfoPanel];
  if (!questionNamesToWatch.includes(options.name)) return;
  const p1DeliveryInfoPanelValue = options.value || [];
  const calculatedDates = [];
  p1DeliveryInfoPanelValue.forEach(value => {
    const method = value?.p1DeliveryMethod;
    let dateServed = parseISO(value?.p1DeliveryDate);
    if (!method || isNaN(dateServed.getTime())) return;
    let extraNoticeDays = 21;
    switch (method) {
      case "inperson":
        break;
      case "electronic":
      case "mail":
        /* For physical mail, it is + at least 7 days. 
           If that 7th day from served date is a Saturday/Sunday/BC Holiday, 
           needs to be calculating for the next BC business day, 
           then +21 days on top of that for the countdown. */
        /* 
          For electronic/fax service:
          Saturday/Sunday/BC holiday, date served = next BC business day, then add 21 days on top of that
        */
        let offsetDays = method == "mail" ? 7 : 0;
        const bcStats = holidaysByDate;
        let resolvedDate = false;
        while (!resolvedDate) {
          let destinationDate = addDays(dateServed, offsetDays);
          const destinationDayOfWeek = getDay(destinationDate) as DayOfWeek;
          if (destinationDayOfWeek == DayOfWeek.Saturday) {
            offsetDays += 2;
            continue;
          } else if (destinationDayOfWeek == DayOfWeek.Sunday) {
            offsetDays += 1;
            continue;
          } else if (bcStats.hasOwnProperty(format(destinationDate, "yyyy-MM-dd"))) {
            offsetDays += 1;
            continue;
          }
          resolvedDate = true;
          extraNoticeDays += offsetDays;
        }
        break;
    }
    dateServed = addDays(dateServed, extraNoticeDays);
    calculatedDates.push(dateServed);
  });

  const earliestSubmissionDateQuestion = sender.getQuestionByName(
    SurveyQuestionNames.p1earliestSubmissionDate
  );
  if (!earliestSubmissionDateQuestion) return;
  if (calculatedDates.length == 0) {
    earliestSubmissionDateQuestion.visible = false;
  } else {
    const earliestSubmissionDate = new Date(Math.max.apply(null, calculatedDates));
    sender.setVariable("earliestSubmissionDate", format(earliestSubmissionDate, "MMMM d, yyyy"));
    earliestSubmissionDateQuestion.visible = true;
    //Have to give it a kick to re-render.
    earliestSubmissionDateQuestion.title = earliestSubmissionDateQuestion.title + " ";
    console.log(
      `determineEarliestSubmissionDate - earliestSubmissionDate: ${format(
        earliestSubmissionDate,
        "MMMM d, yyyy"
      )}`
    );
  }
};

export function onValueChanged(sender, options) {
  determinePotentialApplicants(sender, options);
  determineRecipients(sender, options);
  populateApplicantInfoPanelAndP1DeliveryInfoPanel(sender, options);
  determineEarliestSubmissionDate(sender, options);
  setLastUpdated(new Date());
}
