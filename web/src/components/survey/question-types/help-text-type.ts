import Vue from "vue";
import HelpText from "../components/HelpText.vue";
import { WidgetValueName } from "./question-types";

export function initHelpText(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.HelpText],
    title: "Expanding FAQ",
    iconName: "icon-panel",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "helptext";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("helptext", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("helptext", [
        {
          name: "body:text",
          category: "general", // move the custom property in the general category
          visibleIndex: 3 // Moves the property at index 3 within the category
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(HelpText);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}
