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

import SurveySandBox from "@/sandbox/ControlFiles/SurveySandBox.vue"

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
    path: "/sandbox1",
    component: SurveySandBox,
    beforeEnter: authGuard,
    props: { sandboxName: "sandbox1" }
  },
  {
    path: "/sandbox2",
    component: SurveySandBox,
    beforeEnter: authGuard,
    props: { sandboxName: "sandbox2" }
  },
  {
    path: "/sandbox3",
    component: SurveySandBox,
    beforeEnter: authGuard,
    props: { sandboxName: "sandbox3" }
  },
  {
    path: "/sandbox4",
    component: SurveySandBox,
    beforeEnter: authGuard,
    props: { sandboxName: "sandbox4" }
  },
  {
    path: "/sandbox5",
    component: SurveySandBox,
    beforeEnter: authGuard,
    props: { sandboxName: "sandbox5" }
  },
  {
    path: "/surveyeditor1",
    name: "surveyeditor1",
    beforeEnter: authGuard,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox1" }
  },
  {
    path: "/surveyeditor2",
    name: "surveyeditor2",
    beforeEnter: authGuard,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox2" }
  },
  {
    path: "/surveyeditor3",
    name: "surveyeditor3",
    beforeEnter: authGuard,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox3" }
  },
  {
    path: "/surveyeditor4",
    name: "surveyeditor4",
    beforeEnter: authGuard,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox4" }
  },
  {
    path: "/surveyeditor5",
    name: "surveyeditor5",
    beforeEnter: authGuard,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox5" }
  }
];

export default routes;
