<template>
    <b-card no-body border-variant="white"  :style="{minHeight:getHeight}" bg-variant="white" id="status">
        <b-card no-body class="home-content border-white p-0">
            
            <div class="alert alert-danger mt-4" v-if="error">{{error}}</div>
            
            <div class="pt-5" name="info-content-header">
                <h1>Previous Activity</h1>
                <b-card no-body border-variant="white" bg-variant="white">
                    <p class=" ml-0 mb-1">
                        To resume a previous session, click the Resume button next to the activity. 
                        To start a new session, click the Begin New Session button at the bottom 
                        of the page.
                    </p>
                </b-card>

                <div class="mb-4 border border-gray border-right-0 border-left-0 border-bottom-0">
                </div>
            </div>

            <loading-spinner v-if="!dataLoaded" waitingText="Loading ..." />
            
            <div :style="{height:getTableHeight}" v-if="dataLoaded"> 

                <b-card no-body border-variant="white" bg-variant="white" v-if="!previousApplications.length">
                        <span class="text-muted ml-4 mb-5">No previous applications.</span>
                </b-card>

                <b-card v-else :style="{height:getTableHeight}" no-body border-variant="white" bg-variant="white">
                    <b-table  
                        :items="previousApplications"
                        :fields="previousApplicationFields"
                        class="mx-0"
                        style="overflow-y: auto;"
                        sort-by="lastUpdated"
                        :sort-desc="true"
                        borderless
                        sort-icon-left
                        striped
                        small
                        head-variant="dark"                       
                        responsive="sm"
                        sticky-header="600px"                            
                        >
                        <template v-slot:cell(edit)="row">
                            <b-button v-if="row.item.lastFiled == 0" size="sm" variant="transparent" class="my-0 py-0 border-0"
                                @click="removeApplication(row.item, row.index)"
                                v-b-tooltip.hover.noninteractive.left.v-danger
                                title="Remove Application">
                                <b-icon-trash-fill font-scale="1.25" variant="danger"></b-icon-trash-fill>                    
                            </b-button>

                            <b-button size="sm" variant="transparent" class="my-0 py-0 border-0"
                                @click="resumeApplication(row.item.id)"
                                v-b-tooltip.hover.noninteractive.left.v-success
                                title="Resume Application">
                                <b-icon-pencil-square font-scale="1.25" variant="primary"></b-icon-pencil-square>                    
                            </b-button>

                            <b-button v-if="row.item.lastFiled != 0" size="sm" variant="transparent" class="my-0 py-0 border-0"
                                @click="navigateToEFilingHub(row.item.id)"
                                v-b-tooltip.hover.noninteractive.left.v-info
                                title="Navigate To Submitted Application">
                                <span class="fa fa-paper-plane btn-icon-left text-info"/>                    
                            </b-button>
                        </template>
                        <template v-slot:cell(app_type)="row">                  
                            <span>{{row.item.app_type}}</span>
                        </template>
                        <template v-slot:cell(lastUpdated)="row">                  
                            <span>{{ row.item.lastUpdatedDate | beautify-date-weekday}}</span>
                        </template>
                        <template v-slot:cell(lastFiled)="row">                  
                            <span>{{ row.item.lastFiledDate | beautify-date-weekday}}</span>
                        </template>
                    </b-table>
                </b-card>                    
            </div>
        </b-card>
        
        <b-card name="button-menu" class="button-content" border-variant="white" bg-variant="white">
            <b-row class="mt-2 ml-5">                
                <b-col cols="6">
                </b-col>
                <b-col class="m-0 p-0" cols="3">
                    <b-button 
                        variant="success" 
                        size="md"
                        class="application-button" 
                        @click="beginApplication()"
                    >Begin NEW Session</b-button>
                </b-col>
                <b-col class="m-0 p-0" cols="3">                   
                    <div class="my-2 ml-5">
                        <a class="terms" @click="openTerms()">
                            <u style="cursor:pointer" >Terms and Conditions</u>
                        </a>
                    </div>
                </b-col>
            </b-row>           
        </b-card>

        <b-modal v-model="confirmDelete" id="bv-modal-confirm-delete" header-class="bg-warning text-light">
            <b-row v-if="deleteError" id="DeleteError" class="h4 mx-2">
                <b-badge class="mx-1 mt-2"
                    style="width: 20rem;"
                    v-b-tooltip.hover
                    :title="deleteErrorMsgDesc"
                    variant="danger"> {{deleteErrorMsg}}
                    <b-icon class="ml-3"
                        icon = x-square-fill
                        @click="deleteError = false"/>
                </b-badge>                    
            </b-row>            
            <template v-slot:modal-title>
                <h2 class="mb-0 text-light">Confirm Delete Application</h2>                                  
            </template>
            <h4 >Are you sure you want to delete your <b>"{{applicationToDelete['app_type']}}"</b> application?</h4>            
            <template v-slot:modal-footer>
                <b-button variant="danger" @click="confirmRemoveApplication()">Confirm</b-button>
                <b-button variant="primary" @click="$bvModal.hide('bv-modal-confirm-delete')">Cancel</b-button>
            </template>            
            <template v-slot:modal-header-close>                 
                <b-button variant="outline-warning" class="text-light closeButton" @click="$bvModal.hide('bv-modal-confirm-delete')"
                >&times;</b-button>
            </template>
        </b-modal> 

    </b-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as SurveyVue from "survey-vue";  
import * as surveyEnv from "@/components/survey/survey-glossary";
import moment from 'moment-timezone';
import {applicationInfoType} from "@/types/Application"
import {MigrateStore} from './MigrateStore';

import { namespace } from "vuex-class";   
import "@/store/modules/application";
const applicationState = namespace("Application");

import "@/store/modules/common";
const commonState = namespace("Common");

@Component
export default class ApplicationStatus extends Vue {

    @commonState.State
    public userId!: string;

    @commonState.State
    public existingApplication!: Boolean;

    @commonState.State
    public locationsInfo!: any[];

    @commonState.Action
    public UpdateLocationsInfo!: (newLocationsInfo) => void

    @commonState.Action
    public UpdateExistingApplication!: (newExistingApplication) => void

    @applicationState.Action
    public UpdateUserId!: (newUserId) => void

    @applicationState.Action
    public UpdateCurrentApplication!: (newCurrentApplication) => void

    @applicationState.Action
    public UpdateLastUpdated!: (newLastUpdated) => void

    @applicationState.Action
    public UpdateApplicationId!: (newApplicationId) => void

    previousApplications = []
    previousApplicationFields = [
        { key: 'app_type',    label: 'Application Type', sortable:true,  tdClass: 'border-top', thStyle:'font-size:11pt; width:20%;'},
        { key: 'lastUpdated', label: 'Last Updated',     sortable:true,  tdClass: 'border-top', thStyle:'font-size:11pt; width:20%;'},
        { key: 'lastFiled',   label: 'Last Filed',       sortable:true,  tdClass: 'border-top', thStyle:'font-size:11pt; width:20%;'},
        { key: 'status',      label: 'Status',           sortable:true,  tdClass: 'border-top', thStyle:'font-size:10pt; width:15%;'},
        { key: 'packageNum',  label: 'Package#',         sortable:false, tdClass: 'border-top', thStyle:'font-size:10pt; width:15%;'},
        { key: 'edit',        label: '',                 sortable:false, tdClass: 'border-top', thStyle:'font-size:10pt; width:10%;'}
    ]
    confirmDelete = false;
    currentApplication = {} as applicationInfoType;
    applicationToDelete = {}
    indexToDelete = -1 
    applicationId = ''
    error = ''
    deleteErrorMsg = ''
    deleteErrorMsgDesc = ''
    deleteError = false ;
    windowHeight = 0;
    footerHeight = 0;
    headerHeight = 0; 
    buttonMenuHeight = 0;
    infoContentHeaderHeight = 0;
    dataLoaded = false;

    mounted() {
        window.addEventListener('resize', this.getWindowHeight);
        this.loadApplications();
        this.getWindowHeight();
    }

    public getWindowHeight() {
        this.windowHeight = document.documentElement.clientHeight;
        this.footerHeight = (document.getElementsByName("navigation-footer")[0] as HTMLElement)?.clientHeight;
        this.headerHeight = (document.getElementsByName("navigation-topbar")[0] as HTMLElement)?.clientHeight;
        this.buttonMenuHeight = (document.getElementsByName("button-menu")[0] as HTMLElement)?.clientHeight;
        this.infoContentHeaderHeight = (document.getElementsByName("info-content-header")[0] as HTMLElement)?.clientHeight;
    }

    get getHeight() {        
        return this.windowHeight-this.footerHeight-this.headerHeight-1 + 'px'
    }

    get getTableHeight() {        
        return this.windowHeight-this.footerHeight-this.headerHeight-this.buttonMenuHeight-this.infoContentHeaderHeight-10 + 'px'
    }

    public openTerms() {
        this.$router.push({name: "terms"})
    }

    public loadApplications () {
    //TODO: when extending to use throughout the province, the timezone should be changed accordingly
    //TODO: read in the data required to navigate to the eFilingHub package page
        this.dataLoaded = false;
        this.$http.get('/app-list/')
        .then((response) => {
            for (const appJson of response.data) {
                const app = {lastUpdated:0, lastUpdatedDate:'', id:0, app_type:'', lastFiled:0, lastFiledDate:''};
                app.lastUpdated = appJson.last_updated?moment(appJson.last_updated).tz("America/Vancouver").diff('2000-01-01','minutes'):0;
                app.lastUpdatedDate = appJson.last_updated?moment(appJson.last_updated).tz("America/Vancouver").format():'';                
                app.lastFiled = appJson.last_filed?moment(appJson.last_filed).tz("America/Vancouver").diff('2000-01-01','minutes'):0;
                app.lastFiledDate = appJson.last_filed?moment(appJson.last_filed).tz("America/Vancouver").format():'';                
                app.id = appJson.id;
                app.app_type = appJson.app_type;
                this.previousApplications.push(app);
            }
            this.extractFilingLocations();
            this.dataLoaded = true;
            //console.log(this.previousApplications)       
        },(err) => {            
            //console.log(err)
            this.dataLoaded = true;
            this.error = err;        
        });
    }

    public extractFilingLocations() {
        this.$http.get('/efiling/locations/')
        .then((response) => {
            // console.log(Object.keys(response.data))
            const locationsInfo = response.data 
            const locationNames = Object.keys(response.data);
            const locations = []
            for (const location of locationNames){
                // console.log(location)
                // console.log(locationsInfo[location])
                const locationInfo = locationsInfo[location];
                const address = locationInfo.address_1?(locationInfo.address_1+ ', '):''  + 
                                locationInfo.address_2?(locationInfo.address_2 + ', '):'' + 
                                locationInfo.address_3?(locationInfo.address_3 + ', '):'';

                const postalCode = locationInfo.postal?? '';
                const city = locationInfo.city?? '';
                const province = locationInfo.province?? '';
                locations.push({
                    id: locationInfo.location_id, 
                    name: location, 
                    address: address.slice(0,-2),                    
                    city,
                    postalCode,
                    province,
                })
            }
            // console.log(locations)
            this.UpdateLocationsInfo(locations);
            
            // if(response.data.length>0) {
            //     this.navigate("returning");
            // }else{
            //     this.navigate("new");
            // }        
        
        },(err) => console.log(err));
        
    }

    public beginApplication() {
           
        this.$store.dispatch("Application/UpdateInit", Vue.filter('get-current-version')());
        this.UpdateUserId(this.userId);
        this.UpdateExistingApplication(false); 
        this.$router.push({name: "surveys" });        
    }

    public navigateToEFilingHub(packageNumber) {
        //TODO: replace input value with the eFilingHub link
        console.log("going to hub")
        //location.replace(packageNumber)
    }

    public resumeApplication(applicationId) {      
    
        this.$http.get('/app/'+ applicationId + '/')
        .then((response) => {
            const applicationData = response.data

            // console.log(applicationData)
            const storeMigrationFn = new MigrateStore() 
            this.currentApplication = storeMigrationFn.migrate(applicationData, Vue.filter('get-current-version')());   

            this.$router.push({name: "surveys" })        
        }, err => {
            //console.log(err)
            this.error = err;        
        });
    }   

    public removeApplication(application, index) {
        this.deleteErrorMsg = '';
        this.deleteErrorMsgDesc = '';
        this.deleteError = false;
        this.applicationToDelete = application;
        this.indexToDelete = index;
        this.confirmDelete=true;         
    }    

    public confirmRemoveApplication() {
        this.$http.delete('/app/'+ this.applicationToDelete['id'] + '/')
        .then((response) => {
            //console.log(response.data)
            
            var indexToDelete = this.previousApplications.findIndex((app) =>{if(app.id == this.applicationToDelete['id'])return true});
            if(indexToDelete>=0)this.previousApplications.splice(indexToDelete, 1);  
            
        },err => {
            const errMsg = err.response.data.error;
                    //console.log(err.response)
            this.deleteErrorMsg = errMsg.slice(0,60) + (errMsg.length>60?' ...':'');
            this.deleteErrorMsgDesc = errMsg;
            this.deleteError = true;            
        });
        this.confirmDelete=false;  
    }


    beforeCreate() {
        const Survey = SurveyVue;
        surveyEnv.setCss(Survey);
    }
};
</script>

<style scoped lang="scss">
@import "src/styles/common";
.home-content {
    padding-bottom: 20px;
    padding-top: 0rem;
    width: 80%;
    color: black;
    margin: 0 auto;
}
hr.section {
    border: 0.5px solid $gov-mid-blue;
    margin-bottom: 1.5rem;
}
.section-heading {
    color: $gov-mid-blue;
    font-weight: 500;
    padding: 0rem 2rem 0rem 2rem;
}
.intro {
    font-size: 24px;
    line-height: 1.6;
    margin: 0.5rem auto 0.5rem;
    p {
        margin-bottom: 0.5rem;
    }
}
.loginInfo-section {
    margin-top: 2.5rem;
}
.register-button {
    color: $gov-white !important;
    border: 2px solid rgba($gov-mid-blue, 0.3);
    margin-top: 2.5rem;
    width: 100%;
    &:active {
        border: 2px solid rgba($gov-white, 0.8);
    }
}
.wrapper {
    position: relative;
    padding-left: 8rem;
    width: 30px;
    height: 200px;
    margin: 10px;
}

.application-button {
    float: right;
    color: $gov-white !important;
    border: 2px solid rgba($gov-mid-blue, 0.3);   
    &:active {
        border: 2px solid rgba($gov-white, 0.8);
    }
}

.terms{
    color: $gov-mid-blue;
    margin-top: auto 0;
}

</style>
