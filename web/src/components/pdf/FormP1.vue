<template>
  <div key="getLastUpdated">
    <b-button style="transform:translate(500px,0px)" variant="success" @click="onPrint()">
      Print
    </b-button>
    <b-card
      id="print"
      style="border:1px solid; border-radius:5px;padding:3rem 4rem 2rem 4rem;"
      bg-variant="white"
      class="printcard mt-4 mb-3"
      ref="root"
    >
      <div style="text-align:center;">
        <div style="margin:5rem 0 0 0;font-weight: 300;font-size:20px;">
          FORM P1 (RULE 25-2 (3))
        </div>
        <div style="margin:1rem 0 0 0;font-weight: 600;font-size:24px;">
          <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
        </div>
        <div style="margin:1rem 0 5rem 0;font-weight: 600;font-size:24px;">
          NOTICE OF PROPOSED APPLICATION IN RELATION TO ESTATE
        </div>
      </div>

      <div style="margin:0 0 1rem 0rem;font-weight: 600;font-size:18px;">
        TAKE NOTICE THAT:
      </div>

      <underline-form
        textwidth="36rem"
        :beforetext="takeNoticeTitle()"
        :text="getAllApplicants()"
      />
      <div style="display:inline-block;">
        propose(s) to apply, in the
      </div>
      <underline-form
        class="mt-3 ml-1"
        textwidth="20rem"
        beforetext=""
        :text="serviceContact.courtLocation"
      />
      <underline-form
        class="mt-3"
        textwidth="28rem"
        beforetext="court registry, for"
        :text="applicationType()"
      />
      <underline-form
        class="mt-3"
        textwidth="22rem"
        beforetext="in relation to the estate of the deceased described below who died on"
        :text="deceased.dateOfDeath"
      />

      <div style="margin:2rem 0 1rem 0rem;">Full legal name of deceased:</div>
      <underline-form
        class="mt-0"
        textwidth="40rem"
        beforetext=""
        :text="formatDeceasedName(deceased)"
      />
      <div style="margin:2rem 0 1rem 0rem;">
        Last residential address of the deceased:
      </div>
      <underline-form class="mt-0" textwidth="40rem" beforetext="" :text="deceased.address" />

      <div class="mt-3">
        This application does not relate to a will or foreign grant.
      </div>

      <div class="new-page"></div>

      <div style="margin:0rem 0 1rem 0rem;font-weight: 600;font-size:18px;">
        AND TAKE NOTICE THAT:
      </div>

      <ol class="resetcounter">
        <li class="bracketnumber">
          Before obtaining the foregoing grant or resealing, the applicant may be granted an
          authorization to obtain estate information or an authorization to obtain resealing
          information, as the case may be, in relation to that grant or resealing for the purposes
          of obtaining financial information in relation to the grant or resealing.
        </li>
        <li class="bracketnumber">
          You have a right to oppose, by filing a notice of dispute in accordance with Rule 25-10
          (1),
          <ol style="text-indent:2px; list-style-type:lower-alpha">
            <li>
              if the intended application is for an estate grant, the granting of either or both of
              an authorization to obtain estate information and the estate grant, or
            </li>
            <li>
              if the intended application is for a resealing, the granting of either or both of an
              authorization to obtain resealing information and the resealing.
            </li>
          </ol>
        </li>
        <li class="bracketnumber">
          You may or may not be entitled to claim against the estate for relief, including a claim
          under
          <ol style="text-indent:2px; list-style-type:lower-alpha">
            <li>the Family Law Act, or</li>
            <li>
              Division 6 of Part 4 of the Wills, Estates and Succession Act.
            </li>
          </ol>
        </li>
        <li class="bracketnumber">
          If you choose to take a step referred to in paragraph (2) or (3), you must do so within
          the time limited by any relevant rule of court or other enactment.
        </li>
        <li class="bracketnumber">
          You may consult with your own lawyer concerning your interest in, or rights against, the
          estate.
        </li>
        <li class="bracketnumber">
          After the applicant has filed a submission for estate grant or submission for resealing,
          you may apply for an order requiring the applicant to provide security unless the
          applicant is the Public Guardian and Trustee. Filing a notice of dispute will prevent a
          grant from being issued before you are able to apply for the order requiring security.
        </li>
        <li class="bracketnumber">
          An authorization to obtain estate information, an authorization to obtain resealing
          information or a grant may issue to the applicant, or a foreign grant may be resealed, on
          any date that is at least 21 days after the date on which this notice is delivered to you
          or on any earlier date ordered by the court.
        </li>
        <li class="bracketnumber">
          If an authorization to obtain estate information issues to the applicant, the applicant
          may apply for a grant without further notice. If an authorization to obtain resealing
          information issues to the applicant, the applicant may apply for the resealing of the
          foreign grant without further notice to you.
        </li>
        <li class="bracketnumber">
          If a grant issues to the applicant, the applicant must provide, if there is a will, to the
          beneficiaries or, if there is no will, to intestate successors of the deceased an
          accounting as to how the estate was administered and how the estate assets were
          distributed, and if a foreign grant is resealed as a result of the application, the
          intended applicant must provide, if there is a will, to the beneficiaries or, if there is
          no will, to intestate successors of the deceased, an accounting as to how the estate
          comprising the assets to which the resealed grant applies was administered and how those
          assets were distributed.
        </li>
      </ol>

      <div style="margin:2rem 0 0rem 0rem;font-weight: 600;font-size:18px;">
        INFORMATION ABOUT EACH APPLICANT
      </div>

      <div v-for="(name, i) in applicantList" :key="i + 100">
        <underline-form class="mt-5" textwidth="40rem" beforetext="Name:" :text="name.fullName" />

        <underline-form
          class="my-3"
          textwidth="40rem"
          beforetext="Mailing address:"
          :text="name.address"
        />

        <check-box
          :check="name.individual && !name.differentAddress"
          text="This applicant is an individual and ordinarily lives at the mailing address noted above."
        />

        <check-box
          style="display:inline-block;"
          shiftmark="0"
          :check="name.differentMail"
          text="This applicant is an individual and ordinarily lives in the following city and country:"
        />
        <underline-form
          style="text-indent: 26px;"
          class="mt-0"
          textwidth="20rem"
          beforetext=""
          :text="name.differentAddress"
        />
        <div v-if="i < 1" class="new-page"></div>
      </div>

      <div style="margin:2rem 0 0rem 0rem;font-weight: 600;font-size:18px;">
        ADDRESS FOR SERVICE OF APPLICANT(S)
      </div>
      <underline-form
        class="mt-4"
        textwidth="40rem"
        beforetext="Street address for service"
        :text="serviceContact.address"
      />
      <underline-form
        v-if="serviceContact.fax"
        class="mt-3"
        textwidth="40rem"
        beforetext="Fax number for service (if any)"
        :text="serviceContact.fax"
      />
      <underline-form
        v-if="serviceContact.email"
        class="mt-3"
        textwidth="40rem"
        beforetext="E-mail address for service (if any)"
        hint="E-mail"
        :text="serviceContact.email"
      />
      <underline-form
        class="mt-3 mb-3"
        textwidth="40rem"
        beforetext="Telephone number"
        :text="serviceContact.phone"
      />

      <div class="mt-5 row" v-for="(name, i) in applicantList" :key="i">
        <div class="col-5">
          <underline-form
            textwidth="16rem"
            beforetext="Date"
            hint=""
            :text="formatMonthDayYear(new Date())"
          />
        </div>
        <div class="col-7 mt-4">
          <underline-form textwidth="20rem" beforetext="" hint="" text="" /><br />
          <div style="display: inline-block" class="mr-4">Signature of</div>
          <div style="display: inline-block">
              <check-box style="display: inline-block" class="mr-4" :check="name.lawyer ? '' : 'yes'" text="" />
              applicant <br/>
              <check-box
                style="display: inline-block"
                :check="name.lawyer ? 'yes' : ''"
                text=""
                class="mr-4"
              />
              lawyer for applicant(s)
              <underline-form
                style="display: inline-block"
                textwidth="20rem"
                beforetext=""
                :text="name.lawyer"
              />
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
import { getLastUpdated, getApplicants } from "@/state/survey-state";
import { SurveyDataService } from "@/services/survey-data-service";
import { applicantInfoPanel, SurveyInstance, SurveyQuestionNames } from "@/types/survey-primary";
import { FormP1Applicant, FormP1Deceased, FormP1ServiceContact } from "@/types/application";
import {
  formatMailingAddress,
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
              ? formatMailingAddress(a.applicantOrdinaryAddress) :
              formatMailingAddress(a.applicantMailingAddress)
              ,
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
        address: formatMailingAddress(data.deceasedAddress) || "",
        dateOfDeath: data.deceasedDateOfDeath ? dateFormatter(data.deceasedDateOfDeath) : ""
      };
      serviceContact.value = {
        address: formatMailingAddress(data.applicantServiceAddress) || "",
        phone: data.applicantServicePhone || "",
        fax: data.applicantServiceFax || "",
        email: data.applicantServiceEmail || "",
        courtLocation:
          getLocations?.value?.find(l => l.id == data.applicantCourthouse)?.name?.replace("Law Courts", "") ||
          data.applicantCourthouse ||
          ""
      };
      if (data.applicantHasLawyer == "y") {
        serviceContact.value = {
          ...serviceContact.value,
          address: formatMailingAddress(data.applicantLawyerFirmAddress) || "",
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
      //onPrint();
    };

    const applicationType = () => {
      return "a Grant of Administration Without Will Annexed";
    };

    const takeNoticeTitle = () => {
      if (applicantList.value.length == 1)
        return `The applicant ${applicantList.value[0].fullName} proposes:`;
      if (applicantList.value.length == 2)
        return `The applicants (${applicantList.value[0].fullName} and ${applicantList.value[1].fullName}) propose:`;
      if (applicantList.value.length >= 3)
        return `The applicants (${applicantList.value
          .slice(0, -1)
          .map(a => a.fullName)
          .join(" ")} and ${applicantList.value.slice(-1)[0].fullName}) propose:`;
    };

    const getAllApplicants = () => {
      let result = "";
      for (const name of applicantList.value) result += name.fullName + ", ";
      result = result.slice(0, -2);
      return result;
    };

    const onPrint = async () => {
      const applicationId = getApplicationId.value;
      const formName = "FormP1";
      const html = formPdfHtml(
        root.value.innerHTML,
        `Generated by 'Represent Someone Who Died On' ${formatMonthDayYear(new Date())}`,
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
      takeNoticeTitle,
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
