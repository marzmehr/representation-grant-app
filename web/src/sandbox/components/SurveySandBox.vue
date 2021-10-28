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
import { Vue, Component, Prop } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import * as SurveyInit from "@/components/survey/survey-init";
import SandboxSidebar from "./SandboxSidebar.vue";
import Axios from "axios";
import { addCustomTemplating } from "@/components/survey/survey-templating";

@Component({
  components: {
    SandboxSidebar
  }
})
export default class SurveySandBox extends Vue {
  @Prop() sandboxName!: string;

  survey = null;
  updatedKey = 0;

  beforeCreate() {
    const Survey = SurveyVue;
    SurveyInit.loadQuestionTypesVueAndSetCss(Survey);
  }

  async mounted() {
    const data = await this.loadSurveyDataFromDatabase();
    this.survey = new SurveyVue.Model(data);
    this.survey.commentPrefix = "Comment";
    this.survey.showQuestionNumbers = "off";
    this.addSurveyListener();
  }

  public async loadSurveyDataFromDatabase() {
    try {
      const response = await Axios.get(`/sandbox-survey/?sandbox_name=${this.sandboxName}`);
      return JSON.parse(response.data.sandbox_data);
    } catch (error) {
      console.log("loadSurveyDataFromDatabase(): Loading JSON file failed\n", error);
    }
  }

  //TODO SurveyCreatorForm.vue should combine with this.
  public addSurveyListener() {
    window.surveyInstance = this.survey;

    //These need to be here to keep track of panel counts.
    window.surveyInstance
      .getAllQuestions()
      .filter(x => x.getType() === "paneldynamic")
      .forEach(element => {
        window.surveyInstance.setVariable(`${element.name}-count`, element.panelCount);
      });

    window.surveyInstance.onDynamicPanelAdded.add((sender, options) => {
      sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
    });

    window.surveyInstance.onDynamicPanelRemoved.add((sender, options) => {
      sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
    });

    addCustomTemplating(window.surveyInstance);
    window.surveyInstance.onAfterRenderSurvey.add((sender, options) => {
      this.updatedKey++;
    });

    window.surveyInstance.onValueChanged.add((sender, options) => {
      this.updatedKey++;
    });

    window.surveyInstance.onCurrentPageChanged.add((sender, options) => {
      this.updatedKey++;
      Vue.nextTick(() => {
        const el = document.getElementById("sidebar-title");
        if (el) el.scrollIntoView();
      });
    });
  }
}
</script>
