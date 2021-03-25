import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({
  namespaced: true
})
class Common extends VuexModule {
    public existingApplication = false;
    public userId = '';
    public userName = "";
    public userLocation = '';

    public hideHeaderFooter = false;
    public locationsInfo = [];


    @Mutation
    public setExistingApplication(existingApplication: boolean): void {   
        this.existingApplication = existingApplication
    }

    @Action
    public UpdateExistingApplication(newExistingApplication: boolean): void {
        this.context.commit('setExistingApplication', newExistingApplication)
    }
    
    @Mutation
    public setUserId(userId: string): void {   
        this.userId = userId
    }

    @Action
    public UpdateUserId(newUserId: string): void {
        this.context.commit('setUserId', newUserId)
    }

    @Mutation
    public setUserLocation(userLocation: string): void {   
        this.userLocation = userLocation
    }

    @Action
    public UpdateUserLocation(newUserLocation: string): void {
        this.context.commit('setUserLocation', newUserLocation)
    }
    
    @Mutation
    public  setUserName(userName): void {
        this.userName = userName;
    }
    @Action
    public UpdateUserName(newUserName) {
        this.context.commit("setUserName", newUserName);
    }

    @Mutation
    public setLocationsInfo(locationsInfo): void {   
        this.locationsInfo = locationsInfo
    }

    @Action
    public UpdateLocationsInfo(newLocationsInfo): void {
        this.context.commit('setLocationsInfo', newLocationsInfo)
    }

    @Mutation
    public  setHideHeaderFooter(hideHeaderFooter: boolean): void {
        this.hideHeaderFooter = hideHeaderFooter;
    }
    @Action
    public UpdateHideHeaderFooter(newHideHeaderFooter: boolean) {
        this.context.commit("setHideHeaderFooter", newHideHeaderFooter);
    }

}

export default Common