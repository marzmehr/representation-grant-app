import Vue from "vue";
import DateMath from "../components/DateMath.vue";
import { WidgetValueName } from "./question-types";

export function initDateMath(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.DateMath],
    title: "Date Math",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "datemath";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("datemath", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("datemath", [
        {
          name: "dateType",
          category: "general",
          choices: ["Reference Date", "Name of Variable"],
          default: "Reference Date",
          visibleIndex: 3
        },
        {
          name: "year",
          category: "general",
          dependsOn: "dateType",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.dateType === "Reference Date";
          },
          choices: function() {
            let curYear = new Date().getFullYear();
            const firstYear = curYear - 20;
            curYear += 20;
            const opts = [];
            for (let yr = curYear; yr >= firstYear; yr--) {
              opts.push("" + yr);
            }
            return opts;
          },
          default: new Date().getFullYear(),
          visibleIndex: 4
        },
        {
          name: "month",
          category: "general",
          dependsOn: "dateType",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.dateType === "Reference Date";
          },
          choices: [
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
          ],
          default: new Date().toLocaleString("default", { month: "long" }),
          visibleIndex: 5
        },
        {
          name: "day",
          category: "general",
          dependsOn: "dateType",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.dateType === "Reference Date";
          },
          choices: function(obj: any) {
            const opts = [];
            for (let day = 1; day <= 31; day++) {
              opts.push("" + day);
            }
            return opts;
          },
          default: new Date().getDate(),
          visibleIndex: 6
        },
        {
          name: "nameOfVariable:text",
          category: "general",
          dependsOn: "dateType",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.dateType === "Name of Variable";
          },
          visibleIndex: 7
        },
        {
          name: "daysToOffset:number",
          category: "general",
          default: 0,
          visibleIndex: 8
        },
        {
          name: "typeOfDays",
          category: "general",
          choices: ["Business Days", "Calendar Days"],
          default: "Calendar Days",
          visibleIndex: 9
        },
        {
          name: "calculatedResult",
          readOnly: true,
          category: "general",
          visibleIndex: 10
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(DateMath);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}
