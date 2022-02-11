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
        <div class="navbar-brand navbar-text" style="vertical-align: middle">
          <span style="vertical-align:middle;">
            Represent Someone Who Died
          </span>
          <div class="navbar-text pt-0 pb-0" style="font-size: 12px;vertical-align:middle;">
            (also known as Probate)
          </div>
          <span class="navbar-tag">BETA</span>
          <button type="button" class="btn btn-primary btn-sm" style="margin-left: 20px" v-on:click="toFeedback()">Give Feedback</button>
        </div>

        <div class="navbar-extra">
          <div id="app-profile">
            <div v-if="userName" style="padding-right: rem">
              <span class="pr-2">
                {{ userName }}
              </span>
              <button class="btn btn-primary btn-transparent ml-2" style="background-color: #fcba19 !important; color:rgb(0 51 102); border-color: #494949 !important;">
                <span class="fa fa-sign-out pr-1"></span>
                <span @click="logout(false)">Logout</span>
              </button>
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

  public inSurvey() {
    return this.$route.name === "surveys";
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
  overflow: visible;
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
