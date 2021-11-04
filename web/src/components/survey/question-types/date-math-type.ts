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
          name: "referenceVariable:text",
          category: "general",
          visibleIndex: 3
        },
        {
          name: "daysToOffset:number",
          category: "general",
          default: 0,
          visibleIndex: 4
        },
        {
          name: "typeOfDays",
          category: "general",
          choices: ["Business Days", "Calendar Days"],
          default: "Calendar Days",
          visibleIndex: 5
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
