import Vue from "vue";
import AddressAndContact from "@/components/survey/AddressAndContact.vue";
import { WidgetValueName } from "./question-types";

export function initAddressBlock(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.AddressAndContact],
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
          name: "street:boolean",
          category: "Input Options",
          default: true,
          visibleIndex: 1
        },
        {
          name: "city:boolean",
          category: "Input Options",
          default: true,
          visibleIndex: 2
        },
        {
          name: "country:boolean",
          category: "Input Options",
          default: true,
          visibleIndex: 3
        },
        {
          name: "state:boolean",
          category: "Input Options",
          default: true,
          visibleIndex: 4
        },
        {
          name: "postalCode:boolean",
          category: "Input Options",
          default: true,
          visibleIndex: 5
        },
        {
          name: "phone:boolean",
          category: "Input Options",
          default: false,
          visibleIndex: 6
        },
        {
          name: "fax:boolean",
          category: "Input Options",
          default: false,
          visibleIndex: 7
        },
        {
          name: "email:boolean",
          category: "Input Options",
          default: false,
          visibleIndex: 8
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(AddressAndContact);
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
