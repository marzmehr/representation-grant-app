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
      class="mt-4 mb-3 container"
      no-body
    >
      <div style="text-align:center;margin:0 0 1rem 0;font-size:14pt;">
        FORM P2 (RULE 25-3 (2) )
      </div>

      <div class="mt-0 m-0 p-0 row">
        <div style="margin:0 0 0 25.25rem;">
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
        SUBMISSION FOR ESTATE GRANT
      </div>

      <div>
        <div
          style="display:inline-block; font-weight:bold; margin-right:0.5rem;"
        >
          This submission for estate grant is submitted by:
        </div>

        <div
          style="display:inline-block; margin:0.5rem 0;"
          v-for="(name, i) in applicantList"
          :key="i + 50"
        >
          <underline-form
            v-if="i == 0"
            textwidth="21.25rem"
            beforetext=""
            hint=""
            :text="name.fullName"
          />
          <underline-form
            v-else
            textwidth="42rem"
            beforetext=""
            hint=""
            :text="name.fullName"
          />
        </div>
      </div>

      <div style="margin:0.5rem 0 0rem 0rem;">
        <span v-if="applicantList.length > 1"> We are </span>
        <span v-else> I am </span>
        <span
          >applying for the following in relation to the estate of the deceased
          described in Part 1 of this submission for estate grant (the
          "deceased"):</span
        >
      </div>

      <ul>
        <li>Grant of administration without will annexed</li>
        <li>
          <span v-if="applicantList.length > 1"> We are </span>
          <span v-else> I am </span>
          <span
            >submitting with this submission for estate grant an affidavit of
            assets and liabilities in Form P10 for estate grant and therefore do
            not require an authorization to obtain estate grant information.
          </span>
        </li>
      </ul>

      <div style="margin:0.5rem 0 1rem 0rem;">
        <span v-if="applicantList.length > 1"> We </span>
        <span v-else> I </span>
        <underline-form
          textwidth="5rem"
          beforetext="request"
          hint=""
          :text="printCertifiedCopies"
        />
        <span> certified copy(ies) of the estate grant.</span>
      </div>

      <div style="margin:0.5rem 0 0.5rem 0rem;">
        <span>This submission for estate grant has 4 Parts:</span>
      </div>

      <ol style="margin:0rem 0 2rem 0;">
        <div class="mb-2" style="text-indent: 10px;">
          Part 1: Information about the Deceased
        </div>
        <div class="mb-2" style="text-indent: 10px;">
          Part 2: Contact Information about the Applicant(s)
        </div>
        <div class="mb-2" style="text-indent: 10px;">
          Part 3: Documents filed with the submission for estate grant
        </div>
        <div class="mb-2" style="text-indent: 10px;">Part 4: Schedule</div>
      </ol>

      <div class="mt-5">
        <underline-form textwidth="10rem" beforetext="Date" hint="" text="" />
        <underline-form
          style="margin-left:2rem;"
          textwidth="27rem"
          beforetext=""
          :hint="'Signiture of ' + applicantList[0].fullName"
          text=""
        />
      </div>

      <div class="new-page" />

      <!-- <Part 1> -->
      <div
        style="text-align:left;margin:0rem 0 0.5rem 0;font-weight:bold;font-size:12pt;"
      >
        PART 1 - INFORMATION ABOUT THE DECEASED
      </div>

      <div class="ml-4">
        <div>
          <underline-form
            textwidth="29.2rem"
            beforetext="Full legal name of deceased:"
            hint=""
            :text="deceased.fullName"
          />
        </div>

        <div style="margin:1rem 0">
          <span
            >Other names in which the deceased held or may have held an interest
            in property:</span
          >
          <ol>
            <li v-if="deceasedAliases.length == 0" style="text-indent: 10px;">
              none
            </li>
            <li
              v-else
              class="mb-2"
              style="text-indent: 10px;"
              v-for="(name, i) in deceasedAliases"
              :key="i"
            >
              {{ name }}
            </li>
          </ol>
        </div>

        <div style="margin:1rem 0">
          <span>Last residential address of the deceased:</span>
          <ol>
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Street number and street name: "
              hint=""
              :text="deceased.address.street"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="City/Town: "
              hint=""
              :text="deceased.address.city"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Province: "
              hint=""
              :text="deceased.address.state"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Country: "
              hint=""
              :text="deceased.address.country"
            />
            <underline-form
              style="float: right;"
              textwidth="24rem"
              beforetext="Postal Code: "
              hint=""
              :text="deceased.address.postcode"
            />
          </ol>
        </div>

        <div style="margin-top:8rem !important;">
          <underline-form
            textwidth="12rem"
            beforetext="Deceased's date of death: "
            hint=""
            :text="deceased.DOD"
          />
        </div>

        <div style="margin:0.5rem 0 1rem 0rem;">
          <div v-if="!deceasedFirstNations" class="mb-2">
            The deceased was neither a Nisga'a citizen nor a member of a treaty
            first nation.
          </div>
          <div v-else-if="deceasedFirstNations && deceasedNisaga" class="mb-2">
            The deceased was a Nisga'a citizen.
          </div>
          <div v-else-if="deceasedFirstNations && !deceasedNisaga" class="mb-2">
            <underline-form
              textwidth="20rem"
              beforetext="The deceased was a member of the "
              hint=""
              :text="deceasedFirstNationsName"
            />
            treaty first nation.
          </div>
        </div>
      </div>

      <!-- <Part 2> -->
      <div
        style="text-align:left;margin:0rem 0 0.5rem 0;font-weight:bold;font-size:12pt;"
      >
        PART 2 - CONTACT INFORMATION FOR THE APPLICANT(S)
      </div>

      <ol style="margin:0rem 0 0 -1rem;">
        <underline-form
          textwidth="30rem"
          beforetext="Street address for service: "
          hint=""
          :text="serviceContact.address"
        />
        <underline-form
          textwidth="32.35rem"
          beforetext="Telephone Number: "
          hint=""
          :text="serviceContact.phone"
        />
        <underline-form
          textwidth="29.9rem"
          beforetext="E-mail address for service: "
          hint=""
          :text="serviceContact.email"
        />
      </ol>

      <!-- <Part 3> -->
      <div
        style="text-align:left;margin:1rem 0 0.5rem 0;font-weight:bold;font-size:12pt;"
      >
        PART 3 - DOCUMENTS FILED WITH THIS SUBMISSION FOR ESTATE GRANT
      </div>

      <ol>
        <li class="mb-2">
          <underline-form
            textwidth="5rem"
            beforetext="There is one applicant to this submission for estate grant and a "
            hint=""
            text="P5"
          />
          affidavit is filed with this submission for estate grant.
        </li>
        <li class="mb-2">
          No affidavit of delivery is attached. In accordance with Rule 25-2, no
          one, other than the applicant(s), is entitled to notice.
        </li>
        <li class="mb-2">
          Filed with this submission for estate grant are 2 copies of the
          certificate of the chief executive officer under the Vital Statistics
          Act indicating the results of a search for a wills notice filed by or
          on behalf of the deceased.
        </li>
        <li class="mb-2">
          This application is for a grant of administration without will
          annexed.
        </li>
        <li class="mb-2">
          This application is for a grant of administration without will annexed
          and therefore there can be no orders affecting the validity or content
          of a will.
        </li>

        <li class="mb-2">
          This application is for a grant of administration without will annexed
          and therefore there is no will to refer to additional documents.
        </li>

        <li class="mb-2">
          No documents other than those described elsewhere in this submission
          for estate grant are filed with this submission for estate grant.
        </li>

        <li>
          All documents filed with this submission for estate grant are written
          in the English language.
        </li>
      </ol>

      <!-- <Part 4> -->
      <div
        style="text-align:left;margin:0.5rem 0 0.5rem 0;font-weight:bold;font-size:12pt;"
      >
        PART 4 - SCHEDULE
      </div>

      <ol>
        <li class="mb-2" style="text-indent: 5px;">
          Attached to this submission for estate grant is a Schedule for Grant
          of Administration without Will Annexed.
        </li>
      </ol>

      <!-- <NEW PAGE> -->
      <div class="new-page"></div>

      <div
        style="text-align:left;margin:0.5rem 0 0.5rem 0;font-weight:bold;font-size:12pt;"
      >
        SCHEDULE FOR GRANT OF ADMINISTRATION WITHOUT WILL ANNEXED
      </div>

      <ol>
        <li class="mb-2" style="text-indent: 5px;">
          Listed in each of the following paragraphs is every person who falls
          within the class of persons identified by that paragraph:

          <ol class="resetcounter" style="margin:0rem 0 0 0;">
            <li class="bracketalpha">
              spouse, if any, of the deceased:
              <div class="mt-1" style="text-indent: 5px;">{{ spouseName }}</div>
            </li>
            <li class="bracketalpha">
              child(ren), if any, of the deceased:
              <div
                class="mt-1"
                v-if="childrenList.length == 0"
                style="text-indent: 5px;"
              >
                none
              </div>
              <div
                class="mt-1"
                v-if="childrenList.length != 0"
                style="text-indent: 5px;"
              >
                <span v-for="(name, i) in childrenList" :key="i"
                  >{{ name }}<br v-if="i != childrenList.length - 1"
                /></span>
              </div>
            </li>
            <li class="bracketalpha">
              each person, if any, not named in paragraph (a) or (b), who is
              entitled to receive all or part of the estate of a person who dies
              without a will:
              <div class="mt-1" style="text-indent: 5px;">none</div>
            </li>
            <li class="bracketalpha">
              each creditor of the deceased, if any, not named in paragraph (a),
              (b) or (c) whose claim exceeds $10,000:
              <div
                class="mt-1"
                v-if="creditorList.length == 0"
                style="text-indent: 5px;"
              >
                none
              </div>
              <div
                class="mt-1"
                v-if="creditorList.length != 0"
                style="text-indent: 5px;"
              >
                <span v-for="(name, i) in creditorList" :key="i"
                  >{{ name }}<br v-if="i != creditorList.length - 1"
                /></span>
              </div>
            </li>
            <li class="bracketalpha">
              each citor, if any, not named in paragraph (a), (b), (c) or (d):
              <div
                class="mt-1"
                v-if="citorList.length == 0"
                style="text-indent: 5px;"
              >
                none
              </div>
              <div
                class="mt-1"
                v-if="citorList.length != 0"
                style="text-indent: 5px;"
              >
                <span v-for="(name, i) in citorList" :key="i"
                  >{{ name }}<br v-if="i != citorList.length - 1"
                /></span>
              </div>
            </li>
          </ol>
        </li>
      </ol>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { namespace } from "vuex-class";
import "@/store/modules/application";
const applicationState = namespace("Application");

import UnderlineForm from "@/components/steps/submit/pdf/components/UnderlineForm.vue";
import moment from "moment";
import { stepInfoType } from "@/types/Application";

@Component({
  components: {
    UnderlineForm
  }
})
export default class FormP2 extends Vue {
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
  deceasedFirstNations = false;
  deceasedNisaga = false;
  deceasedFirstNationsName = "";
  applicantCourtHouse = "";
  deceased;
  serviceContact;
  printCertifiedCopies = 0;
  spouseName = "";
  childrenList = [];
  otherRelatedPeopleList = [];
  citorList = [];
  creditorList = [];

  mounted() {
    this.dataIsReady = false;
    this.getRepGrantResultData();
    this.getApplicantsInfo();
    this.getDeceasedInfo();
    this.getRelatedPeopleInfo();
    this.getCreditorInfo();
    this.getOverviewInfo();
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

      if (deceasedInfoSurvey.deceasedFirstNations == "y") {
        this.deceasedFirstNations = true;
        this.deceasedNisaga =
          deceasedInfoSurvey.deceasedFirstNationsName == "Nisga'a";
        this.deceasedFirstNationsName =
          deceasedInfoSurvey.deceasedFirstNationsName;
      } else {
        this.deceasedFirstNations = false;
      }
    }
  }

  public getRelatedPeopleInfo() {
    this.childrenList = [];
    this.spouseName = this.deceasedName + "'s spouse";

    if (this.relatedPeopleInfo.length > 0) {
      const spouse = this.relatedPeopleInfo.filter(relatedPerson => {
        return relatedPerson.relationShip == "spouse";
      })[0];
      if (spouse) {
        this.spouseName = Vue.filter("getFullName")(spouse.name);
      }

      const children = this.relatedPeopleInfo.filter(relatedPerson => {
        return relatedPerson.relationShip == "child";
      });
      for (const child of children) {
        this.childrenList.push(Vue.filter("getFullName")(child.name));
      }
    }

    this.otherRelatedPeopleList = [];
  }

  public getApplicantsInfo() {
    if (this.multipleApplicant) {
      this.changeApplicantList();
    } else {
      this.applicantList = [];
      this.citorList = [];

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
            this.applicantList.push(applicantInfo);

            if (applicantInfoSurvey["applicantCitedByName[" + index + "]"]) {
              this.citorList.push(
                applicantInfoSurvey["applicantCitedByName[" + index + "]"]
              );
            }
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

  public getCreditorInfo() {
    if (
      this.steps[4] &&
      this.steps[4].result &&
      this.steps[4].result["debtConfirmationSurvey"] &&
      this.steps[4].result["debtConfirmationSurvey"].data
    ) {
      const debtConfirmationSurvey = this.steps[4].result[
        "debtConfirmationSurvey"
      ].data;

      if (
        debtConfirmationSurvey.p1EarlyNoWillOwe10k &&
        debtConfirmationSurvey.p1EarlyNoWillOwe10k == "y"
      ) {
        this.creditorList = ["creditors TBD"];
      } else {
        this.creditorList = [];
      }
    }
  }

  public getOverviewInfo() {
    if (
      this.steps[7] &&
      this.steps[7].result &&
      this.steps[7].result["finalizeAssetValuesSurvey"] &&
      this.steps[7].result["finalizeAssetValuesSurvey"].data
    ) {
      const overviewInfoSurvey = this.steps[7].result[
        "finalizeAssetValuesSurvey"
      ].data;
      this.printCertifiedCopies = overviewInfoSurvey.PrintCertifiedCopies;
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
    const bottomRightText = `"P2"`;
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
        link.download = "FormP2.pdf";
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
        
        
        result[stepResult] = stepResults[stepResult].data;
      }
    }
    // const protectedPartyName = {protectedPartyName: this.$store.state.Application.protectedPartyName}
    // Object.assign(result, result, protectedPartyName);

    const applicationLocation = this.$store.state.Application
      .applicationLocation;
    const userLocation = this.$store.state.Common.userLocation;
    
    
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

.new-page {
  margin-top: 9rem;
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

ol li.bracketalpha {
  text-indent: -20px;
  margin: 0.75rem 0;
  counter-increment: alpha;
}

ol li.bracketalpha:before {
  content: "(" counter(alpha, lower-alpha) ") ";
}

ol.resetlist {
  list-style: none;
  counter-reset: list-counter;
}
ol li.listnumber {
  text-indent: -25px;
  margin: 1rem 0;
  counter-increment: list-counter;
}
ol li.listnumber:before {
  content: counter(list-counter) ". ";
  font-weight: bold;
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
