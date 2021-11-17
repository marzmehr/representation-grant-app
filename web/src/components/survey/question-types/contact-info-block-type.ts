import Vue from "vue";
import ContactInfo from "../components/ContactInfo.vue";
import { WidgetValueName } from "./question-types";

export function initContactInfoBlock(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.ContactInfo],
    title: "Contact Info",
    iconName: "icon-multipletext",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "contactinfo";
    },
    htmlTemplate: "<div></div>",
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "contactinfo",
        [
          {
            name: "labelEmail:text"
          },
          {
            name: "labelFax:text"
          },
          {
            name: "labelPhone:text"
          }
        ],
        null,
        "empty"
      );
    },
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(ContactInfo);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    },
    willUnmount: function(question, el) {
      if (question.survey.platformName == "vue") return;
        el.children[0].__vue__.$destroy();
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}
