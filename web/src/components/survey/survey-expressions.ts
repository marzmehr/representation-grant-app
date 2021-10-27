import { addDays, getDay } from "date-fns";
import { ExpressionRunner, FunctionFactory } from "survey-vue";
import { DayOfWeek, HolidayHelper } from "../utils/holiday";

export function addCustomExpressions(Survey: any) {
  // Returns 'y' or 'n', or 'u' for undefined and 'e' for error
  function isChild(params: any) {
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
  }

  function listExcept(params) {
    if (!params && params.length < 2) return false;
    if (!params[0] || !params[1]) return [];
    return params[0].filter(value => !params[1].includes(value));
  }

  function listIntersect(params) {
    if (!params && params.length < 2) return false;
    if (!params[0] || !params[1]) return [];
    return params[0].filter(value => params[1].includes(value));
  }

  function listUnion(params) {
    if (!params && params.length < 2) return false;
    if (!params[0] || !params[1]) return [];
    return params[0].concat(params[1]);
  }

  function panelFilter(params) {
    if (!params && params.length < 2) return false;
    let target = params[0];
    if (!target) return target;
    for (let i = 1; i < params.length; i++) {
      const key = params[i].split(" ")[0];
      const operation = params[i].split(" ")[1];
      const value = params[i].split(" ")[2];
      console.log(`Key: ${key}`);
      console.log(`Operation: ${operation}`);
      console.log(`Value: ${value}`);
      switch (operation) {
        case "<":
          target = target?.filter(e => e[key] && e[key] < value);
          break;
        case ">":
          target = target?.filter(e => e[key] && e[key] > value);
          break;
        case "=":
        case "==":
          target = target?.filter(e => e[key] && e[key] == value);
          break;
        case "!=":
          target = target?.filter(e => e[key] && e[key] != value);
          break;
        case "in":
          target = target?.filter(e => e[key] && value.includes(e[key]));
          break;
        case "not in":
          target = target?.filter(e => e[key] && !value.includes(e[key]));
          break;
      }
    }
    return target;
  }

  //targetDate:date, days:number, dayType = 'calendar' || 'business'
  function getDateFromQuestionAndAddDays(params) {
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
  }

  //Add this so ExpressionRunner can access it.
  FunctionFactory.Instance.register("listIntersect", listIntersect);
  FunctionFactory.Instance.register("listExcept", listExcept);
  FunctionFactory.Instance.register("listUnion", listUnion);
  FunctionFactory.Instance.register("panelFilter", panelFilter);
  FunctionFactory.Instance.register("isChild", isChild);
  FunctionFactory.Instance.register("getDateFromQuestionAndAddDays", getDateFromQuestionAndAddDays);

  Survey.FunctionFactory.Instance.register("listIntersect", listIntersect);
  Survey.FunctionFactory.Instance.register("listExcept", listExcept);
  Survey.FunctionFactory.Instance.register("listUnion", listUnion);
  Survey.FunctionFactory.Instance.register("panelFilter", panelFilter);
  Survey.FunctionFactory.Instance.register("isChild", isChild);
  Survey.FunctionFactory.Instance.register(
    "getDateFromQuestionAndAddDays",
    getDateFromQuestionAndAddDays
  );
}
