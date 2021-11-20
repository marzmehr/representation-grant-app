<template>
  <div class="m-0 mr-5" v-if="survey">
    <b-row style="height: 10rem !important;">
      <b-col md="3">
        <sandbox-sidebar class="pb-4" :survey="survey" :changed="updatedKey" />
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
import * as SurveyInit from "@/components/survey/survey-init";
import SandboxSidebar from "./SandboxSidebar.vue";
import Axios from "axios";
import { addCustomTemplating } from "@/components/survey/survey-templating";
import { onValueChanged } from "@/components/survey/survey-on-value-change";
import { defineComponent, ref} from "@vue/composition-api";
import { getSurveyEnvironment } from "@/components/utils/utils";

export default defineComponent({
  name: "SurveySandBox",
  props: {
    sandboxName: String
  },
  components: {
    SandboxSidebar
  },
  setup(props) {
    let survey = ref<SurveyVue.Model>(new SurveyVue.Model());
    let updatedKey = ref(0);

    const Survey = SurveyVue;
    SurveyInit.loadQuestionTypesVueAndSetCss(Survey);
    const sandboxName = props.sandboxName;

    const loadSurveyDataFromDatabase = async () => {
      try {
        const response = await Axios.get(`/sandbox-survey/?sandbox_name=${sandboxName}`);
        const data = JSON.parse(response.data.sandbox_data);
        survey.value = new SurveyVue.Model(data);
        survey.value.commentPrefix = "Comment";
        survey.value.showQuestionNumbers = "off";
        addSurveyListener();
      } catch (error) {
        console.log("loadSurveyDataFromDatabase(): Loading JSON file failed\n", error);
      }
    };

    const addSurveyListener = () => {
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

    loadSurveyDataFromDatabase();

    return {
      survey,
      updatedKey
    }
  }
});
</script>