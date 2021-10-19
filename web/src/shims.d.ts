declare global {
  interface Window {
    surveyInstance: any;
  }
}

declare module "*.css";
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
