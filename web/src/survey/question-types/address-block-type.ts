import Vue from "vue";
import AddressInfo from "@/components/survey/AddressInfo.vue";
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
      Survey.JsonObject.metaData.addProperties("address", [
        {
          name: "useStreet:boolean",
          category: "others",
          default: true
        },
        {
          name: "useCity:boolean",
          category: "others",
          default: true
        },
        {
          name: "useProvince:boolean",
          category: "others",
          default: true
        },
        {
          name: "useCountry:boolean",
          category: "others",
          default: true
        },
        {
          name: "usePostalCode:boolean",
          category: "others",
          default: true
        },
        {
          name: "usePhone:boolean",
          category: "others",
          default: false
        },
        {
          name: "useFax:boolean",
          category: "others",
          default: false
        },
        {
          name: "useEmail:boolean",
          category: "others",
          default: false
        }
      ]);
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
      for (let i = 0; i < el.children.length; i++) {
        if (el.children[i].__vue__) {
          el.children[i].__vue__.$destroy();
        }
      }
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}
