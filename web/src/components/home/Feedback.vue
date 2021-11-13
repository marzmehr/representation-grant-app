<template>
  <div class="row mt-4 mt-md-5">
    <div class="col-lg-8" id="feedback">
      <h2>Give feedback for "Apply to Represent Someone Who Died (also know as Probate)"</h2>
      <p>If you have already submitted something then don't worry about it, or call 1-800-555-1234.</p>
    
      <div class="row form-group mt-2">
        <div class="col">
          <label class="control-label mb-0">Type of Feedback</label>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="reason" value="problem" id="reason_problem">
            <label class="form-check-label" for="reason_problem">Report a problem with this service</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="reason" value="positive" id="reason_positive">
            <label class="form-check-label" for="reason_positive">Give positive feedback for this service</label>
          </div>
        </div>
      </div>

       <div class="row form-group">
        <div class="col">
          <label class="control-label mb-0">Name</label>
          <input class="form-control" size="30" name="from_name" type="text">
        </div>
      </div>

      <div class="row form-group">
        <div class="col">
          <label class="control-label mb-0">Email address</label>
          <input class="form-control" size="30" name="from_email" type="email">
        </div>
      </div>

      <div class="row form-group">
        <div class="col">
          <label class="control-label mb-0">Feedback</label>
          <textarea class="form-control" name="comments" rows="6" cols="40"></textarea>
        </div>
      </div>

      <div class="row form-group">
        <div class="col text-left">
          <button type="submit" class="btn btn-bcgold">
            <span class="fa fa-paper-plane left"></span> Send Feedback
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import Tooltip from "@/components/survey/components/Tooltip.vue";

@Component({
  components:{
    Tooltip
  }
})
export default class terms extends Vue {
	public navigate() {
    this.$router.push({ name: "applicant-status" });      
  }
};
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
