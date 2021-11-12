<<<<<<< HEAD
import { addDays, format, getDay, parseISO } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
=======
import { addDays, getDay } from "date-fns";
import format from "date-fns/format";
>>>>>>> 44764c6 (Use formatting function)
import { FunctionFactory, ItemValue } from "survey-vue";
import { DayOfWeek, HolidayHelper } from "../utils/holiday";

// Returns 'y' or 'n', or 'u' for undefined and 'e' for error
const isChild = (params: any) => {
  if (!params && !params.length) return "u";
  const DOB = params[0];
  const MinorOrAdult = params[1];
  let dobReturn;
  let maReturn;
  const minYears = 19;

  if (DOB) {
    const now = new Date();
    const cmp = new Date(DOB);
    if (isNaN(cmp.getTime())) {
      dobReturn = "e";
    } else {
      dobReturn = "y";
      const yearDiff = now.getFullYear() - cmp.getFullYear();
      if (yearDiff > minYears) dobReturn = "n";
      else if (yearDiff === minYears) {
        if (cmp.getMonth() < now.getMonth()) dobReturn = "n";
        else if (cmp.getMonth() === now.getMonth() && cmp.getDate() < now.getDate())
          dobReturn = "n";
      }
    }
  }

  if (MinorOrAdult) {
    maReturn = MinorOrAdult === "Minor" ? "y" : "n";
  }

  if (!dobReturn && !maReturn) return "n";
  else if (dobReturn && !maReturn) return dobReturn;
  else if (!dobReturn && maReturn) return maReturn;
  else if (dobReturn === maReturn) return dobReturn;
  else return "e";
};

const listExcept = params => {
  if (!params && params.length < 2) return false;
  if (!params[0] || !params[1]) return [];
  return params[0].filter(value => !params[1].includes(value));
};

const listIntersect = params => {
  if (!params && params.length < 2) return false;
  if (!params[0] || !params[1]) return [];
  return params[0].filter(value => params[1].includes(value));
};

const listUnion = params => {
  if (!params && params.length < 2) return false;
  return (params[0] || []).concat(params[1] || []);
};

//targetDate:date, days:number, dayType = 'calendar' || 'business'
const getDateFromQuestionAndAddDays = params => {
  if (!params && params.length < 3) return false;
  const targetDate = params[0];
  const days = params[1];
  const dayType = params[2];
  const startingDate = new Date(targetDate);
  if (dayType == "calendar") {
    return addDays(startingDate, days);
  } else {
    let movedBusinessDays = 0;
    const statsForYears = [];
    for (let i = -100; i < 100; i++)
      statsForYears.concat(HolidayHelper.bcStats(targetDate.getFullYear() + i));
    const direction = days > 0 ? 1 : -1;
    let newDay = new Date();
    while (Math.abs(days) > movedBusinessDays) {
      newDay = addDays(startingDate, direction);
      if (
        !statsForYears[newDay.toString()] &&
        getDay(newDay) != DayOfWeek.Saturday &&
        getDay(newDay) != DayOfWeek.Sunday
      ) {
        movedBusinessDays++;
      }
      newDay = addDays(startingDate, 1);
    }
  }
};

//Needs to be function, otherwise this context wont work.
//Parameters: {spousePanel}, {childPanel}, <questionName for column choices>
function getApplicants(params) {
  if (!params) return false;
  if (params.length < 3) return false;
  const spousePanel = (params[0] || [])
    .filter(s => s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "y")
    .map(s => s.spouseName);
  const childPanel = (params[1] || [])
    .filter(s => s.childIsAlive == "y" && s.childIsAdult == "y" && s.childIsCompetent == "y")
    .map(s => s.childName);
  const targetQuestion = params[2];
  const participants = [spousePanel, childPanel].flat();
  //Update the column choices.
  this.question.survey.getQuestionByName(targetQuestion).columns[0].choices = participants;
  return participants;
}

//Parameters: {spousePanel}, {childPanel}, <questionName for rows>
export function getRecipients(params) {
  if (!params) return false;
  if (params.length < 3) return false;
  const spousePanel = (params[0] || [])
    .filter(s => s.spouseIsAlive == "n" || s.spouseIsAdult == "n" || s.spouseIsCompetent == "n")
    .map(s => s.spouseName);
  const childPanel = (params[1] || [])
    .filter(s => s.childIsAlive == "n" || s.childIsAdult == "n" || s.childIsCompetent == "n")
    .map(s => s.childName);
  const targetQuestion = params[2];
  const nonParticipants = [spousePanel, childPanel].flat();
  //Update the rows of the table.
  this.question.survey.getQuestionByName(targetQuestion).rows = nonParticipants.map(
    s => new ItemValue(s)
  );
  return nonParticipants;
}

//Parameters: {questionName} for rows.
export function determineEarliestSubmissionDate(params) {
  if (!params) return false;
  if (!params[0]) return false;
  const rows = params[0];
  const calculatedDates = [];
  Object.entries(rows).forEach(([key, value]) => {
    if (!value["Date Served"] || !value["Method"]) return;
    const method = value["Method"];
    let dateServed = parseISO(value["Date Served"] + "T08:00:00Z"); //8 should be fine.
    const timeOfDay = value["Time Of Day"];
    let extraNoticeDays = 21;
    switch (method) {
      case "In-Person":
        break;
      case "Mail": {
        /* For physical mail, it is + at least 7 days. 
           If that 7th day from served date is a Saturday/Sunday/BC Holiday, 
           needs to be calculating for the next BC business day, 
           then +21 days on top of that for the countdown. */
        let mailDays = 7;
        const bcStats = {
          ...HolidayHelper.bcStatsDates(dateServed.getFullYear()),
          ...HolidayHelper.bcStatsDates(dateServed.getFullYear() + 1)
        };
        let resolvedDate = false;
        while (!resolvedDate) {
          let destinationDate = addDays(dateServed, mailDays);
          const destinationDayOfWeek = getDay(destinationDate) as DayOfWeek;
          if (destinationDayOfWeek == DayOfWeek.Saturday) {
            mailDays += 2;
            continue;
          } else if (destinationDayOfWeek == DayOfWeek.Sunday) {
            mailDays += 1;
            continue;
          } else if (bcStats.hasOwnProperty(format(destinationDate, "yyyy-MM-dd"))) {
            mailDays += 1;
            continue;
          }
          resolvedDate = true;
          extraNoticeDays += mailDays;
        }
        break;
      }
      case "Electronic": {
        /* 
        For electronic/fax service:
        Saturday/Sunday/BC holiday, date served = next BC business day, then add 21 days on top of that
        Business day before 4pm, date served is the date served: +0 days, then +21 days on top of that for the countdown.
        Business day after 4pm, date served = next BC business day, then add 21 days on top of that
        */
        let electronicDays = 0;
        const bcStats = {
          ...HolidayHelper.bcStatsDates(dateServed.getFullYear()),
          ...HolidayHelper.bcStatsDates(dateServed.getFullYear() + 1)
        };
        let resolvedDate = false;
        while (!resolvedDate) {
          let destinationDate = addDays(dateServed, electronicDays);
          const destinationDayOfWeek = getDay(destinationDate) as DayOfWeek;
          if (destinationDayOfWeek == DayOfWeek.Saturday) {
            electronicDays += 2;
            continue;
          } else if (destinationDayOfWeek == DayOfWeek.Sunday) {
            electronicDays += 1;
            continue;
          } else if (bcStats.hasOwnProperty(format(destinationDate, "yyyy-MM-dd"))) {
            electronicDays += 1;
            continue;
          } else if (timeOfDay == "After 4pm" && electronicDays == 0) {
            electronicDays += 1;
            continue;
          }
          resolvedDate = true;
          extraNoticeDays += electronicDays;
        }
        break;
      }
    }
    dateServed = addDays(dateServed, extraNoticeDays);
    calculatedDates.push(dateServed);
  });
  if (calculatedDates.length == 0) return false;
  const earliestSubmissionDate = new Date(Math.max.apply(null, calculatedDates));
  return format(earliestSubmissionDate, "yyyy-MM-dd");
}

//Parameters: {questionName} for date.
const dateFormatter = params => {
  const dateItems = params[0].split("-");
  const year = dateItems[0];
  const month = dateItems[1].includes("0")
    ? parseInt(dateItems[1].split("0")[1]) - 1
    : parseInt(dateItems[1]) - 1;
  const day = dateItems[2].includes("0")
    ? parseInt(dateItems[2].split("0")[1])
    : parseInt(dateItems[2]);

  return format(new Date(year, month, day), "MMMM d, yyyy");
};

export const addCustomExpressions = (Survey: any) => {
  //Add this so ExpressionRunner can access it.
  FunctionFactory.Instance.register("listIntersect", listIntersect);
  FunctionFactory.Instance.register("listExcept", listExcept);
  FunctionFactory.Instance.register("listUnion", listUnion);
  FunctionFactory.Instance.register("isChild", isChild);
  FunctionFactory.Instance.register("getDateFromQuestionAndAddDays", getDateFromQuestionAndAddDays);
  FunctionFactory.Instance.register(
    "determineEarliestSubmissionDate",
    determineEarliestSubmissionDate
  );
  FunctionFactory.Instance.register("getApplicants", getApplicants);
  FunctionFactory.Instance.register("getRecipients", getRecipients);
  FunctionFactory.Instance.register("dateFormatter", dateFormatter);

  //For unit testing.
  if (!Survey) return;
  Survey.FunctionFactory.Instance.register("listIntersect", listIntersect);
  Survey.FunctionFactory.Instance.register("listExcept", listExcept);
  Survey.FunctionFactory.Instance.register("listUnion", listUnion);
  Survey.FunctionFactory.Instance.register("isChild", isChild);
  Survey.FunctionFactory.Instance.register(
    "getDateFromQuestionAndAddDays",
    getDateFromQuestionAndAddDays
  );
  Survey.FunctionFactory.Instance.register(
    "determineEarliestSubmissionDate",
    determineEarliestSubmissionDate
  );
  Survey.FunctionFactory.Instance.register("getApplicants", getApplicants);
  Survey.FunctionFactory.Instance.register("getRecipients", getRecipients);
  Survey.FunctionFactory.Instance.register("dateFormatter", dateFormatter);
};
