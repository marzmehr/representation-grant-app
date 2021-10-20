<template>
  <div :key="state.key">
    <span v-for="(val, index) in question.value" :key="index">
      {{ val }}
    </span>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive, onBeforeUnmount } from "@vue/composition-api";

import { ExpressionRunner } from "survey-core";

export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1
    });

    const inputExpressions = [
      props.question.inputExpression1,
      props.question.inputExpression2,
      props.question.inputExpression3,
      props.question.inputExpression4,
      props.question.inputExpression5
    ];

    const getQuestionsAndPanelsToWatch = () => {
      const questionsToWatchByExpression = [];
      inputExpressions.forEach((ie, index) => {
        //Parse out questions.
        const qualityRegex = /{([^{}]+)}/g;
        let matches;
        while ((matches = qualityRegex.exec(ie))) {
          if (!Array.isArray(questionsToWatchByExpression[index]))
            questionsToWatchByExpression[index] = [];
          let match = matches[1].trim();
          //Handle panels.
          match = match.includes(".") ? match.split(".")[0] : match;
          //Exclude functions.
          if (
            !match.includes("(") &&
            !match.includes(")") &&
            !questionsToWatchByExpression[index].includes(match)
          )
            questionsToWatchByExpression[index].push(match);
        }
      });
      return questionsToWatchByExpression;
    };

    const getExpressionValues = expression => {
      const qualityRegex = /{([^{}]+)}/g,
        templates = [];
      let matches;
      while ((matches = qualityRegex.exec(expression))) {
        const match = matches[1].trim();
        templates.push(match);
      }
      //Handle Panel.Question - {xx.yy}
      //Handle question names and expressions {xx}
      const templateValues = templates.map(template => {
        const target = template.includes(".") ? template.split(".")[0] : template;
        return window.surveyInstance.getQuestionByName(target)?.value;
      });
      const expressionValues = {};
      for (let i = 0; i < templates.length; i++) {
        expressionValues[templates[i]] = templateValues[i];
      }
      return expressionValues;
    };

    const runExpression = filterExpression => {
      const expressionValues = getExpressionValues(filterExpression);
      const expression = new ExpressionRunner(filterExpression);
      const value = expression.run(expressionValues);
      console.log(`Filter Expression: ${filterExpression}`);
      console.log(`Result: ${value}`);
      return value;
    };

    const questionsAndPanelsToWatch = getQuestionsAndPanelsToWatch();
    console.log("Input Expressions: ");
    for (let i = 0; i < inputExpressions.length; i++)
      if (inputExpressions[i]) console.log(`filterExpression${i + 1}: ${inputExpressions[i]}`);
    const allQuestionsForWatch = questionsAndPanelsToWatch.flat();
    console.log("Watching Questions/Panels for inputExpression: ");
    console.log(allQuestionsForWatch);

    const onValueChanged = (sender, options) => {
      if (options.name == props.question.name) return;
      if (!questionsAndPanelsToWatch.some(q => q.includes(options.name))) return;

      const filteredData = [];
      //We can either store the state in the component, or we can recalculate.
      //Going the recalculate route for now.
      questionsAndPanelsToWatch.forEach((qp, index) => {
        if (!qp.includes(options.name)) return;
        const filterExpression = inputExpressions[index];
        //Split and run the IF condition first.
        if (filterExpression.includes("IF")) {
          const value = runExpression(filterExpression.split("IF")[1]);
          if (value != true) return;
        }
        const value = runExpression(filterExpression.split("IF")[0]);
        filteredData.push(value);
      });

      props.question.value = filteredData.flat();
      state.key++;
    };

    onBeforeUnmount(() => {
      window.surveyInstance.onValueChanged.remove(onValueChanged);
    });

    onMounted(() => {
      const q = props.question;

      if (window.surveyInstance.onValueChanged)
        window.surveyInstance.onValueChanged.add(onValueChanged);

      //Hooks for SurveyEditor KO.
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("title", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("body", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("messageStyle", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("arraySourceQuestion", () => {
          state.key++;
        });
      }
    });

    return {
      state
    };
  }
});
</script>
