import Vue from "vue";
import Expression from "@/components/survey/survey-js-internal/Expression.vue";
import { WidgetValueName } from "./question-types";

export const fixExpression = Survey => {
  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    {
      name: WidgetValueName[WidgetValueName.expressionFix],
      isDefaultRender: true,
      isFit: question => {
        return question.getType() === "expression";
      },
      widgetIsLoaded: function() {
        return true;
      },
      htmlTemplate: "<div></div>",
      afterRender: function(question, el) {
        if (question.survey.platformName == "vue") {
          //This needs to happen because if we make it invisible, it wont calculate the next question.
          el.closest(".sv_row").style.display = "none";
          return;
        }
        const ComponentClass = Vue.extend(Expression);
        const card = new ComponentClass({
          propsData: { question: question }
        });
        card.$mount();
        el.parentNode.appendChild(card.$el);
        el.style.display = "none"; //If we remove it, willUnmount will never be called.
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
