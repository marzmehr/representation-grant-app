<template>
  <div key="getLastUpdated" style="font-size: 11pt;">
    <b-button style="transform:translate(500px,0px)" variant="success" @click="onPrint()">
      Print
    </b-button>
    <b-card
      id="print"
      style="border:1px solid; border-radius:5px;padding: 0.75in 0.75in 0.75in 0.75in"
      bg-variant="white"
      class="printcard mt-4 mb-3"
      ref="root"
    >
      <div style="text-align:center;">
        <div><b class="black">FORM P1</b> (RULE 25-2 (3))</div>
        <br/>
        <div>
          <b class="black">NOTICE OF PROPOSED APPLICATION IN RELATION TO ESTATE</b>
        </div>
      </div>
      <br/>
      <div>
        <b>TAKE NOTICE THAT:</b>
      </div>
      <br/>
      <div>
        {{ takeNoticeStart() }} <b class="black">{{ takeNoticeApplicants() }}</b> {{ takeNoticeEnd() }} to apply, in the <b class="black">{{ serviceContact.courtLocation }}</b> court
        registry, for a <b class="black">Grant of Administration Without Will Annexed</b> in relation to the
        estate of the deceased described below who died on <b class="black">{{ deceased.dateOfDeath }}</b>.
      </div>
      <br/>
      <div>
        Full legal name of deceased:
        <div>
          <b class="black">{{ formatDeceasedName(deceased) }}</b>
        </div>
      </div>
      <br/>
      <div>
        Last residential address of the deceased:
        <div>
          <b class="black">{{ deceased.address }}</b>
        </div>
      </div>
      <br/>
      <div>
        <b class="black">This application does not relate to a will or a foreign grant.</b>
      </div>
      <br/>
      <br/>
      <div>
        <b>AND TAKE NOTICE THAT:</b> 
      </div>
      <br/>
      <ol class="reset-counter">
        <li class="bracket-number">
          Before obtaining the foregoing grant, the applicant may be granted an authorization to 
          obtain estate information in relation to that grant for the purposes of obtaining 
          financial information in relation to the grant.
        </li>
        <br/>
        <li class="bracket-number">
          You have a right to oppose, by filing a notice of dispute in accordance with Rule 25-10 
          (1), the granting of either or both of an authorization to obtain estate information and 
          the estate grant.
        </li>
        <br/>
        <li class="bracket-number">
          You may or may not be entitled to claim against the estate for relief, including a claim 
          under
          <ol class="reset-counter-alpha">
            <li class="double-bracket-alpha">the <i>Family Law Act</i>, or</li>
            <li class="double-bracket-alpha">
              Division 6 of Part 4 of the <i>Wills, Estates and Succession Act</i>.
            </li>
          </ol>
        </li>
        <br/>
        <li class="bracket-number">
          If you choose to take a step referred to in paragraph (2) or (3), you must do so within 
          the time limited by any relevant rule of court or other enactment.
        </li>
        <br/>
        <li class="bracket-number">
          You may consult with your own lawyer concerning your interest in, or rights against, the 
          estate.
        </li>
        <br/>
        <li class="bracket-number">
          After the applicant has filed a submission for estate grant, you may apply for an order 
          requiring the applicant to provide security unless the applicant is the Public Guardian 
          and Trustee. Filing a notice of dispute will prevent a grant from being issued before you 
          are able to apply for the order requiring security.
        </li>
        <br/>
        <li class="bracket-number">
          An authorization to obtain estate information or a grant may issue to the applicant on 
          any date that is at <i><u>least 21 days</u></i> after the date on which this notice is 
          delivered to you or on any earlier date ordered by the court.
        </li>
        <br/>
        <li class="bracket-number">
          If an authorization to obtain estate information issues to the applicant, the applicant 
          may apply for a grant without further notice.
        </li>
        <br/>
        <li class="bracket-number">
          If a grant issues to the applicant, the applicant must provide, to intestate successors of 
          the deceased, an accounting as to how the estate was administered and how the estate assets 
          were distributed.
        </li>
      </ol>
      <br/>

      <div class="avoid-break">
        <div>
          <b>INFORMATION ABOUT EACH APPLICANT</b>
        </div>
        <br/>
        <div v-for="(name, i) in applicantList" :key="i + 100">
          <div>
            Name: <b class="black">{{ name.fullName }}</b>
          </div>
          <div>
            Mailing address: <b class="black">{{ name.address }}</b>
          </div>
          <div v-if="name.individual && !name.differentAddress">
            This applicant is an individual and ordinarily lives at the mailing address noted above.
          </div>
          <div v-if="name.differentAddress">
            This applicant is an individual and ordinarily lives in <b class="black">{{ name.differentAddress }}</b
            >.
          </div>
        </div>
      </div>
      <br/>
      <div class="avoid-break">
        <div>
          <b>INFORMATION FOR SERVICE</b>
        </div>
        <br/>
        <div>
          Street address: <b class="black">{{ serviceContact.address }}</b>
        </div>
        <div>
          Telephone number: <b class="black">{{ serviceContact.phone }}</b>
        </div>
        <div>
          E-mail address: <b class="black">{{ serviceContact.email }}</b>
        </div>
        <div v-if="serviceContact.fax">
          Fax number: <b class="black">{{ serviceContact.fax }}</b>
        </div>
        <br/>
        <br/>
        <div class="row" style="margin-left: 0;" v-for="(name, i) in applicantList" :key="i">
          <div class="col-*">
            Date:
            <u
              ><b class="black">{{ formatMonthDayYear(new Date()) }}</b></u
            >
          </div>
          <div class="col-1"></div>
          <div class="col-*">
            <u><b class="black">Signed Electronically by {{ name.fullName }}</b></u>
            <div>Signature of {{ name.fullName }}</div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "@vue/composition-api";
import UnderlineForm from "@/components/pdf/components/UnderlineForm.vue";
import CheckBox from "@/components/pdf/components/CheckBox.vue";
import { getLastUpdated, getApplicants, getFormData, setFormData } from "@/state/survey-state";
import { SurveyDataService } from "@/services/survey-data-service";
import { applicantInfoPanel, SurveyInstance, SurveyQuestionNames } from "@/types/survey-primary";
import { FormP1Applicant, FormP1Deceased, FormP1ServiceContact } from "@/types/application";
import {
  formatMailingAddress,
  formatP1Address,
  formatDeceasedName,
  formatMonthDayYear,
  formPdfHtml,
  convertBlobAndDownload
} from "@/utils/utils";
import { getApplicationId, getLocations } from "@/state/application-state";

export default defineComponent({
  name: "FormP1",
  props: {
    survey: Object,
    lastUpdated: Date
  },
  components: {
    UnderlineForm,
    CheckBox
  },
  setup(props) {
    const survey = props.survey;
    const root = ref(null);
    let applicantList = ref<FormP1Applicant[]>([]);
    let deceased = ref<FormP1Deceased>({} as FormP1Deceased);
    let serviceContact = ref<FormP1ServiceContact>({} as FormP1ServiceContact);

    watch(getLastUpdated, () => {
      loadSurveyData(survey);

      // save to state to append to P9 later
      let entry: FormData = {
        form: "FormP1",
        html: root.value.innerHTML
      } as FormData;
      setFormData(entry);
    });

    const loadTestData = () => {
      applicantList.value = [
        {
          fullName: "Its first Son",
          first: "Its",
          middle: "first",
          last: "Son",
          address: "0-123 st, Victoria, BC, Canada V0i 8i8",
          individual: true,
          sameMail: false,
          lawyer: "hey",
          differentMail: true,
          differentAddress: "New York, USA"
        },
        {
          fullName: "Its first Daughter",
          first: "Its",
          middle: "first",
          last: "Daughter",
          address: "1-123 st, Victoria, BC, Canada V0i 8i8",
          individual: false,
          sameMail: true,
          lawyer: "",
          differentMail: false,
          differentAddress: ""
        }
      ];
      deceased.value = {
        first: "Rest",
        middle: "In",
        last: "Peace",
        address: "0-123 st, Victoria, BC, Canada V0i 8i8",
        dateOfDeath: "2021-01-01"
      };
      serviceContact.value = {
        address: "0-123 st, Victoria, BC, Canada V0i 8i8",
        phone: "+1 123 456 7890",
        fax: "+1 123 456 7890",
        email: "ABC@yahoo.ca",
        courtLocation: "Victoria"
      };
    };

    const loadSurveyData = survey => {
      const data = survey.data as SurveyInstance;
      //TODO - Fix this after, so it generates the complex model so we can reference by . and not by ['']
      const applicantPanel = survey.data[SurveyQuestionNames.applicantInfoPanel] || [];
      applicantList.value = applicantPanel.map((a: applicantInfoPanel) => {
        return {
          fullName: (a as any).applicantName || "", //Brought over via survey-on-value-change (from javascript)
          address:
            a.applicantOrdinaryAddressReceiveMail == "y"
              ? formatP1Address(a.applicantOrdinaryAddress)
              : formatP1Address(a.applicantMailingAddress),
          individual: true, // applicantNewPartOfOrg not used.
          lawyer: data.applicantHasLawyer ? data.applicantLawyerName || "" : "",
          differentMail: a.applicantOrdinaryAddressReceiveMail === "n",
          differentAddress:
            a.applicantOrdinaryAddressReceiveMail === "n"
              ? formatCityCountry(a.applicantMailingAddress) || ""
              : ""
        } as FormP1Applicant;
      });
      deceased.value = {
        ...data.deceasedName,
        address: formatP1Address(data.deceasedAddress) || "",
        dateOfDeath: data.deceasedDateOfDeath ? dateFormatter(data.deceasedDateOfDeath) : ""
      };
      serviceContact.value = {
        address: formatP1Address(data.applicantServiceAddress) || "",
        phone: data.applicantServicePhone || "",
        fax: data.applicantServiceFax || "",
        email: data.applicantServiceEmail || "",
        courtLocation:
          getLocations?.value
            ?.find(l => l.id == data.applicantCourthouse)
            ?.name?.replace("Law Courts", "") ||
          data.applicantCourthouse ||
          ""
      };
      if (data.applicantHasLawyer == "y") {
        serviceContact.value = {
          ...serviceContact.value,
          address: formatP1Address(data.applicantLawyerFirmAddress) || "",
          phone: data.applicantLawyerPhone,
          fax: data.applicantLawyerFax,
          email: data.applicantLawyerEmail
        };
      }
    };

    const dateFormatter = dateString => {
      return formatMonthDayYear(new Date(dateString.replace(/-/g, "/")));
    };

    const formatCityCountry = mailingAddress => {
      return `${mailingAddress?.city}, ${mailingAddress?.country}`;
    };

    const loadApplicantList = () => {
      if (survey) loadSurveyData(survey);
      else loadTestData();
    };

    const applicationType = () => {
      return "a Grant of Administration Without Will Annexed";
    };

    const takeNoticeStart = () => {
      if (applicantList.value.length == 1) return "The applicant";
      return "The applicants";
    }

    const takeNoticeEnd = () => {
      if (applicantList.value.length == 1) return "proposes";
      return "propose";
    }

    const takeNoticeApplicants = () => {
      if (applicantList.value.length == 1)
        return `${applicantList.value[0].fullName}`;
      if (applicantList.value.length == 2)
        return `(${applicantList.value[0].fullName} and ${applicantList.value[1].fullName})`;
      if (applicantList.value.length >= 3)
        return `The applicants (${applicantList.value
          .slice(0, -1)
          .map(a => a.fullName)
          .join(" ")} and ${applicantList.value.slice(-1)[0].fullName})`;
    };

    const getAllApplicants = () => {
      let result = "";
      for (const name of applicantList.value) result += name.fullName + ", ";
      result = result.slice(0, -2);
      return result;
    };

    const onPrint = async () => {
      const applicationId = getApplicationId.value || 9999999999;
      const formName = "FormP1";
      const innerHTML = root.value.innerHTML;

      const html = formPdfHtml(
        innerHTML,
        `Generated by "Represent Someone Who Died" on ${formatMonthDayYear(new Date())}.`,
        "P1",
        ""
      );
      const jsonData = {
        applicantList: applicantList.value,
        deceased: deceased.value,
        serviceContact: serviceContact.value
      };
      try {
        const response = await SurveyDataService.getPdf(
          applicationId,
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

    onMounted(() => {
      loadApplicantList();
    });

    return {
      SurveyDataService,
      applicantList,
      loadApplicantList,
      deceased,
      serviceContact,
      takeNoticeStart,
      takeNoticeEnd,
      takeNoticeApplicants,
      getAllApplicants,
      applicationType,
      getApplicants,
      getLastUpdated,
      formatCityCountry,
      formatDeceasedName,
      formatMonthDayYear,
      onPrint,
      root
    };
  }
});
</script>
<style scoped lang="css" src="@/styles/_pdf.css"></style>
