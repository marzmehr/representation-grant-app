import Vue from "vue";
import VueCompositionApi, {ref, computed} from "@vue/composition-api";
Vue.use(VueCompositionApi);

const applicationId = ref(0);
export const getApplicationId = computed(() => applicationId.value);
export const setApplicationId = applicationId => (applicationId.value = applicationId);

const applicationType = ref("");
export const getApplicationType = computed(() => applicationType.value);
export const setApplicationType = newApplicationType => (applicationType.value = newApplicationType);

const userName = ref("");
export const getUserName = computed(() => userName.value);
export const setUserName = newUserName => (userName.value = newUserName);

const userId = ref("");
export const getUserId = computed(() => userId.value);
export const setUserId = newUserId => (userId.value = newUserId);

const userLocation = ref("");
export const getUserLocation = computed(() => userLocation.value);
export const setUserLocation = newUserLocation => (userLocation.value = newUserLocation);

const locations = ref([]);
export const getLocations = computed(() => locations.value);
export const setLocations = newLocations => (locations.value = newLocations);

const hideHeaderFooter = ref(false);
export const getHideHeaderFooter = computed(() => hideHeaderFooter.value);
export const setHideHeaderFooter = newHideHeaderFooter => (hideHeaderFooter.value = newHideHeaderFooter);