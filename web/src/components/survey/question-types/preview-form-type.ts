import Vue from "vue";
import PreviewForm from "../components/PreviewForm.vue";
import { WidgetValueName } from "./question-types";

export function initPreviewForm(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.PreviewForm],
    title: "Preview Form",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "previewform";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("previewform", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("previewform", [
        {
          name: "formSelect",
          category: "general",
          visibleIndex: 3,
          choices: ["FormP1", "FormP9"],
          default: "FormP9"
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(PreviewForm);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}
