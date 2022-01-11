import Vue from "vue";
import { addQuestionTypes, WidgetValueName } from "@/survey/question-types/question-types";


import AddressAndContact from "@/components/survey/AddressAndContact.vue";
import ContactInfo from "@/components/survey/ContactInfo.vue";
import CustomDate from "@/components/survey/CustomDate.vue";
import HelpText from "@/components/survey/HelpText.vue";
import InfoText from "@/components/survey/InfoText.vue";
import PersonName from "@/components/survey/PersonName.vue";
import YesNo from "@/components/survey/YesNo.vue";
import FormDownloadButton from "@/components/survey/FormDownloadButton.vue";
import ReviewAnswers from "@/components/survey/ReviewAnswers.vue";
import PreviewForm from "@/components/survey/PreviewForm.vue";

import VRuntimeTemplate from "v-runtime-template";
import StringViewer from "@/components/survey/survey-js-internal/StringViewer.vue";
import SurveyText from "@/components/survey/survey-js-internal/SurveyText.vue";
import SurveyElementVueWrapper from "@/components/survey/survey-js-internal/SurveyElementVueWrapper.vue";

import { HolidayHelper } from "@/utils/holiday";

export function addQuestionTypesVue(Survey: any) {
  Vue.component(WidgetValueName[WidgetValueName.HelpText], HelpText);
  Vue.component(WidgetValueName[WidgetValueName.InfoText], InfoText);
  Vue.component(WidgetValueName[WidgetValueName.YesNo], YesNo);
  Vue.component(WidgetValueName[WidgetValueName.AddressAndContact], AddressAndContact);
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
  //SurveyJS component wrapped here for transitions.
  Vue.component("survey-element", SurveyElementVueWrapper);

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
