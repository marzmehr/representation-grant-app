<template>
  <component :is="state.component"></component>
</template>

<script language="ts">
import { onMounted, defineComponent, reactive } from "@vue/composition-api";
import FormP9 from "@/components/steps/submit/pdf/FormP9.vue";
import FormP1 from "@/components/steps/submit/pdf/FormP1.vue";
import { BIconFileEarmarkArrowDownFill } from "bootstrap-vue";

export default defineComponent({
  components: {
    'FormP1': FormP1,
    'FormP9': FormP9
  },
  props: {
    question: Object
  },
  setup(props) {
    const state = reactive({
      key: 1,
      component: ""
    });

    onMounted(() => {
      const q = props.question;
      state.component = q.formSelect;

      function collectDataFormP9(q) {
        const allQuestions = q.survey.getAllQuestions();

        let applicantList = [];
        let deceased = {
          fullName: "",
          first: "",
          middle: "",
          last: "",
          address: ""
        };
        for (const i in allQuestions) {
          const currQuestion = allQuestions[i];

          if (currQuestion.name === "applicantInfoPanel") {
            for (let j = 0; i < currQuestion.value.length; i++) {
              applicantList[i]["applicantOrdinaryAddress"] = currQuestion.value[j]?.applicantOrdinaryAddress;
              applicantList[i]["applicantOccupation"] = currQuestion.value[j]?.applicantOccupation;
            }
          } else if (currQuestion.name === "p1DeliveryInfoPanel") {
            for (let j = 0; i < currQuestion.value.length; i++) {    
              applicantList[i]["p1DeliveryMethod"] = currQuestion.value[j]?.p1DeliveryMethod;
              applicantList[i]["p1DeliveryDate"] = currQuestion.value[j]?.p1DeliveryDate;
              applicantList[i]["p1DeliveryElectronicReceipt"] = currQuestion.value[j]?.p1DeliveryElectronicReceipt;
              // applicantList[i]["p1DeliveryElectronicReceiptRetain"] = currQuestion.value[j]?.p1DeliveryElectronicReceiptRetain[0];
            }
          } else if (currQuestion.name === "deceasedName") {
            const first = currQuestion.value.first;
            const middle = currQuestion.value.middle;
            const last = currQuestion.value.last;
            const full = first + " " + middle + " " + last;

            deceased["first"] = first;
            deceased["middle"] = middle;
            deceased["last"] = last;
            deceased["fullName"] = full;
          } else if (currQuestion.name === "deceasedAddress") {
            const city = currQuestion.value.city;
            const country = currQuestion.value.country;
            const postcode = currQuestion.value.postcode;
            const state = currQuestion.value.state;
            const street = currQuestion.value.street;

            deceased["address"] = street + ", " + city + ", " + state + ", " + country + " " + postcode;
          } else if (currQuestion.name === "applicant") {
            const key = currQuestion.value;
            for (const j in currQuestion.choices) {
              if (currQuestion.choices[j].value == key) {
                applicantList[i]["fullName"] = currQuestion.choices[j].text;
                break;
              }
            }
            applicant
            console.log(currQuestion);
          }
        }
        console.log(applicantList);
        console.log(deceased);
      }

      if (state.component === "FormP9") {
        collectDataFormP9(q);
      }
      //Hooks for SurveyEditor KO.
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("title", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("body", () => {
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("isRequired", () => {
          state.key++;
        });
      }
    });

    return {
      state
    };
  }
});
</script>
