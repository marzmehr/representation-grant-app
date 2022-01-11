import Vue from "vue";
import AddressInfo from "@/components/survey/AddressInfo.vue";
import { WidgetValueName } from "./question-types";

export function initAddressBlock(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.AddressInfo],
    title: "Address & Contact",
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
      Survey.JsonObject.metaData.addProperties("address", [
        {
          name: "useStreet:boolean",
          category: "Input Options",
          default: true
        },
        {
          name: "useCity:boolean",
          category: "Input Options",
          default: true
        },
        {
          name: "useProvince:boolean",
          category: "Input Options",
          default: true
        },
        {
          name: "useCountry:boolean",
          category: "Input Options",
          default: true
        },
        {
          name: "usePostalCode:boolean",
          category: "Input Options",
          default: true
        },
        {
          name: "usePhone:boolean",
          category: "Input Options",
          default: false
        },
        {
          name: "useFax:boolean",
          category: "Input Options",
          default: false
        },
        {
          name: "useEmail:boolean",
          category: "Input Options",
          default: false
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(AddressInfo);
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
