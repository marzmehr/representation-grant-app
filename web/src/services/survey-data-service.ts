import axios, { AxiosRequestConfig } from "axios";

export const jsonConfig = {
  responseType: "json",
  headers: {
    "Content-Type": "application/json"
  }
} as AxiosRequestConfig;

export const SurveyDataService = {
  createApplication: async function() {
    return await axios.post(
      `/app/`,
      {
        type: "PROBATE",
        steps: []
      },
      jsonConfig
    );
  },
  deleteApplication: async function(applicationId) {
    return await axios.delete(`/app/${applicationId}/`);
  },
  getApplication: async function(applicationId) {
    return await axios.get(`/app/${applicationId}/`);
  },
  getApplicationList: async function() {
    return await axios.get("/app-list/");
  },
  getPdf: async function(applicationId, formName, html, jsonData, version = "1.0") {
    const url = `/survey-print/${applicationId}/?pdf_type=${formName}&version=${version}`;
    const options = {
      method: window.location.pathname.includes("sandbox") ? "PUT" : "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        html: html,
        json_data: jsonData
      }
    } as AxiosRequestConfig;
    return await axios(url, options);
  },
  updateApplication: async function(applicationId, data) {
    return await axios.put(
      `/app/${applicationId}/`,
      {
        type: "PROBATE",
        steps: data
      },
      jsonConfig
    );
  }
};
