//Needs to be function, otherwise this context wont work.
import { notifyP1DeliveryInfoPanel, SurveyQuestionNames } from "@/types/survey-primary";
import { addDays, format, parseISO } from "date-fns";
import { ItemValue, Survey } from "survey-vue";
import {
  getPotentialApplicants,
  setApplicants,
  setLastUpdated,
  setPotentialApplicants,
  setPrevAddresses,
  setRecipients
} from "@/state/survey-state";


// TODO: We really need to pull the applicant and recipient methods apart to clean things up

enum Roles {
  spouse,
  spouseGuardian,
  spouseNominee,
  spousePersonalRep,
  child,
  childGuardian,
  childNominee,
  childPersonalRep,
  gChild,
  gChildGuardian,
  gChildNominee,
  gChildPersonalRep,
  gGChild,
  gGChildGuardian,
  gGChildNominee,
  gGChildPersonalRep,
  gGGChild,
  gGGChildGuardian,
  gGGChildNominee,
  gGGChildPersonalRep,
  descendant,
  descendantGuardian,
  descendantNominee,
  descendantPersonalRep,
  parent,
  parentGuardian,
  parentNominee,
  parentPersonalRep,
  sibling,
  siblingGuardian,
  siblingNominee,
  siblingPersonalRep,
  nibling,
  niblingGuardian,
  niblingNominee,
  niblingPersonalRep,
  gNibling,
  gNiblingGuardian,
  gNiblingNominee,
  gNiblingPersonalRep,
  gParent,
  gParentGuardian,
  gParentNominee,
  gParentPersonalRep,
  pibling,
  piblingGuardian,
  piblingNominee,
  piblingPersonalRep,
  cousin,
  cousinGuardian,
  cousinNominee,
  cousinPersonalRep,
  gGParent,
  gGParentGuardian,
  gGParentNominee,
  gGParentPersonalRep,
  gPibling,
  gPiblingGuardian,
  gPiblingNominee,
  gPiblingPersonalRep,
  firstNation,
  executor,
  beneficiary,
  creditorPerson,
  creditorPersonGuardian,
  creditorPersonNominee,
  creditorPersonPersonalRep,
  creditorOrganization,
  foreignWillExtra,
  applicantCitor,
  applicantCitorNominee,
  applicantCitorGuardian,
  applicantCitorPersonalRep,
  pgt,
  organization,
  childWelfare,
}

//Helper function, that either grabs value from the event, or from the survey via getQuestionByName.
const getValueFromOptionsOrGetQuestion = (
  sender,
  options,
  questionName: string,
  getText?: boolean
) => {
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
    return options.question.choices?.find(c => c.value == options.value)?.text;
  } else {
    const base = sender.getQuestionByName(questionName);
    return base.choices?.find(c => c.value == base?.value)?.text;
  }
};

export const populateApplicantInfoPanel = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.applicantChoice,
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel,
    SurveyQuestionNames.spouseExists,
    SurveyQuestionNames.childExists,
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
};

export const populateP1DeliveryInfoPanel = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.applicantChoice,
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel,
    SurveyQuestionNames.spouseExists,
    SurveyQuestionNames.childExists,
    SurveyQuestionNames.applicantCitorInfoPanel,
  ];
  if (!questionNamesToWatch.includes(options.name)) return;
  const applicantChoice =
    sender.getQuestionByName(SurveyQuestionNames.applicantChoice)?.value || [];
  const applicants = !Array.isArray(applicantChoice) ? [applicantChoice] : applicantChoice;
  const potentialApplicants = getPotentialApplicants.value || [];
  const p1DeliveryInfoPanel = sender.getQuestionByName(
    SurveyQuestionNames.notifyP1DeliveryInfoPanel
  );

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
    if (
      getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.spouseExists) === "n"
    ) {
      sender.getQuestionByName(SurveyQuestionNames.spouseInfoPanel).value = [];
    }
  } else if (options.name === SurveyQuestionNames.childExists) {
    if (
      getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.childExists) === "n"
    ) {
      sender.getQuestionByName(SurveyQuestionNames.childInfoPanel).value = [];
    }
  }
};

export const determinePotentialApplicants = (sender, options) => {
  enum QuestionNamesToWatch {
    spouseInfoPanel = SurveyQuestionNames.spouseInfoPanel,
    spouseExists = SurveyQuestionNames.spouseExists,
    spouseIsAlive = SurveyQuestionNames.spouseIsAlive,
    spouseIsAdult = SurveyQuestionNames.spouseIsAdult,
    spouseHasGuardian = SurveyQuestionNames.spouseHasGuardian,
    
    childInfoPanel = SurveyQuestionNames.childInfoPanel,
    childExists = SurveyQuestionNames.childExists,
    childIsAlive = SurveyQuestionNames.childIsAlive,
    childIsAdult = SurveyQuestionNames.childIsAdult,
    childHasGuardian = SurveyQuestionNames.childHasGuardian,

    deceasedFirstNations = SurveyQuestionNames.deceasedFirstNations,
    deceasedFirstNationsName =  SurveyQuestionNames.deceasedFirstNationsName,
    
    creditorPersonInfoPanel = SurveyQuestionNames.creditorPersonInfoPanel,
    creditorPersonExists = SurveyQuestionNames.creditorPersonExists,
    creditorPersonIsAlive = SurveyQuestionNames.creditorPersonIsAlive,
    creditorPersonIsAdult = SurveyQuestionNames.creditorPersonIsAdult,
    creditorPersonHasGuardian = SurveyQuestionNames.creditorPersonHasGuardian,
    
    creditorOrganizationInfoPanel = SurveyQuestionNames.creditorOrganizationInfoPanel,
    creditorOrganizationExists = SurveyQuestionNames.creditorOrganizationExists,
  };

  if (!Object.values(QuestionNamesToWatch).includes(options.name)) return;

  let spousePanel = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.spouseInfoPanel.toString()) || [];
  const spouseExists = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.spouseExists.toString());

  let childPanel = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.childInfoPanel.toString()) || [];
  const childExists = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.childExists.toString());

  let isFirstNations = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.deceasedFirstNations.toString());
  const firstNationsName = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.deceasedFirstNationsName.toString(), true);

  let creditorPersonPanel = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.creditorPersonInfoPanel.toString()) || [];
  const creditorPersonExists = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.creditorPersonExists.toString());

  let creditorOrganizationPanel = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.creditorOrganizationInfoPanel.toString()) || [];
  const creditorOrganizationExists = getValueFromOptionsOrGetQuestion(sender, options, QuestionNamesToWatch.creditorOrganizationExists.toString());

  // todo: refactor this into sections
  let spouseGuardianPanel = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "n" && s.spouseHasGuardian == "y")
    .map(s => `${s.spouseGuardianName} (as ${s.spouseName}'s Guardian)`)

  let spouseNomineePanel = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "n" && s.spouseHasNominee == "y")
    .map(s => `${s.spouseNomineeName} (as ${s.spouseName}'s Nominee)`);

  let spousePersonalRepPanel = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "n" && s.spouseDiedAfter == "y" && s.spouseHasPersonalRep == "y")
    .map(s => `${s.spousePersonalRepName} (as ${s.spouseName}'s Personal Representative)`);

  spousePanel = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "y")
    .map(s => s.spouseName);

  let childGuardianPanel = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "n" && s.childHasGuardian == "y")
    .map(s => `${s.childGuardianName} (as ${s.childName}'s Guardian)`)

  let childNomineePanel = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "n" && s.childHasNominee == "y")
    .map(s => `${s.childNomineeName} (as ${s.childName}'s Nominee)`);

  let childPersonalRepPanel = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "n" && s.childDiedAfter == "y" && s.childHasPersonalRep == "y")
    .map(s => `${s.childPersonalRepName} (as ${s.childName}'s Personal Representative)`);

  childPanel = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "y")
    .map(s => s.childName);

  const firstNationsPanel = isFirstNations == "y" && firstNationsName ? [firstNationsName] : [];

  let creditorPersonGuardianPanel = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "y" && s.creditorPersonIsAdult == "n" && s.creditorPersonHasGuardian == "y")
    .map(s => `${s.creditorPersonGuardianName} (as ${s.creditorPersonName}'s Guardian)`)

  let creditorPersonNomineePanel = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "y" && s.creditorPersonIsAdult == "y" && s.creditorPersonIsCompetent == "n" && s.creditorPersonHasNominee == "y")
    .map(s => `${s.creditorPersonNomineeName} (as ${s.creditorPersonName}'s Nominee)`);

  let creditorPersonPersonalRepPanel = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "n" && s.creditorPersonHasPersonalRep == "y")
    .map(s => `${s.creditorPersonPersonalRepName} (as ${s.creditorPersonName}'s Personal Representative)`);

  creditorPersonPanel = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "y" && s.creditorPersonIsAdult == "y" && s.creditorPersonIsCompetent == "y")
    .map(s => s.creditorPersonName);

  creditorOrganizationPanel = creditorOrganizationPanel
    .filter(s => creditorOrganizationExists == "y")
    .map(s => s.creditorOrganizationName);

  const potentialApplicants = [
    ...spousePanel.map((sp, index) => ({
      applicantRole: Roles[Roles.spouse],
      applicantName: sp,
      key: `s${index}`
    })),
    ...spouseGuardianPanel.map((sp, index) => ({
      applicantRole: Roles[Roles.spouseGuardian],
      applicantName: sp,
      key: `sg${index}`
    })),
    ...spouseNomineePanel.map((sp, index) => ({
      applicantRole: Roles[Roles.spouseNominee],
      applicantName: sp,
      key: `sn${index}`
    })),
    ...spousePersonalRepPanel.map((sp, index) => ({
      applicantRole: Roles[Roles.spousePersonalRep],
      applicantName: sp,
      key: `spr${index}`
    })),
    ...childPanel.map((c, index) => ({
      applicantRole: Roles[Roles.child],
      applicantName: c,
      key: `c${index}`
    })),
    ...childGuardianPanel.map((c, index) => ({
      applicantRole: Roles[Roles.childGuardian],
      applicantName: c,
      key: `cg${index}`
    })),
    ...childNomineePanel.map((c, index) => ({
      applicantRole: Roles[Roles.childNominee],
      applicantName: c,
      key: `cn${index}`
    })),
    ...childPersonalRepPanel.map((sp, index) => ({
      applicantRole: Roles[Roles.childPersonalRep],
      applicantName: sp,
      key: `cpr${index}`
    })),
    ...firstNationsPanel.map((f, index) => ({
      applicantRole: Roles[Roles.firstNation],
      applicantName: f,
      key: `f${index}`
    })),
    ...creditorPersonPanel.map((cr, index) => ({
      applicantRole: Roles[Roles.creditorPerson],
      applicantName: cr,
      key: `crp${index}`
    })),
    ...creditorPersonGuardianPanel.map((cr, index) => ({
      applicantRole: Roles[Roles.creditorPersonGuardian],
      applicantName: cr,
      key: `crpg${index}`
    })),
    ...creditorPersonNomineePanel.map((cr, index) => ({
      applicantRole: Roles[Roles.creditorPersonNominee],
      applicantName: cr,
      key: `crn${index}`
    })),
    ...creditorPersonPersonalRepPanel.map((sp, index) => ({
      applicantRole: Roles[Roles.creditorPersonPersonalRep],
      applicantName: sp,
      key: `spr${index}`
    })),
    ...creditorOrganizationPanel.map((cr, index) => ({
      applicantRole: Roles[Roles.creditorOrganization],
      applicantName: cr,
      key: `cro${index}`
    })),
  ];

  const applicantChoice = sender.getQuestionByName(SurveyQuestionNames.applicantChoice);
  if (applicantChoice) {
    applicantChoice.choices = potentialApplicants.map(
      p => new ItemValue(`${p.key}`, `${p.applicantName}`)
    );
  }
  setPotentialApplicants(potentialApplicants);
};

export const determineRecipients = (sender, options) => {
  const questionNamesToWatch = [
    SurveyQuestionNames.applicantChoice,
    SurveyQuestionNames.spouseInfoPanel,
    SurveyQuestionNames.childInfoPanel,
    SurveyQuestionNames.deceasedFirstNations,
    SurveyQuestionNames.deceasedFirstNationsName,
    SurveyQuestionNames.applicantCitorInfoPanel,
    SurveyQuestionNames.creditorPersonInfoPanel,
  ];
  if (!questionNamesToWatch.includes(options.name)) return;

  let selectedApplicants =
    getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.applicantChoice) || [];
  const potentialApplicants = getPotentialApplicants.value;

  //Handle both Checkbox and Radiogroup cases.
  let recipients = potentialApplicants
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

  // PGT are not applicants and are handled separately
  let spousePanel = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.spouseInfoPanel) || [];
  const spouseExists = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.spouseExists);

  let spousePGT = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "y" && (s.spouseIsAdult == "n" || s.spouseIsCompetent == "n"))
    .map(s => s.spouseName);

  let childPanel = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.childInfoPanel) || [];
  const childExists = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.childExists);

  let childPGT = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && (s.childIsAdult == "n" || s.childIsCompetent == "n"))
    .map(s => s.childName);

  let creditorPersonPanel = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.creditorPersonInfoPanel) || [];
  const creditorPersonExists = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.creditorPersonExists);

  let creditorPersonPGT = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "y" && (s.creditorPersonIsAdult == "n" || s.creditorPersonIsCompetent == "n"))
    .map(s => s.creditorPersonName);

  let applicantCitorPanel = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.applicantCitorInfoPanel) || [];
  const applicantCitorExists = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.applicantCitorNewExists);
  const applicantCited = getValueFromOptionsOrGetQuestion(sender, options, SurveyQuestionNames.applicantCited);

  const citorRegular = applicantCitorPanel
    .filter(s => applicantCited == "y" && applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "y" && s.applicantCitorIsAdult == "y" && s.applicantCitorIsCompetent == "y")
    .map(s => s.applicantCitorName);

  for (const key in citorRegular) {
    const s = {
      recipientRole: Roles[Roles.applicantCitor],
      recipientName: citorRegular[key],
      key: `ac${key}`
    }
    recipients.push(s);
  };

  let applicantCitorPGT = applicantCitorPanel
    .filter(s => applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "y" && (s.applicantCitorIsAdult == "n" || s.applicantCitorIsCompetent == "n"))
    .map(s => s.applicantCitorName);

  const isPGT = spousePGT.length + childPGT.length + creditorPersonPGT.length + applicantCitorPGT.length;
  if (isPGT > 0) {
    const pgt = {
      recipientRole: Roles[Roles.pgt],
      recipientName: "The Public Guardian & Trustee (PGT)",
      key: `pgt0`
    }

    recipients.push(pgt);
  }

  // REPGRANT-331
  let spouseSuccessor = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "n" && s.spouseHasNominee == "y")
    .map(s => s.spouseName);
  
  let childSuccessor = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "n" && s.childHasNominee == "y")
    .map(s => s.childName);

  let creditorPersonSuccessor = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "y" && s.creditorPersonIsAdult == "y" && s.creditorPersonIsCompetent == "n" && s.creditorPersonHasNominee == "y")
    .map(s => s.creditorPersonName);

  let applicantCitorSuccessor = applicantCitorPanel
    .filter(s => applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "y" && s.applicantCitorIsAdult == "y" && s.applicantCitorIsCompetent == "n" && s.applicantCitorHasNominee == "y")
    .map(s => s.applicantCitorName);

  let applicantCitorNominee = applicantCitorPanel
    .filter(s => applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "y" && s.applicantCitorIsAdult == "y" && s.applicantCitorIsCompetent == "n" && s.applicantCitorHasNominee == "y")
    .map(s => `${s.applicantCitorNomineeName} (as ${s.applicantCitorName}'s Nominee)`);

  for (const key in spouseSuccessor) {
    const s = {
      recipientRole: Roles[Roles.spouse],
      recipientName: spouseSuccessor[key],
      key: `s${key}`
    }
    recipients.push(s);
  };

  for (const key in childSuccessor) {
    const s = {
      recipientRole: Roles[Roles.child],
      recipientName: childSuccessor[key],
      key: `c${key}`
    }
    recipients.push(s);
  };

  for (const key in creditorPersonSuccessor) {
    const s = {
      recipientRole: Roles[Roles.creditorPerson],
      recipientName: creditorPersonSuccessor[key],
      key: `cr${key}`
    }
    recipients.push(s);
  };

  for (const key in applicantCitorSuccessor) {
    const s = {
      recipientRole: Roles[Roles.applicantCitor],
      recipientName: applicantCitorSuccessor[key],
      key: `ac${key}`
    }
    recipients.push(s);
  };

  for (const key in applicantCitorNominee) {
    const s = {
      recipientRole: Roles[Roles.applicantCitorNominee],
      recipientName: applicantCitorNominee[key],
      key: `acn${key}`
    }
    recipients.push(s);
  };

  // REPGRANT-368
  let spouseIncompetent = spousePanel
  .filter(s => spouseExists == "y")
  .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "n" && s.spouseHasNominee == "n")
  .map(s => `${s.spouseName} (Mentally Incompetent Adult without a Nominee)`);

  let childIncompetent = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "n" && s.childHasNominee == "n")
    .map(s => `${s.childName} (Mentally Incompetent Adult without a Nominee)`);

  let creditorPersonIncompetent = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "y" && s.creditorPersonIsAdult == "y" && s.creditorPersonIsCompetent == "n" && s.creditorPersonHasNominee == "n")
    .map(s => `${s.creditorPersonName} (Mentally Incompetent Adult without a Nominee)`);

  let applicantCitorIncompetent = applicantCitorPanel
    .filter(s => applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "y" && s.applicantCitorIsAdult == "y" && s.applicantCitorIsCompetent == "n" && s.applicantCitorHasNominee == "n")
    .map(s => `${s.applicantCitorName} (Mentally Incompetent Adult without a Nominee)`);

  for (const key in spouseIncompetent) {
    const s = {
      recipientRole: Roles[Roles.spouse],
      recipientName: spouseIncompetent[key],
      key: `s${key}`
    }
    recipients.push(s);
  };

  for (const key in childIncompetent) {
    const s = {
      recipientRole: Roles[Roles.child],
      recipientName: childIncompetent[key],
      key: `c${key}`
    }
    recipients.push(s);
  };

  for (const key in creditorPersonIncompetent) {
    const s = {
      recipientRole: Roles[Roles.creditorPerson],
      recipientName: creditorPersonIncompetent[key],
      key: `cr${key}`
    }
    recipients.push(s);
  };

  for (const key in applicantCitorIncompetent) {
    const s = {
      recipientRole: Roles[Roles.applicantCitor],
      recipientName: applicantCitorIncompetent[key],
      key: `ac${key}`
    }
    recipients.push(s);
  };

  // REPGRANT-366
  let spouseMinorNoGuardian = spousePanel
    .filter(s => spouseExists == "y")
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "n" && s.spouseHasGuardian == "n")
    .map(s => `${s.spouseName} (Minor without a Guardian)`);

  let childMinorNoGuardian = childPanel
    .filter(s => childExists == "y")
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "n" && s.childHasGuardian == "n")
    .map(s => `${s.childName} (Minor without a Guardian)`);

  let creditorPersonMinorNoGuardian = creditorPersonPanel
    .filter(s => creditorPersonExists == "y")
    .filter(s => s.creditorPersonIsAlive == "y" && s.creditorPersonIsAdult == "n" && s.creditorPersonHasGuardian == "n")
    .map(s => `${s.creditorPersonName} (Minor without a Guardian)`);

  let applicantCitorMinorNoGuardian = applicantCitorPanel
    .filter(s => applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "y" && s.applicantCitorIsAdult == "n" && s.applicantCitorHasGuardian == "n")
    .map(s => `${s.applicantCitorName} (Minor without a Guardian)`);

  let applicantCitorGuardian = applicantCitorPanel
    .filter(s => applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "y" && s.applicantCitorIsAdult == "n" && s.applicantCitorHasGuardian == "y")
    .map(s => `${s.applicantCitorGuardianName} (as ${s.applicantCitorName}'s Guardian)`)

  for (const key in spouseMinorNoGuardian) {
    const s = {
      recipientRole: Roles[Roles.spouse],
      recipientName: spouseMinorNoGuardian[key],
      key: `s${key}`
    }
    recipients.push(s);
  };

  for (const key in childMinorNoGuardian) {
    const s = {
      recipientRole: Roles[Roles.child],
      recipientName: childMinorNoGuardian[key],
      key: `c${key}`
    }
    recipients.push(s);
  };

  for (const key in creditorPersonMinorNoGuardian) {
    const s = {
      recipientRole: Roles[Roles.creditorPerson],
      recipientName: creditorPersonMinorNoGuardian[key],
      key: `cr${key}`
    }
    recipients.push(s);
  };

  for (const key in applicantCitorMinorNoGuardian) {
    const s = {
      recipientRole: Roles[Roles.applicantCitor],
      recipientName: applicantCitorMinorNoGuardian[key],
      key: `ac${key}`
    }
    recipients.push(s);
  };

  for (const key in applicantCitorGuardian) {
    const s = {
      recipientRole: Roles[Roles.applicantCitorGuardian],
      recipientName: applicantCitorGuardian[key],
      key: `acg${key}`
    }
    recipients.push(s);
  };

  let applicantCitorPersonalRep = applicantCitorPanel
    .filter(s => applicantCitorExists == "y")
    .filter(s => s.applicantCitorIsAlive == "n" && s.applicantCitorHasPersonalRep == "y")
    .map(s => `${s.applicantCitorPersonalRepName} (as ${s.applicantCitorName}'s Personal Representative)`);

  for (const key in applicantCitorPersonalRep) {
    const s = {
      recipientRole: Roles[Roles.applicantCitorPersonalRep],
      recipientName: applicantCitorPersonalRep[key],
      key: `acpr${key}`
    }
    recipients.push(s);
  };

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

export const collectPrevAddresses = sender => {
  let addressQuestions = [];
  const keys = ["street", "city", "country", "state", "postalCode", "phone", "fax", "email"];

  const validEntry = (question) => {
    let hasAllValues = true;
    for (const key of keys) {
      if (question[key] && !question.value[key]) {
        hasAllValues = false;
      }
    }

    if (hasAllValues) {
      addressQuestions.push(question.value);
    }
  };

  const validPanel = (panels) => {
    for (const panel of panels) {
      for (const question of panel.questions) {
        if (question.getType() === "address" && question.value) {
          validEntry(question);
        }
      }
    }
  };

  for (const page of sender.pages) {
    for (const question of page.questions) {
      if (question.getType() === "paneldynamic") {
        validPanel(question.panels);
      } else if (question.getType() === "address" && question.value) {
        validEntry(question);
      }
    }
  }

  const uniqueAddressQuestions = addressQuestions.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        check =>
          check.street === value.street &&
          check.city === value.city &&
          check.state === value.state &&
          check.country === value.country &&
          check.postalCode === value.postalCode &&
          check.email === value.email &&
          check.phone === value.phone &&
          check.fax === value.fax
      )
  );

  setPrevAddresses(uniqueAddressQuestions);
};

export const toNextQuestion = options => {
  const typesToSkip = [
    "address",
    "comment",
    "contactinfo",
    "expression",
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
  if (options.question.survey.platformName != "vue") return; //Disable this for editor mode.

  const filterQuestions = questions => {
    return questions.filter(
      q => q.isVisible && q.getType() !== "helptext" && q.getType() !== "expression"
    );
  };

  const currQuestion = options.question;
  let filtered;
  let nextQuestion;

  if (currQuestion.getType() === "paneldynamic") {
    // avoid scrolling on dynamic panels until 
    return;
    
    // const panels = currQuestion?.panels;

    // for (let panel of panels) {
    //   filtered = filterQuestions(panel.questions);
    //   nextQuestion = filtered.find(q => !q.value);

    //   if (nextQuestion) {
    //     // check if question in panel is usable
    //     const currQuestionInPanel = filtered[filtered.indexOf(nextQuestion) - 1];
    //     if (currQuestionInPanel && typesToSkip.includes(currQuestionInPanel.getType())) {
    //       nextQuestion = null;
    //     }
    //     break;
    //   }
    // }
  }

  // if we are at the end of the panel, we get the next question the usual way
  if (!nextQuestion) {
    let questions = [];
    currQuestion.page.addQuestionsToList(questions, true);
    filtered = filterQuestions(questions);
    const indexOfNextQuestion = filtered.indexOf(currQuestion) + 1;
    nextQuestion = filtered[indexOfNextQuestion];
  }

  if (nextQuestion) {
    setTimeout(() => {
      const element = document.getElementById(nextQuestion.id);
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 110, // leave room for the header
          behavior: "smooth"
        });
      }
    }, 1);
  }
};

export function onValueChanged(sender, options) {
  clearPanel(sender, options);
  determinePotentialApplicants(sender, options);
  determineRecipients(sender, options);
  populateApplicantInfoPanel(sender, options);
  populateP1DeliveryInfoPanel(sender, options);
  determineEarliestSubmissionDate(sender, options);
  setLastUpdated(new Date());
  collectPrevAddresses(sender);
  toNextQuestion(options);
}
