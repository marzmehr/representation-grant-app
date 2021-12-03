<template>
  <div class="centre">
    <div class="row mt-4 mt-md-5">
      <div class="col-lg-12" margin="auto" id="feedback">

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

        <div class="row form-group">
          <form @submit.prevent="onSubmit">
            <vue-recaptcha
              ref="invisibleRecaptcha"
              :sitekey="recaptchaKey"
              @verify="onVerify"
              @expired="onExpired"
              size="invisible"
              >
            </vue-recaptcha>
            <button type="submit">Verify</button>
          </form>
          </div>
        </div>

        <div class="row form-group">
          <div class="col text-left">
            <button type="submit" class="btn btn-bcgold" @click="sendFeedback($event)" v-bind:class="{ loading: sending }" :disabled="sending">
              <span class="fa fa-paper-plane left"></span> Send Feedback
            </button>
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

export default defineComponent({
  components: {
    Tooltip,
    VueRecaptcha
  },
  name: "feedback",
  setup() {
    const invisibleRecaptcha = ref();
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
    const recaptchaKey = ref("some-string");
    let recaptchaResponse;

    const canSend = () => {
      return !recaptchaRequired || !!recaptchaResponse;
    }

    const recaptchaRequired = () => {
      return !!recaptchaKey;
    }

    const onSubmit = () => {
      console.log("executing");
      invisibleRecaptcha.value.execute();
    }

    const onVerify = (response) => {
      console.log('Verify: ' + response)
      recaptchaResponse = response;
    }

    const onExpired = () => {
      console.log('Expired')
    }

    const sendingComplete = () => {
      sending.value = false;
      invisibleRecaptcha.value.reset();
      recaptchaResponse = "";
    }

    const checkFeedback = (feedback) => {
      if (!feedback.value.reason || !feedback.value.name || !feedback.value.email) {
        return false;
      }
      return true;
    }

    const focusAlert = (id) => {
      setTimeout(() => {
        let alert = document.getElementById(id);
        if (alert) alert.focus();
      }, 50);
    }

    const sendFeedback = (pointerEvent) => {
      if (pointerEvent) pointerEvent.preventDefault();
      // if (sending.value) return;
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

      console.log("options");
      console.log(opts);

      // test out data service
      // SurveyDataService.feedback(feedback, opts);
      sent.value = true;
      focusAlert('alert-success');
    }

    return {
      invisibleRecaptcha,
      loading,
      failed,
      sent,
      feedback,
      recaptchaKey,
      sending,
      canSend,
      recaptchaRequired,
      onSubmit,
      onVerify,
      onExpired,
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
  max-width: 950px;
  color: black;
}

.centre {
  margin: auto;
}
</style>
