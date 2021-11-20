import Vue from "vue";
import SurveyText from "@/components/survey/survey-js-internal/SurveyText.vue";
import { WidgetValueName } from "./question-types";

export const addToInputText = Survey => {
  // This hijacks the text, which we've copied over from SurveyLibrary/src/vue.
  // These text improvements, allow for default Substitution.
  Survey.JsonObject.metaData.addProperties("text", [
    {
      name: "defaultSubstitution:text",
      category: "general",
      visibleIndex: 3
    }
  ]);

  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    {
      name: WidgetValueName[WidgetValueName.textImprovements],
      isDefaultRender: true,
      isFit: question => {
        return question.getType() === "text";
      },
      widgetIsLoaded: function() {
        return true;
      },
      htmlTemplate: "<div></div>",
      afterRender: function(question, el) {
        if (question.survey.platformName == "vue") return;
        const ComponentClass = Vue.extend(SurveyText);
        const card = new ComponentClass({
          propsData: { question: question }
        });
        card.$mount();
        el.parentNode.appendChild(card.$el);
        el.style.display = "none";  //If we remove it, willUnmount will never be called.
      },
      willUnmount: function(question, el) {
        if (question.survey.platformName == "vue") return;
        for (let i = 0; i < el.parentNode.children.length; i++) {
          if (el.parentNode.children[i].__vue__) {
            el.parentNode.children[i].__vue__.$destroy();
          }
        }
      }
    },
    "type"
  );
};
