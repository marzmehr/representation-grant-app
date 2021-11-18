<template>
  <div>
    <b-button style="transform:translate(500px,0px)" variant="success" @click="onPrint()">
    </b-button>
    <b-card
      id="print"
      style="border:1px solid; border-radius:5px;padding:2rem 3rem 2rem 2rem;"
      bg-variant="white"
      class="mt-4 mb-3"
    >
      <div style="text-align:center;margin:4rem 0 0 -1.3rem;font-weight: 300;font-size:20px;">
        FORM P9 (RULE 25-3 (2))
      </div>

      <div class="mt-3 m-0 p-0 row">
        <div style="margin:0 0 0 40rem;">
          <div>
            <underline-form
              textwidth="10.6rem"
              beforetext="This is the"
              hint="1st/2nd/3rd..."
              text="1st"
            />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              affidavit
            </div>
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="12.8rem"
              beforetext="of"
              hint="Applicant Name"
              :text="getAllApplicants(25)"
            />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              in this case
            </div>
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="11rem"
              beforetext="and was made on"
              hint="Affidavit Date (dd mmm yyyy)"
              text="20 Apr 2020"
            />
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="15rem"
              beforetext=""
              hint="Court Location (leave blank for Commissioner)"
              text="Victoria"
            />
            <div style="display:inline-block; margin:0 0 0 0.5rem; padding:0;">
              Registry
            </div>
          </div>
          <div class="mt-2">
            <underline-form
              textwidth="18rem"
              beforetext="No."
              hint="File Number (leave blank for Registry)"
              text="2020REP_abc"
            />
          </div>
        </div>
      </div>

      <div style="text-align:center;margin:1rem 0 1rem -1.3rem;font-weight: 600;font-size:24px;">
        <i>IN THE SUPREME COURT OF BRITISH COLUMBIA</i>
      </div>
      <div style="display:inline-block; text-indent: 5px;">
        <i>In the Matter of the Estate of</i>
      </div>
      <underline-form
        textwidth="37rem"
        beforetext=""
        :text="deceased.fullName"
      />
      <div style="display:inline-block; text-indent: 5px;">
        <i>, deceased</i>
      </div>
      <div style="text-align:center;margin:2rem 0 2rem -1.3rem;font-weight: 600;font-size:20px;">
        AFFIDAVIT OF DELIVERY
      </div>

      <div v-if="applicantList.length > 1" style="display:inline-block; text-indent: 5px;">
        We
      </div>
      <div v-else style="display:inline-block; text-indent: 5px;">I</div>
      <div
        style="display:inline-block; margin:0.5rem 0;"
        v-for="(name, i) in applicantList"
        :key="i + 50"
      >
        <div v-if="i > 0" style="display:inline-block; width:1.9rem;"></div>
        <underline-form
          textwidth="20rem"
          beforetext=""
          :text="name.fullName"
        />
        <underline-form
          textwidth="25rem"
          beforetext=", of"
          :text="name.address"
        />
        <underline-form
          textwidth="10.5rem"
          beforetext=", "
          :text="name.occupation"
        />
        <div style="display:inline-block;">,</div>
      </div>
      <div
        v-if="applicantList.length > 1"
        style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;"
      >
        SWEAR (OR AFFIRM) JOINTLY THAT:
      </div>
      <div v-else style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;">
        SWEAR (OR AFFIRM) THAT:
      </div>

      <ol style="margin:0rem 0 0 -1.5rem;">
        <!-- <1> -->
        <li class="mt-4 text-justify">
          <div style="display:inline;">
            Attached to this affidavit and marked as Exhibit A is a copy of a notice of proposed
            application in Form P1 (the "notice").
          </div>
        </li>

        <!-- <2> -->
        <li class="mt-4 text-justify ">
          <div>I delivered a copy of the notice

            to the following persons as follows:
          </div>

          <check-box
            style="margin-top:1rem;"
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by mailing it/them to the following persons by ordinary mail:"
          />
          <template v-for="recipient in recipientList">
            <underline-form
              :key="recipient"
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="41.5rem"
              beforetext=""
              hint=""
              :text="recipient.p1DelivererName"
            />
            <underline-form
              :key="recipient"
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="15rem"
              beforetext="on"
              :text="recipient.p1DeliveryDate"
            />
          </template>

          <check-box
            style="margin-top:1rem;"
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by handing it/them to and leaving it/them with the following persons:"
          />
          <template v-for="recipient in recipientList">
            <underline-form
              :key="recipient"
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="41.5rem"
              beforetext=""
              hint=""
              :text="recipient.p1DelivererName"
            />
            <underline-form
              :key="recipient"
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="15rem"
              beforetext="on"
              :text="recipient.p1DeliveryDate"
            />
          </template>

          <check-box
            style="margin-top:1rem;"
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by sending it/them to the following persons by e-mail, fax or other electronic means to that person:"
          />
          <template v-for="recipient in recipientList">
            <underline-form
              :key="recipient"
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="41.5rem"
              beforetext=""
              hint=""
              :text="recipient.p1DelivererName"
            />
            <underline-form
              :key="recipient"
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="15rem"
              beforetext="on"
              :text="recipient.p1DeliveryDate"
            />
          </template>

          <check-box
            style="margin-top:1rem;word-spacing:6.5px;text-align-last:justify;"
            shift="40"
            shiftmark="0"
            :check="false"
            text="Each of the persons who received delivery by e-mail, fax or other electronic means has, in writing,"
          />
          <div style=" text-indent: 70px;">
            acknowledged receipt of the document(s) referred to in this section.
          </div>

          <check-box
            v-if="applicantList.length > 1"
            style="margin-top:1rem; word-spacing:5.5px;"
            shift="40"
            shiftmark="0"
            :check="check2"
            text="We will retain a copy of those acknowledgements until the personal representative of the deceased is"
          />
          <check-box
            v-else
            style="margin-top:1rem; word-spacing:6.5px;"
            shift="40"
            shiftmark="0"
            :check="check2"
            text="I will retain a copy of those acknowledgements until the personal representative of the deceased is"
          />
          <div style="margin:0 0rem 0 4.5rem;">
            discharged and will produce those acknowledgements promptly after being requested to do
            so by the registrar.
          </div>
        </li>
      </ol>

      <div class="mt-5 row">
        <div class="col-6">
          <div style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;">
            SWORN (OR AFFIRMED) BEFORE ME
          </div>
          <underline-form textwidth="15rem" beforetext="at" text="" hint="Commissioner City" />
          <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">
            , British Columbia
          </div>

          <underline-form
            style="margin:0.75rem 0 ;"
            textwidth="24rem"
            beforetext="on"
            text=""
            hint="Swear/Affirm Date"
          />
          <underline-form
            style="margin:0.5rem 0 ;"
            textwidth="25rem"
            beforetext=""
            text=""
            hint="A commissioner for taking affidavits for British Columbia"
          />
          <div style="margin:0.5rem 0 ;font-size:14px; ">

          </div>
          <underline-form
            style="margin:.5rem 0 ;"
            textwidth="25rem"
            beforetext=""
            hint="[print name or affix stamp of commissioner]"
            text=""
          />
        </div>
        <div class="col-6 border-left">
          <div v-for="(name, i) in applicantList" :key="i + 250">
            <underline-form
              :style="{ marginTop: getSignatureMargin() }"
              textwidth="29rem"
              beforetext=""
              :hint="'Signature of ' + name.fullName"
              text=""
            />
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getPotentialApplicants } from "@/components/survey/survey-state"

import { namespace } from "vuex-class";
import "@/store/modules/application";
const applicationState = namespace("Application");

import UnderlineForm from "./components/UnderlineForm.vue";
import CheckBox from "./components/CheckBox.vue";
import { all } from "underscore";

@Component({
  components: {
    UnderlineForm,
    CheckBox
  }
})
export default class FormP9 extends Vue {
  @Prop({ required: false })
  survey;

  @applicationState.Action
  public UpdateGotoPrevStepPage!: () => void;

  @applicationState.Action
  public UpdateGotoNextStepPage!: () => void;

  check = ""; //"&#10003"
  check2 = "&#10003";

  applicantList = [];
  recipientList = [];
  successorsRep = [
    { repName: "RIP mother", repType: "Parent", successorName: "RIP child" },
    {
      repName: "RIP layer",
      repType: "Lawyer",
      successorName: "RIP second child"
    }
  ];
  deceased = {
    fullName: "Rest In Peace"
  };
  serviceContact = {
    address: "0-123 st, Victoria, BC, Canada V0i 8i8",
    phone: "+1 123 456 7890",
    fax: "+1 123 456 7890",
    email: "ABC@yahoo.ca"
  };
  form5Info = {
    applicantFullName: "Its first daughter",
    first: "Its",
    middle: "first",
    last: "Daughter",
    date: "20 March 2020"
  };

  mounted() {
    if (this.survey) {
      this.populateForm(this.survey);
    } else {
      this.changeApplicantList();  
    }
  }

  public changeApplicantList() {
    this.applicantList = [];
    this.applicantList.push({
      courthouse: "The main courthouse",
      address: "123 Some Street",
      fullName: "Douglas W.R. Rodgers",
      occupation: "Learned Doctor",
      p1DeliveryMethod: "in person",
      p1DeliveryDate: "2021-11-17",
      p1DeliveryElectronicReceipt: "yes",
      p1DeliveryElectronicReceiptRetain: "confirm",
      // not sure about these items
      individual: "yes",
      sameMail: "",
      differentMail: "",
      differentAddress: "",
    });
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

    const url = "/survey-print/" + applicationId + "/?name=representation-grant";
    const body = Vue.filter("printPdf")(el.innerHTML, `"SCCRPF  02/2021 \a         Form P9";`);
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
        link.download = "FormP9.pdf";
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      },
      err => {
        console.error(err);
      }
    );
  }

  private getApplicantQuestion(questions) {
    for (const question of questions) {
      if (question.name === "applicant") {
        return question;
      }
    }
  }

  private buildInitialApplicantList(applicantQuestion) {
    const template = [
      "courthouse",
      "address",
      "fullName",
      "occupation",
      "p1DelivererName",
      "p1DeliveryMethod",
      "p1DeliveryDate",
      "p1DeliveryElectronicReceipt",
      "p1DeliveryElectronicReceiptRetain",
      // not sure about these items
      "individual",
      "sameMail",
      "differentMail",
      "differentAddress",
    ]

    const applicants = applicantQuestion.value;
    const choices = applicantQuestion.choices;

    let count = 0;
    while (count < applicants.length) {
      let newApplicant = {};
      for (const item of template) {
        newApplicant[item] = "";
      }
      this.applicantList.push(newApplicant);
      count++;
    }

    for (const a in applicants) {
      for (const c in choices) {
        if (applicants[a] === choices[c].value) {
          this.applicantList[a].fullName = applicantQuestion.choices[c].text;
        }
      }
    }
    return this.applicantList.length;
  }

  private buildInitialRecipeintList(recipientQuestion) {
    const template = [
      "p1DelivererName",
      "p1DeliveryMethod",
      "p1DeliveryDate",
      "p1DeliveryElectronicReceipt",
      "p1DeliveryElectronicReceiptRetain",
    ]
    console.log(recipientQuestion);
    const recipients = recipientQuestion.value;

    for (const i in recipients) {
      // use template to set up list item
      let newRecipient = {};
      for (const item of template) {
        newRecipient[item] = "";
      }
      this.recipientList.push(newRecipient);

      // gives us `s0` and we need to get the name from that
      const target = recipients[i].p1DelivererName;

      for (const question of recipientQuestion.panels[i].questions) {
        if (question.name === "p1DelivererName") {
          for (const choice of question.choices) {
            if (target === choice.value) {
              this.recipientList[i].p1DelivererName = choice.text;
            }
          }
        }
      }
    }
    
    console.log("result");
    console.log(this.recipientList);
    return this.recipientList.length;
  }

  private getRecipientQuestion(questions) {
    for (const question of questions) {
      if (question.name === "p1DeliveryInfoPanel") {
        return question;
      }
    }
  }

  private buildRecipientList(allQuestions) {
    const recipientQuestion = this.getRecipientQuestion(allQuestions);
    const numRecipients = this.buildInitialRecipeintList(recipientQuestion);
    for (let idx = 0; idx < numRecipients; idx++) {
      this.recipientList[idx].p1DeliveryMethod = recipientQuestion.value[idx].p1DeliveryMethod || "";
      this.recipientList[idx].p1DeliveryDate = recipientQuestion.value[idx].p1DeliveryDate || "";
      this.recipientList[idx].p1DeliveryElectronicReceipt = recipientQuestion.value[idx].p1DeliveryElectronicReceipt || "";
      this.recipientList[idx].p1DeliveryElectronicReceiptRetain = recipientQuestion.value[idx].p1DeliveryElectronicReceiptRetain ? recipientQuestion.value[idx].p1DeliveryElectronicReceiptRetain[0] : "";
    }
    console.log("recipient list");
    console.log(this.recipientList);
  }

  private getDeceasedName(allQuestions) {
    for (const currQuestion of allQuestions) {
      if (currQuestion.name === "deceasedName") {
        const first = currQuestion.value.first || "";
        const middle = currQuestion.value.middle || "";
        const last = currQuestion.value.last || "";
        this.deceased["fullName"] = first + " " + middle + " " + last;
      }
    }
  }

  private buildApplicantList(allQuestions) {
    const applicantQuestion = this.getApplicantQuestion(allQuestions);
    const numApplicants = this.buildInitialApplicantList(applicantQuestion);

    for (const currQuestion of allQuestions) {
      if (currQuestion.name === "applicantInfoPanel") {
        for (let idx = 0; idx < numApplicants; idx++) {
          const base = currQuestion.value[idx]?.applicantOrdinaryAddress;
          const street = base.street || "";
          const city = base.city || "";
          const state = base.state || "";
          const country = base.country || "";
          const postcode = base.postcode || "";
          this.applicantList[idx].address = street + ", " + city + ", " + state + ", " + country + " " + postcode;
          this.applicantList[idx].occupation = currQuestion.value[idx].applicantOccupation || "";
        }
      }
    }  
  }

  /* 
  Fields of interest from surveyJS:
  These fields will have to be put together from a bunch of different places. 
  They will need to be transformed I believe.. as an applicantPanel doesn't exist (it takes it from different places).
  The responsbility of this component isn't to transform the data, it's simply to display the data.

  applicantInfoPanel:
    applicantCourthouse
    applicantOrdinaryAddress
    applicantOccupation

  p1DeliveryInfoPanel
    p1DelivererName
    p1DeliveryMethod
    p1DeliveryDate
    p1DeliveryElectronicReceipt
    p1DeliveryElectronicReceiptRetain

  deceasedName
  */
  public populateForm(survey) {
    const allQuestions = survey.getAllQuestions();
    this.buildApplicantList(allQuestions);
    this.buildRecipientList(allQuestions);
    this.getDeceasedName(allQuestions);
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
</style>
