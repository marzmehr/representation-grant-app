<template>
  <div>
    <div 
      class="card-body"
      style="margin: 0.5rem 1rem; color: rgb(80, 80, 170); font-size: 16px; font-weight: bold;">
      <b-table hover head-variant="dark" 
        :items="state.results" 
        :fields="fields"
        style="white-space: pre-line;">
        <template v-slot:cell(actions)="">
          <span><b-btn>Edit</b-btn></span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  name: "reviewanswers",
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

      const firstCharToUpper = (string) => {
        let firstChar = string.charAt(0).toUpperCase();
        if (string.length > 1) {
          return firstChar + string.slice(1);
        } else if (string.length === 1) {
          return firstChar;
        }
      }

      const checkForSignature = (question) => {
        if (question.value) {
          return "Signed";
        } else if (!question.value) {
          return "";
        }
      }

      const filterOutFileAttributes = (item) => {
        // The special filtering below is to prevent too much stuff
        // being printed from the `File` component.
        let ret = "";
        for (let key in item) {
          if (key === "name") {
            ret += item[key];
          } else if (key !== "type" && key !== "content") {
            ret += firstCharToUpper(key) + ": " + formatObject(item[key]);
          }
        }
        return ret;
      }

      const formatObject = (item) => {
        // Base case for recursion
        if (item !== Object(item)) {
          return item + '\n';
        } else if (item === Object(item)) {
          return filterOutFileAttributes(item);
        }
      }

      const formatArray = (arr) => {
        let ret = "";
        arr.forEach(element => {
          if (element === Object(element)) {
            ret += formatObject(element);
          } else {
            ret += element + "\n";
          }
        });
        return ret;
      }

      const processAndFormatAnswers = (question) => {
        let answer = question.value;

        if (!answer) {
          return "";
        } else if (question.signaturePad) {
          return checkForSignature(question);
        } else if (Array.isArray(answer)) {
          return formatArray(answer);
        } else if (answer === Object(answer)) {
          return formatObject(answer);
        } else if (typeof answer === "string") {
          return firstCharToUpper(answer);
        } else if (typeof answer === "number" || typeof answer === "boolean") {
          return answer;
        }
      }

      const getAnswers = () => {
        let questions = q.survey.getAllQuestions();
        let toInclude = []; 
        
        if (q.reviewQuestions) {
          toInclude = q.reviewQuestions;
        }
        
        for (let i = 0; i < questions.length - 1; i++) {
          if (toInclude.includes(questions[i].name)) {
            state.results.push({
              question: questions[i].title,
              answer: processAndFormatAnswers(questions[i])
            });
          }
        }
      }

      getAnswers();

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
