import { addDays, format, getDay, parseISO } from "date-fns";
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

//Parameters: {questionName} for rows.
export function determineEarliestSubmissionDate(params: any[]) {
  console.log('determineEarliestSubmissionDate');
  if (!params) return false;
  if (!params[0]) return false;
  const rows = params[0];
  const calculatedDates = [];
  Object.entries(rows).forEach(([key, value]) => {
    if (!value["Date Served"] || !value["Method"]) return;
    const method = value["Method"];
    let dateServed = parseISO(value["Date Served"]);
    const timeOfDay = value["Time Of Day"];
    let extraNoticeDays = 21;
    switch (method) {
      case "In-Person":
        break;
      case "Electronic": 
      case "Mail": 
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
        let offsetDays = method == "Mail" ? 7 : 0;
        const bcStats = {
          ...HolidayHelper.bcStatsDates(dateServed.getFullYear()),
          ...HolidayHelper.bcStatsDates(dateServed.getFullYear() + 1)
        };
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
          } else if (method == "Electronic" && timeOfDay == "After 4pm" && offsetDays == 0) {
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
  return format(earliestSubmissionDate, "yyyy-MM-dd");
}

//Parameters: {questionName} for date.
const dateFormatter = params => {
  if (!params) return "";
  if (!params[0]) return "";

  return format(parseISO(params[0] + "T08:00:00Z"), "MMMM d, yyyy");
};

export const addCustomExpressions = (Survey: any) => {
  //Add this so ExpressionRunner can access it.
  FunctionFactory.Instance.register("listIntersect", listIntersect);
  FunctionFactory.Instance.register("listExcept", listExcept);
  FunctionFactory.Instance.register("listUnion", listUnion);
  FunctionFactory.Instance.register("isChild", isChild);
  FunctionFactory.Instance.register(
    "determineEarliestSubmissionDate",
    determineEarliestSubmissionDate
  );
  FunctionFactory.Instance.register("dateFormatter", dateFormatter);

  //For unit testing.
  if (!Survey) return;

  //It might be possible to get the registered functions below in our survey instance, versus the static instance.
  Survey.FunctionFactory.Instance.register("listIntersect", listIntersect);
  Survey.FunctionFactory.Instance.register("listExcept", listExcept);
  Survey.FunctionFactory.Instance.register("listUnion", listUnion);
  Survey.FunctionFactory.Instance.register("isChild", isChild);
  Survey.FunctionFactory.Instance.register(
    "determineEarliestSubmissionDate",
    determineEarliestSubmissionDate
  );
  Survey.FunctionFactory.Instance.register("dateFormatter", dateFormatter);

};

