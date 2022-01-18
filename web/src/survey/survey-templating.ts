import showdown from "showdown";
import { ExpressionRunner } from "survey-vue";
import { convertCodeMarkupToToolTip, convertTicksToToolTip } from "@/utils/utils";
import { SurveyInstance } from "@/types/survey-primary";
import { replace } from "lodash";
//This is the regular instance, not SurveyKO module.
export function addCustomTemplating(surveyRuntime: any) {
  surveyRuntime.onProcessTextValue.add(function(sender, options) {
    // Note: I tried displayIf here, but since one of the parameters can be a question,
    // it didn't seem to handle nested {{}} inside of functions.

    //Description: Print bulleted list from array.
    //Example Usage: bullets(<panel>.<fieldname>)
    if (options.name?.includes("bullets(")) {
      const data = `${options.name.replace("bullets(", "").replace(")", "")}`;
      const targetName = data.split(".")[0];
      const key = data.split(".")[1];
      const question = sender.getQuestionByName(targetName)?.value;
      if (question) {
        const bullets = [];
        question.forEach(function(element) {
          const value = `${key?.length > 0 ? element[key] : element}`;
          if (value && value !== "undefined") bullets.push(`<li>${value}</li>`);
        });
        options.value = bullets.join("\r\n");
      } else {
        options.value = "";
      }
      options.isExists = true;
    }

    //Description: Print comma list from array.
    //Example Usage: commaList(<questionName1>, <questionName2>, <questionNameN>)
    //or commaList(<panelN>.<fieldnameN>,<questionNameN>)
    if (options.name?.includes("commaList(")) {
      const data = `${options.name.replace("commaList(", "").replace(")", "")}`;
      let commaList = [];
      const panels = [];

      let entries = data
        .split(",")
        .map(e => e.trim())
        .map(e => ({ targetName: e.split(".")[0], panelQuestion: e.split(".")[1] }));
      entries.forEach(entry => {
        const questionValue = sender.getQuestionByName(entry.targetName)?.value;
        if (panels.includes(entry.targetName)) return;
        if (Array.isArray(questionValue)) {
          questionValue.forEach(question => {
            const isPanel = entry.panelQuestion?.length > 0;
            if (isPanel) {
              const panel = question;
              const panelQuestions = entries
                .filter(e => e.targetName == entry.targetName && e.panelQuestion?.length > 0)
                .map(s => s.panelQuestion);
              panelQuestions.forEach(panelQuestion => {
                commaList.push(panel[panelQuestion]);
              });
              panels.push(entry.targetName);
            } else {
              commaList.push(question);
            }
          });
        } else if (questionValue) {
          commaList.push(questionValue);
        }
      });
      commaList = commaList.filter(s => s && s != "undefined");

      if (commaList.length == 0) {
        options.value = "";
      } else
        options.value = `${
          commaList.length > 1 ? commaList.slice(0, -1).join(", ") : commaList[0]
        } ${commaList.length > 1 ? `and ${commaList.slice(-1)[0]}` : ``}`;
      options.isExists = true;
    }

    //Description: Print out entire panel content.
    //Usage: printPanel(panelName)
    if (options.name?.includes("printPanel(")) {
      const targetName = `${options.name.replace("printPanel(", "").replace(")", "")}`;
      const panelData = sender.getQuestionByName(targetName).value;
      options.value = JSON.stringify(panelData);
      options.isExists = true;
    }
  });

  //This templates HTML in the TestSurvey.
  //Also fills in displayIf.
  surveyRuntime.onTextMarkdown.add(function(survey, options) {
    if (options.text.includes("displayIf(")) {
      const split = options.text.match(/displayIf/g);

      for (let i = 0; i < split.length; i++) {
        const startIndex = options.text.indexOf("displayIf(");
        const endIndex = options.text.indexOf(")}");
        const displayIfLength = "displayIf(".length;
        const targetString = `${options.text.substring(startIndex + displayIfLength, endIndex)}`;
        const index = targetString.indexOf(",");
        const params = [targetString.slice(0, index), targetString.slice(index + 1)];
        let expression = params[0];
        const match = expression.match(/\#\w*/);
        const replacement = match ? match[0].replace("#", "") : null;
        expression = replacement ? expression.replace(/\#\w*/g, survey.data[replacement]) : expression;

        let expressionResult = new ExpressionRunner(expression).run({});
        options.text =
          options.text.slice(0, startIndex - 1) +
          (expressionResult !== false ? params[1] : "") +
          options.text.substring(endIndex + 2, options.text.length);
      }
    }
    let str = new showdown.Converter().makeHtml(options.text);
    //Remove <p> tags.
    const m = str.match(/^<p>(.*)<\/p>$/);
    str = str.substring(3);
    if (m) {
      str = m[1];
    }
    if (survey.platformName === "vue") {
      str = convertCodeMarkupToToolTip(str);
      //Qualifying for example didn't convert to <code> and left it as `.
      str = convertTicksToToolTip(str);
    }
    // Sometimes if there is no text, it will display the default.
    options.html = str;
  });
}
