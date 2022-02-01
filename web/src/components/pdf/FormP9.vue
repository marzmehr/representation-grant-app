<template>
  <div key="getLastUpdated" style="font-size:11pt;">
    <div>
      <b-button style="transform:translate(500px,0px)" variant="success" @click="onPrint()">
        Print
      </b-button>
      <b-card
        v-for="(applicant, i) in applicantList"
        :key="i"
        id="print"
        bg-variant="white"
        class="mt-4 mb-3"
        ref="root"
        style="border:1px solid; border-radius:5px;padding:3rem 4rem 2rem 4rem;"
      >
        <div style="text-align:center;margin:1rem 0 0 0rem;f">
          <b>FORM P9</b> (RULE 25-3 (2))
        </div>

        <div class="mt-3 m-0 p-0 row">
          <div style="margin-left: 396px; text-align: right;!important">
            <div>
              This is the <b>1st</b> affidavit of <b>{{ applicant.fullName }}</b> in this case
            </div>
            <div class="mt-2">
              <underline-form textwidth="5rem" beforetext="and was made on" text="" />
            </div>
            <div class="mt-2">
              <b>{{ applicant.courthouse }}</b>
              <underline-form
                textwidth="5rem"
                beforetext="Registry No."
                text=""
              />
            </div>
          </div>
        </div>

        <div style="text-align:center;margin:1rem 0 1rem 0rem;">
          In the Matter of the Estate of <b>{{ deceased }}</b>, deceased
        </div>
        <div style="text-align:center;margin:1rem 0 1rem 0rem;">
          <b>AFFIDAVIT OF DELIVERY</b>
        </div>

        <div>
          I, <b>{{ applicant.fullName }}</b>, of <b>{{ applicant.address }}</b>, 
          <b>{{ applicant.occupation }}</b>, SWEAR (OR AFFIRM) THAT:
        </div>
        <br/>
        <div style="display:inline;">
          1 Attached to this affidavit and marked as Exhibit A is a copy of a notice of proposed
          application in Form P1 (the "notice").
        </div>

        <div
          v-if="
            mailRecipients(applicant).length > 0 ||
            electronicRecipients(applicant).length > 0 ||
            inPersonRecipients(applicant).length > 0
          "
          class="mt-4 text-justify"
        >
          <div>
            2 I delivered a copy of the notice to the following persons as follows:
          </div>

          <div v-if="mailRecipients(applicant).length > 0">
            <div style="margin-left: 50px;">
              by mailing it/them to the following persons by ordinary mail:
            </div>
            <template v-for="(recipient, i) of mailRecipients(applicant)">
              <div class="fullUnderline" :key="i">
                <b>{{ recipient.recipientName }}</b>
                <div :key="i" style="float: right"> on <b>{{ recipient.p1DeliveryDate }}</b></div>
              </div>
            </template>
          </div>

          <br v-if="
            mailRecipients(applicant).length > 0 &&
            (electronicRecipients(applicant).length > 0 ||
            inPersonRecipients(applicant).length > 0)
          "/>

          <div v-if="inPersonRecipients(applicant).length > 0">
            <div style="margin-left: 50px;">
              by handing it/them to and leaving it/them with the following persons:
            </div>
            <template v-for="(recipient, i) of inPersonRecipients(applicant)">
              <div class="fullUnderline" :key="i">
                <b>{{ recipient.recipientName }}</b>
                <div :key="i" style="float: right"> on <b>{{ recipient.p1DeliveryDate }}</b></div>
              </div>
            </template>
          </div>

          <br v-if="
            inPersonRecipients(applicant).length > 0 &&
            electronicRecipients(applicant).length > 0
          "/>

          <div v-if="electronicRecipients(applicant).length > 0">
            <div style="margin-left: 50px;">
              by sending it/them to the following persons by e-mail, fax or other electronic means 
              to that person:
            </div>
            <template v-for="(recipient, i) of electronicRecipients(applicant)">
              <div class="fullUnderline" :key="i">
                <b>{{ recipient.recipientName }}</b>
                <div :key="i" style="float: right"> on <b>{{ recipient.p1DeliveryDate }}</b></div>
              </div>
            </template>
            <ul style="margin-left:30px"> 
              <li v-if="allP1DeliveryElectronicReceipt(applicant)">
                Each of the persons who received delivery by e-mail, fax or other electronic means
                has, in writing, acknowledged receipt of the document(s) referred to in this
                section.
              </li>
                
              <li v-if="electronicRecipients(applicant).length <= 1 && allP1DeliveryElectronicReceiptRetain(applicant)">
                I will retain a copy of those acknowledgements until the personal representative of
                the deceased is discharged and will produce those acknowledgements promptly after 
                being requested to do so by the registrar.
                after being requested to do so by the registrar.
              </li>

              <li v-if="electronicRecipients(applicant).length > 1 && allP1DeliveryElectronicReceiptRetain(applicant)">
                We will retain a copy of those acknowledgements until the personal representative of
                the deceased is discharged and will produce those acknowledgements promptly after
                being requested to do so by the registrar.
              </li>
            </ul>
          </div>
        </div>

        <table class="mt-3">
          <tr>
            <td>
              <div style="margin:0.5rem 0 1rem 0rem;">
                SWORN (OR AFFIRMED) BEFORE ME
              </div>
              <underline-form textwidth="10rem" beforetext="at" text=""/>
              <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">
                , British Columbia
              </div>

              <underline-form
                style="margin:0.75rem 0 ;"
                textwidth="18.5rem"
                beforetext="on"
                text=""
              />
              <div style="margin:0.5rem 0;"></div>
              <underline-form
                style="margin:.5rem 0 ;"
                textwidth="20rem"
                beforetext=""
                hint="A commissioner for taking affidavits for British Columbia"
                text=""
              />
            </td>
            <td>
              <div class="col-6 border-left">
                <underline-form
                  style="marginTop: 7.89rem"
                  textwidth="20rem"
                  beforetext=""
                  :hint="'Signature of ' + applicant.fullName"
                  hintFontSize="11pt"
                  :italicHint="false"
                  text=""
                />
              </div>
            </td>
          </tr>
        </table>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "@vue/composition-api";
import { getLastUpdated, getApplicants, getRecipients } from "@/state/survey-state";
import { FormP9Applicant, P1Panel } from "@/types/application";
import UnderlineForm from "@/components/pdf/components/UnderlineForm.vue";
import { format } from "date-fns";
import {
  applicantInfoPanel,
  notifyP1DeliveryInfoPanel,
  SurveyInstance,
  SurveyQuestionNames 
} from "@/types/survey-primary";
import { SurveyDataService } from "@/services/survey-data-service";
import {
  convertBlobAndDownload,
  formatDeceasedName,
  formatMailingAddress,
  formatMonthDayYear,
  formPdfHtml
} from "@/utils/utils";
import { getApplicationId, getLocations } from "@/state/application-state";

export default defineComponent({
  name: "FormP9",
  props: {
    survey: Object,
    lastUpdated: Date
  },
  components: {
    UnderlineForm
  },
  setup(props) {
    const survey = props.survey;
    const root = ref(null);
    let applicantList = ref([]);
    let deceased = ref("");

    watch(getLastUpdated, () => {
      populateFromSurvey(survey);
    });

    const populateFromFakeData = () => {
      const fakeRecipient: P1Panel = {
        recipientName: "Jane P. Doe",
        p1DelivererName: "John H. Doe",
        p1DeliveryMethod: "inperson",
        p1DeliveryDate: "January 11, 2021",
        p1DeliveryElectronicReceipt: "",
        p1DeliveryElectronicReceiptRetain: ""
      };

      applicantList.value = [
        {
          courthouse: "Victoria Courthouse",
          address: "123 Road St.",
          fullName: "John H. Doe",
          occupation: "Teacher",
          recipients: [fakeRecipient]
        }
      ];

      deceased.value = "Rest in peace";
    };

    const getSignatureMargin = () => {
      let margin = Number(10 / applicantList.value.length);
      if (margin < 1.0) margin = 1;
      return margin + "rem";
    };

    const onPrint = async () => {
      let innerHTML = "";
      root.value.forEach((r: HTMLElement) => (innerHTML += r.innerHTML));
      const html = formPdfHtml(
        innerHTML,
        `Generated by 'Represent Someone Who Died' On ${formatMonthDayYear(new Date())}`,
        ""
      );
      const jsonData = {
        applicantList: applicantList.value
      };
      const formName = "FormP9";
      try {
        const response = await SurveyDataService.getPdf(
          getApplicationId.value,
          formName,
          html,
          jsonData,
          "1.0"
        );
        convertBlobAndDownload(response.data, formName);
      } catch (err) {
        console.log(err);
      }
    };

    // TODO: make this more generic
    const getChoiceFromValue = (target, questions) => {
      for (const question of questions) {
        if (question.name === SurveyQuestionNames.notifyP1DelivererName) {
          const choices = question.choices;
          for (const choice of choices) {
            if (target === choice.value) {
              return choice.text;
            }
          }
        }
      }
    };

    const buildApplicantList = allQuestions => {
      let resultList = [];
      const applicants = getApplicants.value;
      const applicantQuestion = allQuestions.find(
        q => q.name === SurveyQuestionNames.applicantInfoPanel
      );
      
      const data = survey.data as SurveyInstance;

      for (const i in applicants) {
        let applicant: FormP9Applicant = {
          courthouse: 
            getLocations?.value?.find(l => l.id == data.applicantCourthouse)?.name?.replace("Law Courts", "")  ||
            data.applicantCourthouse ||
            "",
          address: "",
          fullName: applicants[i].applicantName,
          occupation: "",
          recipients: []
        };

        if (applicantQuestion) {
          const applicantPanel = applicantQuestion.value[i] as applicantInfoPanel;
          const address = applicantPanel?.applicantOrdinaryAddress;
          applicant.address = `${address?.city}, ${address?.country}`;
          applicant.occupation = applicantPanel.applicantOccupation || "";
        }

        resultList.push(applicant);
      }
      return resultList;
    };

    const buildRecipientList = allQuestions => {
      let resultList = [];
      const recipients = getRecipients.value;
      const recipientQuestion = allQuestions.find(
        q => q.name === SurveyQuestionNames.notifyP1DeliveryInfoPanel
      );

      for (const i in recipients) {
        let recipient: P1Panel = {
          recipientName: recipients[i].recipientName,
          p1DelivererName: "",
          p1DeliveryMethod: "",
          p1DeliveryDate: "",
          p1DeliveryElectronicReceipt: "",
          p1DeliveryElectronicReceiptRetain: ""
        };

        if (recipientQuestion && recipientQuestion.value) {
          const recipientPanel = recipientQuestion.value[i] as notifyP1DeliveryInfoPanel;

          recipient.p1DelivererName = getChoiceFromValue(
            recipientPanel.notifyP1DelivererName,
            recipientQuestion.panels[i].questions
          );
          recipient.p1DeliveryMethod = recipientPanel.notifyP1DeliveryMethod || "";
          recipient.p1DeliveryDate = recipientPanel.notifyP1DeliveryDate
            ? format(
                new Date(recipientPanel.notifyP1DeliveryDate.replace(/-/g, "\/")),
                "MMMM d, yyyy"
              )
            : "";
          recipient.p1DeliveryElectronicReceipt =
            recipientPanel.notifyP1DeliveryElectronicReceipt || "";
          recipient.p1DeliveryElectronicReceiptRetain = recipientPanel.notifyP1DeliveryElectronicReceiptRetain
            ? recipientPanel.notifyP1DeliveryElectronicReceiptRetain[0]
            : "";
        }

        resultList.push(recipient);
      }
      return resultList;
    };

    const getDeceasedName = allQuestions => {
      const deceasedQuestion = allQuestions.find(q => q.name === SurveyQuestionNames.deceasedName);
      if (deceasedQuestion) {
        return formatDeceasedName(deceasedQuestion.value);
      }
      return "";
    };

    const matchApplicantsAndRecipients = (applicants, recipients) => {
      for (const applicant of applicants) {
        for (const recipient of recipients) {
          if (applicant.fullName === recipient.p1DelivererName) {
            applicant.recipients.push(recipient);
          }
        }
      }
      return applicants;
    };

    const populateFromSurvey = survey => {
      const allQuestions = survey.getAllQuestions();
      const applicants = buildApplicantList(allQuestions);
      const recipients = buildRecipientList(allQuestions);
      deceased.value = getDeceasedName(allQuestions);
      applicantList.value = matchApplicantsAndRecipients(applicants, recipients);
    };

    const mailRecipients = applicant => {
      return applicant.recipients.filter(r => r?.p1DeliveryMethod === "mail");
    };

    const inPersonRecipients = applicant => {
      return applicant.recipients.filter(r => r?.p1DeliveryMethod === "inperson");
    };

    const electronicRecipients = applicant => {
      return applicant.recipients.filter(r => r?.p1DeliveryMethod === "electronic");
    };

    const allP1DeliveryElectronicReceipt = applicant => {
      const elecRecipients = electronicRecipients(applicant);
      const receipts = elecRecipients.filter(r => r?.p1DeliveryElectronicReceipt === "y");
      return elecRecipients.length === receipts.length;
    };

    const allP1DeliveryElectronicReceiptRetain = applicant => {
      const elecRecipients = electronicRecipients(applicant);
      const receipts = elecRecipients.filter(r => r?.p1DeliveryElectronicReceiptRetain === "confirmed");
      return elecRecipients.length === receipts.length;
    };

    onMounted(() => {
      if (survey) populateFromSurvey(survey);
      else populateFromFakeData();
    });

    return {
      mailRecipients,
      inPersonRecipients,
      electronicRecipients,
      allP1DeliveryElectronicReceipt,
      allP1DeliveryElectronicReceiptRetain,
      applicantList,
      deceased,
      getLastUpdated,
      getSignatureMargin,
      onPrint,
      root
    };
  }
});
</script>
<style lang="css" scoped>
.fullUnderline {
   margin: 0.5rem 0px 0.5rem 50px;
   border-bottom: 0.7px solid rgb(49, 49, 50);
}
</style>