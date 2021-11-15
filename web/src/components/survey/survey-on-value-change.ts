//Needs to be function, otherwise this context wont work.
import { ItemValue } from "survey-vue";

//Helper function, that either grabs value from the event, or from the survey via getQuestionByName.
const getValueFromOptionsOrGetQuestion = (sender, options, questionName: string) => {
  return options.name == questionName
    ? options.value
    : sender.getQuestionByName(questionName)?.value;
};

const populateApplicantInfoPanel = (sender, options) => {
  const questionNamesToWatch = ["applicant"];
  if (!questionNamesToWatch.includes(options.name)) return;
  const targetPanel = sender.getQuestionByName("applicantInfoPanel");
  const applicants = sender.getQuestionByName("applicant")?.value || [];
  const potentialApplicants = sender.getVariable("potentialApplicants") || []; //If this doesn't work out, use Vuex
  targetPanel.value = applicants.map(a => potentialApplicants.find(pa => pa.key == a));
  console.log(`populateApplicantInfoPanel - Value: ${JSON.stringify(targetPanel.value)}`);
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
  sender.setVariable("potentialApplicants", applicants); //If this doesn't work out, use Vuex
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
    .filter(s => s.spouseIsAlive == "n" || s.spouseIsAdult == "n" || s.spouseIsCompetent == "n")
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

export function onValueChanged(sender, options) {
  populateApplicantInfoPanel(sender, options);
  combinePotentialApplicants(sender, options);
  combineRecipients(sender, options);
}
