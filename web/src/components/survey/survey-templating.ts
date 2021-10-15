import showdown from "showdown";
//This is the regular instance, not SurveyKO module.
export function addCustomTemplating(surveyRuntime: any) {
  surveyRuntime.onProcessTextValue.add(function(sender, options) {
    //Description: Print bulleted list from array.
    //Usage: bullets(<panel>.<fieldname>)
    if (options.name.includes("bullets(")) {
      const data = `${options.name.replace("bullets(", "").replace(")", "")}`;
      const targetName = data.split(".")[0];
      const key = data.split(".")[1];
      if (sender.getQuestionByName(targetName)?.value) {
        const bullets = [];
        sender.getQuestionByName(targetName).value.forEach(function(element) {
          bullets.push(`<li>${key?.length > 0 ? element[key] : element}</li>`);
        });
        options.value = bullets.join("\r\n");
      } else {
        options.value = "";
      }
      options.isExists = true;
    }
    //Description: Print out entire panel content.
    //Usage: printPanel(panelName)
    if (options.name.includes("printPanel(")) {
      const targetName = `${options.name
        .replace("printPanel(", "")
        .replace(")", "")}`;
      const panelData = sender.getQuestionByName(targetName).value;
      options.value = JSON.stringify(panelData);
      options.isExists = true;
    }
  });

  //This templates HTML in the TestSurvey.
  const converter = new showdown.Converter();
  surveyRuntime.onTextMarkdown.add(function(survey, options) {
    let str = converter.makeHtml(options.text);
    str = str.substring(3);
    str = str.substring(0, str.length - 4);
    options.html = str;
  });
}
