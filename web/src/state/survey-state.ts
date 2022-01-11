import Vue from "vue";
import VueCompositionApi, {ref, computed} from "@vue/composition-api";
import SurveyVue from "survey-vue";
Vue.use(VueCompositionApi);

const survey = ref<SurveyVue.Model>();
export const getSurvey = computed(() => survey.value);
export const setSurvey = newSurvey => (survey.value = newSurvey);

const lastUpdated = ref<Date>();
export const getLastUpdated = computed(() => lastUpdated.value);
export const setLastUpdated = newLastUpdated => (lastUpdated.value = newLastUpdated);

const lastSaved = ref<Date>();
export const getLastSaved = computed(() => lastSaved.value);
export const setLastSaved = newLastSaved => (lastSaved.value = newLastSaved);

const potentialApplicants = ref<PotentialApplicant[]>([]);
export const getPotentialApplicants = computed(() => potentialApplicants.value);
export const setPotentialApplicants = newPotentialApplicants => (potentialApplicants.value = newPotentialApplicants);

const applicants = ref<Applicant[]>([]);
export const getApplicants = computed(() => applicants.value);
export const setApplicants = newApplicants => (applicants.value = newApplicants);

const recipients = ref<Recipient[]>([]);
export const getRecipients = computed(() => recipients.value);
export const setRecipients = newRecipients => (recipients.value = newRecipients);