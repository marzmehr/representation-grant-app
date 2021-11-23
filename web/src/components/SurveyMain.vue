<template>
  <div class="m-0 mr-5" v-if="survey">
    <b-row style="height: 10rem !important;">
      <b-col md="3">
        <survey-sidebar class="pb-4" :survey="survey" :changed="updatedKey" />
      </b-col>
      <b-col md="9">
        <survey :survey="survey" />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import * as SurveyInit from "@/survey/survey-init";
import SurveySidebar from "@/components/SurveySidebar.vue";
import Axios from "axios";
import { addCustomTemplating } from "@/survey/survey-templating";
import { onValueChanged } from "@/survey/survey-on-value-change";
import { defineComponent, ref } from "@vue/composition-api";
import { getSurveyEnvironment } from "@/utils/utils";

import surveyJson from "@/survey-primary.json";

export default defineComponent({
  name: "SurveyMain",
  props: {
    sandboxName: String
  },
  components: {
    SurveySidebar
  },
  setup(props) {
    let survey = ref<SurveyVue.Model>(new SurveyVue.Model());
    let updatedKey = ref(0);

    const Survey = SurveyVue;
    SurveyInit.loadQuestionTypesVueAndSetCss(Survey);
    const sandboxName = props.sandboxName;

    const loadSurvey = async () => {
      let data = {};
      if (!sandboxName) {
        data = surveyJson;
      } else {
        try {
          const response = await Axios.get(`/sandbox-survey/?sandbox_name=${sandboxName}`);
          data = JSON.parse(response.data.sandbox_data);
        } catch (error) {
          console.log("loadSurvey(): Loading JSON file failed\n", error);
        }
      }
      survey.value = new SurveyVue.Model(data);
      survey.value.commentPrefix = "Comment";
      survey.value.showQuestionNumbers = "off";
      addSurveyListener();
    };

    const addSurveyListener = () => {
      //We use this for visibleIf on a few of the components.
      survey.value
        .getAllQuestions()
        .filter(
          x =>
            x.getType() === "paneldynamic" &&
            (x.name == "spouseInfoPanel" || x.name == "childInfoPanel")
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
        onValueChanged(sender, options);
        updatedKey.value++;
      });

      survey.value.onCurrentPageChanged.add((sender, options) => {
        updatedKey.value++;
        Vue.nextTick(() => {
          const el = document.getElementById("sidebar-title");
          if (el) el.scrollIntoView();
        });
      });

      survey.value.setVariable(`surveyEnvironment`, getSurveyEnvironment());
    };

    loadSurvey();

    return {
      survey,
      updatedKey
    };
  }
});
</script>
