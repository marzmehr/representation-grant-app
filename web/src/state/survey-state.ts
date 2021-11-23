import Vue from "vue";
import VueCompositionApi, {ref, computed} from "@vue/composition-api";
Vue.use(VueCompositionApi);

const lastUpdated = ref<Date>();
export const getLastUpdated = computed(() => lastUpdated.value);
export const setLastUpdated = newLastUpdated => (lastUpdated.value = newLastUpdated);

const potentialApplicants = ref<PotentialApplicant[]>([]);
export const getPotentialApplicants = computed(() => potentialApplicants.value);
export const setPotentialApplicants = newPotentialApplicants => (potentialApplicants.value = newPotentialApplicants);

const applicants = ref<Applicant[]>([]);
export const getApplicants = computed(() => applicants.value);
export const setApplicants = newApplicants => (applicants.value = newApplicants);

const recipients = ref<Recipient[]>([]);
export const getRecipients = computed(() => recipients.value);
export const setRecipients = newRecipients => (recipients.value = newRecipients);


