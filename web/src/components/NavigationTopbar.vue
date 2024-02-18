<template>
    <header name="navigation-topbar" class="app-header">
        <nav class="navbar navbar-expand-lg navbar-dark">        

            <div class="container-fluid">
                <a class="navbar-brand" href="https://www2.gov.bc.ca" style="max-width:200px">
                    <img
                        class="img-fluid d-none d-md-block"
                        src="../../public/images/bcid-logo-rev-en.svg"
                        width="177"
                        height="44"
                        alt="B.C. Government Logo"
                    />

                    <img
                        class="img-fluid d-md-none"
                        src="../../public/images/bcid-symbol-rev.svg"
                        width="63"
                        height="44"
                        alt="B.C. Government Logo"
                    />
                </a>
                <div class="navbar-brand navbar-text">
                    Represent Someone Who Died (also know as Probate)
                    <span class="navbar-tag">BETA</span>
                </div>

                <div class="navbar-extra">
                    <div id="app-profile">
                        <div v-if="userName" style="padding-right: rem">
                            <b-dropdown
                                id="profileDropdown"
                                text="Profile"
                                variant="primary btn-transparent"
                                menu-class="w-10"
                                style="margin-right: 1rem"
                            >
                                <template #button-content style="background-color: #003366">
                                    <span class="fa fa-user"></span> {{ userName }}
                                </template>
                                <b-dropdown-item v-if="isDevEnv()" @click="runsurvey()">SurveyJS Editor</b-dropdown-item>
                                <b-dropdown-item-button @click="viewStatus()"><b-icon-card-list class="mr-2"/>Previous Applications </b-dropdown-item-button>
                                <b-dropdown-item-button @click="logout(false)"><b-icon-box-arrow-left class="mr-2"/>Logout </b-dropdown-item-button>
                            </b-dropdown>
                        </div>
                    </div>
                </div> 
               
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import { SessionManager } from "@/components/utils/utils";
import moment from "moment-timezone";
import { namespace } from "vuex-class";   

import "@/store/modules/common";
const commonState = namespace("Common");


@Component
export default class NavigationTopbar extends Vue {
    
    @commonState.Action
    public UpdateHideHeaderFooter!: (newHideHeaderFooter) => void

    error = "";

    @commonState.State
    public userName!: string;  

    public logout(isQuickExit) {

        const emptyApplicationRoutes = ["/", "/status", "/serviceLocator"];

        if (emptyApplicationRoutes.indexOf(this.$route.fullPath) == -1) {
            Vue.prototype.$saveChanges();
        }
        Vue.nextTick().then(() => {
            if (isQuickExit){
                window.open('http://www.google.ca');
                SessionManager.logoutAndRedirect(this.$store);
            }else 
                SessionManager.logout(this.$store);
        });
    }

    public runsurvey(){
        this.UpdateHideHeaderFooter(true)
        this.$router.push({name: "surveyeditor"})
    }

    public viewStatus() {
        this.$router.push({ name: "applicant-status" });
    }

    public isDevEnv(){
        const host = window.location.host;
        const DEV = ['0.0.0.0', 'localhost', 'dev.'];   

        return (DEV.some(s=>host.indexOf(s) > -1))
    }

};
</script>

<style>
.btn-transparent {
    background-color: transparent !important;
    border-color: #ccc !important;
}
</style>

<style scoped lang="scss">

    @import "../styles/common";


    .navbar-brand:not(.logo) {
        flex: 1 1 auto;
    }

    .navbar-extra {
        display: inline-block;
        flex: 1 1 auto;
        text-align: right;
    }

    .navbar .navbar-extra {
        display: inline-block;
        flex: 1 1 auto;
        text-align: right;
    }

    #app-profile {
        color: $gov-white;
    }

</style>
