<template>
  <div class="m-0 mr-5">
    <b-row style="height: 10rem !important;">
      <b-col md="3">
        <sandbox-sidebar class="pb-4" :survey="survey" :changed="updatedKey" />
      </b-col>
      <b-col md="9">
        <survey v-bind:survey="survey"></survey>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import * as surveyEnv from "./survey-glossary";
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

  public async loadSurveyDataFromDatabase() {
    try {
      const response = await Axios.get(
        `/sandbox-survey/?sandbox_name=${this.sandboxName}`
      );
      return JSON.parse(response.data.sandbox_data);
    } catch (error) {
      console.log(
        "loadSurveyDataFromDatabase(): Loading JSON file failed\n",
        error
      );
    }
  }

  loadSurveyData = this.loadSurveyDataFromDatabase();
  survey = new SurveyVue.Model(this.loadSurveyData);
  updatedKey = 0;

  beforeCreate() {
    const Survey = SurveyVue;
    surveyEnv.setCss(Survey);
    surveyEnv.loadGlossary();
  }

  async mounted() {
    this.survey = new SurveyVue.Model(await this.loadSurveyData);
    console.log("mounted surveySandbox.");
    this.initializeSurvey();
    this.addSurveyListener();
  }

  public initializeSurvey() {
    this.survey.commentPrefix = "Comment";
    this.survey.showQuestionNumbers = "off";
    surveyEnv.setGlossaryMarkdown(this.survey);
  }

  public addSurveyListener() {
    addCustomTemplating(this.survey);
    this.survey.onAfterRenderSurvey.add((sender, options) => {
      this.updatedKey++;
    });

    this.survey.onValueChanged.add((sender, options) => {
      this.updatedKey++;
      //TODO add in a hook here for combiners.
    });

    this.survey.onCurrentPageChanged.add((sender, options) => {
      this.updatedKey++;
      Vue.nextTick(() => {
        const el = document.getElementById("sidebar-title");
        if (el) el.scrollIntoView();
      });
    });
  }
}
</script>
