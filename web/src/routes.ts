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

import SurveySandBox1 from "@/sandbox/ControlFiles/SurveySandBox1.vue"
import SurveySandBox2 from "@/sandbox/ControlFiles/SurveySandBox2.vue"
import SurveySandBox3 from "@/sandbox/ControlFiles/SurveySandBox3.vue"
import SurveySandBox4 from "@/sandbox/ControlFiles/SurveySandBox4.vue"
import SurveySandBox5 from "@/sandbox/ControlFiles/SurveySandBox5.vue"

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
    path: "/surveyeditor",
    name: "surveyeditor",
    beforeEnter: authGuard,
    component: SurveyCreatorForm
  },
  {
    path: "/sandbox1",
    name: "sandbox1",
    beforeEnter: authGuard,
    component: SurveySandBox1
  },
  {
    path: "/sandbox2",
    name: "sandbox2",
    beforeEnter: authGuard,
    component: SurveySandBox2
  },
  {
    path: "/sandbox3",
    name: "sandbox3",
    beforeEnter: authGuard,
    component: SurveySandBox3
  },
  {
    path: "/sandbox4",
    name: "sandbox4",
    beforeEnter: authGuard,
    component: SurveySandBox4
  },
  {
    path: "/sandbox5",
    name: "sandbox5",
    beforeEnter: authGuard,
    component: SurveySandBox5
  }
];

export default routes;
