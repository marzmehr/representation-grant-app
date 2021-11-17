import Vue from "vue";
import AddressInfo from "../components/AddressInfo.vue";
import { WidgetValueName } from "./question-types";

export function initAddressBlock(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.AddressInfo],
    title: "Postal Address",
    iconName: "icon-multipletext",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "address";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "address",
        [
          {
            name: "referLabel:text"
          }
        ],
        null,
        "empty"
      );
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(AddressInfo);
      const card = new ComponentClass({
        propsData: { question: question }
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
