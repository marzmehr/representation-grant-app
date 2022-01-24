//Needs to be function, otherwise this context wont work.
import { notifyP1DeliveryInfoPanel, SurveyQuestionNames } from "@/types/survey-primary";
import { addDays, format, getDay, parseISO } from "date-fns";
import { ItemValue } from "survey-vue";
import {
  getPotentialApplicants,
  setApplicants,
  setLastUpdated,
  setPotentialApplicants,
  setPrevAddresses,
  setRecipients
} from "@/state/survey-state";

//Helper function, that either grabs value from the event, or from the survey via getQuestionByName.
const getValueFromOptionsOrGetQuestion = (sender, options, questionName: string, getText?: boolean) => {
  if (getText) {
    return getTextValue(sender, options, questionName);
  } else {
    return options.name == questionName
      ? options.value
      : sender.getQuestionByName(questionName)?.value;
  }
};

const getTextValue = (sender, options, questionName) => {
  if (options.name == questionName) {
    return options.question.choices.find(c => c.value == options.value)?.text;
  } else {
    const base = sender.getQuestionByName(questionName);
    return base?.choices.find(c => c.value == base?.value)?.text;
  }
}

const populateApplicantInfoPanelAndP1DeliveryInfoPanel = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.applicantChoice,
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel,
    SurveyQuestionNames.spouseExists,
    SurveyQuestionNames.childExists
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
  }
  const p1DeliveryInfoPanel = sender.getQuestionByName(SurveyQuestionNames.notifyP1DeliveryInfoPanel);
  if (p1DeliveryInfoPanel) {
    const choices = applicants
      .map(a => potentialApplicants.find(pa => pa.key == a))
      .map(p => new ItemValue(`${p.key}`, `${p.applicantName}`));
    for (const panel of p1DeliveryInfoPanel.panels) {
      for (const question of panel.questions) {
        if (question.name != SurveyQuestionNames.notifyP1DelivererName) continue;
        question.choices = choices;
      }
    }
  }
};

const clearPanel = (sender, options) => {
  if (options.name === SurveyQuestionNames.spouseExists) {
    if (getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.spouseExists) === 'n') {
        sender.getQuestionByName(SurveyQuestionNames.spouseInfoPanel).value = [];
    }
  }
  else if (options.name === SurveyQuestionNames.childExists) {
    if (getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.childExists) === 'n') {
        sender.getQuestionByName(SurveyQuestionNames.childInfoPanel).value = [];
    }
  }
}

const determinePotentialApplicants = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel,
    SurveyQuestionNames.spouseExists,
    SurveyQuestionNames.childExists,
    SurveyQuestionNames.deceasedFirstNations,
    SurveyQuestionNames.deceasedFirstNationsName
  ];
  if (!questionNamesToWatch.includes(options.name)) return;
  let spousePanel =
    getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[0]) || [];
  let childPanel = getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[1]) || [];
  const spouseExists = getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[2]);
  const childExists = getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[3]);
  const isFirstNations = getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[4]);
  let firstNationsPanel = getValueFromOptionsOrGetQuestion(sender, options, questionNamesToWatch[5], true);

  spousePanel = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "y")
    .map(s => s.spouseName);
  childPanel = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "y")
    .map(s => s.childName);
  firstNationsPanel = isFirstNations == "y" && firstNationsPanel ? [firstNationsPanel] : [];

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
    })),
    ...firstNationsPanel.map((f, index) => ({
      applicantRole: "firstNations",
      applicantName: f,
      key: `f${index}`
    }))
  ];

  const applicantChoice = sender.getQuestionByName(SurveyQuestionNames.applicantChoice);
  if (applicantChoice) {
    applicantChoice.choices = potentialApplicants.map(
      p => new ItemValue(`${p.key}`, `${p.applicantName}`)
    );
  }
  setPotentialApplicants(potentialApplicants);
};

const determineRecipients = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.applicantChoice,
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel,
    SurveyQuestionNames.deceasedFirstNations,
    SurveyQuestionNames.deceasedFirstNationsName
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
  const targetPanel = sender.getQuestionByName(SurveyQuestionNames.notifyP1DeliveryInfoPanel);
  if (targetPanel) {
    targetPanel.value = recipients;
  }
};

export const determineEarliestSubmissionDate = (sender, options) => {
  const questionNamesToWatch = [SurveyQuestionNames.notifyP1DeliveryInfoPanel];
  if (!questionNamesToWatch.includes(options.name)) return;
  const p1DeliveryInfoPanelValue = options.value || [];
  const calculatedDates = [];
  p1DeliveryInfoPanelValue.forEach((value: notifyP1DeliveryInfoPanel) => {
    const method = value?.notifyP1DeliveryMethod;
    let dateServed = parseISO(value?.notifyP1DeliveryDate);
    if (!method || isNaN(dateServed.getTime())) return;
    dateServed = addDays(dateServed, 21);
    calculatedDates.push(dateServed);
  });

  const earliestSubmissionDateQuestion = sender.getQuestionByName(
    SurveyQuestionNames.notifyEarliestSubmissionDate
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
  }
};

export const collectPrevAddresses = (sender) => {
  let addressQuestions = [];
  const keys = [
    "street",
    "city",
    "country",
    "state",
    "postalCode",
    "phone",
    "fax",
    "email"
  ];

  for (const page of sender.pages) {
    for (const question of page.questions) {
      if (question.getType() === "address" && question.value) {
        
        let hasAllValues = true;
        for (const key of keys) {
          if (question[key] && !question.value[key]) {
            hasAllValues = false;
          }
        }

        if (hasAllValues) {
          addressQuestions.push(question.value);
        }
      }
    }
  }

  // better way to get unique values?
  const uniqueAddressQuestions = addressQuestions.filter((value, index, self) =>
    index === self.findIndex((check) => (
      check.street === value.street
      && check.city === value.city
      && check.state === value.state
      && check.country === value.country
      && check.postcode === value.postcode
      && check.email === value.email
      && check.phone === value.phone
      && check.fax === value.fax
    ))
  );

  setPrevAddresses(uniqueAddressQuestions);
};

export const toNextQuestion = options => {
  const typesToSkip = [
    "address",
    "comment",
    "contactinfo",
    "helptext",
    "matrix",
    "matrixdropdown",
    "matrixdynamic",
    "multipletext",
    "personname",
    "ranking",
    "text"
  ];

  if (!options.question || typesToSkip.includes(options.question.getType())) return;
  if (options.question.survey.platformName != "vue") return; //Disable this for sandbox mode.

  const currQuestion = options.question;
  let questions = [];
  currQuestion.page.addQuestionsToList(questions, true);

  let filtered = questions.filter(q => (q.getType() === "infotext" && q.isRequired) || (q.getType() !== "infotext" && q.getType() !== "helptext"));
  const indexOfNextQuestion = filtered.indexOf(currQuestion) + 1;
  const nextQuestion = filtered[indexOfNextQuestion];

  if (nextQuestion) {
    setTimeout(() => {
      currQuestion.survey.focusFirstQuestionAutomatic = false;
      const element = document.getElementById(nextQuestion.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 1);
  }
};

export function onValueChanged(sender, options) {
  clearPanel(sender, options);
  determinePotentialApplicants(sender, options);
  determineRecipients(sender, options);
  populateApplicantInfoPanelAndP1DeliveryInfoPanel(sender, options);
  determineEarliestSubmissionDate(sender, options);
  setLastUpdated(new Date());
  collectPrevAddresses(sender);
  toNextQuestion(options);
};
