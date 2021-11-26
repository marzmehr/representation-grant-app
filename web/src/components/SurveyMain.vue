<template>
  <div v-if="survey" style="display: flex; flex:auto;">
    <survey-sidebar class="survey-sidebar" :survey="survey" :changed="updatedKey" />
    <div style="width:100%">
      <survey :survey="survey" class="pb-4 pl-4 pr-4" />
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import _ from "lodash";
import { Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";

import * as SurveyInit from "@/survey/survey-init";
import SurveySidebar from "@/components/SurveySidebar.vue";
import { addCustomTemplating } from "@/survey/survey-templating";
import { onValueChanged } from "@/survey/survey-on-value-change";
import { defineComponent, onMounted, ref } from "@vue/composition-api";
import { getSurveyEnvironment } from "@/utils/utils";
import surveyJson from "@/survey-primary.json";
import { getSurvey, setSurvey } from "@/state/survey-state";
import { SurveyDataService } from "@/services/survey-data-service";
import { SurveyQuestionNames } from "@/types/survey-primary";

export default defineComponent({
  name: "SurveyMain",
  props: {
    sandboxName: String
  },
  components: {
    SurveySidebar
  },
  setup(props) {
    let timeoutHandle: NodeJS.Timeout;
    const sandboxName = props.sandboxName;
    const Survey = SurveyVue;
    const survey = getSurvey;
    let updatedKey = ref(0);
    SurveyInit.loadQuestionTypesVueAndSetCss(Survey);

    onMounted(() => {});

    const loadSurveyData = async () => {
      const surveyData = await SurveyDataService.onLoadSurveyData();
      survey.value.data = surveyData?.steps;
    };

    const loadSurveyJson = async () => {
      let data = {};
      if (!sandboxName) {
        data = surveyJson;
      } else {
        try {
          const response = await axios.get(`/sandbox-survey/?sandbox_name=${sandboxName}`);
          data = JSON.parse(response.data.sandbox_data);
        } catch (error) {
          console.log("loadSurveyJson(): Loading JSON file failed\n", error);
        }
      }
      setSurvey(new SurveyVue.Model(data));
      survey.value.commentPrefix = "Comment";
      survey.value.showQuestionNumbers = "off";
      addSurveyListener();
      if (!sandboxName) loadSurveyData();
    };

    const saveTimer = () => {
      if (sandboxName) return;
      clearTimeout(timeoutHandle);
      timeoutHandle = setTimeout(() => SurveyDataService.onSaveSurvey(), 3500);
    };

    const addSurveyListener = () => {
      //We use this for visibleIf on a few of the components.
      survey.value
        .getAllQuestions()
        .filter(
          x =>
            x.getType() === "paneldynamic" &&
            (x.name == SurveyQuestionNames.spouseInfoPanel || x.name ==  SurveyQuestionNames.childInfoPanel)
        )
        .forEach(element => {
          survey.value.setVariable(`${element.name}-count`, element.panelCount);
        });

      survey.value.onDynamicPanelAdded.add((sender, options) => {
        sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
      });

      survey.value.onDynamicPanelRemoved.add((sender, options) => {
        sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
      });

      addCustomTemplating(survey.value);
      survey.value.onAfterRenderSurvey.add((sender, options) => {
        updatedKey.value++;
      });

      survey.value.onValueChanged.add((sender, options) => {
        updatedKey.value++;
        onValueChanged(sender, options);
        saveTimer();
      });

      survey.value.onCurrentPageChanged.add((sender, options) => {
        updatedKey.value++;
        saveTimer();
        Vue.nextTick(() => {
          const el = document.getElementById("sidebar-title");
          if (el) el.scrollIntoView();
        });
      });

      survey.value.setVariable(`surveyEnvironment`, getSurveyEnvironment());
    };

    loadSurveyJson();

    return {
      survey,
      updatedKey
    };
  }
});
</script>
