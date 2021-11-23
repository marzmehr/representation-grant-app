<template>
  <div v-if="dataIsReady">
    <b-form-group>
      <label style="display:inline-block; margin: 0 1rem 0 0;">Example of filled Form for:</label>
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
    <b-button style="transform:translate(340px,0px)" variant="success" @click="onPrint()">
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
        FORM P10 (RULE 25-3 (2) )
      </div>

      <div class="mt-3 m-0 p-0 row">
        <div style="margin:0 0 0 25.25rem;">
          <div>
            <underline-form textwidth="8.6rem" beforetext="This is the" hint="" text="2nd" />
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
            <underline-form textwidth="9.5rem" beforetext="and was made on" hint="" text="" />
          </div>
          <div class="mt-2">
            <underline-form textwidth="13.2rem" beforetext="" hint="" :text="applicantCourtHouse" />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              Registry
            </div>
          </div>
          <div class="mt-2">
            <underline-form textwidth="14.9rem" beforetext="No." hint="" text="" />
          </div>
        </div>
      </div>

      <div style="text-align:center;margin:1rem 0 1rem 0;font-weight:bold;font-size:14pt;">
        <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
      </div>
      <div style="text-align:center;font-size:12pt;">
        <i>In the Matter of the Estate of {{ deceased.fullName }}, deceased</i>
      </div>
      <div style="text-align:center;margin:1.25rem 0 3rem 0;font-weight:bold;font-size:10pt;">
        AFFIDAVIT OF ASSETS AND LIABILITIES FOR DOMICILED ESTATE GRANT
      </div>

      <div>
        <div
          v-if="applicantList.length > 1"
          style="display:inline-block; text-indent: 5px;margin-right:0.5rem;"
        >
          We,
        </div>
        <div v-else style="display:inline-block; text-indent: 5px;margin-right:0.5rem;">
          I,
        </div>
        <div
          style="display:inline-block; margin:0.5rem 0 0 0;"
          v-for="(name, i) in applicantList"
          :key="i + 50"
        >
          <div v-if="i > 0" style="display:inline-block; width:1.9rem;"></div>
          <underline-form textwidth="17rem" beforetext="" hint="" :text="name.fullName" />
          <underline-form textwidth="11rem" beforetext=", of" hint="" :text="name.address" />
          <underline-form textwidth="9.55rem" beforetext=", " hint="" :text="name.occupation" />
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
          <underline-form
            v-if="applicantList.length > 1"
            style="display:inline-block;"
            textwidth="30.7rem"
            beforetext="We are the applicants for"
            hint=""
            text="a grant of administration without will annexed"
          />
          <underline-form
            v-else
            style="display:inline-block;"
            textwidth="31.5rem"
            beforetext="I am an applicant for"
            hint=""
            text="a grant of administration without will annexed"
          />

          <underline-form
            style="margin:0.5rem 0 0 0 ;display:inline-block;"
            textwidth="23rem"
            beforetext="in relation to the estate of"
            hint=""
            :text="deceased.fullName"
          />
          <div style="margin:0.5rem  0 0 0 ; display:inline; text-indent: 5px;">
            (the "deceased").
          </div>
        </li>

        <!-- <2> -->
        <li class="mt-4">
          <div v-if="applicantList.length > 1" style="margin:0 0 .25rem 0; display:inline-block;">
            We have made a diligent search and inquiry to find the property and liabilities of the
            deceased.
          </div>
          <div v-else style="margin:0 0 .25rem 0; display:inline-block;">
            I have made a diligent search and inquiry to find the property and liabilities of the
            deceased.
          </div>
        </li>
        <!-- <3> -->
        <li class="mt-4">
          <div style="display:inline;">
            Attached to this affidavit as Exhibit A is a Statement of Assets, Liabilities and
            Distribution that discloses
            <ol style="margin-left: -1.25rem;" class="resetcounter">
              <li class="bracketalpha">
                all of the property of the deceased, irrespective of its location, nature or value,
                that passes to the applicant in the applicant's capacity as the deceased's personal
                representative,
              </li>
              <li class="bracketalpha">the value of that property, and</li>
              <li class="bracketalpha">
                the liabilities that charge or encumber that property.
              </li>
            </ol>
          </div>
        </li>
        <!-- <4> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            If we determine that there is any property or liability that has not been disclosed in
            Exhibit A, or that information contained in this affidavit is incorrect or incomplete,
            we will promptly after learning of the same file an affidavit of assets and liabilities
            in Form P14 to disclose the correct and complete information.
          </div>
          <div v-else style="display:inline;">
            If I determine that there is any property or liability that has not been disclosed in
            Exhibit A, or that information contained in this affidavit is incorrect or incomplete, I
            will promptly after learning of the same file an affidavit of assets and liabilities in
            Form P14 to disclose the correct and complete information.
          </div>
        </li>

        <div v-if="applicantList.length == 1" class="new-page"></div>

        <!-- <5> -->
        <li class="mt-3">
          <div v-if="applicantList.length > 1" style="display:inline;">
            In addition to the probate fees payable in relation to any property disclosed in Exhibit
            A, we promise to pay the Minister of Finance the probate fees payable with respect to
            the value of any property that passes to us as the deceased's personal representative,
            and that is not disclosed in Exhibit A, on a determination being made as to the value of
            that asset.
          </div>
          <div v-else style="display:inline;">
            In addition to the probate fees payable in relation to any property disclosed in Exhibit
            A, I promise to pay the Minister of Finance the probate fees payable with respect to the
            value of any property that passes to me as the deceased's personal representative, and
            that is not disclosed in Exhibit A, on a determination being made as to the value of
            that asset.
          </div>
        </li>
      </ol>

      <div class="mt-2 row">
        <div class="col-7">
          <div style="margin:0.5rem 0 1rem 0rem;">
            SWORN (OR AFFIRMED) BEFORE ME
          </div>
          <underline-form textwidth="12.5rem" beforetext="at" hint="Commissioner City" text="" />
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
          <div v-for="(name, i) in applicantList" :key="i + 250">
            <underline-form
              :style="{ marginTop: getSignatureMargin() }"
              textwidth="19rem"
              beforetext=""
              :italicHint="false"
              hintFontSize="10pt"
              :hint="'Signature of ' + name.fullName"
              text=""
            />
          </div>
        </div>
      </div>

      <!-- <TABLE PAGE> -->
      <div class="new-page"></div>

      <div class="mt-0 m-0 p-0 row">
        <div style="margin:0 0 0 auto;">
          <div>
            <div style="display:inline-block;">
              This is Exhibit A referred to in the affidavit of
            </div>
          </div>
          <div class="mt-1">
            <underline-form
              textwidth="11.5rem"
              beforetext=""
              hint=""
              :text="getAllApplicants(25)"
            />
            <div style="display:inline-block; ">, sworn (or affirmed)</div>
          </div>
          <div class="mt-1">
            <underline-form
              style="margin:0 0 0 0;"
              textwidth="13.5rem"
              beforetext=" before me on"
              hint=""
              text=""
            />
          </div>
          <div class="mt-1">
            <underline-form textwidth="19.25rem" beforetext="" hint="" text="" />
          </div>
        </div>
      </div>

      <div style="text-align:center;margin:1rem 0 0 0;font-weight:bold;font-size:14pt;">
        Statement of Assets, Liabilities and Distribution
      </div>
      <div style="margin-top:1rem;">
        <b-table :fields="realEstateFields" :items="realEstateItems" small>
          <template v-slot:head(part)>
            <div style="white-space: pre;">Part I <br /></div>
            <div>
              Real Property located within British Columbia
              <span style="font-weight:normal;"
                >(including mortgages and vendors' and purchasers' interests in agreements for
                sale)</span
              >
            </div>
          </template>
          <template v-slot:cell(part)="data">
            <div v-if="data.value == 'TOTAL'" style="text-align:right; font-weight:bold;">
              {{ data.value }}
            </div>
            <div v-else>{{ data.value }}</div>
          </template>
          <template v-slot:cell(value)="data">
            <div v-if="data.item.part == 'TOTAL'" style="font-weight:bold; text-align:right;">
              {{ data.value }}
            </div>
            <div v-else style="text-align:right;">{{ data.value }}</div>
          </template>
        </b-table>

        <b-table :fields="personalTangibleFields" :items="personalTangibleItems" small>
          <template v-slot:head(part)>
            <div style="white-space: pre;">Part II <br /></div>
            <div>
              Tangible Personal Property within British Columbia
              <span style="font-weight:normal;"
                >(including vehicles, furniture and other physical items)</span
              >
            </div>
          </template>
          <template v-slot:cell(part)="data">
            <div v-if="data.value == 'TOTAL'" style="text-align:right; font-weight:bold;">
              {{ data.value }}
            </div>
            <div v-else>{{ data.value }}</div>
          </template>
          <template v-slot:cell(value)="data">
            <div v-if="data.item.part == 'TOTAL'" style="font-weight:bold; text-align:right;">
              {{ data.value }}
            </div>
            <div v-else style="text-align:right;">{{ data.value }}</div>
          </template>
        </b-table>

        <b-table :fields="personalIntangibleFields" :items="personalIntangibleItems" small>
          <template v-slot:head(part)>
            <div style="white-space: pre;">Part III <br /></div>
            <div>
              Intangible Personal Property anywhere in the world
              <span style="font-weight:normal;"
                >(including bank accounts, intellectual property and other valuable items that
                cannot be touched by hand)</span
              >
            </div>
          </template>
          <template v-slot:cell(part)="data">
            <div v-if="data.value == 'TOTAL'" style="text-align:right; font-weight:bold;">
              {{ data.value }}
            </div>
            <div v-else v-html="data.value">{{ data.value }}</div>
          </template>
          <template v-slot:cell(value)="data">
            <div
              v-if="data.item.part == 'TOTAL'"
              style="font-weight:bold; text-align:right;"
              v-html="data.value"
            >
              {{ data.value }}
            </div>
            <div v-else v-html="data.value" style="text-align:right;">
              {{ data.value }}
            </div>
          </template>
        </b-table>

        <div style="margin:0.5rem 1rem 0.5rem 8rem;display:inline-block;">
          <b>GROSS VALUE OF ASSETS LESS SECURED DEBTS</b>
        </div>
        <div
          style="float:right; border:1px solid;height:2.25rem; width:10rem; font-weight:bold; text-align:right; margin:0rem 0 0.5rem 1.5rem;padding:0.5rem 0.25rem 0 0.25rem;"
        >
          {{ totalAssetsValue | currencyFormat }}
        </div>
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UnderlineForm from "@/components/pdf/components/UnderlineForm.vue";

import moment from "moment";
import axios, { AxiosRequestConfig } from "axios";
import { getApplicationId } from "@/state/application-state";
import { onPrint } from "@/utils/utils";

@Component({
  components: {
    UnderlineForm
  }
})
export default class FormP10 extends Vue {
  deceasedName = {};
  dataIsReady = false;
  multipleApplicant = false;
  applicantList = [];
  applicantCourtHouse = "";
  deceased;
  totalAssetsValue = 0;
  // serviceContact;

  realEstateFields = [
    {
      key: "part",
      thClass: "border-dark",
      tdClass: "border-dark c1",
      thStyle: "width:30rem;",
      label:
        "Part I, Real Property (including mortgages and vendors' and purchasers' interests in agreements for sale)"
    },
    {
      key: "value",
      thClass: "border-dark text-center align-middle",
      tdClass: "border-dark c3 pl-0",
      thStyle: "width:9.25rem;",
      label: "Value at Death"
    }
  ];
  realEstateItems = [
    { part: "none", value: "$0.00" },
    { part: "TOTAL", value: "$0.00" }
  ];

  personalTangibleFields = [
    {
      key: "part",
      thClass: "border-dark",
      tdClass: "border-dark c1",
      thStyle: "width:30rem;",
      label: "Part II, Personal Property (all assets except real property)"
    },
    {
      key: "value",
      thClass: "border-dark text-center align-middle",
      tdClass: "border-dark c3 pl-0",
      thStyle: "width:9.25rem;",
      label: "Value at Death"
    }
  ];
  personalTangibleItems = [
    { part: "none", value: "$0.00" },
    { part: "TOTAL", value: "$0.00" }
  ];

  personalIntangibleFields = [
    {
      key: "part",
      thClass: "border-dark",
      tdClass: "border-dark c1",
      thStyle: "width:30rem;",
      label: "Part III, Liabilities"
    },
    {
      key: "value",
      thClass: "border-dark text-center align-middle",
      tdClass: "border-dark c3 pl-0",
      thStyle: "width:9.25rem;",
      label: "Value at Death"
    }
  ];
  personalIntangibleItems = [
    { part: "none", value: "$0.00" },
    { part: "TOTAL", value: "$0.00" }
  ];

  mounted() {
    this.dataIsReady = false;
    this.getApplicantsInfo();
    this.getDeceasedInfo();
    this.getBelongingsInfo();
    this.dataIsReady = true;
  }

  public getDeceasedInfo() {}

  public getApplicantsInfo() {
    if (this.multipleApplicant) {
    } else {
      this.applicantList = [];
    }
  }

  public getBelongingsInfo() {
    this.realEstateItems = [
      { part: "none", value: "$0.00" },
      { part: "TOTAL", value: "$0.00" }
    ];

    this.personalTangibleItems = [
      { part: "none", value: "$0.00" },
      { part: "TOTAL", value: "$0.00" }
    ];

    this.personalIntangibleItems = [
      { part: "none", value: "$0.00" },
      { part: "TOTAL", value: "$0.00" }
    ];
    let belongingsInfo = {};
    if (belongingsInfo["vehiclesSurvey"] && belongingsInfo["vehiclesSurvey"].data) {
      const vehiclesSurvey = belongingsInfo["vehiclesSurvey"].data;
      if (vehiclesSurvey.vehicleExists && vehiclesSurvey.vehicleExists == "y") {
        console.log("has vehicle");
      }
    }

    if (belongingsInfo["bankAccountsSurvey"] && belongingsInfo["bankAccountsSurvey"].data) {
      const bankAccountsSurvey = belongingsInfo["bankAccountsSurvey"].data;
      if (
        bankAccountsSurvey.bankAccountExists &&
        bankAccountsSurvey.bankAccountExists == "y" &&
        bankAccountsSurvey.bankAccountInfoPanel &&
        bankAccountsSurvey.bankAccountInfoPanel.length > 0
      ) {
        this.personalIntangibleItems = [];
        let totalValue = 0;
        for (const bankIndex in bankAccountsSurvey.bankAccountInfoPanel) {
          const bankInfo = bankAccountsSurvey.bankAccountInfoPanel[bankIndex];

          const bankName = bankInfo.bankName;
          let bankRow = Number(bankIndex) + 1 + ". " + bankName;
          let valueRow = "";

          if (bankInfo.accountPanel && bankInfo.accountPanel.length > 0) {
            bankRow = bankRow + '<ol style="list-style-type: lower-alpha;">';

            for (const accountIndex in bankInfo.accountPanel) {
              const accountInfo = bankInfo.accountPanel[accountIndex];
              const accountNumber = accountInfo.accountNumber;
              const accountType = accountInfo.accountType;
              if (accountInfo.accountValue && accountInfo.accountValue == "other") {
                if (accountInfo.accountValueComment) {
                  valueRow =
                    valueRow +
                    "<br>" +
                    Vue.filter("currencyFormat")(accountInfo.accountValueComment);
                  totalValue = totalValue + Number(accountInfo.accountValueComment);
                }
              } else if (
                accountInfo.accountValue &&
                accountInfo.accountValue == "willGetValueLater"
              ) {
              }

              bankRow = bankRow + "<li >" + accountType + " Account # " + accountNumber + "</li>";
            }
            bankRow = bankRow + "</ol>";
          }

          this.personalIntangibleItems.push({
            part: bankRow,
            value: valueRow
          });
        }
        // console.log(Vue.filter('currencyFormat')(totalValue))
        this.personalIntangibleItems.push({
          part: "TOTAL",
          value: Vue.filter("currencyFormat")(totalValue)
        });
        this.totalAssetsValue = this.totalAssetsValue + totalValue;
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
    onPrint("FormP10");
  }

  public getRepGrantResultData() {}
}
</script>
<style scoped>
.table >>> th.border-dark {
  border: 1px solid #313131 !important;
}
.table >>> td.border-dark {
  height: 2.5rem;
  border: 1px solid #313131 !important;
}

.table >>> td.c1 {
  height: 2rem;
}

.table >>> td.c2 {
  height: 2rem;
}

.table >>> td.c3 {
  height: 2rem;
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
  margin-top: 10rem;
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

ol li.bracketalpha {
  text-indent: -20px;
  margin: 0.75rem 0;
  counter-increment: alpha;
}
ol li.bracketalpha:before {
  content: "(" counter(alpha, lower-alpha) ") ";
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
