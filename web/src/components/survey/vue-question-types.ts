import { addQuestionTypes } from "./question-types";
import Vue from "vue";

import AddressInfo from "./components/AddressInfo.vue";
import ContactInfo from "./components/ContactInfo.vue";
import CustomDate from "./components/CustomDate.vue";
import HelpText from "./components/HelpText.vue";
import InfoText from "./components/InfoText.vue";
import PersonName from "./components/PersonName.vue";
import YesNo from "./components/YesNo.vue";
import FormDownloadButton from "./components/FormDownloadButton.vue";
import ReviewAnswers from "./components/ReviewAnswers.vue";
import QuestionCombiner from "./components/QuestionCombiner.vue";
import SurveyText from "./components/SurveyText.vue";
import EarliestSubmissionDate from "./components/EarliestSubmissionDate.vue";

export function addQuestionTypesVue(Survey: any) {
  Vue.component("HelpText", HelpText);
  Vue.component("InfoText", InfoText);
  Vue.component("YesNo", YesNo);
  Vue.component("AddressInfo", AddressInfo);
  Vue.component("PersonName", PersonName);
  Vue.component("ContactInfo", ContactInfo);
  Vue.component("CustomDate", CustomDate);
  Vue.component("FormDownloadButton", FormDownloadButton);
  Vue.component("ReviewAnswers", ReviewAnswers);
  Vue.component("QuestionCombiner", QuestionCombiner);
  Vue.component("EarliestSubmissionDate", EarliestSubmissionDate);
  Vue.component("survey-text", SurveyText);
  addQuestionTypes(Survey);
}
