import { addDays, getDay, format } from "date-fns";

//This is Day of the week for Date() type.
export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

//This is for Month of Year for Date() type.
export enum MonthOfYear {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11
}

export const HolidayHelper = {
  //This has no timezone affiliated to it, and is just the yyyy-MM-dd.
  bcStatsDates: function(year: number) {
    const statsByString = []
    for (let [k, v] of Object.entries(HolidayHelper.bcStats(year))) 
      statsByString[format(Date.parse(k), "yyyy-MM-dd")] = v;
    return statsByString;
  },
  bcStats: function(year: number) {
    return {
      [`${HolidayHelper.newYearsDay(year)}`]: "New Years Day " + year,
      [`${HolidayHelper.familyDay(year)}`]: "BC Family Day",
      [`${HolidayHelper.goodFriday(year)}`]: "Good Friday",
      [`${HolidayHelper.easterMonday(year)}`]: "Easter Monday",
      [`${HolidayHelper.victoriaDay(year)}`]: "Victoria Day",
      [`${HolidayHelper.canadaDay(year)}`]: "Canada Day",
      [`${HolidayHelper.bcDay(year)}`]: "BC Day",
      [`${HolidayHelper.labourDay(year)}`]: "Labour Day",
      [`${HolidayHelper.truthReconciliationDay(year)}`]: "Truth and Reconciliation Day",
      [`${HolidayHelper.thanksgiving(year)}`]: "Thanksgiving",
      [`${HolidayHelper.remembranceDay(year)}`]: "Remembrance Day",
      [`${HolidayHelper.christmasDay(year)}`]: "Christmas Day",
      [`${HolidayHelper.boxingDay(year)}`]: "Boxing Day",
      [`${HolidayHelper.newYearsDay(year + 1)}`]: "New Years Day " + (year + 1)
    };
  },
  dateOrFollowingMonday: function(year: number, month: number, day: number) {
    const specificDate = new Date(year, month, day);
    switch (getDay(specificDate)) {
      case DayOfWeek.Saturday:
        return addDays(specificDate, 2);
      case DayOfWeek.Sunday:
        return addDays(specificDate, 1);
      default:
        return specificDate;
    }
  },
  nthMonday: function(year: number, month: number, nth: number) {
    let first = new Date(year, month, 1);
    while (getDay(first) != DayOfWeek.Monday) {
      first = addDays(first, 1);
    }
    return addDays(first, 7 * (nth - 1));
  },
  // Jan 1 or the following Monday
  newYearsDay: function(year: number) {
    return HolidayHelper.dateOrFollowingMonday(year, MonthOfYear.January, 1);
  },
  // second monday in < Febuary 2019, third Monday in > February 2019
  familyDay: function(year: number) {
    const week = year > 2018 ? 3 : 2;
    return HolidayHelper.nthMonday(year, MonthOfYear.February, week);
  },
  goodFriday: function(year: number) {
    return addDays(HolidayHelper.easterSunday(year), -2);
  },
  easterMonday: function(year: number) {
    return addDays(HolidayHelper.easterSunday(year), 1);
  },
  // Monday before May 25.  (18th - 24th)
  victoriaDay: function(year: number) {
    let victoriaDay = new Date(year, MonthOfYear.May, 18);
    while (getDay(victoriaDay) != DayOfWeek.Monday) victoriaDay = addDays(victoriaDay, 1);

    return victoriaDay;
  },
  // July 1st or the follwing monday of July 1 falls on a weekend
  canadaDay: function(year: number) {
    return HolidayHelper.dateOrFollowingMonday(year, MonthOfYear.July, 1);
  },
  // 1st Monday in August
  bcDay: function(year: number) {
    return HolidayHelper.nthMonday(year, MonthOfYear.August, 1);
  },
  // 1st Monday in September
  labourDay: function(year: number) {
    return HolidayHelper.nthMonday(year, MonthOfYear.September, 1);
  },
  // Sep 30 or the following Monday if Sep 30th falls on a weekend
  truthReconciliationDay(year: number) {
    return HolidayHelper.dateOrFollowingMonday(year, MonthOfYear.September, 30);
  },
  // 2nd Monday in October
  thanksgiving(year: number) {
    return HolidayHelper.nthMonday(year, MonthOfYear.October, 2);
  },
  // Nov 11 or the following Monday if Nov 11th falls on a weekend
  remembranceDay(year: number) {
    return HolidayHelper.dateOrFollowingMonday(year, MonthOfYear.November, 11);
  },
  // Dec 25 or the following Monday if Dec 25th falls on a weekend
  christmasDay(year: number) {
    return HolidayHelper.dateOrFollowingMonday(year, MonthOfYear.December, 25);
  },
  // Dec 26 or the following monday or tuesday
  boxingDay(year: number) {
    const boxingDay = new Date(year, MonthOfYear.December, 26);

    switch (getDay(boxingDay)) {
      case DayOfWeek.Saturday:
        return addDays(boxingDay, 2);
      case DayOfWeek.Sunday:
        return addDays(boxingDay, 2);
      //This is because of Christmas being shifted to Monday.
      case DayOfWeek.Monday:
        return addDays(boxingDay, 1);
      default:
        return boxingDay;
    }
  },
  easterSunday: function(year: number) {
    const c = Math.floor(year / 100);
    const n = year - 19 * Math.floor(year / 19);
    const k = Math.floor((c - 17) / 25);
    let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor(i / 30);
    i =
      i -
      Math.floor(i / 28) *
        (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    let j = year + Math.floor(year / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    const l = i - j;
    const month = 3 + Math.floor((l + 40) / 44);
    const day = l + 28 - 31 * Math.floor(month / 4);

    // -1 for month because Date starts at 0 for January.
    return new Date(year, month - 1, day);
  }
};
