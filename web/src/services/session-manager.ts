import { setUserId, setUserLocation, setUserName } from "@/state/application-state";
import axios from "axios";
import Vue from "vue";

//This handles the user context, logging out, userInfo etc.
export const SessionManager = {
    logoutAndRedirect: async function() {
      window.location.replace(`${process.env.BASE_URL}api/v1/logout/`);
      Vue.$cookies.set("quickexit", "1");
    },
    logout: function() {
      window.location.replace(`${process.env.BASE_URL}api/v1/logout/`);
      setUserName("");
      setUserId("");
      setUserLocation("");
    },
    redirectIfQuickExitCookie: function() {
      if (Vue.$cookies.isKey("quickexit")) {
        Vue.$cookies.remove("quickexit");
        history.pushState({ page: "home" }, "", process.env.BASE_URL);
        window.location.href = "https://www.google.ca";
      }
    },
    getUserInfo: async function() {
      try {
        const response = await axios.get("/user-info/");
        const userId = response.data.user_id;
        const loginUrl = response.data.login_uri;
        const isStaff = response.data.is_staff;
        const userLocation = response.data.location;
        if (userId) {
          const universalId = response.data.universal_id;
          if (!universalId) {
            this.logout();
          }
          const userName =
            response.data.display_name || response.data.first_name + " " + response.data.last_name;
  
          setUserName(userName);
          setUserId(userId);
          setUserLocation(userLocation);
        }
        return { userId, loginUrl, isStaff };
      } catch (error) {
        console.log(error);
      }
    }
  };