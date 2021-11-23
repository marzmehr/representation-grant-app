import { getApplicationId } from "@/state/application-state";
import { getSurvey } from "@/state/survey-state";
import axios, { AxiosRequestConfig } from "axios";

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
        console.error(err);
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
      const response = axios.put(`/app/${getApplicationId.value}/`, getSurvey.value.data, config);
    } catch (error) {
      console.log(`onSaveSurvey(): failed: ${error}`, error);
    }
  },
  onLoadSurveyData: async function() {
    try {
      const response = axios.get(`/app/${getApplicationId.value}/`);
      return;
    } catch (error) {
      console.log(`onSaveSurvey(): failed: ${error}`, error);
    }
  }
};
