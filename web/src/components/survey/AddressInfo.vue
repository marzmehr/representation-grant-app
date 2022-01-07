<template>
  <div class="survey-address">
    <div class="row survey-address-line" v-if="selOptions.length">
      <div class="col-sm-6">
        <label class="survey-sublabel">Copy from:</label>
        <div ref="copyFrom" @change="fillInData">
          <div class="form-control-sm ml-2 no-border" v-for="(opt, inx) in selOptions" :key="inx" >
            <input
              type="radio"
              name="prevAddressOpt"
              :value="opt.value">
            {{ opt.label }}
          </div>
          <div class="form-control-sm ml-2 no-border">
            <input type="radio" name="prevAddressOpt" value=""> Manual Entry
          </div>
        </div>
      </div>
    </div>
    <div class="row survey-address-line" v-if="fields.useStreet">
      <div class="col-sm-6">
        <label class="survey-sublabel">Street Address</label>
        <input
          class="form-control"
          :id="question.inputId"
          v-model="pendingValue['street']"
          @change="updateValue"
          :readonly="readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="fields.useCity">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-city'">City / Town</label>
        <input
          class="form-control"
          :id="question.inputId + '-city'"
          v-model="pendingValue['city']"
          @change="updateValue"
          :readonly="readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line pb-1" v-if="fields.useCountry">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-country'">Country</label>
        <select
          class="form-control"
          v-model="pendingValue['country']"
          :id="question.inputId + '-country'"
          @change="updateValue"
          :disabled="readOnly"
        >
          <option v-for="coun of countryOptions" :key="coun.value" :value="coun.value">{{
            coun.text
          }}</option>
        </select>
      </div>
    </div>
    <div class="row survey-address-line" v-if="fields.useProvince">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-state'"
          >Province / Territory / State / Region</label
        >
        <div v-if="isDropDownRegion">
          <select
            class="form-control"
            v-model="pendingValue['state']"
            :id="question.inputId + '-state'"
            @change="updateValue"
            :disabled="readOnly"
          >
            <option v-for="reg of regionOptions" :key="reg.value" :value="reg.value">{{
              reg.text
            }}</option>
          </select>
        </div>
        <div v-else>
          <input
            class="form-control"
            v-model="pendingValue['state']"
            :id="question.inputId + '-state'"
            @change="updateValue"
            :disabled="readOnly"
          />
        </div>
      </div>
    </div>
    <div class="row survey-address-line" v-if="fields.usePostalCode">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-postcode'">Postal Code / Zip Code</label>
        <input
          class="form-control"
          autocomplete="postal-code"
          :id="question.inputId + '-postcode'"
          v-model="pendingValue['postcode']"
          @change="updateValue"
          :readonly="readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="fields.useEmail">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-email'">Email</label>
        <div class="alert alert-danger sv_qstn_error_top" v-if="emailMsg">{{emailMsg}}</div>
        <input
          class="form-control"
          type="text"
          autocomplete="email"
          :id="question.inputId + '-email'"
          v-model="pendingValue['email']"
          @blur="validEmail"
          :readonly="readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="fields.usePhone">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-phone'">Phone Number</label>
        <input
          class="form-control"
          type="number"
          autocomplete="tel"
          :id="question.inputId + '-phone'"
          v-model="pendingValue['phone']"
          @change="updateValue"
          :readonly="readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="fields.useFax">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-fax'">Fax</label>
        <input
          class="form-control"
          type="number"
          autocomplete="tel"
          :id="question.inputId + '-fax'"
          v-model="pendingValue['fax']"
          @change="updateValue"
          :readonly="readOnly"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { canada, provinces, usa, states, otherCountries } from "@/utils/location-options";
export default {
  props: {
    question: Object
  },
  data() {
    return {
      countryOptions: [canada, usa].concat(otherCountries),
      selOptions: [],
      pendingValue: this.loadValue(this.question.value),
      value: this.question.value,
      readOnly: false,
      emailMsg: "",
      fields: {
        useStreet: this.question.useStreet,
        useCity: this.question.useCity,
        useProvince: this.question.useProvince,
        useCountry: this.question.useCountry,
        usePostalCode: this.question.usePostalCode,
        useEmail: this.question.useEmail,
        usePhone: this.question.usePhone,
        useFax: this.question.useFax
      }
    };
  },
  methods: {
    prevAddrOptions() {
      const q = this.question;
      const skipName = q.name;
      const survey = q.survey;
      const addrs = [];
      const seen = {};
      let otherQVal;
      for (const page of survey.pages) {
        for (const otherQ of page.questions) {
          if (
            otherQ.getType() === "address" &&
            otherQ.name !== skipName &&
            (otherQVal = otherQ.value)
          ) {
            const potentialParts = [
              otherQVal.street,
              otherQVal.city,
              otherQVal.state,
              otherQVal.country,
              otherQVal.postcode,
              otherQVal.email,
              otherQVal.phone,
              otherQVal.fax
            ];

            // ensure the fields match, otherwise copying won't make sense.
            if (Object.keys(this.fields).length !== potentialParts.length) continue;

            let match = true;
            let i = 0;
            for (let key in this.fields) {
              if (!!this.fields[key] !== !!potentialParts[i]) {
                match = false;
                break;
              }
              i++;
            }

            if (!match) continue;

            // collect data
            let parts = [];
            let k = 0;
            for (let key in this.fields) {
              if (this.fields[key]) {
                parts.push(potentialParts[k]);
              }
              k++;
            }

            const lbl = parts
              .map(p => p.trim())
              .filter(p => p)
              .join(", ");

            if (lbl && !seen[lbl]) {
              seen[lbl] = 1;
              addrs.push({
                name: otherQ.name,
                label: lbl, // otherQ.referLabel,
                value: Object.assign({}, otherQ.value)
              });
            }
          }
        }
      }
      addrs.sort((a, b) => a.label.localeCompare(b.label));
      return addrs;
    },
    updateValue() {
      const value = Object.assign({}, this.pendingValue);
      for (const k in value) {
        if (value[k] !== undefined && value[k].length) {
          this.question.value = value;
          return;
        }
      }
      this.question.value = null;
    },
    loadValue(val) {
      val = val || {};
      const pending = {
        street: val.street || "",
        city: val.city || "",
        state: val.state || "BC",
        country: val.country || "CAN",
        postcode: val.postcode || "",
        email: val.email || "",
        phone: val.phone || "",
        fax: val.fax || ""
      };
      return pending;
    },
    fillInData(e) {
      const data = e.target._value;

      if (!data) {
        this.readOnly = false;
        this.pendingValue = this.loadValue();
      } else if (data) {
        this.readOnly = true;
        this.pendingValue = this.loadValue(data);
      }
      this.updateValue();
    },
    validEmail(e) {
      const email = e.target._value;
      const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})+$/;
      if (re.test(email)) {
        this.updateValue();
        this.emailMsg = "";
      } else {
        this.emailMsg = "Please enter a valid e-mail address.";
      }
    }
  },
  computed: {
    regionOptions() {
      const p = this.pendingValue;

      if (p && p.country) {
        return p.country === "CAN"
          ? provinces
          : states
      } else {
        return provinces.concat(states);
      }
    },
    isDropDownRegion() {
      const p = this.pendingValue;
      return (!p || !p.country || ( p.country !== "CAN" && p.country !== "USA")) ? false : true;
    }
  },
  mounted() {
    const q = this.question;

    for (let key in this.fields) {
      this.fields[key] = q[key];
    }

    q.valueChangedCallback = () => {
      const pending = this.loadValue(q.value);
      this.pendingValue = pending;
      this.value = q.value;
      this.selOptions = this.prevAddrOptions();
    };
    this.selOptions = this.prevAddrOptions();
  }
};
</script>

<style scoped>
.no-border {
    border: 0;
    box-shadow: none;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
