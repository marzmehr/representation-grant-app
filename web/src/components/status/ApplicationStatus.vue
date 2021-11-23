<template>
  <b-card id="status">
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
                  class="my-0 py-0"
                  @click="resumeApplication(row.item.id)"
                >
                  Resume Application
                </b-button>
                <b-button
                  size="sm"
                  variant="danger"
                  class="my-0 py-0"
                  @click="removeApplication(row.item, row.index)"
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
                  @click="beginApplication()"
                  >Begin NEW Application</b-button
                >
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

    <b-modal
      v-model="confirmDelete"
      id="bv-modal-confirm-delete"
      header-class="bg-warning text-light"
    >
      <b-row v-if="deleteError" id="DeleteError" class="h4 mx-2">
        <b-badge
          class="mx-1 mt-2"
          style="width: 20rem;"
          v-b-tooltip.hover
          :title="deleteErrorMsgDesc"
          variant="danger"
        >
          {{ deleteErrorMsg }}
          <b-icon class="ml-3" icon="x-square-fill" @click="deleteError = false" />
        </b-badge>
      </b-row>
      <template v-slot:modal-title>
        <h2 class="mb-0 text-light">Confirm Delete Application</h2>
      </template>
      <h4>
        Are you sure you want to delete your
        <b>"{{ applicationToDelete.deceased_name }}"</b> application?
      </h4>
      <template v-slot:modal-footer>
        <b-button variant="danger" @click="confirmRemoveApplication()">Confirm</b-button>
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
import moment from "moment-timezone";
import axios from "axios";

@Component
export default class ApplicationStatus extends Vue {
  previousApplications = [];
  previousApplicationFields = [
    { key: "deceased_name", label: "Deceased Name", sortable: true, tdClass: "border-top" },
    { key: "lastUpdated", label: "Last Updated", sortable: true, tdClass: "border-top" },
    { key: "edit", thClass: "d-none", sortable: false, tdClass: "border-top" }
  ];
  confirmDelete = false;
  currentApplication: any = {};
  applicationToDelete = {};
  indexToDelete = -1;
  applicationId = "";
  error = "";
  deleteErrorMsg = "";
  deleteErrorMsgDesc = "";
  deleteError = false;

  mounted() {
    this.loadApplications();
  }

  public openTerms() {
    this.$router.push({ name: "terms" });
  }

  public loadApplications() {
    //TODO: when extending to use throughout the province, the timezone should be changed accordingly
    //TODO: read in the data required to navigate to the eFilingHub package page
    axios.get("/app-list/").then(
      response => {
        for (const appJson of response.data) {
          const app = {
            lastUpdated: 0,
            lastUpdatedDate: "",
            id: 0,
            deceased_name: "",
          };
          app.lastUpdated = appJson.last_updated
            ? moment(appJson.last_updated)
                .tz("America/Vancouver")
                .diff("2000-01-01", "minutes")
            : 0;
          app.lastUpdatedDate = appJson.last_updated
            ? moment(appJson.last_updated)
                .tz("America/Vancouver")
                .format("MMMM d, yyyy H:mm z")
            : "";
          app.id = appJson.id;
          app.deceased_name = `${appJson.deceased_name.first} ${appJson.deceased_name.middle} ${appJson.deceased_name.last}`;
          this.previousApplications.push(app);
        }
        this.extractFilingLocations();
      },
      err => {
        this.error = err;
      }
    );
  }

  public extractFilingLocations() {
    axios.get("/efiling/locations/").then(
      response => {
        // console.log(Object.keys(response.data))
        const locationsInfo = response.data;
        const locationNames = Object.keys(response.data);
        const locations = [];
        for (const location of locationNames) {
          // console.log(location)
          // console.log(locationsInfo[location])
          const locationInfo = locationsInfo[location];
          const address = locationInfo.address_1
            ? locationInfo.address_1 + ", "
            : "" + locationInfo.address_2
            ? locationInfo.address_2 + ", "
            : "" + locationInfo.address_3
            ? locationInfo.address_3 + ", "
            : "" + locationInfo.address_2
            ? locationInfo.postal
            : "";
          locations.push({ id: locationInfo.location_id, name: location, address: address });
        }
        console.log(locations);
        // if(response.data.length>0) {
        //     this.navigate("returning");
        // }else{
        //     this.navigate("new");
        // }
      },
      err => console.log(err)
    );
  }

  public beginApplication() {
    this.$router.push({ name: "surveys" });
  }

  public navigateToEFilingHub(packageNumber) {
    //TODO: replace input value with the eFilingHub link
    console.log("going to hub");
    //location.replace(packageNumber)
  }

  public resumeApplication(applicationId) {
    axios.get("/app/" + applicationId + "/").then(
      response => {
        const applicationData = response.data;

        this.currentApplication.id = applicationId;
        this.currentApplication.allCompleted = applicationData.allCompleted;
        this.currentApplication.applicantName = applicationData.applicantName;
        this.currentApplication.currentStep = applicationData.currentStep;
        this.currentApplication.lastUpdate = applicationData.lastUpdated;
        this.currentApplication.lastPrinted = applicationData.lastPrinted;
        this.currentApplication.deceasedName = applicationData.deceasedName;
        this.currentApplication.deceasedDateOfDeath = applicationData.deceasedDateOfDeath;
        this.currentApplication.dateOfWill = applicationData.dateOfWill;
        this.currentApplication.applicationLocation = applicationData.applicationLocation;

        this.currentApplication.type = applicationData.type;
        this.currentApplication.userId = applicationData.user;
        this.currentApplication.userName = applicationData.userName;
        this.currentApplication.userType = applicationData.userType;
        this.currentApplication.steps = applicationData.steps;

        this.$router.push({ name: "surveys" });
      },
      err => {
        this.error = err;
      }
    );
  }

  public removeApplication(application, index) {
    this.deleteErrorMsg = "";
    this.deleteErrorMsgDesc = "";
    this.deleteError = false;
    this.applicationToDelete = application;
    this.indexToDelete = index;
    this.confirmDelete = true;
  }

  public confirmRemoveApplication() {
    axios.delete("/app/" + this.applicationToDelete["id"] + "/").then(
      response => {
        var indexToDelete = this.previousApplications.findIndex(app => {
          if (app.id == this.applicationToDelete["id"]) return true;
        });
        if (indexToDelete >= 0) this.previousApplications.splice(indexToDelete, 1);
      },
      err => {
        const errMsg = err.response.data.error;

        this.deleteErrorMsg = errMsg.slice(0, 60) + (errMsg.length > 60 ? " ..." : "");
        this.deleteErrorMsgDesc = errMsg;
        this.deleteError = true;
      }
    );
    this.confirmDelete = false;
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
