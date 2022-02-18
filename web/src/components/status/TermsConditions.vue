<template>
  <b-card class="container" id="terms" border-variant="white">
    <b-row class="mt-3">
      <b-col>
        <span class="text-primary h1 ml-4">Terms and Conditions</span>
        <b-card border-variant="white">
          <p>
            Represent Someone Who Died is a service provided by the Government of British
            Columbia to help you apply for a <tooltip :index="0" title="Representation Grant" />.
          </p>
            <ul>
              <li>
                The Supreme Court of British Columbia will review the documents that you create through this service.
              </li>
              <li> The Court may ask you for additional information even if you have used this service.</li>
              <li> The Court will decide whether or not to give you a Representation Grant. </li>
            </ul>
  
          <p>
            The Government of British Columbia may update this service at any time.
          </p>
          <ul>
            <li>
              Learn more about <a target="_blank" href="https://www2.gov.bc.ca/gov/content/home/disclaimer"> the disclaimer and liability
             here</a
              >.
            </li>
            <li>
              Learn more about <a target="_blank" href="https://www2.gov.bc.ca/gov/content/home/privacy"> privacy and security
              here</a>.
            </li>
          </ul>

          <p>
            You previously agreed to these terms when you clicked "Continue" on the first page of this service entitled 
            <a href="do-you-need-this-service" target="_blank">Is this service right for your situation?</a>
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Tooltip from "@/components/survey/Tooltip.vue";

@Component({
  components: {
    Tooltip
  }
})
export default class terms extends Vue {
  public navigate() {
    this.$router.push({ name: "applicant-status" });
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
</style>
