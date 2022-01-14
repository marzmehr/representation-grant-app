<template>
  <div class="survey-address" :key="state.key">
    <div class="row survey-address-line" v-if="prevAddresses.length">
      <div class="col-sm-6">
        <label class="survey-sublabel">Copy from:</label>
        <div ref="copyFrom" @change="fillInData">
          <div class="form-control-sm ml-2 no-border" v-for="(addr, inx) in prevAddresses" :key="inx" >
            <input
              type="radio"
              name="prevAddressOpt"
              :value="addr.value">
            {{ addr.label }}
          </div>
          <div class="form-control-sm ml-2 no-border">
            <input type="radio" name="prevAddressOpt" value=""> Enter a New Address
          </div>
        </div>
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.street">
      <div class="col-sm-6">
        <label class="survey-sublabel">Street Address</label>
        <input
          class="form-control"
          :id="question.inputId"
          v-model="state.pendingValue['street']"
          @change="updateValue"
          :readonly="state.readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.city">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-city'">City / Town</label>
        <input
          class="form-control"
          :id="question.inputId + '-city'"
          v-model="state.pendingValue['city']"
          @change="updateValue"
          :readonly="state.readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line pb-1" v-if="question.country">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-country'">Country</label>
        <select
          class="form-control"
          v-model="state.pendingValue['country']"
          :id="question.inputId + '-country'"
          @change="updateValue"
          :disabled="state.readOnly"
        >
          <option v-for="coun of countryOptions" :key="coun.value" :value="coun.value">{{
            coun.text
          }}</option>
        </select>
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.state">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-state'"
          >Province / Territory / State / Region</label
        >
        <div v-if="isDropDownRegion">
          <select
            class="form-control"
            v-model="state.pendingValue['state']"
            :id="question.inputId + '-state'"
            @change="updateValue"
            :disabled="state.readOnly"
          >
            <option v-for="reg of regionOptions" :key="reg.value" :value="reg.value">{{
              reg.text
            }}</option>
          </select>
        </div>
        <div v-else>
          <input
            class="form-control"
            v-model="state.pendingValue['state']"
            :id="question.inputId + '-state'"
            @change="updateValue"
            :disabled="state.readOnly"
          />
        </div>
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.postalCode">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-postalCode'">Postal Code / Zip Code</label>
        <input
          class="form-control"
          autocomplete="postal-code"
          :id="question.inputId + '-postalCode'"
          v-model="state.pendingValue['postalCode']"
          @change="updateValue"
          :readonly="state.readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.phone">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-phone'">Phone Number</label>
        <input
          class="form-control"
          type="number"
          autocomplete="tel"
          :id="question.inputId + '-phone'"
          v-model="state.pendingValue['phone']"
          @change="updateValue"
          :readonly="state.readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.fax">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-fax'">Fax</label>
        <input
          class="form-control"
          type="number"
          autocomplete="tel"
          :id="question.inputId + '-fax'"
          v-model="state.pendingValue['fax']"
          @change="updateValue"
          :readonly="state.readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.email">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-email'">Email</label>
        <div class="alert alert-danger sv_qstn_error_top" v-if="state.emailMsg">{{state.emailMsg}}</div>
        <input
          class="form-control"
          type="text"
          autocomplete="email"
          :id="question.inputId + '-email'"
          v-model="state.pendingValue['email']"
          @blur="validEmail"
          :readonly="state.readOnly"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive, computed, watch, ref } from "@vue/composition-api";
import { canada, provinces, usa, states, otherCountries } from "@/utils/location-options";
import { getPrevAddresses } from "@/state/survey-state";

export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1,
      readOnly: false,
      emailMsg: "",
      pendingValue: loadValue(props.question.value),
      value: props.question.value,
      fields: {
        street: props.question.street,
        city: props.question.city,
        state: props.question.state,
        country: props.question.country,
        postalCode: props.question.postalCode,
        email: props.question.email,
        phone: props.question.phone,
        fax: props.question.fax
      },
    });

    let prevAddresses = ref(filterAddresses());

    const q = props.question;
    const countryOptions = [canada, usa].concat(otherCountries);
    let currCountry = loadValue(q.value).country;

    q.valueChangedCallback = () => {
      state.pendingValue = loadValue(q.value);
      state.value = q.value;
    };

    function loadValue(val?) {
      val = val || {};
      const pending = {
        street: val.street || "",
        city: val.city || "",
        state: val.state || "BC",
        country: val.country || "Canada",
        postalCode: val.postalCode || "",
        email: val.email || "",
        phone: val.phone || "",
        fax: val.fax || ""
      };
      return pending;
    };

    function updateValue() {
      const value = Object.assign({}, state.pendingValue);
      for (const k in value) {
        if (value[k] !== undefined && value[k].length) {
          props.question.value = value;
          return;
        }
      }
      q.value = null;
    };
    
    function fillInData(e) {
      const data = e.target._value;

      if (!data) {
        state.readOnly = false;
        state.pendingValue = loadValue();
      } else {
        state.readOnly = true;
        state.pendingValue = loadValue(data);
      }
      updateValue();
    }

    function validEmail(e) {
      const email = e.target.value;
      const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})+$/;
      if (re.test(email)) {
        updateValue();
        state.emailMsg = "";
      } else {
        state.emailMsg = "Please enter a valid e-mail address.";
      }
    };

    function filterAddresses() {
      let matches = [];

      for (const addr of getPrevAddresses.value) {
        // check for matching state.fields
        let inputsMatch = true;
        for (const field in state.fields) {
          if (state.fields[field] === !!addr[field]) {
          } else {
            inputsMatch = false;
            break;
          }
        }

        if (!inputsMatch) continue;

        let label = "";
        const orderedLabels = [
          "street",
          "city",
          "country",
          "state",
          "postalCode",
          "phone",
          "fax",
          "email"
        ];

        orderedLabels.forEach((value, index) => {
          if (addr[value] && label.length === 0) label = `${addr[value]}`;
          else if (addr[value]) label += `, ${addr[value]}`;
        });

        matches.push({label: label, value: addr});
      }

      return matches;
    };

    const regionOptions = computed(() => {
      const p = state.pendingValue;

      if (p && p.country) {
        return p.country === "Canada"
          ? provinces
          : states
      } else {
        return provinces.concat(states);
      }
    });

    const isDropDownRegion = computed(() => {
      const p = state.pendingValue;
      if (p.country !== currCountry) {
        currCountry = p.country;
        p.state = "";
      }
      return p && p.country && (p.country === "Canada" || p.country === "United States of America");
    });

    watch(getPrevAddresses, () => {
      prevAddresses.value = filterAddresses();
    });

    onMounted(() => {
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("street", (value) => {
          state.fields.street = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("city", (value) => {
          state.fields.city = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("state", (value) => {
          state.fields.state = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("country", (value) => {
          state.fields.country = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("postalCode", (value) => {
          state.fields.postalCode = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("phone", (value) => {
          state.fields.phone = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("fax", (value) => {
          state.fields.fax = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("email", (value) => {
          state.fields.email = value;
          state.key++;
        });
      }
    });

    return {
      state,
      prevAddresses,
      countryOptions,
      currCountry,
      loadValue,
      updateValue,
      fillInData,
      validEmail,
      regionOptions,
      isDropDownRegion,
      getPrevAddresses
    }
  }
});
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
