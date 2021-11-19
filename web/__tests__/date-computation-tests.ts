import { HolidayHelper, MonthOfYear } from "../src/components/utils/holiday";
import {
  determineEarliestSubmissionDate
} from "../src/components/survey/survey-expressions";

describe("Test holiday date detection / determine EarliestSubmissionDate", () => {
  it("Test Holiday generation for 2029.", () => {
    const stats = HolidayHelper.bcStats(2029);
    const newYears = new Date(2029, MonthOfYear.January, 1);
    const familyDay = new Date(2029, MonthOfYear.February, 19);
    const goodFriday = new Date(2029, MonthOfYear.March, 30);
    const easterMonday = new Date(2029, MonthOfYear.April, 2);
    const victoriaDay = new Date(2029, MonthOfYear.May, 21);
    const canadaDay = new Date(2029, MonthOfYear.July, 2);
    const bcDay = new Date(2029, MonthOfYear.August, 6);
    const labourDay = new Date(2029, MonthOfYear.September, 3);
    const truthReconciliationDay = new Date(2029, MonthOfYear.October, 1);
    const thanksgiving = new Date(2029, MonthOfYear.October, 8);
    const rememberanceDay = new Date(2029, MonthOfYear.November, 12);
    const christmasDay = new Date(2029, MonthOfYear.December, 25);
    const boxingDay = new Date(2029, MonthOfYear.December, 26);
    expect(stats[newYears.toString()]).toBeDefined();
    expect(stats[familyDay.toString()]).toBeDefined();
    expect(stats[goodFriday.toString()]).toBeDefined();
    expect(stats[easterMonday.toString()]).toBeDefined();
    expect(stats[victoriaDay.toString()]).toBeDefined();
    expect(stats[canadaDay.toString()]).toBeDefined();
    expect(stats[bcDay.toString()]).toBeDefined();
    expect(stats[labourDay.toString()]).toBeDefined();
    expect(stats[truthReconciliationDay.toString()]).toBeDefined();
    expect(stats[thanksgiving.toString()]).toBeDefined();
    expect(stats[rememberanceDay.toString()]).toBeDefined();
    expect(stats[christmasDay.toString()]).toBeDefined();
    expect(stats[boxingDay.toString()]).toBeDefined();
  });

  it("REPGRANT-153 - Mail - Submission Date Conditions", () => {
    const saturdayDate = determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2021-11-06",
          "Method": "Mail"
        }
      }
    ]);
    expect(saturdayDate).toBe("2021-12-06");
    const sundayDate = determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2021-11-07",
          "Method": "Mail"
        }
      }
    ]);
    expect(sundayDate).toBe("2021-12-06");

    const holidayDate = determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2021-11-04",
          "Method": "Mail"
        }
      }
    ]);
    expect(holidayDate).toBe("2021-12-03");
  });

  it("REPGRANT-153 - In-Person - Submission Date Conditions", () => {
    const inPersonDate = determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2020-01-01",
          "Method": "In-Person",
        }
      }
    ]);
    expect(inPersonDate).toBe("2020-01-22");
  });

  it("REPGRANT-153 - Electronic - Submission Date Conditions", () => {
    expect(determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2021-11-27",
          "Method": "Electronic",
        }
      }
    ])).toBe("2021-12-20");
    const sundayDate = determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2021-11-28",
          "Method": "Electronic",
        }
      }
    ]);
    expect(sundayDate).toBe("2021-12-20");
    const holidayDate = determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2025-12-25",
          "Method": "Electronic",
        }
      }
    ]);
    expect(holidayDate).toBe("2026-01-19");
    const holidayDate2 = determineEarliestSubmissionDate([
      {
        row: {
          "Date Served": "2025-12-26",
          "Method": "Electronic",
        }
      }
    ]);
  });
});
