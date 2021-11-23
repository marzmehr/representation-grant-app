import LandingPage from "@/components/home/LandingPage.vue";
import PreQualification from "@/components/home/PreQualification.vue";
import Qualified from "@/components/home/Qualified.vue";
import UnQualified from "@/components/home/UnQualified.vue";
import ApplicationStatus from "@/components/status/ApplicationStatus.vue";
import TermsConditions from "@/components/status/TermsConditions.vue";
import SurveyCreatorForm from "@/components/survey-creator/SurveyCreatorForm.vue";
import SurveyMain from "@/components/SurveyMain.vue";
import FormP1 from "@/components/pdf/FormP1.vue";
import FormP9 from "@/components/pdf/FormP9.vue";
import { SessionManager } from "@/services/session-manager";

async function authGuard(to: any, from: any, next: any) {
  const result = await SessionManager.getUserInfo();
  if (result.userId) {
    next();
  } else if (result.loginUrl) {
    window.location.replace(
      `${result.loginUrl}&next=${process.env.BASE_URL}${to.fullPath.slice(1)}`
    );
  } else {
    window.location.replace(process.env.BASE_URL);
  }
}

async function authGuardAdmin(to: any, from: any, next: any) {
  const result = await SessionManager.getUserInfo();
  if (!result.userId && result.loginUrl) {
    window.location.replace(`${result.loginUrl}&next=${window.location.href}`);
  } else if (result.isStaff) {
    next();
  } else if (result.userId) {
    window.location.replace(`${process.env.BASE_URL}status`);
    window.alert("You are not an Admin");
  } else {
    window.location.replace(process.env.BASE_URL);
  }
}

const routes = [
  {
    path: "/",
    component: LandingPage
  },
  {
    path: "/represent-someone-who-died",
    component: LandingPage
  },
  {
    path: "/qualify",
    name: "pre-qualification",
    // beforeEnter: authGuard,
    component: PreQualification
  },
  {
    path: "/qualified",
    name: "qualified",
    // beforeEnter: authGuard,
    component: Qualified
  },
  {
    path: "/unqualified",
    name: "unqualified",
    // beforeEnter: authGuard,
    component: UnQualified
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
    component: SurveyMain
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
    path: "/formp1",
    component: FormP1,
    beforeEnter: authGuardAdmin
  },
  {
    path: "/formp9",
    component: FormP9,
    beforeEnter: authGuardAdmin
  },
  {
    path: "/sandbox1",
    component: SurveyMain,
    beforeEnter: authGuardAdmin,
    props: { sandboxName: "sandbox1" }
  },
  {
    path: "/sandbox2",
    component: SurveyMain,
    beforeEnter: authGuardAdmin,
    props: { sandboxName: "sandbox2" }
  },
  {
    path: "/sandbox3",
    component: SurveyMain,
    beforeEnter: authGuardAdmin,
    props: { sandboxName: "sandbox3" }
  },
  {
    path: "/sandbox4",
    component: SurveyMain,
    beforeEnter: authGuardAdmin,
    props: { sandboxName: "sandbox4" }
  },
  {
    path: "/sandbox5",
    component: SurveyMain,
    beforeEnter: authGuardAdmin,
    props: { sandboxName: "sandbox5" }
  },
  {
    path: "/surveyeditor1",
    name: "surveyeditor1",
    beforeEnter: authGuardAdmin,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox1" }
  },
  {
    path: "/surveyeditor2",
    name: "surveyeditor2",
    beforeEnter: authGuardAdmin,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox2" }
  },
  {
    path: "/surveyeditor3",
    name: "surveyeditor3",
    beforeEnter: authGuardAdmin,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox3" }
  },
  {
    path: "/surveyeditor4",
    name: "surveyeditor4",
    beforeEnter: authGuardAdmin,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox4" }
  },
  {
    path: "/surveyeditor5",
    name: "surveyeditor5",
    beforeEnter: authGuardAdmin,
    component: SurveyCreatorForm,
    props: { sandboxName: "sandbox5" }
  }
];

export default routes;
