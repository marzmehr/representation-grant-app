<template>
  <div class="wrap">
    <div class="content">
      <b-card 
        v-if="pageReady"
        id="landing-page"
        class="container"
        style="background: content-box; border: none; color: black"
        >
        <b-row class="mt-3">
          <b-col>
            <div 
            class="text-primary h1"
            style="text-align:center"
              >Represent Someone Who Died
              <br>
              (also known as Probate)*</div
            >
            <div
            class="h3"
            style="text-align:center">
              <b>This service will allow you to apply for a <tooltip :index="0" title="Representation Grant" /> from the Supreme Court of British Columbia</b>
            </div>
            <div style="text-align:center">
              <b>*At present this application is limited to complete the forms required when the deceased did not leave a will</b>
            </div>
            <br/>
            <br/>
            <br/>
            <div
            class="h3"
            style="text-align:center">
              How it Works?
            </div>
            <b-list-group-item>
              <div class="row" style="font-weight: bold; color: black">
                <div class="col-md-6">
                  <ol type="1">
                    <li>
                      Register of login
                      <br/>
                      To use this application, you will need to setup a Basic BCeID account. If you do not currently have a Basic BCeID account you can register for one by clicking the Registrar button.
                    </li>
                    <br/>
                    <li>
                      Answer Questions
                      <br/>
                      Our secure online questionnaire will ensure that this service is appropriate for you to use and will save your work so, you can proceed at your own pace.
                    </li>
                  </ol>
                </div>
                <div class="col-md-6">
                  <ol type="1" start="3">
                    <li>
                      Print Your Forms
                      <br/>
                      Once you're done with the question, you will need to print your documents and file at your local court registry.
                    </li>
                  </ol>
                </div>
              </div>
            </b-list-group-item>
            <b-card border-variant="white" style="background: content-box; border: none">
              <b-card border-variant="white" v-if="!isLoggedIn" style="background: content-box; border: none">
                <b-row class="justify-content-center">
                  <b-button
                    variant="primary"
                    size="lg"
                    class="survey-button text-white"
                    @click="navigate('new')"
                  >
                    <strong>New User</strong> - Let’s get started
                  </b-button>
                </b-row>

                <b-row class="justify-content-center">
                  <b-button
                    variant="warning"
                    class="login-button text-primary"
                    @click="navigate('returning')"
                  >
                    <strong>Returning User?</strong>
                    <br />Log in with BCeID
                  </b-button>
                </b-row>
              </b-card>
            </b-card>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tooltip from "@/components/survey/Tooltip.vue";
import { setHideHeaderFooter } from "@/state/application-state";
@Component({
  components: {
    Tooltip
  }
})
export default class LandingPage extends Vue {
  isLoggedIn = false;
  pageReady = true;
  mounted() {
    setHideHeaderFooter(false);
    if (document?.referrer?.includes('bceid.ca'))
      this.navigate('returning');
  }
  public navigate(userType) {
    if (userType === "new") {
      this.$router.push({ name: "pre-qualification" });
    } else if (userType === "returning") {
      this.$router.push({ name: "applicant-status" });
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/_common";
.list-group-item {
  border-color: white;
  border: 2px solid rgba($gov-navy-blue, 0.5);
  border-radius: 18px;
  background-color: rgba($gov-mid-blue, 0);
  margin-top: 0.5rem;
  color: $text-color;
}
.survey-button {
  color: black;
  border: 2px solid rgba($gov-pale-grey, 0.3);
  margin-top: 2.5rem;
  &:hover,
  &:focus {
    color: rgb(247, 214, 126);
  }
  &:active {
    border: 2px solid rgba($gov-white, 0.8);
  }
}
.login-button {
  color: black;
  margin-top: 1rem;
  border: 2px solid rgb($gov-pale-grey, 0.8);
  &:hover,
  &:focus {
    color: blue;
  }
  &:active {
    border: 2px solid rgba($gov-white, 0.8);
  }
}
.wrap {
  position: relative;
}

.wrap:before {
  content: ' ';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background-image: url('/images/legislature-dome.jpg');
  background-size: cover;
}

.content  {
  position: relative;
}
</style>