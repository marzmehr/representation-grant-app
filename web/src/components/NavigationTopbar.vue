<template>
  <header class="app-header">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="https://www2.gov.bc.ca" style="max-width:200px">
          <img
            class="img-fluid d-none d-md-block"
            src="../../public/images/bcid-logo-rev-en.svg"
            width="177"
            height="44"
            alt="B.C. Government Logo"
          />

          <img
            class="img-fluid d-md-none"
            src="../../public/images/bcid-symbol-rev.svg"
            width="63"
            height="44"
            alt="B.C. Government Logo"
          />
        </a>
        <div class="navbar-brand navbar-text">
          Represent Someone Who Died
          <div class="navbar-text" style="font-size: small;">
            (also known as Probate)
          </div>
          <span class="navbar-tag">BETA</span>
          <button v-if="inSurvey()" type="button" class="btn btn-primary btn-sm" style="margin-left: 20px" @click="save()">Save</button>
          <button type="button" class="btn btn-primary btn-sm" style="margin-left: 20px" v-on:click="toFeedback()">Give Feedback</button>
        </div>

        <div class="navbar-extra">
          <div id="app-profile">
            <div v-if="userName" style="padding-right: rem">
              <b-dropdown
                id="profileDropdown"
                text="Profile"
                variant="primary btn-transparent"
                menu-class="w-10"
                style="margin-right: 1rem"
              >
                <template #button-content style="background-color: #003366">
                  <span class="fa fa-user"></span> {{ userName }}
                </template>
                <!--<b-dropdown-item @click="runsurvey()">SurveyJS Editor</b-dropdown-item>-->
                <b-dropdown-item @click="logout(false)">Logout</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getApplicationId, getUserName } from "@/state/application-state";
import { SessionService } from "@/services/session-service";
import { SurveyDataService } from "@/services/survey-data-service";
import { getSurvey } from "@/state/survey-state";
import { saveSurvey } from "@/utils/utils";
@Component
export default class NavigationTopbar extends Vue {
  error = "";

  get userName() {
    return getUserName.value;
  }

  public logout(isQuickExit) {
    const emptyApplicationRoutes = ["/", "/status", "/serviceLocator"];
    if (emptyApplicationRoutes.indexOf(this.$route.fullPath) == -1) {
      const applicationId = getApplicationId.value;
      const data = getSurvey.value.data;
      SurveyDataService.updateApplication(applicationId, data);
    }
    Vue.nextTick().then(() => {
      if (isQuickExit) {
        window.open("http://www.google.ca");
        SessionService.logoutAndRedirect();
      } else SessionService.logout();
    });
  }

  public save() {
    const saved = saveSurvey();
    if(saved) {
      alert("Represent Someone Who Died\n\nSaved");
    } else {
      alert("Represent Someone Who Died\n\nFailed to save");
    }
  }

  public inSurvey() {
    const route = this.$route.name;
    if (route === "surveys") {
      return true;
    } else {
      return false;
    }
  }
  
  public toFeedback() {
    const route = this.$router.resolve({ name: "feedback" });
    window.open(route.href, "_blank");
  }
}
</script>

<style>
.btn-transparent {
  background-color: transparent !important;
  border-color: #ccc !important;
}
</style>

<style scoped lang="scss">
@import "@/styles/_common";

.navbar {
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
}

.navbar-brand:not(.logo) {
  flex: 1 1 auto;
}

.navbar-extra {
  display: inline-block;
  flex: 1 1 auto;
  text-align: right;
}

.navbar .navbar-extra {
  display: inline-block;
  flex: 1 1 auto;
  text-align: right;
}

.app-header {
  margin-top: 63px;
}

#app-profile {
  color: $gov-white;
}
</style>
