<template>
  <b-card id="status" border-variant="white">
    <b-container class="container home-content">
      <div class="alert alert-danger mt-4" v-if="error">{{ error }}</div>
      <b-row>
        <b-col>
          <h1>Previous Applications</h1>
          <hr class="bg-light" style="height: 2px;" />

          <b-card
            no-body
            border-variant="white"
            bg-variant="white"
            v-if="!previousApplications.length"
          >
            <span class="text-muted ml-4 mb-5">No previous applications.</span>
          </b-card>

          <b-card v-else no-body border-variant="white" bg-variant="white">
            <b-table
              :items="previousApplications"
              :fields="previousApplicationFields"
              class="mx-4"
              sort-by="lastUpdated"
              :sort-desc="true"
              borderless
              striped
              small
              responsive="sm"
            >
              <template v-slot:cell(edit)="row">
                <b-button
                  size="sm"
                  variant="primary"
                  class="my-0 py-0 ml-2 mr-2"
                  @click="resumeApplication(row.item.id)"
                >
                  Resume Application
                </b-button>
                <b-button
                  size="sm"
                  variant="danger"
                  class="my-0 py-0"
                  @click="dataManager.onDeleteApplication(row.item, row.index, deleteItems)"
                >
                  Delete Application
                </b-button>
              </template>
              <template v-slot:cell(deceased_name)="row">
                <span>{{ row.item.deceased_name }}</span>
              </template>
              <template v-slot:cell(lastUpdated)="row">
                <span>{{ row.item.lastUpdatedDate }}</span>
              </template>
            </b-table>
          </b-card>

          <b-card border-variant="white">
            <b-row>
              <b-col cols="5">
                <b-button
                  variant="success"
                  class="btn-lg register-button"
                  @click="beginNewApplication()"
                  >Begin NEW Application</b-button
                >
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      v-model="deleteItems.confirmDelete"
      id="bv-modal-confirm-delete"
      header-class="bg-warning text-light"
    >
      <b-row v-if="deleteItems.deleteError" id="DeleteError" class="h4 mx-2">
        <b-badge
          class="mx-1 mt-2"
          style="width: 20rem;"
          v-b-tooltip.hover
          :title="deleteItems.deleteErrorMsgDesc"
          variant="danger"
        >
          {{ deleteItems.deleteErrorMsg }}
          <b-icon class="ml-3" icon="x-square-fill" @click="deleteItems.deleteError = false" />
        </b-badge>
      </b-row>
      <template v-slot:modal-title>
        <h2 class="mb-0 text-light">Confirm Delete Application</h2>
      </template>
      <h4>
        Are you sure you want to delete your
        <b>"{{ deleteItems.deleteError.deceased_name }}"</b> application?
      </h4>
      <template v-slot:modal-footer>
        <b-button variant="danger" @click="dataManager.OnDeleteApplicationConfirm(previousApplications, deleteItems)">Confirm</b-button>
        <b-button variant="primary" @click="$bvModal.hide('bv-modal-confirm-delete')"
          >Cancel</b-button
        >
      </template>
      <template v-slot:modal-header-close>
        <b-button
          variant="outline-warning"
          class="text-light closeButton"
          @click="$bvModal.hide('bv-modal-confirm-delete')"
          >&times;</b-button
        >
      </template>
    </b-modal>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as SurveyVue from "survey-vue";
import * as surveyEnv from "@/survey/survey-init";
import { SurveyDataManager } from "@/services/survey-data-manager";
import { extractFilingLocations } from "@/utils/utils";
import { getError, setApplicationId } from "@/state/application-state";

@Component
export default class ApplicationStatus extends Vue {
  previousApplications = [];
  previousApplicationFields = [
    { key: "deceased_name", label: "Deceased Name", sortable: true, tdClass: "border-top" },
    { key: "lastUpdated", label: "Last Updated", sortable: true, tdClass: "border-top" },
    { key: "edit", thClass: "d-none", sortable: false, tdClass: "border-top" }
  ];
  currentApplication: any = {};
  applicationId = "";
  error = getError.value;
  deleteItems = {
    deleteErrorMsg: "",
    deleteErrorMsgDesc: "",
    deleteError: false,
    applicationToDelete: {},
    indexToDelete: -1,
    confirmDelete: false,
  }
  dataManager = SurveyDataManager;

  mounted() {
    SurveyDataManager.onLoadApplications(this.previousApplications);
    extractFilingLocations();
  }

  public async resumeApplication(applicationId) {
    setApplicationId(applicationId);
    this.$router.push({ name: "surveys" });
  }

  public openTerms() {
    this.$router.push({ name: "terms" });
  }

  public async beginNewApplication() {
    const data = await SurveyDataManager.onBeginNewApplication();
    setApplicationId(data.app_id);
    this.$router.push({ name: "surveys" });
  }

  public navigateToEFilingHub(packageNumber) {
    //TODO: replace input value with the eFilingHub link
    //location.replace(packageNumber)
  }

  beforeCreate() {
    const Survey = SurveyVue;
    surveyEnv.loadQuestionTypesVueAndSetCss(Survey);
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/_common";
.home-content {
  padding-bottom: 20px;
  padding-top: 2rem;
  max-width: 950px;
  color: black;
}
hr.section {
  border: 0.5px solid $gov-mid-blue;
  margin-bottom: 1.5rem;
}
.section-heading {
  color: $gov-mid-blue;
  font-weight: 500;
  padding: 0rem 2rem 0rem 2rem;
}
.intro {
  font-size: 24px;
  line-height: 1.6;
  margin: 0.5rem auto 0.5rem;
  p {
    margin-bottom: 0.5rem;
  }
}
.loginInfo-section {
  margin-top: 2.5rem;
}
.register-button {
  color: $gov-white !important;
  border: 2px solid rgba($gov-mid-blue, 0.3);
  margin-top: 2.5rem;
  width: 100%;
  &:active {
    border: 2px solid rgba($gov-white, 0.8);
  }
}
.wrapper {
  position: relative;
  padding-left: 8rem;
  width: 30px;
  height: 200px;
  margin: 10px;
}

.application-button {
  margin-right: 2rem;
}

.terms {
  color: $gov-mid-blue;
}
</style>
