<template>
  <div :class="question.cssClasses.text">{{ state.result }}</div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1,
      result: 0
    });

    onMounted(() => {
      const q = props.question;
      const getDate = (year, monthName, day) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        const month = months.indexOf(monthName);
        return new Date(year, month, day);
      };

      const calcHolidays = year => {
        const dateFactory = (year, month, day, range) => {
          // helper function to calc a series of holidays
          const holidates = [];
          for (let i = -range; i <= range; i++) {
            holidates.push(new Date(year + i, month, day));
          }
          return holidates;
        };

        const dateByRule = (year, rule, range) => {
          // Evaluate rules and send off to factory for creation
          const holidates = [];
          for (let i = -range; i <= range; i++) {
            const temp = new Date(year + i, rule.month, 1);
            let dayOfWeek = temp.getDay();

            while (dayOfWeek !== rule.dayOfWeek) {
              temp.setDate(temp.getDate() + 1);
              dayOfWeek = temp.getDay();
            }

            temp.setDate(temp.getDate() + 7 * rule.week);

            holidates.push(temp);
          }
          return holidates;
        };

        const truthAndRecHandler = (year, month, day, range) => {
          // helper function to calc a series of holidays
          const holidates = [];
          for (let i = -range; i <= range; i++) {
            if (year + i >= 2021) {
              holidates.push(new Date(year + i, month, day));
            }
          }
          return holidates;
        };

        const getEaster = year => {
          // taken from https://gist.github.com/johndyer/0dffbdd98c2046f41180c051f378f343
          const f = Math.floor,
            G = year % 19,
            C = f(year / 100),
            H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
            I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
            J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
            L = I - J,
            month = 3 + f((L + 40) / 44),
            day = L + 28 - 31 * f(month / 4);

          return new Date(year, month - 1, day);
        };

        const easterRelatedHoliday = (year, dayOfWeek, range) => {
          // we know easter will always be on a sunday, so we can do simple math when we get the date.
          const holidates = [];
          for (let i = -range; i <= range; i++) {
            const temp = getEaster(year + i);

            if (dayOfWeek === 1) {
              temp.setDate(temp.getDate() + 1);
              holidates.push(temp);
            } else if (dayOfWeek === 5) {
              temp.setDate(temp.getDate() - 2);
              holidates.push(temp);
            }
          }
          return holidates;
        };

        const victoriaDayHandler = (year, month, day, range) => {
          const holidates = [];

          for (let i = -range; i <= range; i++) {
            const start = new Date(year + i, month, day);
            let dayOfWeek = start.getDay();

            while (dayOfWeek !== 1) {
              start.setDate(start.getDate() - 1);
              dayOfWeek = start.getDay();
            }

            holidates.push(start);
          }
          console.log(holidates);
          return holidates;
        };

        // for now lets just have a steady default range
        const range = 2;

        const holidates = {
          new_year: dateFactory(year, 0, 1, range),
          family_day: dateByRule(year, { month: 1, week: 2, dayOfWeek: 1 }, range),
          good_friday: easterRelatedHoliday(year, 5, range),
          easter_monday: easterRelatedHoliday(year, 1, range),
          victoria_day: victoriaDayHandler(year, 4, 25, range),
          canada_day: dateFactory(year, 6, 1, range),
          bc_day: dateByRule(year, { month: 7, week: 0, dayOfWeek: 1 }, range),
          labour_day: dateByRule(year, { month: 8, week: 0, dayOfWeek: 1 }, range),
          truth_and_rec: truthAndRecHandler(year, 8, 30, range),
          thanksgiving: dateByRule(year, { month: 9, week: 1, dayOfWeek: 1 }, range),
          remember_day: dateFactory(year, 10, 11, range),
          christmas: dateFactory(year, 11, 25, range)
        };

        let ret = [];
        for (const holiday in holidates) {
          ret = ret.concat(holidates[holiday]);
        }
        return ret;
      };

      const calcBusinessDays = (date, offset) => {
        const holidates = calcHolidays(date.getFullYear());
        let daysAdded = 0;

        while (daysAdded < offset) {
          const dayOfWeek = date.getDay();
          let holiday = false;

          for (const idx in holidates) {
            if (date.getTime() === holidates[idx].getTime()) {
              holiday = true;
              break;
            }
          }

          if (dayOfWeek >= 1 && dayOfWeek <= 5 && !holiday) {
            daysAdded++;
          }

          date.setDate(date.getDate() + 1);
        }
        return date;
      };

      const calcFromReferenceDate = (year, month, day, offset, daysType) => {
        const date = getDate(year, month, day);

        if (daysType === "Calendar Days") {
          date.setDate(date.getDate() + offset);
          return date;
        } else if (daysType === "Business Days") {
          const ret = calcBusinessDays(date, offset);
          return ret;
        }
      };

      const dateFormatter = date => {
        return date.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric" });
      };

      const dateMath = () => {
        const dateType = q.dateType;
        const offset = q.daysToOffset;
        const daysType = q.typeOfDays;

        if (dateType === "Reference Date") {
          return dateFormatter(calcFromReferenceDate(q.year, q.month, q.day, offset, daysType));
        } else if (dateType === "Name of Variable") {
          // have to evaulate the var
          return "";
        }
      };

      state.result = dateMath();

      //Hooks for SurveyEditor KO.
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("title", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("body", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("messageStyle", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("arraySourceQuestion", () => {
          state.key++;
        });
      }
    });

    return {
      state
    };
  }
});
</script>
