<template>
  <div>
    <b-button
      style="transform:translate(500px,0px)"
      variant="success"
      @click="onPrint()"
    >
    </b-button>
    <b-card
      id="print"
      style="border:1px solid; border-radius:5px;padding:2rem 3rem 2rem 2rem;"
      bg-variant="white"
      class="mt-4 mb-3"
    >
      <div style="text-align:center;margin:4rem 0 0 -1.3rem;font-weight: 300;font-size:20px;">
        FORM P9 (RULE 25-3 (2) )
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
        hint="Deceased’s Legal Name"
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
          hint="Full Name of Applicant(s)"
          :text="name.fullName"
        />
        <underline-form
          textwidth="25rem"
          beforetext=", of"
          hint="Street, City/Town, Province, Country and Postal Code"
          :text="name.address"
        />
        <underline-form
          textwidth="10.5rem"
          beforetext=", "
          hint="Occupation"
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
          <div v-if="applicantList.length > 1">
            We delivered a copy of the notice, along with
          </div>
          <div v-else>I delivered a copy of the notice, along with</div>

          <underline-form
            style="margin:0.5rem 0 0 0 ;display:inline-block;"
            textwidth="40rem"
            beforetext=""
            hint=""
            text=""
          />
          <div style="margin:0.5rem  0 0 0 ; display:inline; text-indent: 5px;">
            to the following persons as follows:
          </div>

          <check-box
            style="margin-top:1rem;"
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by mailing it/them to the following persons by ordinary mail:"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="41.5rem"
            beforetext=""
            hint=""
            text="lawyer1"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="15rem"
            beforetext="on"
            hint="Mailed Date"
            text="January 3, 2021"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="41.5rem"
            beforetext=""
            hint=""
            text="lawyer2"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="15rem"
            beforetext="on"
            hint="Mailed Date"
            text="January 3, 2021"
          />

          <check-box
            style="margin-top:1rem;"
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by handing it/them to and leaving it/them with the following persons as follows:"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="41.5rem"
            beforetext=""
            hint=""
            text="lawyer1"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="15rem"
            beforetext="on"
            hint="Served Date"
            text="January 3, 2021"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="41.5rem"
            beforetext=""
            hint=""
            text="lawyer2"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="15rem"
            beforetext="on"
            hint="Served Date"
            text="January 3, 2021"
          />

          <check-box
            style="margin-top:1rem;"
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by sending it/them to the following persons by e-mail, fax or other electronic means to that person"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="41.5rem"
            beforetext=""
            hint=""
            text="lawyer1"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="15rem"
            beforetext="on"
            hint="Served Date"
            text="January 3, 2021"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="41.5rem"
            beforetext=""
            hint=""
            text="lawyer2"
          />
          <underline-form
            style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
            textwidth="15rem"
            beforetext="on"
            hint="Served Date"
            text="January 3, 2021"
          />

          <check-box
            style="margin-top:1rem;word-spacing:6.5px;text-align-last:justify;"
            shift="40"
            shiftmark="0"
            :check="check2"
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

        <!-- <3> -->
        <!-- Keep this here for now.
        <li class="mt-4">
          <div class="mt-3" v-for="(successor, i) in successorsRep" :key="i + 200">
            <underline-form
              v-if="applicantList.length > 1"
              style="display:inline-block;"
              textwidth="31rem"
              beforetext="We delivered the document(s) referred to in section 2 to "
              hint="Name of Personal Rep/Parent/Committee/etc"
              :text="successor.repName"
            />
            <underline-form
              v-else
              style="display:inline-block;"
              textwidth="32.2rem"
              beforetext="I delivered the document(s) referred to in section 2 to "
              hint="Name of Personal Rep/Parent/Committee/etc"
              :text="successor.repName"
            />
            <div style="display:inline-block; text-indent: 5px;">
              in his/her capacity as the
            </div>
            <underline-form
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="18rem"
              beforetext=""
              hint="(Personal Rep/Parent/Committee/etc)"
              :text="successor.repType"
            />
            <underline-form
              style="margin:0.5rem 0 ;display:inline-block; text-indent: 5px;"
              textwidth="25.85rem"
              beforetext="of"
              hint="Successor Name"
              :text="successor.successorName"
            />
          </div>
        </li>
        -->

        <!-- <4> -->
        <!-- Keep this here for now.
        <li class="mt-4 text-justify">
          <div v-if="applicantList.length > 1" style="display:inline;">
            In accordance with Rule 25-2, we delivered a copy of the document(s) referred to in
            section 2 to the Public Guardian and Trustee as follows:
          </div>

          <div v-else style="display:inline;">
            In accordance with Rule 25-2, I delivered a copy of the document(s) referred to in
            section 2 to the Public Guardian and Trustee as follows:
          </div>
          <check-box
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by mailing it/them to the Public Guardian and Trustee by ordinary mail."
          />
          <check-box
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by handing it/them to and leaving it/them with the Public Guardian and Trustee."
          />
          <check-box
            shift="0"
            shiftmark="0"
            :check="check2"
            text="by sending it/them to the Public Guardian and Trustee by-mail, fax or 
                    other electronic means to that person."
          />
        </li>
        -->
      </ol>

      <div class="mt-5 row">
        <div class="col-6">
          <div style="margin:0.5rem 0 1rem 0rem;font-weight: 300;font-size:18px;">
            SWORN (OR AFFIRMED) BEFORE ME
          </div>
          <underline-form textwidth="15rem" beforetext="at" hint="Commissioner City" text="" />
          <div style="margin:0.5rem 0 ; display:inline; text-indent: 5px;">
            , British Columbia
          </div>

          <underline-form
            style="margin:0.75rem 0 ;"
            textwidth="24rem"
            beforetext="on"
            hint="Swear/Affirm Date"
            text=""
          />
          <underline-form
            style="margin:0.5rem 0 ;"
            textwidth="25rem"
            beforetext=""
            hint="Commissioner Signature"
            text=""
          />
          <div style="margin:0.5rem 0 ;font-size:14px; ">
            A commissioner for taking affidavits for British Columbia
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
import { Component, Vue } from "vue-property-decorator";

import { namespace } from "vuex-class";
import "@/store/modules/application";
const applicationState = namespace("Application");

import UnderlineForm from "./components/UnderlineForm.vue";
import CheckBox from "./components/CheckBox.vue";

@Component({
  components: {
    UnderlineForm,
    CheckBox
  }
})
export default class FormP9 extends Vue {
  @applicationState.Action
  public UpdateGotoPrevStepPage!: () => void;

  @applicationState.Action
  public UpdateGotoNextStepPage!: () => void;

  check = ""; //"&#10003"
  check2 = "&#10003";

  applicantList = [];
  successorsRep = [
    { repName: "RIP mother", repType: "Parent", successorName: "RIP child" },
    {
      repName: "RIP layer",
      repType: "Lawyer",
      successorName: "RIP second child"
    }
  ];
  deceased = {
    fullName: "Rest In Peace",
    first: "Rest",
    middle: "In",
    last: "Peace",
    address: "0-123 st, Victoria, BC, Canada V0i 8i8"
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
    this.changeApplicantList();
  }

  public changeApplicantList() {
    this.applicantList = [];
    this.applicantList.push({
      fullName: "Its first Son",
      first: "Its",
      middle: "first",
      last: "Son",
      address: "0-123 st, Victoria, BC, Canada V0i 8i8",
      notIndividual: "",
      individual: "yes",
      sameMail: "",
      differentMail: "yes",
      differentAddress: "New York, USA",
      occupation: "work",
      city: "Victoria",
      state: "BC",
      country: "Canada",
      section130: "(a)"
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
