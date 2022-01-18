<template>
  <b-container class="container home-content" style="margin-bottom: 56px;">
    <survey :survey="survey"></survey>
    <b-button v-if="displayButton" @click="onSubmit" variant="success">
      <b-icon-check-circle-fill /> Next
    </b-button>

    <b-modal
      size="xl"
      v-model="showDisclaimer"
      header-class="bg-white"
      no-close-on-backdrop
      hide-header-close
    >
      <template v-slot:modal-title>
        <h1 class="mb-0 text-primary">Terms and Conditions</h1>
      </template>

      <p>
        "Represent Someone Who Died" is a service provided by the Government of British
        Columbia.
      </p>
      <p>The Government of British Columbia has the right to change this service at any time.</p>
      <ul>
        <li>
          Learn more about the disclaimer and liability
          <a target="_blank" href="https://www2.gov.bc.ca/gov/content/home/disclaimer">here </a>.
        </li>
        <li>
          Learn more about privacy and security
          <a target="_blank" href="https://www2.gov.bc.ca/gov/content/home/privacy">here </a>.
        </li>
      </ul>

      <p>
        The Supreme Court of British Columbia will review your
        <tooltip :index="0" title="application" />. The Court will decide to give you a
        <tooltip :index="0" title="Representation Grant" />or not.
      </p>

      <template v-slot:modal-footer>
        <b-button
          variant="primary"
          style="font-size:22px;font-weight:bold;"
          size="lg"
          @click="showDisclaimer = false"
          >Accept</b-button
        >
      </template>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import * as SurveyInit from "@/survey/survey-init";
import surveyJson from "@/components/home/forms/survey-qualify.json";
import Tooltip from "@/components/survey/Tooltip.vue";

import { addCustomTemplating } from "@/survey/survey-templating";
import { getUserId } from "@/state/application-state";

@Component({
  components: {
    Tooltip
  }
})
export default class PreQualification extends Vue {
  userId = "";
  error = "";
  applicationId = 0;
  displayButton = false;
  showDisclaimer = false;
  //@ts-ignore - It sucks to have to do this.
  survey = new SurveyVue.Model(surveyJson);

  beforeCreate() {
    const Survey = SurveyVue;
    SurveyInit.loadQuestionTypesVueAndSetCss(Survey);
  }

  mounted() {
    this.showDisclaimer = false;
    this.displayButton = false;
    //@ts-ignore - It sucks to have to do this.
    this.survey = new SurveyVue.Model(surveyJson);
    this.survey.commentPrefix = "Comment";
    this.survey.showQuestionNumbers = "off";
    this.survey.showNavigationButtons = false;
    this.addSurveyListener();
    this.userId = getUserId.value;
  }

  public onSubmit(evt) {
    evt.preventDefault();

    if (!this.survey.isCurrentPageHasErrors) {
      if (
        this.survey.data.qualifyingWillExists == "n" &&
        this.survey.data.qualifyingDiedAfterWESA == "y" &&
        this.survey.data.qualifyingTerms > 0
      ) {
        if (this.userId !== "") {
          this.$router.push({ name: "surveys" });
        } else {
          this.$router.push({ name: "qualified" });
        }
      } else {
        this.$router.push({ name: "unqualified" });
      }
    }
  }

  public addSurveyListener() {
    addCustomTemplating(this.survey);
    this.survey.onValueChanged.add((sender, options) => {
      if (
        this.survey.data.qualifyingWillExists == "n" &&
        this.survey.data.qualifyingDiedAfterWESA == "y" &&
        this.survey.data.qualifyingTerms > 0
      ) {
        this.displayButton = true;
      } else {
        this.displayButton = false;
      }
    });
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/_common";
.home-content {
  padding-bottom: 20px;
  padding-top: 2rem;
  max-width: 1140px;
  color: black;
}
</style>
