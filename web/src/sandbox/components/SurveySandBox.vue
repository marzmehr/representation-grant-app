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
import * as SurveyInit from "@/components/survey/question-types/survey-init";
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

  public addSurveyListener() {
    (window as any).surveyInstance = this.survey;
    //These need to be here to keep track of panel counts.

    /* This causes terrible performance. 
    this.survey
      .getAllQuestions()
      .filter(x => x.getType() === "paneldynamic")
      .forEach(element => {
        this.survey.setVariable(`${element.name}-count`, element.panelCount);
      });*/

    this.survey.onDynamicPanelAdded.add((sender, options) => {
      sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
    });

    this.survey.onDynamicPanelRemoved.add((sender, options) => {
      sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
    });

    addCustomTemplating(this.survey);
    this.survey.onAfterRenderSurvey.add((sender, options) => {
      this.updatedKey++;
    });

    this.survey.onValueChanged.add((sender, options) => {
      this.updatedKey++;
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
