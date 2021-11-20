import Vue from "vue";
import PersonName from "@/components/PersonName.vue";
import { WidgetValueName } from "./question-types";

export function initPersonName(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.PersonName],
    title: "Person Name",
    iconName: "icon-multipletext",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "personname";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "personname",
        [
          {
            name: "defaultSubstitution:text"
          },
          {
            name: "labelFirstName:text"
          },
          {
            name: "labelMiddleName:text"
          },
          {
            name: "labelLastName:text"
          },
          {
            name: "descFirstName:text"
          },
          {
            name: "descMiddleName:text"
          },
          {
            name: "descLastName:text"
          }
        ],
        null,
        "empty"
      );
    },
    getDisplayValue: function(question: any) {
      const name = question.value;
      if (name)
        return [name.first, name.middle, name.last]
          .map(p => p.trim())
          .filter(p => p)
          .join(" ");
      return question.defaultSubstitution;
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(PersonName);
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
