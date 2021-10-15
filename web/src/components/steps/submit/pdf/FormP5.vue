<template>
  <div v-if="dataIsReady">
    <b-form-group>
      <label style="display:inline-block; margin: 0 1rem 0 0;"
        >Example of filled Form for:</label
      >
      <b-form-radio-group
        style="display:inline-block"
        v-model="multipleApplicant"
        :options="[
          { value: false, text: 'Single Applicant' },
          { value: true, text: '10 (Multiple) Applicants' }
        ]"
        @change="changeApplicantList()"
      ></b-form-radio-group>
    </b-form-group>
    <b-button
      style="transform:translate(340px,0px)"
      variant="success"
      @click="onPrint()"
    >
      Save
    </b-button>

    <b-card
      id="print"
      style="border:1px solid; border-radius:5px;"
      bg-variant="white"
      class="mt-4 mb-4 container"
      no-body
    >
      <div
        style="text-align:center;margin:0 0 1rem 0rem;font-weight: 300;font-size:14pt;"
      >
        FORM P5 (RULE 25-3 (2) )
      </div>

      <div class="mt-0 m-0 p-0 row">
        <div style="margin:0 0 0 25.25rem;">
          <div>
            <underline-form
              textwidth="8.6rem"
              beforetext="This is the"
              hint=""
              text="1st"
            />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              affidavit
            </div>
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="10.8rem"
              beforetext="of"
              hint=""
              :text="getAllApplicants(25)"
            />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              in this case
            </div>
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="9.5rem"
              beforetext="and was made on"
              hint=""
              text=""
            />
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="13.2rem"
              beforetext=""
              hint=""
              :text="applicantCourtHouse"
            />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              Registry
            </div>
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="14.9rem"
              beforetext="No."
              hint=""
              text=""
            />
          </div>
        </div>
      </div>

      <div
        style="text-align:center;margin:1rem 0 1rem 0;font-weight:bold;font-size:14pt;"
      >
        <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
      </div>
      <div style="text-align:center;font-size:12pt;">
        <i>In the Matter of the Estate of {{ deceased.fullName }}, deceased</i>
      </div>
      <div
        style="text-align:center;margin:1.25rem 0 3rem 0;font-weight:bold;font-size:10pt;"
      >
        AFFIDAVIT OF APPLICANT FOR GRANT OF ADMINISTRATION WITHOUT WILL ANNEXED
      </div>

      <div>
        <div
          v-if="applicantList.length > 1"
          style="display:inline-block; text-indent: 5px; margin-right:0.5rem;"
        >
          We,
        </div>
        <div
          v-else
          style="display:inline-block; text-indent: 5px; margin-right:0.5rem;"
        >
          I,
        </div>
        <div
          style="display:inline-block; margin:0.5rem 0 0 0;"
          v-for="(applicant, i) in applicantList"
          :key="i + 50"
        >
          <div v-if="i > 0" style="display:inline-block; width:1.9rem;"></div>
          <underline-form
            textwidth="17rem"
            beforetext=""
            hint=""
            :text="applicant.fullName"
          />
          <underline-form
            textwidth="11rem"
            beforetext=", of"
            hint=""
            :text="
              applicant.address.city +
                ', ' +
                applicant.address.state +
                ', ' +
                applicant.address.country
            "
          />
          <underline-form
            textwidth="9.55rem"
            beforetext=", "
            hint=""
            :text="applicant.occupation"
          />
          <div style="display:inline-block;">,</div>
        </div>
      </div>

      <div v-if="applicantList.length > 1" style="margin:0 0 1rem 0rem;">
        SWEAR (OR AFFIRM) JOINTLY THAT:
      </div>
      <div v-else style="margin:0 0 1rem 0rem;">SWEAR (OR AFFIRM) THAT:</div>

      <ol style="margin:0rem 0 0 -1.5rem;">
        <!-- <1> -->
        <li>
          <div v-if="applicantList.length > 1" style="display:inline;">
            I am one of the applicants referred to in the submission for estate
            grant in relation to the estate of
          </div>
          <div v-else style="display:inline;">
            I am the applicant referred to in the submission for estate grant in
            relation to the estate of
          </div>

          <underline-form
            style="margin:0.25rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="29rem"
            beforetext=""
            hint=""
            :text="deceased.fullName"
          />
          <div
            v-if="applicantList.length > 1"
            style="margin:0.25rem 0 ; display:inline; text-indent: 2px;"
          >
            (the "deceased") and are
          </div>
          <div
            v-else
            style="margin:0.25rem 0 ; display:inline; text-indent: 2px;"
          >
            (the "deceased") and am
          </div>
          <div style="display:inline-block; text-indent: 10px;">
            applying for a grant of administration without will annexed.
          </div>
        </li>
        <!-- <2> -->
        <li class="mt-3">
          <div
            class="mb-2"
            style=""
            v-for="(applicant, i) in applicantList"
            :key="i + 50"
          >
            <div style="" v-if="applicantList.length > 1">
              I am <b>{{ applicant.fullName }}</b> and ordinarily live at the
              following location
            </div>
            <div style="" v-else>
              I am an individual and ordinarily live at the following location:
            </div>

            <underline-form
              style="text-indent: 0px;"
              textwidth="12rem"
              beforetext="City/town:"
              hint=""
              :text="applicant.address.city"
            />
            <underline-form
              style="display:inline-block;text-indent: 5px;"
              textwidth="6rem"
              beforetext="Province/state:"
              hint=""
              :text="applicant.address.state"
            />
            <underline-form
              style="display:inline-block;text-indent: 5px;"
              textwidth="7rem"
              beforetext="Country:"
              hint=""
              :text="applicant.address.country"
            />
          </div>
        </li>
        <!-- <3> -->
        <li class="mt-3">
          <br v-if="applicantList.length > 1" />
          <div
            style="display:inline-block; margin:0 0 1rem 0;"
            v-for="(applicant, i) in applicantList"
            :key="i + 50"
          >
            <div v-if="applicantList.length > 1" style="display:inline-block;">
              <b>{{ applicant.fullName }}</b> is a person referred to in
              paragraph
            </div>
            <div v-else style="display:inline-block;">
              I am a person referred to in paragraph
            </div>
            <underline-form
              style="display:inline-block;margin:0 0.25rem;"
              textwidth="2rem"
              beforetext=""
              hint=""
              :text="applicant.section130"
            />
            <div style="display:inline; ">
              of section 130 of the <i> Wills, Estates and Succession Act.</i>
            </div>
          </div>
        </li>
        <!-- <4> -->
        <li class="mt-2">
          <div v-if="applicantList.length > 1" style="">
            We are not obliged under Rule 25-3 (11) to deliver a filed copy of
            this submission for estate grant to the Public Guardian and Trustee
          </div>
          <div v-else style="">
            I am not obliged under Rule 25-3 (11) to deliver a filed copy of
            this submission for estate grant to the Public Guardian and Trustee.
          </div>
        </li>
        <!-- <5> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            We are satisfied that a diligent search for a testamentary document
            of the deceased has been made in each place that could reasonably be
            considered to be a place where a testamentary document may be found,
            including, without limitation, in all places where the deceased
            usually kept his or her documents and:
          </div>
          <div v-else style="display:inline;">
            I am satisfied that a diligent search for a testamentary document of
            the deceased has been made in each place that could reasonably be
            considered to be a place where a testamentary document may be found,
            including, without limitation, in all places where the deceased
            usually kept his or her documents and:
          </div>

          <div class="mt-2">
            no testamentary document of the deceased has been found.
          </div>

          <!-- <div class="mt-2" v-if="applicantList.length>1" style="">one or more testamentary documents have been found. A copy of the testamentary document(s) is/are attached as an exhibit to the affidavit. We believe that the testamentary document(s) is/are invalid or otherwise not relevant to this application for the following reasons:</div>   
                    <div class="mt-2" v-else style="">one or more testamentary documents have been found. A copy of the testamentary document(s) is/are attached as an exhibit to the affidavit. I believe that the testamentary document(s) is/are invalid or otherwise not relevant to this application for the following reasons:</div>  -->

          <!-- <underline-form style="margin:1rem 0 1rem 0rem;" textwidth="59.5rem" beforetext="" hint="" text=""/>
                    <underline-form style="margin:0 0 1rem 0rem;" textwidth="59.5rem" beforetext="" hint="" text=""/> -->
        </li>

        <!-- <div v-if="applicantList.length<2" class="new-page"> </div> -->

        <!-- <6> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            We believe that there is no will of the deceased.
          </div>
          <div v-else style="display:inline;">
            I believe that there is no will of the deceased.
          </div>
        </li>

        <!-- <7> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="">
            We are not aware of any grant of probate or administration, or
            equivalent, having been issued in relation to the deceased in
            British Columbia or in any other jurisdiction.
          </div>
          <div v-else style="">
            I am not aware of any grant of probate or administration, or
            equivalent, having been issued in relation to the deceased in
            British Columbia or in any other jurisdiction.
          </div>
        </li>

        <!-- <8> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            We have read the submission for estate grant and the other documents
            referred to in that document and we believe that the information
            contained in that submission for estate grant and those documents is
            correct and complete.
          </div>
          <div v-else style="display:inline;">
            I have read the submission for estate grant and the other documents
            referred to in that document and I believe that the information
            contained in that submission for estate grant and those documents is
            correct and complete.
          </div>
        </li>

        <!-- <9> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            We will administer according to law all of the deceased's estate, we
            will prepare an accounting as to how the estate was administered and
            we acknowledge that, in doing this, we will be subject to the legal
            responsibility of a personal representative.
          </div>
          <div v-else style="display:inline;">
            I will administer according to law all of the deceased's estate, I
            will prepare an accounting as to how the estate was administered and
            I acknowledge that, in doing this, I will be subject to the legal
            responsibility of a personal representative.
          </div>
        </li>
      </ol>

      <div class="mt-2 row">
        <div class="col-7">
          <div style="margin:0.5rem 0 1rem 0rem;">
            SWORN (OR AFFIRMED) BEFORE ME
          </div>
          <underline-form
            textwidth="12.5rem"
            beforetext="at"
            hint="Commissioner City"
            text=""
          />
          <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">
            , British Columbia
          </div>

          <underline-form
            style="margin:0.75rem 0 ;"
            textwidth="19rem"
            beforetext="on"
            hint="Swear/Affirm Date"
            text=""
          />
          <underline-form
            style="margin:0.5rem 0 ;"
            textwidth="20.5rem"
            beforetext=""
            hint="A commissioner for taking affidavits for British Columbia"
            text=""
          />
          <underline-form
            style="margin:.5rem 0 ;"
            textwidth="20.5rem"
            beforetext=""
            hint="[print name or affix stamp of commissioner]"
            text=""
          />
        </div>
        <div class="col-5" style="border-left:1px solid #313132">
          <div v-for="(applicant, i) in applicantList" :key="i + 250">
            <underline-form
              :style="{ marginTop: getSignatureMargin() }"
              textwidth="19rem"
              beforetext=""
              :italicHint="false"
              hintFontSize="10pt"
              :hint="'Signature of ' + applicant.fullName"
              text=""
            />
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { namespace } from "vuex-class";
import "@/store/modules/application";
const applicationState = namespace("Application");

import UnderlineForm from "./components/UnderlineForm.vue";
import moment from "moment";
import { stepInfoType } from "@/types/Application";

@Component({
  components: {
    UnderlineForm
  }
})
export default class FormP5 extends Vue {
  @applicationState.State
  public steps!: stepInfoType[];

  @applicationState.State
  public deceasedName!: string;

  @applicationState.State
  public deceasedAliases!: string[];

  @applicationState.State
  public relatedPeopleInfo!: any;

  @applicationState.Action
  public UpdateGotoPrevStepPage!: () => void;

  @applicationState.Action
  public UpdateGotoNextStepPage!: () => void;

  dataIsReady = false;
  multipleApplicant = false;
  applicantList = [];
  applicantCourtHouse = "";
  deceased;
  serviceContact;

  mounted() {
    this.dataIsReady = false;
    this.getRepGrantResultData();
    this.getApplicantsInfo();
    this.getDeceasedInfo();
    this.dataIsReady = true;
  }

  public getDeceasedInfo() {
    if (
      this.steps[0] &&
      this.steps[0].result &&
      this.steps[0].result["deceasedInfoSurvey"] &&
      this.steps[0].result["deceasedInfoSurvey"].data
    ) {
      const deceasedInfoSurvey = this.steps[0].result["deceasedInfoSurvey"]
        .data;
      this.deceased = {
        fullName: Vue.filter("getFullName")(this.deceasedName),
        first: this.deceasedName["first"],
        middle: this.deceasedName["middle"],
        last: this.deceasedName["last"],
        address: deceasedInfoSurvey.deceasedAddress,
        DOD: Vue.filter("beautify-full-date")(
          deceasedInfoSurvey.deceasedDateOfDeath
        )
      };
    }
  }

  public getApplicantsInfo() {
    if (this.multipleApplicant) {
      this.changeApplicantList();
    } else {
      this.applicantList = [];

      if (
        this.steps[3] &&
        this.steps[3].result &&
        this.steps[3].result["applicantInfoSurvey"] &&
        this.steps[3].result["applicantInfoSurvey"].data
      ) {
        const applicantInfoSurvey = this.steps[3].result["applicantInfoSurvey"]
          .data;
        if (applicantInfoSurvey.applicant.length > 0) {
          for (const applicant of applicantInfoSurvey.applicant) {
            const index = applicant.charAt(14);

            const applicantSurvey = this.relatedPeopleInfo[index];

            const applicantInfo = {
              fullName: Vue.filter("getFullName")(applicantSurvey.name),
              first: applicantSurvey.name.first,
              middle: applicantSurvey.name.middle,
              last: applicantSurvey.name.last
            };

            if (applicantInfoSurvey["applicantOccupation[" + index + "]"]) {
              applicantInfo["occupation"] =
                applicantInfoSurvey["applicantOccupation[" + index + "]"];
            }

            if (
              applicantInfoSurvey[
                "applicantMailingAddressIsOrdinary[" + index + "]"
              ] &&
              applicantInfoSurvey[
                "applicantMailingAddressIsOrdinary[" + index + "]"
              ] == "y"
            ) {
              if (
                applicantInfoSurvey["applicantMailingAddress[" + index + "]"]
              ) {
                const addressInfo =
                  applicantInfoSurvey["applicantMailingAddress[" + index + "]"];
                applicantInfo["address"] = addressInfo;
              }
            } else if (
              applicantInfoSurvey[
                "applicantMailingAddressIsOrdinary[" + index + "]"
              ] &&
              applicantInfoSurvey[
                "applicantMailingAddressIsOrdinary[" + index + "]"
              ] == "n"
            ) {
              if (
                applicantInfoSurvey["applicantOrdinaryAddress[" + index + "]"]
              ) {
                const addressInfo =
                  applicantInfoSurvey[
                    "applicantOrdinaryAddress[" + index + "]"
                  ];
                applicantInfo["address"] = addressInfo;
              }
            } else {
              applicantInfo["address"] = "";
            }
            // console.log(applicantInfo)
            this.applicantList.push(applicantInfo);
          }
        }

        this.applicantCourtHouse = applicantInfoSurvey.applicantCourthouse;
        this.serviceContact = {
          address:
            applicantInfoSurvey.applicantServiceAddress.street +
            ", " +
            applicantInfoSurvey.applicantServiceAddress.city +
            ", " +
            applicantInfoSurvey.applicantServiceAddress.state +
            ", " +
            applicantInfoSurvey.applicantServiceAddress.country +
            ", " +
            applicantInfoSurvey.applicantServiceAddress.postcode,
          phone: applicantInfoSurvey.applicantServiceEmail,
          email: applicantInfoSurvey.applicantServicePhone
        };
      }
    }
  }

  public changeApplicantList() {
    this.applicantList = [];
    if (this.multipleApplicant) {
      this.applicantList.push(
        {
          fullName: "Its first Son",
          first: "Its",
          middle: "first",
          last: "Son",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "",
          differentMail: "yes",
          differentAddress: "New York, USA",
          occupation: "worker",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(b)"
        },
        {
          fullName: "Its first Daughter",
          first: "Its",
          middle: "first",
          last: "Daughter",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "work",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(a)"
        },
        {
          fullName: "Its second Son",
          first: "Its",
          middle: "second",
          last: "Son",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          lawyer: "Its good lawyer",
          occupation: "working",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(c)"
        },
        {
          fullName: "Its second Daughter",
          first: "Its",
          middle: "second",
          last: "Daughter",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "worker",
          city: "Vancouver",
          state: "BC",
          country: "Canada",
          section130: "(d)"
        },
        {
          fullName: "Its third Son",
          first: "Its",
          middle: "third",
          last: "Son",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "",
          differentMail: "yes",
          differentAddress: "New York, USA",
          occupation: "work",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(d)"
        },
        {
          fullName: "Its third Daughter",
          first: "Its",
          middle: "third",
          last: "Daughter",
          address: "Victoria, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "worker",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(e)"
        },
        {
          fullName: "Its fourth Son",
          first: "Its",
          middle: "fourth",
          last: "Son",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          lawyer: "Its good lawyer",
          occupation: "work",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(f)"
        },
        {
          fullName: "Its fourth Daughter",
          first: "Its",
          middle: "fourth",
          last: "Daughter",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "working",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(f)"
        },
        {
          fullName: "Its fifth Son",
          first: "Its",
          middle: "fifth",
          last: "Son",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "",
          differentMail: "yes",
          differentAddress: "New York, USA",
          occupation: "worker",
          city: "Seattle",
          state: "WA",
          country: "USA",
          section130: "(f)"
        },
        {
          fullName: "Its fifth Daughter",
          first: "Its",
          middle: "fifth",
          last: "Daughter",
          address: "Vancouver, BC, Canada",
          notIndividual: "",
          individual: "yes",
          sameMail: "yes",
          differentMail: "",
          differentAddress: "",
          occupation: "work",
          city: "Victoria",
          state: "BC",
          country: "Canada",
          section130: "(a)"
        }
      );
    } else {
      this.getApplicantsInfo();
    }
  }

  public getSignatureMargin() {
    let margin = Number(10 / this.applicantList.length);
    if (margin < 1.0) margin = 1;
    return margin + "rem";
  }

  public getAllApplicants(len: number) {
    let result = "";
    for (const name of this.applicantList) result += name.fullName + ", ";
    result = result.slice(0, -2);
    if (result.length > len) result = result.slice(0, len) + "...";
    return result;
  }

  public onPrint() {
    const el = document.getElementById("print");
    console.log(el);
    const applicationId = this.$store.state.Application.id;
    const bottomLeftText =
      `"Generated by “Apply to Represent Someone Who Died” on ` +
      moment().format("MMMM D, YYYY") +
      `.";`;
    const bottomRightText = `"P5"`;
    const url =
      "/survey-print/" + applicationId + "/?name=representation-grant";
    const body = Vue.filter("printPdf")(
      el.innerHTML,
      bottomLeftText,
      bottomRightText
    );
    const options = {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json"
      }
    };
    console.log(body);
    this.$http.post(url, body, options).then(
      res => {
        const blob = res.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.download = "FormP5.pdf";
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      },
      err => {
        console.error(err);
      }
    );
  }

  public getRepGrantResultData() {
    let result = this.$store.state.Application.steps[0].result;
    for (let i = 1; i < 9; i++) {
      const stepResults = this.$store.state.Application.steps[i].result;
      for (const stepResult in stepResults) {
        //console.log(stepResults[stepResult])
        //console.log(stepResults[stepResult].data)
        result[stepResult] = stepResults[stepResult].data;
      }
    }
    const protectedPartyName = {
      protectedPartyName: this.$store.state.Application.protectedPartyName
    };
    Object.assign(result, result, protectedPartyName);

    const applicationLocation = this.$store.state.Application
      .applicationLocation;
    const userLocation = this.$store.state.Common.userLocation;
    //console.log(applicationLocation)
    //console.log(userLocation)
    if (applicationLocation)
      Object.assign(result, result, {
        applicationLocation: applicationLocation
      });
    else Object.assign(result, result, { applicationLocation: userLocation });
    console.log(result);
    return result;
  }
}
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

ol.resetlist {
  list-style: none;
  counter-reset: list-counter;
}
ol li.listnumber {
  text-indent: -25px;
  text-align: justify;
  text-justify: inter-word;
  margin: 1rem 0;
  counter-increment: list-counter;
}
ol li.listnumber:before {
  content: counter(list-counter) ". ";
  font-weight: bold;
}

.containe {
  padding: 0 !important;
  margin-right: 0 !important;
  margin-left: 0 !important;
  width: 100% !important;
  max-width: 500px !important;
  min-width: 680px !important;
  font-size: 0.65em !important;
  font-family: BCSans;
}

.container {
  padding: 40px !important;
  margin-right: auto !important;
  margin-left: auto !important;
  width: 100% !important;
  max-width: 760px !important;
  min-width: 760px !important;
  font-size: 10pt !important;
  font-family: BCSans;
  color: #313132 !important;
}
</style>
