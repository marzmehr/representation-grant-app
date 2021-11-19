import Vue from "vue";
import VueCompositionApi, {ref, computed} from "@vue/composition-api";
Vue.use(VueCompositionApi);

const potentialApplicants = ref<PotentialApplicant[]>([]);
export const getPotentialApplicants = computed(() => potentialApplicants.value);
export const setPotentialApplicants = newPotentialApplicants => (potentialApplicants.value = newPotentialApplicants);

const applicants = ref<Applicant[]>([]);
export const getApplicants = computed(() => applicants.value);
export const setApplicants = newApplicants => (applicants.value = newApplicants);

const recipients = ref<Recipient[]>([]);
export const getRecipients = computed(() => recipients.value);
export const setRecipients = recipients => (recipients.value = recipients);