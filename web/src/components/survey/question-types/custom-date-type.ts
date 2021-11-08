import Vue from "vue";
import CustomDate from "../components/CustomDate.vue";
import { WidgetValueName } from "./question-types";

export function initCustomDate(Survey: any) {
  const widget = {
    name: WidgetValueName[WidgetValueName.CustomDate],
    title: "Date Input",
    iconName: "icon-date",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "customdate";
    },
    htmlTemplate: "<div></div>",
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("customdate", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("customdate", [
        {
          name: "pastDateHandler",
          category: "general",
          choices: ["Years Behind", "Earliest Date", "Past Reference Variable"],
          default: "Years Behind"
        },
        {
          name: "yearsBehind:number",
          category: "general",
          default: 0,
          dependsOn: "pastDateHandler",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.pastDateHandler === "Years Behind";
          }
        },
        {
          name: "earliestDate",
          category: "general",
          dependsOn: "pastDateHandler",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.pastDateHandler === "Earliest Date";
          },
          onPropertyEditorUpdate: function(obj: any, propertyEditor: any) {
            propertyEditor.inputType = "date";
          }
        },
        {
          name: "pastReferenceVariable:text",
          category: "general",
          dependsOn: "pastDateHandler",
          localized: true,
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.pastDateHandler === "Past Reference Variable";
          }
        },
        {
          name: "futureDateHandler",
          category: "general",
          choices: ["Years Ahead", "Latest Date", "Future Reference Variable"],
          default: "Years Ahead"
        },
        {
          name: "yearsAhead:number",
          category: "general",
          default: 0,
          dependsOn: "futureDateHandler",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.futureDateHandler === "Years Ahead";
          }
        },
        {
          name: "latestDate",
          category: "general",
          dependsOn: "futureDateHandler",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.futureDateHandler === "Latest Date";
          },
          onPropertyEditorUpdate: function(obj: any, propertyEditor: any) {
            propertyEditor.inputType = "date";
          }
        },
        {
          name: "futureReferenceVariable:text",
          category: "general",
          dependsOn: "futureDateHandler",
          visibleIf: function(obj: any) {
            if (!obj) return false;
            return obj.futureDateHandler === "Future Reference Variable";
          }
        }
      ]);
    },
    afterRender: function(question, el) {
      if (question.survey.platformName == "vue") return;
      const ComponentClass = Vue.extend(CustomDate);
      const card = new ComponentClass({
        propsData: { question: question }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "property");
}
