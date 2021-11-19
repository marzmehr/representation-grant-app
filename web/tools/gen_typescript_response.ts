import * as Survey from "survey-vue";
import { readFileSync, writeFileSync } from "fs";
import { addQuestionTypes } from "../src/components/survey/question-types/question-types";
const json = readFileSync(
  "../src/components/steps/survey-primary.json"
).toString();

addQuestionTypes(Survey);
const survey = new Survey.SurveyModel(json);

console.log("Generating possible response, this may take a while... ");

//writeFileSync("src/component/types/survey-primary.ts", )

survey.getAllQuestions().forEach(function(question) {
  //survey.setValue(question.name, "test"); This is slow, but generates the correct model.
  console.log(`${question.name} - ${question.getType()}`);
});
