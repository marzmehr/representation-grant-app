//Needs to be function, otherwise this context wont work.
import { addDays, format, getDay, parseISO } from "date-fns";
import { ItemValue } from "survey-vue";
import { DayOfWeek } from "../utils/holiday";
import { holidaysByDate } from "./survey-init";
import { getPotentialApplicants, setPotentialApplicants } from "./survey-state";

//Helper function, that either grabs value from the event, or from the survey via getQuestionByName.
const getValueFromOptionsOrGetQuestion = (sender, options, questionName: string) => {
  return options.name == questionName
    ? options.value
    : sender.getQuestionByName(questionName)?.value;
};

const populateApplicantInfoPanelAndP1DeliveryInfoPanel = (sender, options) => {
  const questionNamesToWatch = ["applicant"];
  if (!questionNamesToWatch.includes(options.name)) return;
  const targetPanel = sender.getQuestionByName("applicantInfoPanel");
  const applicants = sender.getQuestionByName("applicant")?.value || [];
  const potentialApplicants = getPotentialApplicants.value || [];
  targetPanel.value = applicants.map(a => potentialApplicants.find(pa => pa.key == a));
  const p1DeliveryInfoPanel = sender.getQuestionByName("p1DeliveryInfoPanel");
  for (const panel of p1DeliveryInfoPanel.panels) {
    for (const question of panel.questions) {
      if (question.name != "p1DelivererName") continue;
      question.choices = potentialApplicants.map(
        p => new ItemValue(`${p.key}`, `${p.applicantName}`)
      );
    }
  }
  console.log(
    `populateApplicantInfoPanel+p1DeliveryInfoPanel - Value: ${JSON.stringify(targetPanel.value)}`
  );
};

const combinePotentialApplicants = (sender, options) => {
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

  const applicants = [
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
  applicant.choices = applicants.map(p => new ItemValue(`${p.key}`, `${p.applicantName}`));
  setPotentialApplicants(applicants);
  console.log(
    `combinePotentialApplicants - Applicant choices: ${JSON.stringify(applicant.choices)}`
  );
};

const combineRecipients = (sender, options) => {
  const questionNamesToWatch = ["spouseInfoPanel", "childInfoPanel"];
  if (!questionNamesToWatch.includes(options.name)) return;
  let spousePanel =
    getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[0]) || [];
  let childPanel = getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[1]) || [];

  spousePanel = spousePanel
    .filter(s => s.spouseIsAlive == "n" || s.spouseIsAdult == "n" || s.spouseIsCompetent == "n")
    .map(s => s.spouseName);
  childPanel = childPanel
    .filter(s => s.childIsAlive == "n" || s.childIsAdult == "n" || s.childIsCompetent == "n")
    .map(s => s.childName);

  const recipients = [
    ...spousePanel.map((sp, index) => ({
      recipientRole: "spouse",
      recipientName: sp,
      key: `s${index}`
    })),
    ...childPanel.map((c, index) => ({
      recipientRole: "child",
      recipientName: c,
      key: `c${index}`
    }))
  ];

  //Going to have to combine objects here, not just replace.
  const targetPanel = sender.getQuestionByName("p1DeliveryInfoPanel");
  targetPanel.value = recipients;
  console.log(
    `combineRecipients - p1DeliveryInfoPanel value: ${JSON.stringify(targetPanel.value)}`
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
    const timeOfDay = value?.p1DeliveryTime;
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
          } else if (method == "electronic" && timeOfDay == "after4pm" && offsetDays == 0) {
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
  if (calculatedDates.length == 0) return false;
  const earliestSubmissionDate = new Date(Math.max.apply(null, calculatedDates));
  const earliestSubmissionDateQuestion = sender.getQuestionByName("p1earliestSubmissionDate");
  earliestSubmissionDateQuestion.title = earliestSubmissionDateQuestion.title.replace("[insert date here]", format(earliestSubmissionDate, "yyyy-MM-dd"));
  earliestSubmissionDateQuestion.visible = true;
};

export function onValueChanged(sender, options) {
  populateApplicantInfoPanelAndP1DeliveryInfoPanel(sender, options);
  combinePotentialApplicants(sender, options);
  combineRecipients(sender, options);
  determineEarliestSubmissionDate(sender, options);
}
