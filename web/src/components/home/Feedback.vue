<template>
  <div class="row mt-4 mt-md-5">
    <div class="col-lg-8" id="feedback">

      <h2 tabindex="-1">Give Feedback for "Apply to Represent Someone Who Died (also know as Probate)"</h2>

      <p>If you have already submitted your stuff and you want to change it, call the help thingy at 1-800-555-1234.</p>

      <div class="alert alert-success alert-dismissible" id="alert-success" role="alert" tabindex="0" v-if="sent">
        <h3 class="h5 my-0">Feedback Sent</h3>
        Thank you, your feedback has been submitted.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="sent=false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="alert alert-warning alert-dismissible" id="alert-required" role="alert" tabindex="0"
        v-if="feedback.invalid">
        <h3 class="h5 my-0">Required Field(s)</h3>
        One or more fields are missing from the feedback form.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="feedback.invalid=false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="alert alert-danger alert-dismissible" id="alert-error" role="alert" tabindex="0" v-if="failed">
        <h3 class="h5 my-0">Error sending feedback</h3>
        Your request could not be completed at this time, try again later.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="failed=false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="row form-group mt-2">
        <div class="col">
          <label class="control-label mb-0">Type of Feedback</label>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="reason" value="problem" id="reason_problem" required
              v-model="feedback.reason">
            <label class="form-check-label" for="reason_problem">Report a problem with this service</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="reason" value="positive" id="reason_positive" required
              v-model="feedback.reason">
            <label class="form-check-label" for="reason_positive">Give positive feedback for this service</label>
          </div>
        </div>
      </div>

      <div class="row form-group">
        <div class="col">
          <label class="control-label mb-0">Name</label>
          <input class="form-control" size="30" name="name" type="text" required v-model="feedback.name">
        </div>
      </div>

      <div class="row form-group">
        <div class="col">
          <label class="control-label mb-0">Email address</label>
          <input class="form-control" size="30" name="email" type="email" required v-model="feedback.email">
        </div>
      </div>

      <div class="row form-group">
        <div class="col">
          <label class="control-label mb-0">Feedback</label>
          <textarea class="form-control" name="comments" rows="6" cols="40" v-model="feedback.comments"></textarea>
        </div>
      </div>

      <!-- <div class="row form-group">
        <div class="col">
          <vue-recaptcha siteKey="your key here"></vue-recaptcha>
        </div>
      </div> -->

      <div class="row form-group">
        <div class="col text-left">
          <button type="submit" class="btn btn-bcgold" @click="sendFeedback($event)" v-bind:class="{ loading: sending }" :disabled="sending">
            <span class="fa fa-paper-plane left"></span> Send Feedback
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import Tooltip from "@/components/survey/components/Tooltip.vue";
import VueRecaptcha from "vue-recaptcha";

@Component({
  components: {
    Tooltip
  }
})

export default class Feedback extends Vue {
  public loading = true;
  public feedback = { 
    reason: "",
    name: "",
    email: "",
    comments: "",
    invalid: null
  };
  public failed = false;
  public sending = false;
  public sent = false;

  checkFeedback(feedback) {
    if (!feedback.reason || !feedback.name || !feedback.email) {
      return false;
    }
    return true;
  }

  focusAlert(id) {
    setTimeout(() => {
      let alert = document.getElementById(id);
      if (alert) alert.focus();
    }, 50);
  }

  sendFeedback(pointerEvent) {
    if (pointerEvent) pointerEvent.preventDefault();
    if (this.sending) return;
    this.sending = true;
    this.sent = false;

    const feedback = this.feedback;
    const valid = this.checkFeedback(feedback);
    feedback.invalid = valid ? null : 'required';

    if (!valid) {
      this.focusAlert('alert-required');
      this.sending = false;
      return;
    }

    this.sent = true;
    this.focusAlert('alert-success');
  }
}
</script>

<style scoped lang="scss">
@import "src/styles/common";
.home-content {
  padding-bottom: 20px;
  padding-top: 2rem;
  max-width: 950px;
  color: black;
}
</style>
