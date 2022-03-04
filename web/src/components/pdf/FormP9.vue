<template>
  <div key="getLastUpdated">
    <div style="font-size:11pt;">
      <b-button style="transform:translate(500px,0px)" variant="success" @click="onPrint()">
        Print
      </b-button>
      <b-card
        v-for="(applicant, i) in applicantList"
        :key="i"
        id="print"
        style="border:1px solid; border-radius:5px;padding: 0.75in 0.75in 0.75in 0.75in"
        bg-variant="white"
        class="printcard mt-4 mb-3"
        ref="root"
      >
        <div style="text-align:center;"><b>FORM P9</b> (RULE 25-3 (2))</div>

        <div class="mt-3 m-0 p-0 row">
          <div style="margin-left: auto; text-align: right;!important">
            <div>
              This is the <b>1st</b> affidavit of <b>{{ applicant.fullName }}</b> in this case
            </div>
            <div class="mt-2">
              <underline-form textwidth="12rem" beforetext="and was made on" text="" />
            </div>
            <div class="mt-2">
              <b>{{ applicant.courthouse }}</b>
              <underline-form textwidth="12rem" beforetext="Registry No." text="" />
            </div>
          </div>
        </div>
        <br/>
        <div style="text-align:center;">
          In the Matter of the Estate of <b>{{ deceased }}</b>, deceased
        </div>
        <br/>
        <div style="text-align:center;">
          <b>AFFIDAVIT OF DELIVERY</b>
        </div>
        <br/>
        <div>
          I, <b>{{ applicant.fullName }}</b
          >, of <b>{{ applicant.address }}</b
          >, <b>{{ applicant.occupation }}</b
          >, AFFIRM/SWEAR THAT:
        </div>
        <br />
        <div>
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

          <div class="avoid-break" v-if="mailRecipients(applicant).length > 0">
            <div style="margin-left: 25px;">
              by mailing it to the following persons by ordinary mail:
            </div>
            <div :key="i" v-for="(recipient, i) of mailRecipients(applicant)">
              <div class="full-underline" :key="i">
                <b>{{ recipient.recipientName }}</b>
                <div :key="i" style="float: right">
                  on <b>{{ recipient.p1DeliveryDate }}</b>
                </div>
              </div>
            </div>
          </div>

          <div class="avoid-break" v-if="inPersonRecipients(applicant).length > 0">
            <div style="margin-left: 25px;">
              by handing it/them to and leaving it/them with the following persons:
            </div>
            <div :key="i" v-for="(recipient, i) of inPersonRecipients(applicant)">
              <div class="full-underline" :key="i">
                <b>{{ recipient.recipientName }}</b>
                <div :key="i" style="float: right">
                  on <b>{{ recipient.p1DeliveryDate }}</b>
                </div>
              </div>
            </div>
          </div>

          <div v-if="electronicRecipients(applicant).length > 0">
            <div style="margin-left: 25px;">
              by sending it/them to the following persons by e-mail, fax or other electronic means
              to that person:
            </div>
            <div :key="i" v-for="(recipient, i) of electronicRecipients(applicant)">
              <div class="full-underline" :key="i">
                <b>{{ recipient.recipientName }}</b>
                <div :key="i" style="float: right">
                  on <b>{{ recipient.p1DeliveryDate }}</b>
                </div>
              </div>
            </div>
            <div class="avoid-split">
              <ul style="margin-left:50px">
                <li v-if="allP1DeliveryElectronicReceipt(applicant)">
                  Each of the persons who received delivery by e-mail, fax or other electronic means
                  has, in writing, acknowledged receipt of the document(s) referred to in this
                  section.
                </li>

                <li
                  v-if="
                    electronicRecipients(applicant).length <= 1 &&
                      allP1DeliveryElectronicReceiptRetain(applicant)
                  "
                >
                  I will retain a copy of those acknowledgements until the personal representative of
                  the deceased is discharged and will produce those acknowledgements promptly after
                  being requested to do so by the registrar. after being requested to do so by the
                  registrar.
                </li>

                <li
                  v-if="
                    electronicRecipients(applicant).length > 1 &&
                      allP1DeliveryElectronicReceiptRetain(applicant)
                  "
                >
                  We will retain a copy of those acknowledgements until the personal representative of
                  the deceased is discharged and will produce those acknowledgements promptly after
                  being requested to do so by the registrar.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <br/>
        <div class="avoid-split">
          <table class="mt-3">
            <tr>
              <td>
                <div>
                  AFFIRMED/SWORN BEFORE ME
                </div>
                <underline-form textwidth="10rem" beforetext="at" text="" />
                <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">
                  , British Columbia
                </div>

                <underline-form
                  textwidth="17rem"
                  beforetext="on"
                  text=""
                />
                <underline-form
                  style="margin:.5rem 0 ;"
                  textwidth="18.5rem"
                  beforetext=""
                  hint="A commissioner for taking affidavits for British Columbia"
                  text=""
                />
              </td>
              <td>
                <div class="col-6 border-left">
                  <underline-form
                    style="marginTop: 4rem"
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
        </div>
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

      // testing what happens when we send two of these out.
      const html = formPdfHtml(
        innerHTML,
        `Generated by "Represent Someone Who Died" On ${formatMonthDayYear(new Date())}.`,
        "P9"
      );

      // dummy data using p9 for now
      // const htmlp1 = formPdfHtml(
      //   innerHTML,
      //   `Generated by "Represent Someone Who Died" On ${formatMonthDayYear(new Date())}.`,
      //   "P9 Exhibit A"
      // );

      // const html = htmlp9.concat(htmlp1);

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
          "1.0",
          "FormP1"
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
            getLocations?.value
              ?.find(l => l.id == data.applicantCourthouse)
              ?.name?.replace("Law Courts", "") ||
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
          applicant.address = `${address?.street}, ${address?.city}, ${address?.state}, ${address?.country}`;
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
      const receipts = elecRecipients.filter(
        r => r?.p1DeliveryElectronicReceiptRetain === "confirmed"
      );
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
<style lang="css" scoped src="@/styles/_pdf.css"></style>
