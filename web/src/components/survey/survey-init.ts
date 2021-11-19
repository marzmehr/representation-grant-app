import Vue from "vue";
import { addQuestionTypes, WidgetValueName } from "./question-types/question-types";


import AddressInfo from "./components/AddressInfo.vue";
import ContactInfo from "./components/ContactInfo.vue";
import CustomDate from "./components/CustomDate.vue";
import HelpText from "./components/HelpText.vue";
import InfoText from "./components/InfoText.vue";
import PersonName from "./components/PersonName.vue";
import YesNo from "./components/YesNo.vue";
import FormDownloadButton from "./components/FormDownloadButton.vue";
import ReviewAnswers from "./components/ReviewAnswers.vue";
import PreviewForm from "./components/PreviewForm.vue";

import VRuntimeTemplate from "v-runtime-template";
import StringViewer from "./components/outer-question/StringViewer.vue";
import SurveyText from "./components/outer-question/SurveyText.vue";

import { HolidayHelper } from "../utils/holiday";

export function addQuestionTypesVue(Survey: any) {
  Vue.component(WidgetValueName[WidgetValueName.HelpText], HelpText);
  Vue.component(WidgetValueName[WidgetValueName.InfoText], InfoText);
  Vue.component(WidgetValueName[WidgetValueName.YesNo], YesNo);
  Vue.component(WidgetValueName[WidgetValueName.AddressInfo], AddressInfo);
  Vue.component(WidgetValueName[WidgetValueName.PersonName], PersonName);
  Vue.component(WidgetValueName[WidgetValueName.ContactInfo], ContactInfo);
  Vue.component(WidgetValueName[WidgetValueName.CustomDate], CustomDate);
  Vue.component(WidgetValueName[WidgetValueName.FormDownloadButton], FormDownloadButton);
  Vue.component(WidgetValueName[WidgetValueName.ReviewAnswers], ReviewAnswers);
  Vue.component(WidgetValueName[WidgetValueName.PreviewForm], PreviewForm);

  //These override existing components:
  //https://github.com/surveyjs/survey-library/tree/master/src/vue
  Vue.component("survey-text", SurveyText);
  //SurveyJS components here, customized.
  Vue.component("sv-string-viewer", StringViewer);
  //Library template function, that creates Vue components from string.
  Vue.component("v-runtime-template", VRuntimeTemplate);

  addQuestionTypes(Survey);
}

export function loadQuestionTypesVueAndSetCss(Survey) {
  addQuestionTypesVue(Survey);
  Survey.defaultBootstrapCss.page.root = "sv_page";
  Survey.defaultBootstrapCss.pageDescription = "sv_page_description";
  Survey.defaultBootstrapCss.page.description = "sv_page_description";
  Survey.defaultBootstrapCss.pageTitle = "sv_page_title";
  Survey.defaultBootstrapCss.page.title = "sv_page_title";
  Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
  Survey.defaultBootstrapCss.question.title = "sv_q_title";
  Survey.defaultBootstrapCss.question.description = "sv_q_description";
  Survey.defaultBootstrapCss.panel.description = "sv_p_description";
  Survey.defaultBootstrapCss.matrixdynamic.button = "btn btn-primary";
  Survey.defaultBootstrapCss.paneldynamic.button = "btn btn-primary";
  Survey.defaultBootstrapCss.paneldynamic.root = "sv_p_dynamic";
  Survey.defaultBootstrapCss.checkbox.item = "sv-checkbox";
  Survey.defaultBootstrapCss.checkbox.controlLabel = "sv-checkbox-label";
  Survey.defaultBootstrapCss.checkbox.materialDecorator = "";
  Survey.defaultBootstrapCss.radiogroup.item = "sv-radio";
  Survey.defaultBootstrapCss.radiogroup.controlLabel = "sv-checkbox-label";
  Survey.defaultBootstrapCss.radiogroup.materialDecorator = "";
  Survey.StylesManager.applyTheme("bootstrap");
}

function calcHolidays() {
  let date = new Date();
  const yearRange = 100; // some day we may want to make this more flexible
  let holidays = {};
  for (let i = -yearRange; i <= yearRange; i++) {
    holidays = Object.assign({}, holidays, HolidayHelper.bcStats(date.getFullYear() + i));
  }
  return holidays
}

function calcHolidaysByDate() {
  let date = new Date();
  const yearRange = 100; // some day we may want to make this more flexible
  let holidays = {};
  for (let i = -yearRange; i <= yearRange; i++) {
    holidays = Object.assign({}, holidays, HolidayHelper.bcStatsDates(date.getFullYear() + i));
  }
  return holidays
}

export const holidays = calcHolidays();
export const holidaysByDate = calcHolidaysByDate();
