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
import surveyJson1 from "../JsonFiles/sandbox3.json";
import * as surveyEnv from "./survey-glossary";

import SandboxSidebar from "./SandboxSidebar.vue";

import Axios from "axios";

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

  // ASYNC AWAIT is causing issues. make sure the left panel is yellow.

  loadSurveyData = this.loadSurveyDataFromDatabase();
  survey = new SurveyVue.Model(this.loadSurveyData);
  updatedKey = 0;

  beforeCreate() {
    const Survey = SurveyVue;
    surveyEnv.setCss(Survey);
    surveyEnv.loadGlossary();
  }

  async mounted() {
    await this.initializeSurvey();
    this.addSurveyListener();
    // this.reloadPageInformation();
  }

  public async initializeSurvey() {
    this.survey = new SurveyVue.Model(await this.loadSurveyData);
    this.survey.commentPrefix = "Comment";
    this.survey.showQuestionNumbers = "off";
    // this.survey.showNavigationButtons = false;
    surveyEnv.setGlossaryMarkdown(this.survey);
  }

  public addSurveyListener() {
    this.survey.onValueChanged.add((sender, options) => {
      //console.log(options)
      //console.log(this.survey)
      this.updatedKey++;
      //this.survey.currentPageNo =3;
    });

    this.survey.onCurrentPageChanged.add((sender, options) => {
      this.updatedKey++;
      //Vue.nextTick(()=> window.scrollTo(0,0))
      Vue.nextTick(() => {
        const el = document.getElementById("sidebar-title");
        if (el) el.scrollIntoView();
        //scrollTo(0,0);
        //console.log(el)
      });
      // , 1000)
    });
  }
}
</script>
