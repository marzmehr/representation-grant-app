<template>
  <div>
    <div 
      class="card-body"
      style="margin: 0.5rem 1rem; color: rgb(80, 80, 170); font-size: 16px; font-weight: bold;">
      <b-table hover head-variant="dark" 
        :items="state.results" 
        :fields="fields"
        style="white-space: pre-line;">
        <template v-slot:cell(question)="value">
          <v-runtime-template :template="`<div>${value.item.question}</div>`"></v-runtime-template>
        </template>
        <template v-slot:cell(actions)="">
          <span><b-btn>Edit</b-btn></span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import VRuntimeTemplate from "v-runtime-template";
export default defineComponent({
  name: "reviewanswers",
  components: {
    VRuntimeTemplate
  },
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1,
      results: []
    });
    const fields = ["question", "answer", "actions"];

    onMounted(() => {
      const q = props.question;

      // Helpful utility methods
      const signatureHandler = (answer) => {
        if (answer) {
          return "Signed";
        }
        return "";
      }

      const separator = (str) => {
        if (str.includes("?")) {
          return " ";
        } else {
          return ": ";
        }
      }

      const removeBackticks = (str) => {
        return str.split("`").join("");
      }

      const getReviewQuestions = (reviewQuestions) => {
        let selected = new Set();
        if (!reviewQuestions) {
          return selected;
        } else {
          let questions = reviewQuestions.split(",");
          for (let idx in questions) {
            selected.add(questions[idx]);
          }
          return selected;
        }
      }

      // Formatters
      const formatObject = (item) => {
        // Base case for recursion
        if (item !== Object(item)) {
          return item + '\n';
        } else if (item === Object(item)) {
          let ret = "";
          for (let key in item) {
            ret += formatKey(key) + separator(key) + formatObject(item[key]);
          }
          return ret;
        }
      }

      const formatArray = (arr) => {
        let ret = "";
        arr.forEach(element => {
          ret += formatObject(element)
        });
        return ret;
      }

      const formatKey = (str) => {
        let firstChar = str.charAt(0).toUpperCase();
        let capitalized = "";

        if (str.length > 1) {
          capitalized = firstChar + str.slice(1);
        } else if (str.length === 1) {
          capitalized = firstChar;
        }

        return removeBackticks(capitalized);
      }

      // Special case handlers
      const yesNoHandler = (answer) => {
        if (answer === "y") {
          return "Yes";
        } else {
          return "No";
        }
      }

      const fileAnswerHandler = (answer) => {
        let ret = "";
        let suffix = "\n";

        if (answer.length <= 1) {
          suffix = "";
        }
        for (let i = 0; i < answer.length; i++) {
          ret += answer[i].name + suffix;
        }
        return ret;
      }

      const customLabelHandler = (answer, labels) => {
        let ret = "";
        let idx = 0;

        for (let key in answer) {
          let title = labels[idx] || formatKey(key);
          ret += removeBackticks(title) + separator(title) + answer[key] + "\n";
          idx++;
        }
        return ret;
      }

      const dynamicPanelHandler = (question) => {
        // This does not handle nested panels, assumes you stop at one.
        let answers = question.value;
        if (!answers) {
          return "";
        }

        let panels = question?.panels;
        let ret = "";
        for (let i = 0; i < answers.length; i++) {
          let currAnswer = answers[i];
          let currPanel = panels[i];

          for (let j = 0; j < currPanel.questions.length; j++) {
            let currQuestion = currPanel.questions[j];

            if (currQuestion.isVisible) {

              let formattedAnswer = formatSwitchboard(
                undefined,
                currAnswer[currQuestion.name],
                currQuestion.getType()
              );

              let title = currQuestion.locTitle.htmlValues.default;
              ret += removeBackticks(title) + separator(title) + formattedAnswer + "\n";
            }
          }

          // Ensure we don't add too many newlines
          if (i < answers.length - 1) {
            ret += "\n";
          }
        }

        return ret;
      }

      const formatSwitchboard = (question, answer, questionType) => {
        if (!answer) {
          return "";
        } else if (questionType === "file") {
          return fileAnswerHandler(answer);
        } else if (questionType === "signaturepad") {
          return signatureHandler(answer);
        } else if (questionType === "yesno") {
          return yesNoHandler(answer);
        } else if (questionType === "personname") {
          return customLabelHandler(answer, [question.labelFirstName, question.labelMiddleName, question.labelLastName]);
        } else if (questionType === "address") {
          return customLabelHandler(answer, [question.labelPhone, question.labelEmail, question.labelFax]);
        } else if (Array.isArray(answer)) {
          return formatArray(answer);
        } else if (answer === Object(answer)) {
          return formatObject(answer);
        } else {
          return answer;
        }
      }

      const formatAnswers = (question) => {
        let answer = question.value;
        let questionType = question.getType();

        // special check we need to do for nested items
        if (questionType === "paneldynamic") {
          return dynamicPanelHandler(question);
        } else {
          return formatSwitchboard(question, answer, questionType);
        }
      }

      const buildQuestionAnswerTable = () => {
        let questions = q.survey.getAllQuestions();
        let selected = getReviewQuestions(q.reviewQuestions);

        for (let select of selected) {
          for (let j = 0; j < questions.length - 1; j++) {
            if(select === questions[j].name && questions[j].isVisible) {
              state.results.push({
                question: removeBackticks(questions[j].title),
                answer: formatAnswers(questions[j])
              });
            }
          }
        }
      }

      buildQuestionAnswerTable();

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
      state,
      fields
    };
  }
});
</script>
