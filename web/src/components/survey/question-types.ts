import { addDays, getDay } from "date-fns";
import Vue from "vue";
import { DayOfWeek, HolidayHelper } from "../utils/holiday";
import AddressInfo from "./components/AddressInfo.vue";
import ContactInfo from "./components/ContactInfo.vue";
import CustomDate from "./components/CustomDate.vue";
import HelpText from "./components/HelpText.vue";
import InfoText from "./components/InfoText.vue";
import PersonName from "./components/PersonName.vue";
import YesNo from "./components/YesNo.vue";
import FormDownloadButton from "./components/FormDownloadButton.vue";
import ReviewYourAnswers from "./components/ReviewYourAnswers.vue"
import { addCustomExpressions } from "./survey-expressions";

function fixCheckboxes(Survey: any) {
  const widget = {
    name: "fixchecks",
    isFit: function(question: any) {
      const t = question.getType();
      return (
        t === "radiogroup" ||
        t === "checkbox" ||
        t === "matrix" ||
        t === "boolean"
      );
    },
    isDefaultRender: true,
    afterRender: function(question: any, el: any) {
      // if(1) return;
      const elts = el.getElementsByTagName("input");
      for (let idx = 0; idx < elts.length; idx++) {
        const input = elts[idx];
        if (input.type !== "radio" && input.type !== "checkbox") continue;
        const newInput = document.createElement("input");
        for (const k of input.getAttributeNames()) {
          newInput.setAttribute(k, input.getAttribute(k));
        }
        if (!newInput.id) {
          newInput.id = (newInput.name || question.name) + "-" + idx;
        }
        newInput.checked = input.checked;
        const outer = input.parentNode;
        const contain = outer.parentNode;
        let label = undefined;
        for (const child of outer.children) {
          if (child.tagName.toLowerCase() === "span") {
            if (
              child.className.indexOf("circle") < 0 &&
              child.className.indexOf("check") < 0 &&
              child.className.indexOf("checkbox-material") < 0
            ) {
              label = child;
              break;
            }
          }
        }
        if (question.getType() !== "boolean" && label)
          label = label.children[0];
        let wrap = contain;
        if (wrap.tagName.toLowerCase() !== "div") {
          wrap = document.createElement("div");
          if (question.getType() !== "boolean") wrap.className = newInput.type;
          contain.insertBefore(wrap, outer);
          wrap.appendChild(outer);
        }
        wrap.insertBefore(newInput, outer);
        const newLabel = document.createElement("label");
        newLabel.setAttribute("for", newInput.id);
        if (label) {
          label.style.marginLeft = "0.3em";
          newLabel.appendChild(label);
        }
        wrap.insertBefore(newLabel, outer);
        wrap.removeChild(outer);

        newInput.addEventListener("click", event => {
          const target = <HTMLInputElement>event.target;
          if (question.getType() === "matrix") {
            if (target.checked) {
              question.generatedVisibleRows.forEach(function(
                row: any,
                index: any,
                rows: any
              ) {
                if (row.fullName === target.name) {
                  row.value = target.value;
                }
              });
            }
          } else if (question.getType() === "checkbox") {
            const oldValue = question.value || [];
            const index = oldValue.indexOf(target.value);
            if (index >= 0) {
              if (!target.checked) {
                oldValue.splice(index, 1);
                question.value = oldValue;
              }
            } else if (target.checked) {
              question.value = oldValue.concat([target.value]);
            }
          } else if (target.checked) {
            question.value = target.value;
          }
        });
      }

      question.valueChangedCallback = function() {
        if (question.getType() !== "matrix") {
          let values = question.value || [];
          if (!Array.isArray(values)) {
            values = [values];
          }
          const inputElts = el.getElementsByTagName("input");
          for (let i = 0; i < inputElts.length; i++) {
            inputElts[i].checked = values.indexOf(inputElts[i].value) >= 0;
          }
        } else {
          question.generatedVisibleRows.forEach(function(
            row: any,
            index: any,
            rows: any
          ) {
            if (row.value) {
              const inputElts = el.getElementsByTagName("input");
              for (let i = 0; i < inputElts.length; i++) {
                if (
                  inputElts[i].name === row.fullName &&
                  inputElts[i].value === row.value
                ) {
                  inputElts[i].checked = true;
                }
              }
            }
          });
        }
      };
    },
    willUnmount: function(question: any, el: any) {}
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initHelpText(Survey: any) {
  const widget = {
    name: "HelpText",
    title: "Expanding FAQ",
    iconName: "icon-panel",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "helptext";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("helptext", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("helptext", [
        {
          name: "body:text",
          category: "general", // move the custom property in the general category
          visibleIndex: 3 // Moves the property at index 3 within the category
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(HelpText);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initInfoText(Survey: any) {
  const widget = {
    name: "InfoText",
    title: "Message Text",
    iconName: "icon-panel",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "infotext";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("infotext", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("infotext", [
        {
          name: "body:text",
          category: "general",
          visibleIndex: 3
        },
        {
          name: "messageStyle",
          default: "info",
          choices: ["info", "inline", "error"],
          category: "general",
          visibleIndex: 4
        },
        {
          name: "displayTextBasedOffArrayQuestion",
          default: "",
          category: "general",
          visibleIndex: 5
        }
      ]);
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(InfoText);
      const card = new ComponentClass({
        propsData: {
          question: question,
          isSurveyEditor: true
        }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initFormDownloadButton(Survey: any) {
  const widget = {
    name: "FormDownloadButton",
    title: "Form Download/Print Button",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "formdownloadbutton";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "formdownloadbutton",
        [],
        null,
        "empty"
      );
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(FormDownloadButton);
      const card = new ComponentClass({
        propsData: { question: question }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initYesNo(Survey: any) {
  const widget = {
    name: "YesNo",
    title: "Yes/No",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "yesno";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass("yesno", [], null, "empty");
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(YesNo);
      const card = new ComponentClass({
        propsData: { question: question }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initAddressBlock(Survey: any) {
  const widget = {
    name: "AddressInfo",
    title: "Postal Address",
    iconName: "icon-multipletext",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "address";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "address",
        [
          {
            name: "referLabel:text"
          }
        ],
        null,
        "empty"
      );
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(AddressInfo);
      const card = new ComponentClass({
        propsData: { question: question }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initPersonName(Survey: any) {
  const widget = {
    name: "PersonName",
    title: "Person Name",
    iconName: "icon-multipletext",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "personname";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "personname",
        [
          {
            name: "defaultSubstitution:text"
          },
          {
            name: "labelFirstName:text"
          },
          {
            name: "labelMiddleName:text"
          },
          {
            name: "labelLastName:text"
          },
          {
            name: "descFirstName:text"
          },
          {
            name: "descMiddleName:text"
          },
          {
            name: "descLastName:text"
          }
        ],
        null,
        "empty"
      );
    },
    getDisplayValue: function(question: any) {
      const name = question.value;
      if (name)
        return [name.first, name.middle, name.last]
          .map(p => p.trim())
          .filter(p => p)
          .join(" ");
      return question.defaultSubstitution;
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(PersonName);
      const card = new ComponentClass({
        propsData: { question: question }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initContactInfoBlock(Survey: any) {
  const widget = {
    name: "ContactInfo",
    title: "Contact Info",
    iconName: "icon-multipletext",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "contactinfo";
    },
    htmlTemplate: "<div></div>",
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "contactinfo",
        [
          {
            name: "labelEmail:text"
          },
          {
            name: "labelFax:text"
          },
          {
            name: "labelPhone:text"
          }
        ],
        null,
        "empty"
      );
    },
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(ContactInfo);
      const card = new ComponentClass({
        propsData: { question: question, isSurveyEditor: true }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

function initCustomDate(Survey: any) {
  const widget = {
    name: "CustomDate",
    title: "Date Input",
    iconName: "icon-date",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.inputType === "date";
    },
    htmlTemplate: "<div></div>",
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addProperties("text", [
        {
          name: "dateYearsAhead:number",
          default: 0
        },
        {
          name: "dateYearsBehind:number",
          default: 100
        }
      ]);
    },
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(CustomDate);
      const card = new ComponentClass({
        propsData: { question: question }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "property");
}

function initReviewYourAnswers(Survey: any) {
  const widget = {
    name: "ReviewYourAnswers",
    title: "Review Your Answers button",
    iconName: "icon-radiogroup",
    isDefaultRender: true,
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question: any) {
      return question.getType() === "reviewyouranswers";
    },
    activatedByChanged: function(activatedBy: any) {
      Survey.JsonObject.metaData.addClass(
        "reviewyouranswers",
        [],
        null,
        "empty"
      );
    },
    htmlTemplate: "<div></div>",
    afterRender: function(question, el) {
      const ComponentClass = Vue.extend(ReviewYourAnswers);
      const card = new ComponentClass({
        propsData: { question: question }
      });
      card.$mount();
      el.appendChild(card.$el);
    }
  };
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

export function addQuestionTypes(Survey: any) {
  // fixCheckboxes(Survey);
  initReviewYourAnswers(Survey)
  initFormDownloadButton(Survey);
  initYesNo(Survey);
  initInfoText(Survey);
  initHelpText(Survey);
  initPersonName(Survey);
  initAddressBlock(Survey);
  initContactInfoBlock(Survey);
  initCustomDate(Survey);
  addCustomExpressions(Survey);
}

export function addToolboxOptions(editor: any) {
  editor.toolbox.addItem({
    title: "---Custom---"
  });
  editor.toolbox.addItem({
    name: "yesno",
    title: "Yes/No Choice",
    isCopied: true,
    iconName: "icon-radiogroup",
    json: {
      type: "yesno"
    }
  });
  editor.toolbox.addItem({
    name: "helptext",
    title: "Expanding FAQ",
    isCopied: true,
    iconName: "icon-panel",
    json: {
      type: "helptext",
      titleLocation: "hidden"
    }
  });
  editor.toolbox.addItem({
    name: "infotext",
    title: "Message Text",
    isCopied: true,
    iconName: "icon-panel",
    json: {
      type: "infotext",
      titleLocation: "hidden"
    }
  });
  editor.toolbox.addItem({
    name: "personname",
    title: "Name Input",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "personname"
    }
  });
  editor.toolbox.addItem({
    name: "address",
    title: "Postal Address",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "address"
    }
  });
  editor.toolbox.addItem({
    name: "contactinfo",
    title: "Contact Information",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "contactinfo"
    }
  });
  editor.toolbox.addItem({
    name: "formdownloadbutton",
    title: "Form Download/Print button",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "formdownloadbutton"
    }
  });
  editor.toolbox.addItem({
    name: "reviewyouranswers",
    title: "Review Your Answers button",
    isCopied: true,
    iconName: "icon-multipletext",
    json: {
      type: "reviewyouranswers"
    }
  });
}
