import { addDays, format, getDay, parseISO } from "date-fns";
import { FunctionFactory, ItemValue } from "survey-vue";
import { holidays } from "@/survey/survey-init";

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

//Parameters: {questionName} for date.
const dateFormatter = params => {
  if (!params) return false;
  if (!params[0]) return false;

  if (params[0] instanceof Date) {
    return format(params[0], "MMMM d, yyyy");
  } else {
    return format(parseISO(params[0] + "T08:00:00Z"), "MMMM d, yyyy");
  }
};

//Parameters: {questionName}, offset, dateType
export function dateMath(params: any[]) {
  if (!params) return false;
  if (params.length < 3) return false;

  const calcBusinessDays = (date, offset) => {
    if (offset === 0) {
      return date;
    }

    let daysCounted = 0;
    const crement = offset >= 0 ? 1 : -1;

    while (daysCounted !== offset) {
      date.setDate(date.getDate() + crement);
      const dayOfWeek = date.getDay();
      let holiday = false;

      for (const holidate in holidays) {
        if (date == holidate) {
          holiday = true;
          break;
        }
      }

      // calc for weekends
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holiday) {
        daysCounted += crement;
      }
    }
    return date;
  };

  const referenceDate = params[0] ? new Date(params[0].replace(/-/g, "/")) : null;
  const offset = params[1];
  const daysType = params[2];

  if (!referenceDate) {
    return "";
  }

  if (daysType === "calendar") {
    referenceDate.setDate(referenceDate.getDate() + offset);
    return format(referenceDate, "yyyy-MM-dd");
  } else if (daysType === "business") {
    return format(calcBusinessDays(referenceDate, offset), "yyyy-MM-dd");
  }
}

//REPGRANT-225 - Fix. 
export function currentDate(params: any) {
  return format(new Date(), "yyyy-MM-dd HH:mm");
}

//REPGRANT-225 - Fix. 
export function today(params: any) {
  let targetDate = new Date();
  if (params?.length == 1)
    targetDate.setDate(targetDate.getDate() + params[0]);
  return format(targetDate, "yyyy-MM-dd");
}

export const addCustomExpressions = (Survey: any) => {
  //Add this so ExpressionRunner can access it.
  FunctionFactory.Instance.register("listIntersect", listIntersect);
  FunctionFactory.Instance.register("listExcept", listExcept);
  FunctionFactory.Instance.register("listUnion", listUnion);
  FunctionFactory.Instance.register("isChild", isChild);
  FunctionFactory.Instance.register("dateFormatter", dateFormatter);
  FunctionFactory.Instance.register("dateMath", dateMath);
  FunctionFactory.Instance.register("today", today);
  FunctionFactory.Instance.register("currentDate", currentDate);

  //For unit testing.
  if (!Survey) return;

  //It might be possible to get the registered functions below in our survey instance, versus the static instance.
  Survey.FunctionFactory.Instance.register("listIntersect", listIntersect);
  Survey.FunctionFactory.Instance.register("listExcept", listExcept);
  Survey.FunctionFactory.Instance.register("listUnion", listUnion);
  Survey.FunctionFactory.Instance.register("isChild", isChild);
  Survey.FunctionFactory.Instance.register("dateFormatter", dateFormatter);
  Survey.FunctionFactory.Instance.register("dateMath", dateMath);
  Survey.FunctionFactory.Instance.register("today", today);
  Survey.FunctionFactory.Instance.register("currentDate", currentDate);
};
