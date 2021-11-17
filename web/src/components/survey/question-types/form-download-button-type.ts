import Vue from "vue";
import FormDownloadButton from "../components/FormDownloadButton.vue";
import { WidgetValueName } from "./question-types";

export function initFormDownloadButton(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.FormDownloadButton],
    title: "Form Download/Print Button",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "formdownloadbutton";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("formdownloadbutton", [], null, "empty");
      Survey.JsonObject.metaData.addProperties(
        "formdownloadbutton",
        [
          {
            name: "buttonTitle",
            default: "",
            category: "general",
            visibleIndex: 2
          },
          {
            name: "pdfType",
            default: "",
            category: "general",
            visibleIndex: 3
          }
        ],
        null,
        "empty"
      );
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(FormDownloadButton);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    },
    willUnmount: function(question, el) {
      if (question.survey.platformName == "vue") return;
      for (let i = 0; i < el.children.length; i++) {
        if (el.children[i].__vue__) {
          el.children[i].__vue__.$destroy();
        }
      }
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}