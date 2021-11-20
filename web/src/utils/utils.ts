import Axios, { AxiosInstance } from "axios";
import Vue from "vue";
import { setUserId, setUserLocation, setUserName } from "../state/application-state";

//These are used inside of our components to convert from code and ` to a vue component.
export const convertCodeMarkupToToolTip = (str: string) => {
  return str?.replace(/<code>(.*?)<\/code>/g, (wholeMatch, m1) => {
    return `<tooltip title='${m1}'/>`;
  });
};

export const convertTicksToToolTip = (str: string) => {
  return str?.replace(/`(.*?)`/g, (wholeMatch, m1) => {
    return `<tooltip title='${m1}'/>`;
  });
};

export const getSurveyEnvironment = () => {
  const host = window.location.host;
  const DEV = ["0.0.0.0", "localhost", "dev."];
  const TEST = ['test.'];
  if (DEV.some(s => host.includes(s))) {
    return "DEV";
  } else if (TEST.some(s => host.includes(s))) {
    return "TEST";
  } else {
    return "PROD";
  }
};

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
      const response = await Axios.get("/user-info/");
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
