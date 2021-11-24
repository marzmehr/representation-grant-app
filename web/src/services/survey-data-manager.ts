import { getApplicationId, setError } from "@/state/application-state";
import { getSurvey } from "@/state/survey-state";
import axios, { AxiosRequestConfig } from "axios";
import { differenceInMinutes } from "date-fns";
import { format } from "date-fns-tz";

//This handles saving, loading, printing of surveys.
export const SurveyDataManager = {
  onPrint: async function(pdfType) {
    const applicationId = getApplicationId.value;
    const url = `/survey-print/${applicationId}/?pdf_type=${pdfType}`;
    const options = {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json"
      }
    } as AxiosRequestConfig;
    axios.get(url, options).then(
      res => {
        const blob = res.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.download = `${pdfType}.pdf`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      },
      err => {
        setError(err);
      }
    );
  },
  onSaveSurvey: async function() {
    const config = {
      responseType: "json",
      headers: {
        "Content-Type": "application/json"
      }
    } as AxiosRequestConfig;

    try {
      const response = axios.put(
        `/app/${getApplicationId.value}/`,
        {
          type: "PROBATE", //Todo change this later.
          steps: getSurvey.value.data
        },
        config
      );
    } catch (error) {
      console.log(`onSaveSurvey(): failed: ${error}`, error);
    }
  },
  onLoadSurveyData: async function() {
    try {
      const response = axios.get(`/app/${getApplicationId.value}/`);
      return (await response).data;
    } catch (error) {
      console.log(`onSaveSurvey(): failed: ${error}`, error);
    }
  },
  onLoadApplications: async function(applications) {
    axios.get("/app-list/").then(
      response => {
        for (const appJson of response.data) {
          const app = {
            lastUpdated: 0,
            lastUpdatedDate: "",
            id: 0,
            deceased_name: "",
          };
          const date = new Date(appJson.last_updated);
          app.lastUpdated = appJson.last_updated
            ? differenceInMinutes(date, new Date("2000/01/01"))
            : 0;
          app.lastUpdatedDate = appJson.last_updated
            ? format(date, "MMMM d, yyyy H:mm z", { timeZone: "America/Vancouver" })
            : "";
          app.id = appJson.id;
          app.deceased_name = `${appJson.deceased_name.first} ${appJson.deceased_name.middle} ${appJson.deceased_name.last}`;
          applications.push(app);
        }
      },
      err => {
        setError(err);
      }
    );
  },
  onResumeApplication(applicationId, currentApplication) {
    axios.get("/app/" + applicationId + "/").then(
      response => {
        const applicationData = response.data;

        currentApplication = {
          id: applicationId,
          userId: applicationData.user, 
          ...applicationData
        };
      },
      err => {
        setError(err);
      }
    );
  },
  onDeleteApplication(application, index, deleteItems) {
    deleteItems.deleteErrorMsg = "";
    deleteItems.deleteErrorMsgDesc = "";
    deleteItems.deleteError = false;
    deleteItems.applicationToDelete = application;
    deleteItems.indexToDelete = index;
    deleteItems.confirmDelete = true;
  },
  OnDeleteApplicationConfirm(applications, deleteItems) {
    axios.delete("/app/" + deleteItems.applicationToDelete["id"] + "/").then(
      response => {
        var indexToDelete = applications.findIndex(app => {
          if (app.id == deleteItems.applicationToDelete["id"]) return true;
        });
        if (indexToDelete >= 0) applications.splice(indexToDelete, 1);
      },
      err => {
        const errMsg = err.response.data.error;
        setError(errMsg);

        deleteItems.deleteErrorMsg = errMsg.slice(0, 60) + (errMsg.length > 60 ? " ..." : "");
        deleteItems.deleteErrorMsgDesc = errMsg;
        deleteItems.deleteError = true;
      }
    );
    deleteItems.confirmDelete = false;
  },
  // axios.post applicationvuew
  onBenigApplication() {
    const config = {
      responseType: "json",
      headers: {
        "Content-Type": "application/json"
      }
    } as AxiosRequestConfig;

    try {
      const response = axios.post(
        `/app/`,
        {
          type: "PROBATE", //Todo change this later.
          steps: []
        },
        config
      );
    } catch (error) {
      console.log(`onBenigApplication(): failed: ${error}`, error);
    }
  }
  
};
