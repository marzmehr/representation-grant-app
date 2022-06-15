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
        <div>
            Dear Public Guardian and Trustee, Grant Application Review Services,
        </div>
        <br/>
        <div>
            I, <b class="black">{{ applicant.fullName }}</b> ({{ deceasedFullName }}'s {{ applicantRole }}), am 
            requesting you review my application for a Representation Grant for <b class="black">{{ deceasedFullName }}</b>, of 
            <b class="black">{{ deceased.address }}</b>, who died on <b class="black">{{ deceased.dateOfDeath }}</b>.
        </div>
        <br/>
        <div v-if="successorMinorList.length == 1">
          My application involves a minor:
        </div>
        <div v-else-if="successorMinorList.length > 1">
          My application involves minors:
        </div>
        <div v-for="(successor, i) in successorMinorList" :key="i + 100">
          <ul>
            <li v-if="successor.successorRole == 'citor'">
              Minor: <b class="black">{{ successor.successorName }}</b> ({{ successor.successorRole }})
            </li>
            <li v-else>
              Minor: <b class="black">{{ successor.successorName }}</b> ({{ deceasedFullName }}'s {{ successor.successorRole }})
            </li>
            <ul>
              <li style="margin-left: -20px;">
                Date of Birth: <b class="black">{{ successor.successorDateOfBirth }}</b>
              </li>
              <li style="margin-left: -20px;">
                Residential Address: <b class="black">{{ successor.successorResidentialAddress }}</b>
              </li>
              <li style="margin-left: -20px;">
                Postal Address: <b class="black">{{ successor.successorMailingAddress }}</b>
              </li>
              <li style="margin-left: -20px;">
                Email: <b class="black">{{ successor.successorEmailAddress }}</b>
              </li>
              <li style="margin-left: -20px;">
                Fax: <b class="black">{{ successor.successorFaxNumber }}</b>
              </li>
              <li style="margin-left: -20px;">
                Guardian: <b class="black">{{ successor.successorGuardianName }}</b>
              </li>
              <ul v-if="successor.successorGuardianName !== 'none'" style="list-style-type: circle;">
                <li style="margin-left: -40px;">
                  Residential Address: <b class="black">{{ successor.successorGuardianResidentialAddress }}</b>
                </li>
                <li style="margin-left: -40px;">
                  Postal Address: <b class="black">{{ successor.successorGuardianMailingAddress }}</b>
                </li>
                <li style="margin-left: -40px;">
                  Email: <b class="black">{{ successor.successorGuardianEmailAddress }}</b>
                </li>
                <li style="margin-left: -40px;">
                  Fax: <b class="black">{{ successor.successorGuardianFaxNumber }}</b>
                </li>
              </ul>
            </ul>
          </ul>
        </div>

        <div v-if="successorIncompetentList.length == 1">
          My application involves an incapable adult:
        </div>
        <div v-else-if="successorIncompetentList.length > 1">
          My application involves incapable adults:
        </div>
        <div v-for="(successor, i) in successorIncompetentList" :key="i + 200">
          <ul>
            <li v-if="successor.successorRole == 'citor'">
              Incapable Adult: <b class="black">{{ successor.successorName }}</b> ({{ successor.successorRole }})
            </li>
            <li v-else>
              Incapable Adult: <b class="black">{{ successor.successorName }}</b> ({{ deceasedFullName }}'s {{ successor.successorRole }})
            </li>
            <ul>
              <li style="margin-left: -20px;">
                Date of Birth: <b class="black">{{ successor.successorDateOfBirth }}</b>
              </li>
              <li style="margin-left: -20px;">
                Residential Address: <b class="black">{{ successor.successorResidentialAddress }}</b>
              </li>
              <li style="margin-left: -20px;">
                Postal Address: <b class="black">{{ successor.successorMailingAddress }}</b>
              </li>
              <li style="margin-left: -20px;">
                Email: <b class="black">{{ successor.successorEmailAddress }}</b>
              </li>
              <li style="margin-left: -20px;">
                Fax: <b class="black">{{ successor.successorFaxNumber }}</b>
              </li>
              <li style="margin-left: -20px;">
                Nominee: <b class="black">{{ successor.successorNomineeName }}</b>
              </li>
              <ul v-if="successor.successorNomineeName !== 'none'" style="list-style-type: circle;">
                <li style="margin-left: -40px;">
                  Residential Address: <b class="black">{{ successor.successorNomineeResidentialAddress }}</b>
                </li>
                <li style="margin-left: -40px;">
                  Postal Address: <b class="black">{{ successor.successorNomineeMailingAddress }}</b>
                </li>
                <li style="margin-left: -40px;">
                  Email: <b class="black">{{ successor.successorNomineeEmailAddress }}</b>
                </li>
                <li style="margin-left: -40px;">
                  Fax: <b class="black">{{ successor.successorNomineeFaxNumber }}</b>
                </li>
              </ul>
            </ul>
          </ul>
        </div>

        <div>
          I can be contacted at the following:
          <ul>
            <li style="margin-left: -20px;">
               <b class="black">{{ serviceContact.address }}</b>
            </li>
            <li style="margin-left: -20px;">
               <b class="black">{{ serviceContact.phone }}</b>
            </li>
            <li style="margin-left: -20px;">
               <b class="black">{{ serviceContact.email }}</b>
            </li>
          </ul>
        </div>
        <div>
          Sincerely,
          <br />
          <u>Signed Electronically by {{ applicant.fullName }}</u>
          <br />
          {{ applicant.fullName }}
        </div>
      </b-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "@vue/composition-api";
import { getApplicants, getLastUpdated, getFormData } from "@/state/survey-state";
import UnderlineForm from "@/components/pdf/components/UnderlineForm.vue";
import { FormP1Applicant, FormP1Deceased, PGTLetterSuccessor, FormP1ServiceContact } from "@/types/application";
import { applicantInfoPanel, spouseInfoPanel, childInfoPanel, creditorPersonInfoPanel, applicantCitorInfoPanel, SurveyInstance, SurveyQuestionNames } from "@/types/survey-primary";
import { formatAddressWithPostalCode, formatMonthDayYear, formPdfHtml, convertBlobAndDownload, formatCityCountry, dateFormatter } from "@/utils/utils";
import { getApplicationId } from "@/state/application-state";
import { SurveyDataService } from "@/services/survey-data-service";

export default defineComponent({
  name: "PGTLetter",
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
    let applicantList = ref<FormP1Applicant[]>([]);
    let applicantRole = ref();
    let successorMinorList = ref<PGTLetterSuccessor[]>([]);
    let successorIncompetentList = ref<PGTLetterSuccessor[]>([]);
    let deceased = ref<FormP1Deceased>({} as FormP1Deceased);
    let serviceContact = ref<FormP1ServiceContact>({} as FormP1ServiceContact);
    let deceasedFullName = ref<String>("");

    watch(getLastUpdated, () => {
      loadSurveyData(survey);
    });

    onMounted(() => {
      if (survey) loadSurveyData(survey);
    });

    const processSuccessor = successorLists => {
      let successors = [];
      for (const successorList of successorLists) {
        for (const successor of successorList) {
          if (successor) {
            successors.push(successor);
          }
        }
      }
      return successors;
    };

    const loadSurveyData = survey => {
      const data = survey.data as SurveyInstance;
      //TODO - Fix this after, so it generates the complex model so we can reference by . and not by ['']
      const applicantPanel = data[SurveyQuestionNames.applicantInfoPanel] || [];
      applicantList.value = applicantPanel.map((a: applicantInfoPanel) => {
        return {
          fullName: (a as any).applicantName || "", //Brought over via survey-on-value-change (from javascript)
          address:
            a.applicantOrdinaryAddressReceiveMail == "y"
              ? formatAddressWithPostalCode(a.applicantOrdinaryAddress)
              : formatAddressWithPostalCode(a.applicantMailingAddress),
          individual: true, // applicantNewPartOfOrg not used.
          lawyer: data.applicantHasLawyer ? data.applicantLawyerName || "" : "",
          differentMail: a.applicantOrdinaryAddressReceiveMail === "n",
          differentAddress:
            a.applicantOrdinaryAddressReceiveMail === "n"
              ? formatCityCountry(a.applicantMailingAddress) || ""
              : ""
        } as FormP1Applicant;
      });

      // TODO: Better solution when we have multiple applicants
      applicantRole.value = getApplicants.value
        .filter(a => a.applicantName == applicantList.value[0].fullName)
        .map(a => a.applicantRole)[0]
        .split(/(?=[A-Z])/)
        .map(element => element.toLowerCase())
        .join(" ");

      serviceContact.value = {
        address: formatAddressWithPostalCode(data.applicantServiceAddress) || "",
        phone: data.applicantServicePhone || "",
        email: data.applicantServiceEmail || ""
      };

      deceased.value = {
        ...data.deceasedName,
        address: formatAddressWithPostalCode(data.deceasedAddress) || "",
        dateOfDeath: data.deceasedDateOfDeath ? dateFormatter(data.deceasedDateOfDeath) : ""
      };

      let names = [deceased.value.first, deceased.value.middle, deceased.value.last];
      names = names.filter(n => n && n.length !== 0);
      deceasedFullName.value = names.join(" ");
      
      const spousePanel = data[SurveyQuestionNames.spouseInfoPanel] || [];
      
      const spouseSuccessorsMinor = spousePanel.map((s: spouseInfoPanel) => {
        if (s.spouseIsAlive == "y" && s.spouseIsAdult == "n") {
          return {
            successorName: (s as any).spouseName || "",
            successorRole: "spouse",
            successorDateOfBirth: dateFormatter(s.spouseIsAdultNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(s.spouseIsAdultNoResidentialAddress),

            successorMailingAddress: s.spouseIsAdultNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(s.spouseIsAdultNoResidentialAddress)
              : s.spouseIsAdultNoResidentialReceiveMail == "n" && s.spouseIsAdultNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(s.spouseIsAdultNoMailingAddress)
                : "none",
            
            successorEmailAddress: s.spouseIsAdultNoEmail == "y" ? s.spouseIsAdultNoEmailAddress : "none",
            successorFaxNumber: s.spouseIsAdultNoFax == "y" ? s.spouseIsAdultNoFaxNumber : "none",
            successorGuardianName: s.spouseHasGuardian == "y" ? s.spouseGuardianName : "none",
            successorGuardianResidentialAddress: formatAddressWithPostalCode(s.spouseGuardianResidentialAddress),

            successorGuardianMailingAddress: s.spouseGuardianResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(s.spouseGuardianResidentialAddress)
              : s.spouseGuardianResidentialReceiveMail == "n" && s.spouseGuardianHasMailingAddress == "y"
                ? formatAddressWithPostalCode(s.spouseGuardianMailingAddress)
                : "none",

            successorGuardianEmailAddress: s.spouseGuardianEmail == "y" ? s.spouseGuardianEmailAddress : "none",
            successorGuardianFaxNumber: s.spouseGuardianFax == "y" ? s.spouseGuardianFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      const spouseSuccessorIncompetent = spousePanel.map((s: spouseInfoPanel) => {
        if (s.spouseIsAlive == "y" && s.spouseIsAdult == "y" && s.spouseIsCompetent == "n") {
          return {
            successorName: (s as any).spouseName || "",
            successorRole: "spouse",
            successorDateOfBirth: dateFormatter(s.spouseIsCompetentNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(s.spouseIsCompetentNoResidentialAddress),

            successorMailingAddress: s.spouseIsCompetentNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(s.spouseIsCompetentNoResidentialAddress)
              : s.spouseIsCompetentNoResidentialReceiveMail == "n" && s.spouseIsCompetentNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(s.spouseIsCompetentNoMailingAddress)
                : "none",

            successorEmailAddress: s.spouseIsCompetentNoEmail == "y" ? s.spouseIsCompetentNoEmailAddress : "none",
            successorFaxNumber: s.spouseIsCompetentNoFax == "y" ? s.spouseIsCompetentNoFaxNumber : "none",
            successorNomineeName: s.spouseHasNominee == "y" && s.spouseNomineeFormal == "y"
              ? `${s.spouseNomineeName} (formally appointed)`
              : s.spouseHasNominee == "y" && s.spouseNomineeFormal == "n"
                ? `${s.spouseNomineeName} (not formally appointed)`
                : "none",
            successorNomineeResidentialAddress: formatAddressWithPostalCode(s.spouseNomineeResidentialAddress),

            successorNomineeMailingAddress: s.spouseNomineeResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(s.spouseNomineeResidentialAddress)
              : s.spouseNomineeResidentialReceiveMail == "n" && s.spouseNomineeHasMailingAddress == "y"
                ? formatAddressWithPostalCode(s.spouseNomineeMailingAddress)
                : "none",

            successorNomineeEmailAddress: s.spouseNomineeEmail == "y" ? s.spouseNomineeEmailAddress : "none",
            successorNomineeFaxNumber: s.spouseNomineeFax == "y" ? s.spouseNomineeFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      const childPanel = data[SurveyQuestionNames.childInfoPanel] || [];
      const childSuccessorsMinor = childPanel.map((c: childInfoPanel) => {
        if (c.childIsAlive == "y" && c.childIsAdult == "n") {
          return {
            successorName: (c as any).childName || "",
            successorRole: "child",
            successorDateOfBirth: dateFormatter(c.childIsAdultNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(c.childIsAdultNoResidentialAddress),

            successorMailingAddress: c.childIsAdultNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.childIsAdultNoResidentialAddress)
              : c.childIsAdultNoResidentialReceiveMail == "n" && c.childIsAdultNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.childIsAdultNoMailingAddress)
                : "none",

            successorEmailAddress: c.childIsAdultNoEmail == "y" ? c.childIsAdultNoEmailAddress : "none",
            successorFaxNumber: c.childIsAdultNoFax == "y" ? c.childIsAdultNoFaxNumber : "none",
            successorGuardianName: c.childHasGuardian == "y" ? c.childGuardianName : "none",
            successorGuardianResidentialAddress: formatAddressWithPostalCode(c.childGuardianResidentialAddress),

            successorGuardianMailingAddress: c.childGuardianResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.childGuardianResidentialAddress)
              : c.childGuardianResidentialReceiveMail == "n" && c.childGuardianHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.childGuardianMailingAddress)
                : "none",

            successorGuardianEmailAddress: c.childGuardianEmail == "y" ? c.childGuardianEmailAddress : "none",
            successorGuardianFaxNumber: c.childGuardianFax == "y" ? c.childGuardianFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      const childSuccessorsIncompetent = childPanel.map((c: childInfoPanel) => {
        if (c.childIsAlive == "y" && c.childIsAdult == "y" && c.childIsCompetent == "n") {
          return {
            successorName: (c as any).childName || "",
            successorRole: "child",
            successorDateOfBirth: dateFormatter(c.childIsCompetentNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(c.childIsCompetentNoResidentialAddress),

            successorMailingAddress: c.childIsCompetentNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.childIsCompetentNoResidentialAddress)
              : c.childIsCompetentNoResidentialReceiveMail == "n" && c.childIsCompetentNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.childIsCompetentNoMailingAddress)
                : "none",

            successorEmailAddress: c.childIsCompetentNoEmail == "y" ? c.childIsCompetentNoEmailAddress : "none",
            successorFaxNumber: c.childIsCompetentNoFax == "y" ? c.childIsCompetentNoFaxNumber : "none",
            successorNomineeName: c.childHasNominee == "y" && c.childNomineeFormal == "y"
              ? `${c.childNomineeName} (formally appointed)`
              : c.childHasNominee == "y" && c.childNomineeFormal == "n"
                ? `${c.childNomineeName} (not formally appointed)`
                : "none",
            successorNomineeResidentialAddress: formatAddressWithPostalCode(c.childNomineeResidentialAddress),

            successorNomineeMailingAddress: c.childNomineeResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.childNomineeResidentialAddress)
              : c.childNomineeResidentialReceiveMail == "n" && c.childNomineeHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.childNomineeMailingAddress)
                : "none",

            successorNomineeEmailAddress: c.childNomineeEmail == "y" ? c.childNomineeEmailAddress : "none",
            successorNomineeFaxNumber: c.childNomineeFax == "y" ? c.childNomineeFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      const creditorPersonPanel = data[SurveyQuestionNames.creditorPersonInfoPanel] || [];
      const creditorPersonSuccessorsMinor = creditorPersonPanel.map((c: creditorPersonInfoPanel) => {
        if (c.creditorPersonIsAlive == "y" && c.creditorPersonIsAdult == "n") {
          return {
            successorName: (c as any).creditorPersonName || "",
            successorRole: "creditor",
            successorDateOfBirth: dateFormatter(c.creditorPersonIsAdultNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(c.creditorPersonIsAdultNoResidentialAddress),

            successorMailingAddress: c.creditorPersonIsAdultNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.creditorPersonIsAdultNoResidentialAddress)
              : c.creditorPersonIsAdultNoResidentialReceiveMail == "n" && c.creditorPersonIsAdultNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.creditorPersonIsAdultNoMailingAddress)
                : "none",

            successorEmailAddress: c.creditorPersonIsAdultNoEmail == "y" ? c.creditorPersonIsAdultNoEmailAddress : "none",
            successorFaxNumber: c.creditorPersonIsAdultNoFax == "y" ? c.creditorPersonIsAdultNoFaxNumber : "none",
            successorGuardianName: c.creditorPersonHasGuardian == "y" ? c.creditorPersonGuardianName : "none",
            successorGuardianResidentialAddress: formatAddressWithPostalCode(c.creditorPersonGuardianResidentialAddress),

            successorGuardianMailingAddress: c.creditorPersonGuardianResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.creditorPersonGuardianResidentialAddress)
              : c.creditorPersonGuardianResidentialReceiveMail == "n" && c.creditorPersonGuardianHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.creditorPersonGuardianMailingAddress)
                : "none",

            successorGuardianEmailAddress: c.creditorPersonGuardianEmail == "y" ? c.creditorPersonGuardianEmailAddress : "none",
            successorGuardianFaxNumber: c.creditorPersonGuardianFax == "y" ? c.creditorPersonGuardianFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      const creditorPersonSuccessorsIncompetent = creditorPersonPanel.map((c: creditorPersonInfoPanel) => {
        if (c.creditorPersonIsAlive == "y" && c.creditorPersonIsAdult == "y" && c.creditorPersonIsCompetent == "n") {
          return {
            successorName: (c as any).creditorPersonName || "",
            successorRole: "creditor",
            successorDateOfBirth: dateFormatter(c.creditorPersonIsCompetentNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(c.creditorPersonIsCompetentNoResidentialAddress),

            successorMailingAddress: c.creditorPersonIsCompetentNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.creditorPersonIsCompetentNoResidentialAddress)
              : c.creditorPersonIsCompetentNoResidentialReceiveMail == "n" && c.creditorPersonIsCompetentNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.creditorPersonIsCompetentNoMailingAddress)
                : "none",

            successorEmailAddress: c.creditorPersonIsCompetentNoEmail == "y" ? c.creditorPersonIsCompetentNoEmailAddress : "none",
            successorFaxNumber: c.creditorPersonIsCompetentNoFax == "y" ? c.creditorPersonIsCompetentNoFaxNumber : "none",
            successorNomineeName: c.creditorPersonHasNominee == "y" && c.creditorPersonNomineeFormal == "y"
              ? `${c.creditorPersonNomineeName} (formally appointed)`
              : c.creditorPersonHasNominee == "y" && c.creditorPersonNomineeFormal == "n"
                ? `${c.creditorPersonNomineeName} (not formally appointed)`
                : "none",
            successorNomineeResidentialAddress: formatAddressWithPostalCode(c.creditorPersonNomineeResidentialAddress),

            successorNomineeMailingAddress: c.creditorPersonNomineeResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.creditorPersonNomineeResidentialAddress)
              : c.creditorPersonNomineeResidentialReceiveMail == "n" && c.creditorPersonNomineeHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.creditorPersonNomineeMailingAddress)
                : "none",

            successorNomineeEmailAddress: c.creditorPersonNomineeEmail == "y" ? c.creditorPersonNomineeEmailAddress : "none",
            successorNomineeFaxNumber: c.creditorPersonNomineeFax == "y" ? c.creditorPersonNomineeFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      const applicantCitorPanel = data[SurveyQuestionNames.applicantCitorInfoPanel] || [];
      const applicantCitorSuccessorsMinor = applicantCitorPanel.map((c: applicantCitorInfoPanel) => {
        if (c.applicantCitorIsAlive == "y" && c.applicantCitorIsAdult == "n") {
          return {
            successorName: (c as any).applicantCitorName || "",
            successorRole: "citor",
            successorDateOfBirth: dateFormatter(c.applicantCitorIsAdultNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(c.applicantCitorIsAdultNoResidentialAddress),

            successorMailingAddress: c.applicantCitorIsAdultNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.applicantCitorIsAdultNoResidentialAddress)
              : c.applicantCitorIsAdultNoResidentialReceiveMail == "n" && c.applicantCitorIsAdultNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.applicantCitorIsAdultNoMailingAddress)
                : "none",

            successorEmailAddress: c.applicantCitorIsAdultNoEmail == "y" ? c.applicantCitorIsAdultNoEmailAddress : "none",
            successorFaxNumber: c.applicantCitorIsAdultNoFax == "y" ? c.applicantCitorIsAdultNoFaxNumber : "none",
            successorGuardianName: c.applicantCitorHasGuardian == "y" ? c.applicantCitorGuardianName : "none",
            successorGuardianResidentialAddress: formatAddressWithPostalCode(c.applicantCitorGuardianResidentialAddress),

            successorGuardianMailingAddress: c.applicantCitorGuardianResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.applicantCitorGuardianResidentialAddress)
              : c.applicantCitorGuardianResidentialReceiveMail == "n" && c.applicantCitorGuardianHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.applicantCitorGuardianMailingAddress)
                : "none",

            successorGuardianEmailAddress: c.applicantCitorGuardianEmail == "y" ? c.applicantCitorGuardianEmailAddress : "none",
            successorGuardianFaxNumber: c.applicantCitorGuardianFax == "y" ? c.applicantCitorGuardianFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      const applicantCitorSuccessorsIncompetent = applicantCitorPanel.map((c: applicantCitorInfoPanel) => {
        if (c.applicantCitorIsAlive == "y" && c.applicantCitorIsAdult == "y" && c.applicantCitorIsCompetent == "n") {
          return {
            successorName: (c as any).applicantCitorName || "",
            successorRole: "citor",
            successorDateOfBirth: dateFormatter(c.applicantCitorIsCompetentNoDOB),
            successorResidentialAddress: formatAddressWithPostalCode(c.applicantCitorIsCompetentNoResidentialAddress),

            successorMailingAddress: c.applicantCitorIsCompetentNoResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.applicantCitorIsCompetentNoResidentialAddress)
              : c.applicantCitorIsCompetentNoResidentialReceiveMail == "n" && c.applicantCitorIsCompetentNoHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.applicantCitorIsCompetentNoMailingAddress)
                : "none",

            successorEmailAddress: c.applicantCitorIsCompetentNoEmail == "y" ? c.applicantCitorIsCompetentNoEmailAddress : "none",
            successorFaxNumber: c.applicantCitorIsCompetentNoFax == "y" ? c.applicantCitorIsCompetentNoFaxNumber : "none",
            successorNomineeName: c.applicantCitorHasNominee == "y" && c.applicantCitorNomineeFormal == "y"
              ? `${c.applicantCitorNomineeName} (formally appointed)`
              : c.applicantCitorHasNominee == "y" && c.applicantCitorNomineeFormal == "n"
                ? `${c.applicantCitorNomineeName} (not formally appointed)`
                : "none",
            successorNomineeResidentialAddress: formatAddressWithPostalCode(c.applicantCitorNomineeResidentialAddress),

            successorNomineeMailingAddress: c.applicantCitorNomineeResidentialReceiveMail == "y"
              ? formatAddressWithPostalCode(c.applicantCitorNomineeResidentialAddress)
              : c.applicantCitorNomineeResidentialReceiveMail == "n" && c.applicantCitorNomineeHasMailingAddress == "y"
                ? formatAddressWithPostalCode(c.applicantCitorNomineeMailingAddress)
                : "none",

            successorNomineeEmailAddress: c.applicantCitorNomineeEmail == "y" ? c.applicantCitorNomineeEmailAddress : "none",
            successorNomineeFaxNumber: c.applicantCitorNomineeFax == "y" ? c.applicantCitorNomineeFaxNumber : "none"
          } as PGTLetterSuccessor;
        }
      });

      successorMinorList.value = processSuccessor([
        spouseSuccessorsMinor,
        childSuccessorsMinor,
        creditorPersonSuccessorsMinor,
        applicantCitorSuccessorsMinor
      ]);
      successorIncompetentList.value = processSuccessor([
        spouseSuccessorIncompetent,
        childSuccessorsIncompetent,
        creditorPersonSuccessorsIncompetent,
        applicantCitorSuccessorsIncompetent
        ]);
    };

    const onPrint = async () => {
      const formName = "PGTLetter";
      let innerHTML = "";
      root.value.forEach((r: HTMLElement) => (innerHTML += r.innerHTML));

      const html = formPdfHtml(
        innerHTML,
        `Generated by "Represent Someone Who Died" on ${formatMonthDayYear(new Date())}.`,
        "PGT Letter",
        "Letter to the Public Guardian & Trustee (PGT) of British Columbia",
        "pgt"
      );

      const jsonData = {
        applicantList: applicantList.value,
        deceased: deceased.value
      };

      const p1HtmlData = formPdfHtml(
        getFormData.value.html,
        `Generated by "Represent Someone Who Died" on ${formatMonthDayYear(new Date())}.`,
        "P1",
        ""
      );

      try {
        const response = await SurveyDataService.getPdf(
          getApplicationId.value,
          formName,
          html,
          jsonData,
          "1.0",
          p1HtmlData
        );
        convertBlobAndDownload(response.data, formName);
      } catch (err) {
        console.log(err);
      }
    };

    return {
      getLastUpdated,
      root,
      applicantList,
      applicantRole,
      deceased,
      deceasedFullName,
      successorMinorList,
      successorIncompetentList,
      serviceContact,
      onPrint
    };
  }
});
</script>
<style lang="css" scoped src="@/styles/_pdf.css"></style>
