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
          "applicantInfoPanel": {
            // "applicantCourthouse": "",
            "applicantOrdinaryAddress": "",
            "applicantOccupation": ""
          },
          "p1DeliveryInfoPanel": {
            "p1DeliveryMethod": "",
            "p1DeliveryDate": "",
            "p1DeliveryElectronicReceipt": "",
            "p1DeliveryElectronicReceiptRetain": ""
          },
          "deceasedName": ""
        }

        const allQuestions = q.survey.getAllQuestions();

        for (const question in allQuestions) {
          const currQuestion = allQuestions[question];
          if (currQuestion.name === "applicantInfoPanel") {
            console.log("Found the applicant info panel");
            console.log(currQuestion);
            targets["applicantInfoPanel"]["applicantOrdinaryAddress"] = allQuestions[question].value[0].applicantOrdinaryAddress;
            targets["applicantInfoPanel"]["applicantOccupation"] = allQuestions[question].value[0].applicantOccupation;
          } else if (currQuestion.name === "p1DeliveryInfoPanel") {
            console.log("Found the delivery info panel");
            console.log(currQuestion);
            targets["p1DeliveryInfoPanel"]["p1DeliveryMethod"] = allQuestions[question].value[0].p1DeliveryMethod;
            targets["p1DeliveryInfoPanel"]["p1DeliveryDate"] = allQuestions[question].value[0].p1DeliveryDate;
            targets["p1DeliveryInfoPanel"]["p1DeliveryElectronicReceipt"] = allQuestions[question].value[0].p1DeliveryElectronicReceipt;
            targets["p1DeliveryInfoPanel"]["p1DeliveryElectronicReceiptRetain"] = allQuestions[question].value[0].p1DeliveryElectronicReceiptRetain[0];
          } else if (currQuestion.name === "deceasedName") {
            console.log("Found the deceased name");
            console.log(currQuestion);
            targets["deceasedName"] = currQuestion.value;
          }
        }
        console.log(targets);
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
