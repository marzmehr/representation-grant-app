<template>
  <div>
    <b-form-group>
      <label style="display:inline-block; margin: 0 1rem 0 0;">Example of filled Form for:</label>
      <b-form-radio-group
        style="display:inline-block"
        v-model="multipleApplicant"
        :options="[
          { value: false, text: 'Single Applicant' },
          { value: true, text: '3 (Multiple) Applicants' }
        ]"
        @change="changeApplicantList()"
      ></b-form-radio-group>
    </b-form-group>
    <b-button style="transform:translate(500px,0px)" variant="success" @click="onPrint()">
      Save
    </b-button>

    <b-card
      id="print"
      style="border:1px solid; border-radius:5px;padding:3rem 4rem 2rem 4rem;"
      bg-variant="white"
      class="printcard mt-4 mb-3"
    >
      <div style="text-align:center;">
        <div style="margin:5rem 0 0 -1.3rem;font-weight: 300;font-size:20px;">
          FORM P1 (RULE 25-2 (3))
        </div>
        <div style="margin:1rem 0 0 -1.3rem;font-weight: 600;font-size:24px;">
          <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
        </div>
        <div style="margin:1rem 0 5rem -1.3rem;font-weight: 600;font-size:24px;">
          NOTICE OF PROPOSED APPLICATION IN RELATION TO ESTATE
        </div>
      </div>

      <div style="margin:0 0 1rem 0rem;font-weight: 600;font-size:18px;">
        TAKE NOTICE THAT:
      </div>

      <underline-form
        textwidth="36rem"
        :beforetext="takeNoticeTitle()"
        hint="Full Name of Applicant(s)"
        :text="getAllApplicants()"
      />
      <div style="display:inline-block; text-indent: 5px;">
        propose(s) to apply, in the
      </div>
      <underline-form
        class="mt-3"
        textwidth="20rem"
        beforetext=""
        hint="Court Location"
        text="courtLocation"
      />
      <underline-form
        style="text-indent: 5px;"
        class="mt-3"
        textwidth="28rem"
        beforetext="court registry, for"
        hint="Application Type"
        text="applicationType"
      />
      <underline-form
        style="text-indent: 5px;"
        class="mt-3"
        textwidth="22rem"
        beforetext="in relation to the estate of the deceased described below who died on"
        hint="Deceased’s Date of Death (mm dd yyyy)"
        text="deceasedDateOfDeath"
      />

      <div style="margin:2rem 0 1rem 0rem;">Full legal name of deceased:</div>
      <underline-form
        class="mt-0"
        textwidth="58rem"
        beforetext=""
        hint="Name"
        :text="deceased.first"
      />
      <div style="margin:2rem 0 1rem 0rem;">
        Last residential address of the deceased:
      </div>
      <underline-form
        class="mt-0"
        textwidth="58rem"
        beforetext=""
        hint="Street Number or Post Office Box, City/Town, Province, Country and Postal Code"
        :text="deceased.address"
      />

      <div class="mt-3">
        This application does not relate to a will or foreign grant.
      </div>

      <div class="new-page"></div>

      <div style="margin:4rem 0 1rem 0rem;font-weight: 600;font-size:18px;">
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
        <underline-form
          class="mt-5"
          textwidth="58rem"
          beforetext="Name:"
          hint="Name"
          :text="name.name"
        />

        <underline-form
          class="my-3"
          textwidth="48.75rem"
          beforetext="Mailing address:"
          hint="Street Number or Post Office Box, City/Town, Province, Country and Postal Code"
          :text="name.address"
        />

        <check-box
          :check="name.individual"
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
          textwidth="30rem"
          beforetext=""
          hint="City and Country"
          :text="name.differentAddress"
        />
        <div v-if="i < 1" class="new-page"></div>
      </div>

      <div style="margin:2rem 0 0rem 0rem;font-weight: 600;font-size:18px;">
        ADDRESS FOR SERVICE OF APPLICANT(S)
      </div>
      <underline-form
        class="mt-4"
        textwidth="45rem"
        beforetext="Street address for service"
        hint="Street Number, City/Town, Province, Country and Postal Code"
        :text="serviceContact.address"
      />
      <underline-form
        v-if="serviceContact.applicantServicePOBoxAddress"
        class="mt-3"
        textwidth="42.5rem"
        beforetext="PO Box within 30km of (Courthouse Location)"
        hint=""
        :text="serviceContact.fax"
      />
      <underline-form
        v-if="serviceContact.fax"
        class="mt-3"
        textwidth="42.5rem"
        beforetext="Fax number for service (if any)"
        hint="Fax Number (+1 AreaCode XXX-XXXX )"
        :text="serviceContact.fax"
      />
      <underline-form
        v-if="serviceContact.email"
        class="mt-3"
        textwidth="41rem"
        beforetext="E-mail address for service (if any)"
        hint="E-mail"
        :text="serviceContact.email"
      />
      <underline-form
        class="mt-3 mb-5"
        textwidth="48.5rem"
        beforetext="Telephone number"
        hint="Phone Number (+1 AreaCode XXX-XXXX )"
        :text="serviceContact.phone"
      />

      <div class="mt-5 row" v-for="(name, i) in applicantList" :key="i">
        <div class="col-4">
          <underline-form
            textwidth="16rem"
            beforetext="Date"
            hint=""
            :text="currentDayMonthYear(new Date())"
          />
        </div>
        <div class="col-8">
          <underline-form textwidth="39rem" beforetext="" hint="" text="" />
          <div style="display:inline-block;text-indent:10px;">Signature of</div>
          <check-box
            style="display:inline-block;"
            shift="10"
            :check="name.lawyer ? '' : 'yes'"
            text=""
          />
          <underline-form
            style="display:inline-block;margin-left:2.5rem;"
            textwidth="24.5rem"
            beforetext="applicant"
            hint="full name"
            :text="name.lawyer ? '' : name.fullName"
          />
          <div>
            <check-box
              style="display:inline-block;"
              shift="118"
              :check="name.lawyer ? 'yes' : ''"
              text=""
            />
            <underline-form
              style="display:inline-block;margin-left:9rem;"
              textwidth="19.55rem"
              beforetext="lawyer for applicant"
              hint="lawyer's full name"
              :text="name.lawyer"
            />
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { onMounted, defineComponent, reactive, ref } from "@vue/composition-api";
import UnderlineForm from "@/components/pdf/components/UnderlineForm.vue";
import CheckBox from "@/components/pdf/components/CheckBox.vue";
import { format } from "date-fns";
import axios, { AxiosRequestConfig } from "axios";
import { getApplicants } from '@/state/survey-state';

export default defineComponent({
  name: "FormP1",
  props: {
    survey: Object
  },
  components: {
    UnderlineForm,
    CheckBox
  },
  setup(props) {
    const multipleApplicant = ref(false);

    const check = ""; //"&#10003"
    const check2 = "&#10003";

    const survey = props.survey;
    let applicantList = ref([]);
    let deceased = {
      first: "Rest",
      middle: "In",
      last: "Peace",
      address: "0-123 st, Victoria, BC, Canada V0i 8i8"
    };
    let serviceContact = {
      address: "0-123 st, Victoria, BC, Canada V0i 8i8",
      phone: "+1 123 456 7890",
      fax: "+1 123 456 7890",
      email: "ABC@yahoo.ca"
    };

    const changeApplicantList = () => {
      applicantList.value = [];
      if (multipleApplicant.value) {
        applicantList.value.push(
          {
            fullName: "Its first Son",
            first: "Its",
            middle: "first",
            last: "Son",
            address: "0-123 st, Victoria, BC, Canada V0i 8i8",
            notIndividual: "",
            individual: "yes",
            sameMail: "",
            differentMail: "yes",
            differentAddress: "New York, USA"
          },
          {
            fullName: "Its first Daughter",
            first: "Its",
            middle: "first",
            last: "Daughter",
            address: "1-123 st, Victoria, BC, Canada V0i 8i8",
            notIndividual: "",
            individual: "yes",
            sameMail: "yes",
            differentMail: "",
            differentAddress: ""
          },
          {
            fullName: "Its second Son",
            first: "Its",
            middle: "second",
            last: "Son",
            address: "0000 st, Vancouver, BC, Canada V0v 0v0",
            notIndividual: "",
            individual: "yes",
            sameMail: "yes",
            differentMail: "",
            differentAddress: "",
            lawyer: "Its good lawyer"
          }
        );
      } else {
        applicantList.value.push({
          fullName: "Its first Son",
          first: "Its",
          middle: "first",
          last: "Son",
          address: "0-123 st, Victoria, BC, Canada V0i 8i8",
          notIndividual: "",
          individual: "yes",
          sameMail: "",
          differentMail: "yes",
          differentAddress: "New York, USA"
        });
      }
    };

    /* 
  Fields of interest from surveyJS:
  These fields will have to be put together from a bunch of different places. 
  They will need to be transformed I believe.. as an applicantPanel doesn't exist (it takes it from different places).
  The responsbility of this component isn't to transform the data, it's simply to display the data.

  applicantPanel:
    applicantCourthouse
    applicantMailingAddress
    applicantMailingAddressIsOrdinary
    applicantOrdinaryAddress
    applicantServiceAddress
    applicantServicePOBox
    applicantServiceFax
    applicantServiceEmail
    applicantServicePhone
    applicantLawyer
    applicantLawyerName
    applicantName

  applicationScenario (applicationType)
  deceasedDateOfDeath
  deceasedName
  deceasedAddress
  */
  
    const applicationType = () => {
      return "a Grant of Administration Without Will Annexed";
    };

    const deceasedDateOfDeath = () => {
      const deceasedDateOfDeath = new Date();
      return currentDayMonthYear(deceasedDateOfDeath);
    };

    const courtLocation = () => {
      const applicantCourthouseClosest = "y";
      const applicantCourtHouseDifferent = "applicantCourtHouseDifferent";
      if (applicantCourthouseClosest == "y") return "Closest Courthouse";
      if (applicantCourthouseClosest == "n") return applicantCourtHouseDifferent;
      return "Court Location";
    };

    const takeNoticeTitle = () => {
      if (applicantList.value.length == 1) return `The applicant ${applicantList.value[0].fullName} proposes:`;
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
      if (result.length > 70) result = result.slice(0, 70) + "...";
      return result;
    };

    const currentDayMonthYear = date => {
      return format(date, "MMMM dd, yyyy");
    };

    onMounted(() => {
      changeApplicantList();
    });

    const onPrint = () => {
      const applicationId = 55; //props.question.survey.applicationId; //TODO wire this state up.
      const pdfType = 'formp1';
      const url = `/survey-print/${applicationId}/?pdf_type=${pdfType}`;
      const options = {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json"
        }
      } as AxiosRequestConfig;
      axios.get(url, options).then(
        res => {
          const blob = res.data;
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.download = `${pdfType}.pdf`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        },
        err => {
          console.error(err);
        }
      );
    };

    return {
      onPrint,
      applicantList,
      currentDayMonthYear,
      changeApplicantList,
      deceased,
      serviceContact,
      multipleApplicant,
      takeNoticeTitle,
      getAllApplicants,
      getApplicants
    };
  }
});
</script>
<style scoped>
.table >>> th.border-dark {
  border: 1px solid #000;
}
.table >>> td.border-dark {
  border: 1px solid #000;
}

section {
  counter-increment: question-counter;
  float: left;
  text-indent: -20px;
  text-align: justify;
  text-justify: inter-word;
  margin: 1rem 0.5rem 0.5rem 0rem;
}

section:before {
  font-weight: bolder;
  content: counter(question-counter) ".";
}

dsection:after {
  float: none;
  white-space: pre;
}

section.resetquestion {
  counter-reset: question-counter;
}

ol.resetcounter {
  list-style: none;
  counter-reset: bracket-counter;
}
ol li.bracketnumber {
  text-indent: -25px;
  text-align: justify;
  text-justify: inter-word;
  margin: 1rem 0;
  counter-increment: bracket-counter;
}
ol li.bracketnumber:before {
  content: "(" counter(bracket-counter) ") ";
  font-weight: bold;
}
</style>
