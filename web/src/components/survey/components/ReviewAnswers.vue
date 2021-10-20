<template>
  <div v-if="getAnswers">
    <div 
      class="card-body"
      style="margin: 0.5rem 1rem; color: rgb(80, 80, 170); font-size: 16px; font-weight: bold;">
      <b-table hover head-variant="dark" 
        :items="results" 
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
  data() {
    return {
      fields: ["question", "answer", "actions"],
      results: []
    }
  },
  setup(props) {
    const state = reactive({
      key: 1
    });
    onMounted(() => {
      const q = props.question;
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
  },
  methods: {
    setValue(val) {
      //TODO needs work
      this.question.value = val;
    },
    toggle() {
      //TODO needs work
      this.question.value = !this.question.value;
    },
    firstCharToUpper(string) {
      let firstChar = string.charAt(0).toUpperCase();
      if (string.length > 1) {
        return firstChar + string.slice(1);
      } else if (string.length === 1) {
        return firstChar;
      }
    },
    checkForSignature(question) {
      if (question.value) {
        return "Signed";
      } else if (!question.value) {
        return "";
      }
    },
    filterOutFileAttributes(item) {
      // The special filtering below is to prevent too much stuff
      // being printed from the `File` component.
      let ret = "";
      for (let key in item) {
        if (key === "name") {
          ret += item[key];
        } else if (key !== "type" && key !== "content") {
          ret += this.firstCharToUpper(key) + ": " + this.formatObject(item[key]);
        }
      }
      return ret;
    },
    formatObject(item) {
      // Base case for recursion
      if (item !== Object(item)) {
        return item + '\n';
      } else if (item === Object(item)) {
        return this.filterOutFileAttributes(item);
      }
    },
    formatArray(arr) {
      let ret = "";
      arr.forEach(element => {
        if (element === Object(element)) {
          ret += this.formatObject(element);
        } else {
          ret += element + "\n";
        }
      });
      return ret;
    },
    processAndFormatAnswers(question) {
      let answer = question.value;

      if (!answer) {
        return "";
      } else if (question.signaturePad) {
        return this.checkForSignature(question);
      } else if (Array.isArray(answer)) {
        return this.formatArray(answer);
      } else if (answer === Object(answer)) {
        return this.formatObject(answer);
      } else if (typeof answer === "string") {
        return this.firstCharToUpper(answer);
      } else if (typeof answer === "number" || typeof answer === "boolean") {
        return answer;
      }
    }
  },
  computed: {
    getAnswers: function () {
      let questions = this.question.survey.getAllQuestions();
      let toInclude = this.question.reviewQuestions;
      
      for (let i = 0; i < questions.length - 1; i++) {
        if (toInclude.includes(questions[i].name)) {
          this.results.push({
            question: questions[i].title,
            answer: this.processAndFormatAnswers(questions[i])
          });
        }
      }
      return this.results;
    }
  }
});
</script>
