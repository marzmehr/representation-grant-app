import Vue from "vue";
import Expression from "../components/outer-question/Expression.vue";
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
        if (question.survey.platformName == "vue") return;
        const ComponentClass = Vue.extend(Expression);
        const card = new ComponentClass({
          propsData: { question: question }
        });
        card.$mount();
        el.parentNode.appendChild(card.$el);
        el.parentNode.removeChild(el);
      },
      willUnmount: function(question, el) {
        if (question.survey.platformName == "vue") return;
          el.children[0].__vue__.$destroy();
      }
    },
    "type"
  );
};
