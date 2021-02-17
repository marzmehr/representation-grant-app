import LandingPage from "@/components/home/LandingPage.vue";
import PreQualification from "@/components/home/PreQualification.vue";
import Qualified from "@/components/home/Qualified.vue";
import UnQualified from "@/components/home/UnQualified.vue";
// import ResultPage from "@/components/home/ResultPage.vue";
import Surveys from "@/components/Surveys.vue";
import ApplicationStatus from "@/components/status/ApplicationStatus.vue";
import TermsConditions from "@/components/status/TermsConditions.vue"
import SurveyCreatorForm from "@/components/survey/SurveyCreatorForm.vue"
import { SessionManager } from "@/components/utils/utils";
import VueResource from 'vue-resource'
import store from "@/store"


async function authGuard(to: any, from: any, next: any) {
  var result = await SessionManager.getUserInfo(store);
  if (result.userId)
    next();
  else if (result.loginUrl)
    location.replace(result.loginUrl);
}

const routes = [
  {
    path: "/",
    component: LandingPage
  },
  {
    path: "/representation-grant", 
    component: LandingPage
  },
  {
    path: "/qualify",
    name: "pre-qualification",
    // beforeEnter: authGuard,
    component: PreQualification,
  },
  {
    path: "/qualified",
    name: "qualified",
    // beforeEnter: authGuard,
    component: Qualified,
  },
  {
    path: "/unqualified",
    name: "unqualified",
    // beforeEnter: authGuard,
    component: UnQualified,
  },
  // {
  //   path: "/results/:result",
  //   name: "result-page",
  //   component: ResultPage,
  // },
  { 
    path: "/survey",
    name: "surveys",
    beforeEnter: authGuard,
    component: Surveys
  },
  {
    path: "/status",
    name: "applicant-status",
    beforeEnter: authGuard,
    component: ApplicationStatus
  },
  {
    path: "/terms",
    name: "terms",
    component: TermsConditions
  },
  {
    path: "/surveycreator",
    name: "surveycreator",
    component: SurveyCreatorForm
  }
];

export default routes;
