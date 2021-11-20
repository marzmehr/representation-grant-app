<template>
  <div class="app-outer fill-body" id="app">
    <navigation-topbar v-if="!hideHeaderFooter" />
    <main class="app-content fill-body">
      <router-view />
    </main>
    <navigation-footer id="footer" v-if="!hideHeaderFooter" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NavigationTopbar from "@/components/NavigationTopbar.vue";
import NavigationFooter from "@/components/NavigationFooter.vue";
import { namespace } from "vuex-class";
import "@/store/modules/common";
const commonState = namespace("Common");

@Component({
  components: {
    NavigationTopbar,
    NavigationFooter
  }
})
export default class App extends Vue {
  @commonState.State
  public hideHeaderFooter!: boolean;
}
</script>
