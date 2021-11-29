<template>
  <div key="getLastUpdated">
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
        <div style="text-align:center;margin:1rem 0 0 0rem;font-weight: 300;font-size:20px;">
          FORM P9 (RULE 25-3 (2))
        </div>

        <div class="mt-3 m-0 p-0 row">
          <div style="margin-left: 450px; text-align: right; font-size:10px !important">
            <div>
              <underline-form
                style="position: static !important"
                textwidth="8rem"
                beforetext="This is the"
                text="1st"
              />
              <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
                affidavit
              </div>
            </div>
            <div class="mt-2">
              <underline-form textwidth="14rem" beforetext="of" :text="applicant.fullName" />
              <br/>
              <div style="display:inline-block; margin:0 0 0 0rem; padding:0;">
                in this case and was made on
              </div>
            </div>
            <div class="mt-2">
              <underline-form textwidth="3rem" beforetext="" text="" />
            </div>
            <div class="mt-2">
              <underline-form
                textwidth="10rem"
                beforetext=""
                :text="applicant.courthouse"
              />
              <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
                Registry
              </div>
            </div>
            <div class="mt-2">
              <underline-form textwidth="10rem" beforetext="No." text="" />
            </div>
          </div>
        </div>

        <div style="text-align:center;margin:1rem 0 1rem 0rem;font-weight: 600;font-size:20px;">
          <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
        </div>
        <div style="text-align:center">
          <div style="display:inline-block;">
            <i>In the Matter of the Estate of</i>
          </div>
          <underline-form textwidth="17rem" beforetext="" :text="deceased" />
          <div style="display:inline-block; text-indent: 5px;">
            <i>, deceased</i>
          </div>
        </div>
        <div style="text-align:center;margin:1rem 0 1rem 0rem;font-weight: 600;font-size:18px;">
          AFFIDAVIT OF DELIVERY
        </div>

        <div style="display:inline-block; text-indent: 5px;">I</div>
        <div style="display:inline-block; margin:0.5rem 0;">
          <div style="display:inline-block; width:0.5rem;"></div>
          <underline-form textwidth="12rem" beforetext="" :text="applicant.fullName" />
          <underline-form textwidth="15rem" beforetext=", of" :text="applicant.address" />
          <underline-form textwidth="7rem" beforetext=", " :text="applicant.occupation" />
          <underline-form textwidth="0rem" beforetext=", " text="" />
        </div>
        <div style="margin:0.25rem 0 1rem 0rem;font-weight: 300;font-size:18px;">
          SWEAR (OR AFFIRM) THAT:
        </div>

        <ol style="margin:0rem 0 0 0rem;">
          <li class="mt-4 text-justify">
            <div style="display:inline;">
              Attached to this affidavit and marked as Exhibit A is a copy of a notice of proposed
              application in Form P1 (the "notice").
            </div>
          </li>

          <li
            v-if="
              mailRecipients(applicant).length > 0 ||
                electronicRecipients(applicant).length > 0 ||
                inPersonRecipients(applicant).length > 0
            "
            class="mt-4 text-justify "
          >
            <div>
              I delivered a copy of the notice to the following persons as follows:
            </div>

            <div v-if="mailRecipients(applicant).length > 0">
              <div style="text-indent: 20px;">
                by mailing it/them to the following persons by ordinary mail:
              </div>
              <template v-for="(recipient, i) of mailRecipients(applicant)">
                <div :key="i" style="display:inline-block; margin:0.5rem 0;">
                  <underline-form
                    :key="recipient.recipientName"
                    style="margin:0.5rem 0 ;display:inline-block; text-indent: 20px;"
                    textwidth="41.5rem"
                    beforetext=""
                    hint=""
                    :text="recipient.recipientName"
                  />
                  <underline-form
                    :key="recipient.p1DeliveryDate"
                    style="margin:0.5rem 0 ;display:inline-block;"
                    textwidth="15rem"
                    beforetext="on"
                    :text="recipient.p1DeliveryDate"
                  />
                </div>
              </template>
            </div>

            <div v-if="inPersonRecipients(applicant).length > 0">
              <div style="text-indent: 20px;">
                by handing it/them to and leaving it/them with the following persons:
              </div>
              <template v-for="(recipient, i) of inPersonRecipients(applicant)">
                <div :key="i" style="display:inline-block; margin:0.5rem 0;">
                  <underline-form
                    :key="recipient.recipientName"
                    style="margin:0.5rem 0 ;display:inline-block; text-indent: 20px;"
                    textwidth="20rem"
                    beforetext=""
                    hint=""
                    :text="recipient.recipientName"
                  />
                  <underline-form
                    :key="recipient.p1DeliveryDate"
                    style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
                    textwidth="15rem"
                    beforetext="on"
                    :text="recipient.p1DeliveryDate"
                  />
                </div>
              </template>
            </div>

            <div v-if="electronicRecipients(applicant).length > 0">
              <div>
                by sending it/them to the following persons by e-mail, fax or other electronic means
                to that person:
              </div>
              <template v-for="(recipient, i) of electronicRecipients(applicant)">
                <div :key="i" style="display:inline-block; margin:0.5rem 0;">
                  <underline-form
                    :key="recipient.recipientName"
                    style="margin:0.5rem 0 ;display:inline-block; text-indent: 20px;"
                    textwidth="20rem"
                    beforetext=""
                    hint=""
                    :text="recipient.recipientName"
                  />
                  <underline-form
                    :key="recipient.p1DeliveryDate"
                    style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
                    textwidth="15rem"
                    beforetext="on"
                    :text="recipient.p1DeliveryDate"
                  />
                </div>
              </template>

              <div v-if="allP1DeliveryElectronicReceipt(applicant)">
                Each of the persons who received delivery by e-mail, fax or other electronic means
                has, in writing, acknowledged receipt of the document(s) referred to in this
                section.
              </div>

              <div
                v-if="applicantList.length > 1 && allP1DeliveryElectronicReceiptRetain(applicant)"
              >
                We will retain a copy of those acknowledgements until the personal representative of
                the deceased is discharged and will produce those acknowledgements promptly after
                being requested to do so by the registrar.
              </div>

              <div
                v-else-if="allP1DeliveryElectronicReceiptRetain(applicant)"
              >
                I will retain a copy of those acknowledgements until the personal representative of
                the deceased is discharged and will produce those acknowledgements promptly after 
                being requested to do so by the registrar.
                after being requested to do so by the registrar.
              </div>
            </div>
          </li>
        </ol>

        <table class="mt-3">
          <tr>
            <td>
              <div style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;">
                SWORN (OR AFFIRMED) BEFORE ME
              </div>
              <underline-form textwidth="10rem" beforetext="at" text="" hint="Commissioner City" />
              <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">
                , British Columbia
              </div>

              <underline-form
                style="margin:0.75rem 0 ;"
                textwidth="18.5rem"
                beforetext="on"
                text=""
                hint="Swear/Affirm Date"
              />
              <underline-form
                style="margin:0.5rem 0 ;"
                textwidth="20rem"
                beforetext=""
                text=""
                hint="A commissioner for taking affidavits for British Columbia"
              />
              <div style="margin:0.5rem 0 ;font-size:14px; "></div>
              <underline-form
                style="margin:.5rem 0 ;"
                textwidth="20rem"
                beforetext=""
                hint="[print name or affix stamp of commissioner]"
                text=""
              />
            </td>
            <td>
              <div class="col-6 border-left">
                <underline-form
                  :style="{ marginTop: getSignatureMargin() }"
                  textwidth="20rem"
                  beforetext=""
                  :hint="'Signature of ' + applicant.fullName"
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
  formPdfHtml
} from "@/utils/utils";
import { getApplicationId } from "@/state/application-state";

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
      const html = formPdfHtml(innerHTML, "hey", "hey");
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
          courthouse: data.applicantCourthouse,
          address: "",
          fullName: applicants[i].applicantName,
          occupation: "",
          recipients: []
        };

        if (applicantQuestion) {
          const applicantPanel = applicantQuestion.value[i] as applicantInfoPanel;
          const base = applicantPanel?.applicantOrdinaryAddress;
          applicant.address = formatMailingAddress(base);
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

    onMounted(() => {
      if (survey) populateFromSurvey(survey);
      else populateFromFakeData();
    });

    return {
      applicantList,
      deceased,
      getLastUpdated,
      getSignatureMargin,
      onPrint,
      root
    };
  },
  methods: {
    mailRecipients(applicant): any[] {
      return applicant.recipients.filter(r => r?.p1DeliveryMethod === "mail");
    },
    inPersonRecipients(applicant): any[] {
      return applicant.recipients.filter(r => r?.p1DeliveryMethod === "inperson");
    },
    electronicRecipients(applicant): any[] {
      return applicant.recipients.filter(r => r?.p1DeliveryMethod === "electronic");
    },
    allP1DeliveryElectronicReceipt(applicant): boolean {
      return !applicant.recipients.some(r => r?.p1DeliveryElectronicReceipt !== "y");
    },
    allP1DeliveryElectronicReceiptRetain(applicant): boolean {
      return !applicant.recipients.some(r => r?.p1DeliveryElectronicReceiptRetain !== "confirmed");
    }
  }
});
</script>
<style scoped lang="css" src="@/styles/_pdf.css"></style>
