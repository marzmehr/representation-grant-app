import Vue from "vue";
import InfoText from "../components/InfoText.vue";
import { WidgetValueName } from "./question-types";

export function initInfoText(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.InfoText],
    title: "Message Text",
    iconName: "icon-panel",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "infotext";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("infotext", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("infotext", [
        {
          name: "body:text",
          category: "general",
          visibleIndex: 3
        },
        {
          name: "messageStyle",
          default: "info",
          choices: ["info", "inline", "error"],
          category: "general",
          visibleIndex: 4
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(InfoText);
      const card = new ComponentClass({
        propsData: {
          question: question,
          isSurveyEditor: true
        }
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
