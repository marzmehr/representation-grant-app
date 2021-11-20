<template>
  <div class="app-outer fill-body" id="app">
    <navigation-topbar v-if="!getHideHeaderFooter" />
    <main class="app-content fill-body">
      <router-view />
    </main>
    <navigation-footer id="footer" v-if="!getHideHeaderFooter" />
  </div>
</template>

<script lang="ts">
import NavigationTopbar from "@/components/NavigationTopbar.vue";
import NavigationFooter from "@/components/NavigationFooter.vue";
import { getHideHeaderFooter } from "@/state/application-state";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "App",
  props: {
    survey: Object
  },
  components: {
    NavigationTopbar,
    NavigationFooter
  },
  setup(props) {
    return {
      getHideHeaderFooter
    };
  }
});
</script>
