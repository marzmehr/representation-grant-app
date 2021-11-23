<template>
  <div>
    <div
      class="card-body"
      style="margin: 0.5rem 1rem; color: rgb(80, 80, 170); font-size: 16px; font-weight: bold;"
    >

      <b-table
        hover
        head-variant="dark"
        :items="state.results"
        :fields="fields"
        style="white-space: pre-line;"
      >
        <template v-slot:cell(question)="value">
          <v-runtime-template :template="`<div>${value.item.question}</div>`"></v-runtime-template>
        </template>

        <template v-slot:cell(answer)="value">
          <v-runtime-template :template="`<div>${value.item.answer}</div>`"></v-runtime-template>
        </template>

        <template v-slot:cell(actions)="value">
          <span><b-btn v-on:click="navigateToQuestion(value.item.question)">Edit</b-btn></span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import VRuntimeTemplate from "v-runtime-template";
import { convertTicksToToolTip } from "@/utils/utils";
export default defineComponent({
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

      const signatureHandler = answer => {
        if (answer) {
          return "Signed";
        }
        return "";
      };

      const separator = str => {
        if (str.includes("?")) {
          return " ";
        } else {
          return ": ";
        }
      };

      const getReviewQuestions = reviewQuestions => {
        const selected = new Set();
        if (!reviewQuestions) {
          return selected;
        } else {
          const questions = reviewQuestions.split(",");
          for (const idx in questions) {
            selected.add(questions[idx]);
          }
          return selected;
        }
      };

      const formatKey = str => {
        const firstChar = str.charAt(0).toUpperCase();
        let capitalized = "";

        if (str.length > 1) {
          capitalized = firstChar + str.slice(1);
        } else if (str.length === 1) {
          capitalized = firstChar;
        }

        return convertTicksToToolTip(capitalized);
      };

      const formatObject = item => {
        // Base case for recursion
        if (item !== Object(item)) {
          return item + "\n";
        } else if (item === Object(item)) {
          let ret = "";
          for (const key in item) {
            ret += formatKey(key) + separator(key) + formatObject(item[key]);
          }
          return ret;
        }
      };

      const formatArray = arr => {
        let ret = "";
        arr.forEach(element => {
          ret += formatObject(element);
        });
        return ret;
      };

      const yesNoHandler = answer => {
        if (answer === "y") {
          return "Yes";
        } else {
          return "No";
        }
      };

      const fileAnswerHandler = answer => {
        let ret = "";
        let suffix = "\n";

        if (answer.length <= 1) {
          suffix = "";
        }
        for (let i = 0; i < answer.length; i++) {
          ret += answer[i].name + suffix;
        }
        return ret;
      };

      const customLabelHandler = (answer, labels) => {
        let ret = "";
        let idx = 0;

        for (const key in answer) {
          const title = labels[idx] || formatKey(key);
          ret += convertTicksToToolTip(title) + separator(title) + answer[key] + "\n";
          idx++;
        }
        return ret;
      };

      const checkboxHandler = question => {
        return question.choices.find(c => c.value == question.value)?.text;
      };

      const formatSwitchboard = (question, answer, questionType) => {
        if (!answer) {
          return "";
        } else if (questionType === "checkbox") {
          return checkboxHandler(question);
        } else if (questionType === "file") {
          return fileAnswerHandler(answer);
        } else if (questionType === "signaturepad") {
          return signatureHandler(answer);
        } else if (questionType === "yesno") {
          return yesNoHandler(answer);
        } else if (questionType === "personname") {
          return customLabelHandler(answer, [
            question.labelFirstName,
            question.labelMiddleName,
            question.labelLastName
          ]);
        } else if (questionType === "address") {
          return customLabelHandler(answer, [
            question.labelPhone,
            question.labelEmail,
            question.labelFax
          ]);
        } else if (Array.isArray(answer)) {
          return formatArray(answer);
        } else if (answer === Object(answer)) {
          return formatObject(answer);
        } else {
          return answer;
        }
      };

      const dynamicPanelHandler = question => {
        // This does not handle nested panels, assumes you stop at one.
        // eslint-disable-next-line prefer-const
        let answers = question.value;
        if (!answers) {
          return "";
        }

        const panels = question?.panels;
        let ret = "";
        for (let i = 0; i < answers.length; i++) {
          const currAnswer = answers[i];
          const currPanel = panels[i];

          for (let j = 0; j < currPanel.questions.length; j++) {
            const currQuestion = currPanel.questions[j];

            if (currQuestion.isVisible) {
              const formattedAnswer = formatSwitchboard(
                undefined,
                currAnswer[currQuestion.name],
                currQuestion.getType()
              );

              const title = currQuestion.localizableStrings.title.renderedHtml;
              ret += convertTicksToToolTip(title) + separator(title) + formattedAnswer + "\n";
            }
          }

          // Ensure we don't add too many newlines
          if (i < answers.length - 1) {
            ret += "\n";
          }
        }

        return ret;
      };

      const formatAnswers = question => {
        const answer = question.value;
        const questionType = question.getType();

        // special check we need to do for nested items
        if (questionType === "paneldynamic") {
          return dynamicPanelHandler(question);
        } else {
          return formatSwitchboard(question, answer, questionType);
        }
      };

      const buildQuestionAnswerTable = () => {
        const questions = q.survey.getAllQuestions();
        const selected = getReviewQuestions(q.reviewQuestions);

        for (const select of selected) {
          for (let j = 0; j < questions.length - 1; j++) {
            if (select === questions[j].name && questions[j].isVisible) {
              state.results.push({
                question: convertTicksToToolTip(questions[j].localizableStrings.title.renderedHtml),
                answer: formatAnswers(questions[j])
              });
            }
          }
        }
      };

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
      }
    });

    return {
      state,
      fields
    };
  },
  methods: {
    navigateToQuestion: function(question) {
      const survey = this.question.survey;
      const questions = survey.getAllQuestions();
      const pages = survey.pages;
      let target;

      for (const i in questions) {
        if (convertTicksToToolTip(questions[i].title) === question) {
          target = questions[i];
          break;
        }
      }

      let pageNum;
      for (const page in pages) {
        const quesOnPage = pages[page].questions;
        for (const ques in quesOnPage) {
          if (quesOnPage[ques] === target) {
            pageNum = page;
            break;
          }
        }
      }

        survey.currentPageNo = pageNum;
        if (target?.panels) {
          target.panels[0].focusFirstQuestion();
        } else {
          target.focus();
      }
    }
  }
});
</script>
