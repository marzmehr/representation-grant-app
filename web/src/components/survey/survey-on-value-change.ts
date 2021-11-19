//Needs to be function, otherwise this context wont work.
import { addDays, format, getDay, parseISO } from "date-fns";
import { ItemValue } from "survey-vue";
import { DayOfWeek } from "../utils/holiday";
import { holidaysByDate } from "./survey-init";
import {
  getPotentialApplicants,
  setApplicants,
  setPotentialApplicants,
  setRecipients
} from "./survey-state";

//Helper function, that either grabs value from the event, or from the survey via getQuestionByName.
const getValueFromOptionsOrGetQuestion = (sender, options, questionName: string) => {
  return options.name == questionName
    ? options.value
    : sender.getQuestionByName(questionName)?.value;
};

const populateApplicantInfoPanelAndP1DeliveryInfoPanel = (sender, options) => {
  const questionNamesToWatch = ["applicant", "spouseInfoPanel", "childInfoPanel"];
  if (!questionNamesToWatch.includes(options.name)) return;
  const applicants = sender.getQuestionByName("applicant")?.value || [];
  const potentialApplicants = getPotentialApplicants.value || [];
  const applicantInfoPanel = sender.getQuestionByName("applicantInfoPanel");
  if (applicantInfoPanel) {
    applicantInfoPanel.value = applicants.map(a => potentialApplicants.find(pa => pa.key == a));
    applicantInfoPanel.visible = applicants.length > 0;
    console.log(`applicantInfoPanel - Value: ${JSON.stringify(applicantInfoPanel.value)}`);
  }
  const p1DeliveryInfoPanel = sender.getQuestionByName("p1DeliveryInfoPanel");
  if (p1DeliveryInfoPanel) {
    const choices = applicants
      .map(a => potentialApplicants.find(pa => pa.key == a))
      .map(p => new ItemValue(`${p.key}`, `${p.applicantName}`));
    for (const panel of p1DeliveryInfoPanel.panels) {
      for (const question of panel.questions) {
        if (question.name != "p1DelivererName") continue;
        question.choices = choices;
      }
    }
    console.log(`populatep1DeliveryInfoPanel - Value: ${JSON.stringify(choices)}`);
  }
};

const determinePotentialApplicants = (sender, options) => {
  const questionNamesToWatch = ["spouseInfoPanel", "childInfoPanel"];
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
  const applicant = sender.getQuestionByName("applicant");
  applicant.choices = potentialApplicants.map(p => new ItemValue(`${p.key}`, `${p.applicantName}`));
  setPotentialApplicants(potentialApplicants);
  console.log(
    `combinePotentialApplicants - Applicant choices: ${JSON.stringify(applicant.choices)}`
  );
};

const determineRecipients = (sender, options) => {
  const questionNamesToWatch = ["applicant", "spouseInfoPanel", "childInfoPanel"];
  if (!questionNamesToWatch.includes(options.name)) return;

  let selectedApplicants = getValueFromOptionsOrGetQuestion(sender, options, "applicant") || [];
  const potentialApplicants = getPotentialApplicants.value;
  const recipients = potentialApplicants
    .filter(pa => !selectedApplicants.find(sa => sa == pa.key))
    .map(pa => ({
      recipientRole: pa.applicantRole,
      recipientName: pa.applicantName,
      key: pa.key
    }));
  setRecipients(recipients);

  const applicants = potentialApplicants.filter(pa => selectedApplicants.find(sa => sa == pa.key));
  setApplicants(applicants);

  //Going to have to combine objects here, not just replace.
  const targetPanel = sender.getQuestionByName("p1DeliveryInfoPanel");
  if (targetPanel) {
    targetPanel.value = recipients;
  }
  console.log(
    `determineRecipients - p1DeliveryInfoPanel value: ${JSON.stringify(targetPanel.value)}`
  );
};

const determineEarliestSubmissionDate = (sender, options) => {
  const questionNamesToWatch = ["p1DeliveryInfoPanel"];
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
          Business day before 4pm, date served is the date served: +0 days, then +21 days on top of that for the countdown.
          Business day after 4pm, date served = next BC business day, then add 21 days on top of that
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
  const earliestSubmissionDateQuestion = sender.getQuestionByName("p1earliestSubmissionDate");
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
}
