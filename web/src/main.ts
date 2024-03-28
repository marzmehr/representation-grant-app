import Vue from "vue";
import App from "@/App.vue";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faFileCircleCheck, faFileLines, faUserTie, faCoins, faEnvelopeOpenText, faUsers, faChild, faPaperPlane, faBook } from '@fortawesome/free-solid-svg-icons'
import VueRouter from "vue-router";
import VueCookies from "vue-cookies"
import routes from "@/routes";
import store from "@/store";
import http from "./plugins/http";
import UpdateGotoStep from "./prototypes/UpdateGotoStep";
import "./filters";
import LoadingSpinner from "./components/utils/LoadingSpinner.vue";
import "@/styles/index.scss";
import "bootstrap-vue/dist/bootstrap-vue.css";

// https://www.npmjs.com/package/vue-fontawesome-icon
// import material-icon scss
import "font-awesome/css/font-awesome.min.css";
import { SessionManager } from "@/components/utils/utils";

library.add(faUserTie as IconDefinition);
library.add(faFileLines as IconDefinition);
library.add(faCoins as IconDefinition);
library.add(faEnvelopeOpenText as IconDefinition);
library.add(faUsers as IconDefinition);
library.add(faChild as IconDefinition);
library.add(faPaperPlane as IconDefinition);
library.add(faBook as IconDefinition);
library.add(faFileCircleCheck as IconDefinition);

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueRouter);
Vue.use(VueCookies);
Vue.use(http);
Vue.use(UpdateGotoStep);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('loading-spinner', LoadingSpinner);

const router = new VueRouter({
    routes: routes, 
    mode: "history", 
    base: process.env.BASE_URL,
    scrollBehavior(to, from, savedPosotion) { 
        return { x: 0, y: 0 }
    }
});

// Redirect to /BASE_URL
history.pushState({page: "home"}, "", process.env.BASE_URL)

SessionManager.redirectIfQuickExitCookie();

new Vue({
    router: router,
    render: (h) => h(App),
    store: store,
    data: {},
}).$mount("#app");
