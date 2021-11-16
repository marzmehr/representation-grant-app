import Vue from "vue";
import VueCompositionApi, {ref, computed} from "@vue/composition-api";
Vue.use(VueCompositionApi);

const potentialApplicants = ref([]);
export const getPotentialApplicants = computed(() => potentialApplicants.value);
export const setPotentialApplicants = newApplicants => (potentialApplicants.value = newApplicants);
