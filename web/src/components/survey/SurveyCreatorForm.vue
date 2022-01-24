<template>
  <div id="surveyCreatorContainer"></div>
</template>

<script lang="ts">
import Axios from "axios";
import { Component, Vue, Prop } from "vue-property-decorator";
import * as SurveyCreator from "survey-creator";
import "survey-creator/survey-creator.css";
import { addToolboxOptions, addQuestionTypes } from "@/survey/question-types/question-types";
import { addCustomTemplating } from "@/survey/survey-templating";
import * as widgets from "surveyjs-widgets";
import * as SurveyKO from "survey-knockout";
import ace from "ace-builds";
import "ace-builds/src-noconflict/ext-searchbox";
import { onValueChanged } from "@/survey/survey-on-value-change";
import { getSurveyEnvironment } from "@/utils/utils";
import { setHideHeaderFooter } from "@/state/application-state";

@Component
export default class SurveyCreatorForm extends Vue {
  @Prop() sandboxName!: string;

  public async saveSurveyDataToDatabase(jsonData: string) {
    try {
      await Axios.put("/sandbox-survey/", {
        sandbox_name: this.sandboxName,
        sandbox_data: jsonData
      });
      alert("Saved");
    } catch (error) {
      console.log("saveSurveyData(jsonData): saving JSON data to database failed\n", error);
      alert("Failed to Save");
    }
  }

  public async loadSurveyDataFromDatabase(editor) {
    try {
      const response = await Axios.get(`/sandbox-survey/?sandbox_name=${this.sandboxName}`);
      editor.changeText(JSON.parse(response.data.sandbox_data));
    } catch (error) {
      console.log("loadSurveyDataFromDatabase(): Loading JSON to JSON Editor failed\n", error);
    }
  }

  editor: SurveyCreator.SurveyCreator;
  async mounted() {
    this.initSurvey();

    setHideHeaderFooter(true);
    widgets.inputmask(SurveyKO);

    addQuestionTypes(SurveyKO);
    const saveSurveyData = this.saveSurveyDataToDatabase;
    const sandboxName = this.sandboxName;

    const editorOptions = {
      isAutoSave: true,
      showLogicTab: true,
      designerHeight: "766px"
    };

    const editor = new SurveyCreator.SurveyCreator("surveyCreatorContainer", editorOptions);

    ace.edit(document.getElementsByName("survey-json-editor")[0], {});

    editor.onSurveyInstanceCreated.add(function(sender, options) {
      //These need to be here to keep track of panel counts.
      options.survey
        .getAllQuestions()
        .filter(
          x =>
            x.getType() === "paneldynamic" &&
            (x.name == "spouseInfoPanel" || x.name == "childInfoPanel")
        )
        .forEach(element => {
          options.survey.setVariable(`${element.name}-count`, element.panelCount);
        });

      options.survey.onDynamicPanelAdded.add((sender, options) => {
        sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
      });

      options.survey.onDynamicPanelRemoved.add((sender, options) => {
        sender.setVariable(`${options.question.name}-count`, options.question.panelCount);
      });

      if (options.reason == "test") {
        addCustomTemplating(options.survey);
      }
      options.survey.onValueChanged.add((sender, options) => {
        this.updatedKey++;
        onValueChanged(sender, options);
      });
      options.survey.setVariable(`surveyEnvironment`, getSurveyEnvironment());
    });

    const resizeIfLargeEnoughScreen = () => {
      if (
        window.innerHeight > 800 &&
        document.querySelector<HTMLElement>("main.app-content.fill-body").style.height != "100vh"
      ) {
        document.querySelector<HTMLElement>("main.app-content.fill-body").style.height = "100vh";
        document.querySelector<HTMLElement>(".svd_container .svd_content").style.height = "100vh";
        document.querySelector<HTMLElement>("#surveyCreatorContainer div").style.height = "100vh";
      }
    };

    resizeIfLargeEnoughScreen();
    window.addEventListener("resize", resizeIfLargeEnoughScreen);

    editor.toolbarItems.push({
      id: "save-test",
      visible: true,
      title: "Save Test",
      action: async function() {
        await saveSurveyData(editor.text);
      }
    });

    editor.toolbarItems.push({
      id: "copy-link",
      visible: true,
      title: "Copy Test URL",
      action: function() {
        const copyToClipboard = (str: string) => {
          const el = document.createElement("textarea");
          el.value = str;
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        };
        const url = window.location.href;
        copyToClipboard(url.replace("surveyeditor", "sandbox"));
        alert("Copied");
      }
    });

    editor.toolbarItems.push({
      id: "download-json",
      visible: true,
      title: "Download JSON",
      action: function() {
        const download = (fileData: string, fileName: string) => {
          const el = document.createElement("a");
          el.setAttribute(
            "href",
            "data:application/json;charset=utf-8," + encodeURIComponent(fileData)
          );
          el.setAttribute("download", fileName);
          el.click();
        };
        download(editor.text, `SurveyEditor${sandboxName.slice(-1)}.json`);
      }
    });

    editor.haveCommercialLicense = true;

    addToolboxOptions(editor);

    await this.loadSurveyDataFromDatabase(editor);
  }

  initSurvey() {
    const surveyCssCls = SurveyKO.defaultBootstrapCss;
    surveyCssCls.page.root = "sv_page";
    surveyCssCls.pageDescription = "sv_page_description";
    surveyCssCls.page.description = "sv_page_description";
    surveyCssCls.pageTitle = "sv_page_title";
    surveyCssCls.page.title = "sv_page_title";
    surveyCssCls.navigationButton = "btn btn-primary";
    surveyCssCls.question.title = "sv_q_title";
    surveyCssCls.question.description = "sv_q_description";
    surveyCssCls.panel.description = "sv_p_description";
    surveyCssCls.matrixdynamic.button = "btn btn-primary";
    surveyCssCls.paneldynamic.button = "btn btn-primary";
    surveyCssCls.paneldynamic.root = "sv_p_dynamic";
    surveyCssCls.checkbox.item = "sv-checkbox";
    surveyCssCls.checkbox.controlLabel = "sv-checkbox-label";
    surveyCssCls.checkbox.materialDecorator = "";
    surveyCssCls.radiogroup.item = "sv-radio";
    surveyCssCls.radiogroup.controlLabel = "sv-checkbox-label";
    surveyCssCls.radiogroup.materialDecorator = "";

    const mainColor = "#38598a";
    const mainHoverColor = "#2d476f";
    const textColor = "#494949";
    const headerColor = "#555";
    const headerBackgroundColor = "#4a4a4a";
    const bodyContainerBackgroundColor = "#f8f8f8";
    const borderColor = "#aaa";

    const surveyThemeColors = SurveyKO.StylesManager.ThemeColors["default"];
    surveyThemeColors["$main-color"] = mainColor;
    surveyThemeColors["$main-hover-color"] = mainHoverColor;
    surveyThemeColors["$text-color"] = textColor;
    surveyThemeColors["$header-color"] = headerColor;
    surveyThemeColors["$header-background-color"] = headerBackgroundColor;
    surveyThemeColors["$body-container-background-color"] = bodyContainerBackgroundColor;

    const editorThemeColors = SurveyCreator.StylesManager.ThemeColors["default"];
    editorThemeColors["$primary-color"] = mainColor;
    editorThemeColors["$secondary-color"] = mainColor;
    editorThemeColors["$primary-border-color"] = borderColor;
    editorThemeColors["$secondary-border-color"] = borderColor;
    editorThemeColors["$primary-hover-color"] = mainHoverColor;
    editorThemeColors["$primary-text-color"] = textColor;
    editorThemeColors["$selection-border-color"] = mainColor;

    // SurveyCreator.StylesManager.applySurveyTheme = () => null; // disable editor's reference to survey theme
    SurveyKO.StylesManager.applyTheme("bootstrap");
    SurveyCreator.StylesManager.applyTheme("bootstrap");
  }
}
</script>
