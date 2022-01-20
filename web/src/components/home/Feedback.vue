<template>
  <div class="centre">
    <div class="row mt-4 mt-md-5">
      <div class="col-lg-12" margin="auto" id="feedback" style="margin-bottom: 53px;">

        <h2 tabindex="-1">Give Feedback for "Represent Someone Who Died"</h2>

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

        <div v-if="!sent">
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

          <div class="row form-group">
            <VueRecaptcha
              :sitekey="recaptchaKey"
              :loadRecaptchaScript="true"
              @verify="validate">
            </VueRecaptcha>
          </div>

          <div class="row form-group">
            <div class="col text-left">
              <button type="submit" class="btn btn-bcgold" @click="sendFeedback($event)" v-bind:class="{ loading: sending }" :disabled="sending || !canSend">
                <span class="fa fa-paper-plane left"></span> Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import Tooltip from "@/components/survey/Tooltip.vue";
import VueRecaptcha from 'vue-recaptcha';
import { SurveyDataService } from "@/services/survey-data-service";
import vueRecaptchaSiteKey from "../../../app.config";
export default defineComponent({
  components: {
    Tooltip,
    VueRecaptcha
  },
  name: "feedback",
  setup() {
    let loading = ref(true);
    let feedback = ref({ 
      reason: "",
      name: "",
      email: "",
      comments: "",
      invalid: null
    });
    let failed = ref(false);
    let sending = ref(false);
    let sent = ref(false);
    const recaptchaKey = ref(vueRecaptchaSiteKey.vueAppRecaptchaSiteKey);
    let recaptchaResponse;

    const canSend = () => {
      return !recaptchaRequired || !!recaptchaResponse;
    }

    const recaptchaRequired = () => {
      return !!recaptchaKey;
    }

    const sendingComplete = () => {
      sending.value = false;
      recaptchaResponse = "";
    }

    const checkFeedback = (feedback) => {
      return !(!feedback.value.reason || !feedback.value.name || !feedback.value.email);
    }

    const focusAlert = (id) => {
      setTimeout(() => {
        let alert = document.getElementById(id);
        if (alert) alert.focus();
      }, 50);
    }

    const validate = (response) => {
      recaptchaResponse = response;
    }

    async function sendFeedback(pointerEvent) {
      if (pointerEvent) pointerEvent.preventDefault();
      if (sending.value) return;
      sending.value = true;
      sent.value = false;

      const valid = checkFeedback(feedback);
      feedback.value.invalid = valid ? null : 'required';

      if (!valid) {
        focusAlert('alert-required');
        sending.value = false;
        return;
      }

      const opts = recaptchaResponse
        ? { headers: { "X-CAPTCHA-RESPONSE": recaptchaResponse } }
        : undefined;

      try {
        const responseData = await SurveyDataService.feedback(feedback, opts);

        if (responseData && responseData.status == "sent") {
          console.log(" feedback sent successfully", responseData);
          focusAlert('alert-success');
          sent.value = true;
          feedback.value = { reason: '', name: '', email: '', comments: '', invalid: null };
        } else {
          console.log("feedback submission failed", responseData);
          focusAlert('alert-error');
          failed.value = true;
        }
        sendingComplete();
      } catch(err) {
        console.log("Error: feedback not submitted", err);
        failed.value = true;
        sendingComplete();
        focusAlert('alert-error');
      }
    }

    return {
      loading,
      failed,
      sent,
      feedback,
      recaptchaKey,
      sending,
      canSend,
      recaptchaRequired,
      validate,
      sendingComplete,
      checkFeedback,
      sendFeedback,
    }
  }
});
</script>
<style scope lang="scss">
@import "src/styles/common";
.home-content {
  padding-bottom: 20px;
  padding-top: 2rem;
  max-width: 1140px;
  color: black;
}

.centre {
  margin: auto;
  margin-top: 0;
}
</style>
