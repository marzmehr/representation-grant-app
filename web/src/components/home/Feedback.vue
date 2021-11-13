<template>
  <div class="row mt-4 mt-md-5">
    <div class="col-lg-8" id="feedback">
      <h2>Give feedback for "Apply to Represent Someone Who Died (also know as Probate)"</h2>
      <p>If you have already submitted something then don't worry about it, or call 1-800-555-1234.</p>
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
