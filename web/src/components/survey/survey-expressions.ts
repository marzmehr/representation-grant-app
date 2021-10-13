import { addDays, getDay } from "date-fns";
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
          else if (
            cmp.getMonth() === now.getMonth() &&
            cmp.getDate() < now.getDate()
          )
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
        statsForYears.concat(
          HolidayHelper.bcStats(targetDate.getFullYear() + i)
        );
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

  Survey.FunctionFactory.Instance.register(
    "getDateFromQuestionAndAddDays",
    getDateFromQuestionAndAddDays
  );

  Survey.FunctionFactory.Instance.register("isChild", isChild);
}
