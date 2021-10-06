<template>
  <b-card
    v-if="pageReady"
    id="landing-page"
    class="container"
    border-variant="white"
  >
    <b-row class="mt-3">
      <b-col>
        <span class="text-primary h2 ml-4"
          >Apply to Represent Someone Who Died (also know as Probate)</span
        >
        <b-card border-variant="white">
          <p>
            Use this service to apply for a
            <tooltip :index="0" title="Representation Grant" /> from the Supreme
            Court of British Columbia. A Representation Grant is a court
            document that confirms you are the appropriate person to manage the
            property, money and other belongings that a person left behind after
            they died. The collection of
            <tooltip :index="0" title="assets" /> that a person left behind is
            call their <tooltip :index="0" title="estate" />.
          </p>

          <p>
            Representation Grant is an umbrella term that includes different
            types of grants. A Grant of Probate is a type of Representation
            Grant specifically for executors named in the Will.
          </p>

          <b-list-group-item>
            <b-icon-credit-card variant="primary" /><b> Cost:</b>
            <ul>
              <li>
                This service is provided for free by the Government of British
                Columbia.
              </li>
              <li>
                This service will help you complete your
                <tooltip :index="0" title="application" />
              </li>
              <li>
                Once your application is complete, there will usually be a $200
                fee to file your application with the court. If the
                <tooltip :index="2" title="estate" /> is worth less than
                $25,000, the application will be free to file.
              </li>
              <li>
                There will be costs for swearing or affirming the
                <tooltip :index="0" title="affidavit" />s you will need for the
                application. Each affidavit costs $40 to swear or affirm at a
                courthouse. An application usually has 3 or more affidavits.
              </li>
              <li>
                There will be <tooltip :index="0" title="probate fees" /> if the
                <tooltip :index="1" title="estate" /> is worth more than
                $25,000. This fee will be a percentage of the total value.
              </li>
            </ul>
          </b-list-group-item>
          <b-list-group-item>
            <b-icon-clock-history variant="primary" /><b> Time:</b> The average
            time that people spend using this service is 6 hours. Don't worry.
            You don't have to complete this all at once. This service will save
            your progress so you can come back later.<br />
            The amount of time it will take you to complete your application
            will depend on:
            <ul>
              <li>If there is a <tooltip :index="0" title="Will" />.</li>
              <li>How many people are involved</li>
              <li>How many belongings are involved</li>
            </ul>
          </b-list-group-item>
          <b-list-group-item>
            <b-icon-printer variant="primary" /><b> Print:</b>
            You will need a printer to print your application.
          </b-list-group-item>

          <!-- <b-card border-variant="white" class="mt-3">
                            <span class="text-primary h3">Filing Your Application</span>
                            <p class="mt-3">You can use this service to file your application online. </p>
                            <p>If there is a <tooltip :index="1" title='Will'/> and it is written on paper, you can still 
                                file online. However, you need to mail the Will to a courthouse or file it in person.
                            </p>
                            <p>You may also choose to print your application and file the whole package, including 
                                the Will, in person at a courthouse.
                            </p>
                        </b-card>  -->

          <b-card border-variant="white" v-if="!isLoggedIn">
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SessionManager } from "@/components/utils/utils";
import Tooltip from "@/components/survey/Tooltip.vue";

@Component({
  components: {
    Tooltip
  }
})
export default class LandingPage extends Vue {
  isLoggedIn = false;
  pageReady = true;

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
@import "src/styles/common";

.list-group-item {
  border-color: white;
  border: 2px solid rgba($gov-pale-grey, 0.3);
  border-radius: 18px;
  background-color: rgba($gov-mid-blue, 0.6);
  margin-top: 0.5rem;
  color: $gov-white;
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
  border: 2px solid rgb(231, 231, 231);
  &:hover,
  &:focus {
    color: blue;
  }
  &:active {
    border: 2px solid rgba($gov-white, 0.8);
  }
}
</style>
