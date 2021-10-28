<!-- We need to override this so we can customize now the title/description component is rendered.
     Instead of rendering text with v-html, we want to dynamically create some vue components 
     This way our Tooltip.vue can render in. v-runtime-template assists with this.  -->

<template>
  <span style="position: static">
    <span class="sv-string-viewer" style="position: static" v-if="locString.hasHtml">
      <v-runtime-template
        :template="`<div style='display:inline'>${locString.renderedHtml}</div>`"
      ></v-runtime-template>
    </span>
    <span class="sv-string-viewer" style="position: static" v-else>
      {{ locString.renderedHtml }}</span
    >
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { LocalizableString } from "survey-vue";
import VRuntimeTemplate from "v-runtime-template";

@Component({
  components: {
    VRuntimeTemplate
  }
})
export class SurveyStringViewer extends Vue {
  @Prop() locString: LocalizableString;
}

Vue.component(LocalizableString.defaultRenderer, SurveyStringViewer);
export default SurveyStringViewer;
</script>
