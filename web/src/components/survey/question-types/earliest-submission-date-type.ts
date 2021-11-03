import Vue from "vue";
import EarliestSubmissionDate from "../components/EarliestSubmissionDate.vue";
import { WidgetValueName } from "./question-types";

export const initEarliestSubmissionDate = (Survey: any) => {
  const widget = {
    name: WidgetValueName[WidgetValueName.EarliestSubmissionDate],
    title: "Longest Date From Panel",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "earliestsubmissiondate";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("earliestsubmissiondate", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("earliestsubmissiondate", [
        {
          name: "panelName:string",
          category: "general",
          visibleIndex: 3
        },
        {
          name: "panelField:string",
          category: "general",
          visibleIndex: 4
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(EarliestSubmissionDate);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
};
