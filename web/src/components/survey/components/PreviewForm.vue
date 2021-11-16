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
        const targets = {
          "applicantInfoPanel": [
            // "applicantCourthouse",
            "applicantOrdinaryAddress",
            "applicantOccupation"
          ],
          "p1DeliveryInfoPanel": [
            "p1DeliveryMethod",
            "p1DeliveryDate",
            "p1DeliveryElectronicReceipt",
            "p1DeliveryElectronicReceiptRetain"
          ],
          // "deceasedName": ""
        }

        const allQuestions = q.survey.getAllQuestions();
        const keys = Object.keys(targets);
        console.log(keys);

        let results = [];
        for (const i in allQuestions) {
          const currQuestion = allQuestions[i];

          if (currQuestion.name === "applicantInfoPanel") {
            console.log("Found the applicant info panel");
            console.log(currQuestion);
            for (let i = 0; i < currQuestion.value.length; i++) {
              let result = {};
              result["applicantOrdinaryAddress"] = currQuestion.value[i].applicantOrdinaryAddress;
              result["applicantOccupation"] = currQuestion.value[i].applicantOccupation;
              results.push(result);
            }
          } else if (currQuestion.name === "p1DeliveryInfoPanel") {
            console.log("Found the delivery info panel");
            console.log(currQuestion);
            for (let i = 0; i < currQuestion.value.length; i++) {         
              results[i]["p1DeliveryMethod"] = currQuestion.value[i].p1DeliveryMethod;
              results[i]["p1DeliveryDate"] = currQuestion.value[i].p1DeliveryDate;
              results[i]["p1DeliveryElectronicReceipt"] = currQuestion.value[i].p1DeliveryElectronicReceipt;
              results[i]["p1DeliveryElectronicReceiptRetain"] = currQuestion.value[i].p1DeliveryElectronicReceiptRetain[0];
            }
          }
          // } else if (currQuestion.name === "deceasedName") {
          //   console.log("Found the deceased name");
          //   console.log(currQuestion);
          //   targets["deceasedName"] = currQuestion.value;
          // }
        }
        console.log(results);
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
