<template>
  <div class="survey-address" :key="state.key" @click="updateSelOptions">
    <div class="row survey-address-line" v-if="getPrevAddresses.length">
      <div class="col-sm-6">
        <label class="survey-sublabel">Copy from:</label>
        <div ref="copyFrom" @change="fillInData">
          <div class="form-control-sm ml-2 no-border" v-for="(opt, inx) in getPrevAddresses" :key="inx" >
            <input
              type="radio"
              name="prevAddressOpt"
              :value="opt">
            {{ opt }}
          </div>
          <div class="form-control-sm ml-2 no-border">
            <input type="radio" name="prevAddressOpt" value=""> Enter a New Address
          </div>
        </div>
      </div>
    </div>
    <div class="row survey-address-line" v-if="question.useStreet">
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
    <div class="row survey-address-line" v-if="question.useCity">
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
    <div class="row survey-address-line pb-1" v-if="question.useCountry">
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
    <div class="row survey-address-line" v-if="question.useProvince">
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
    <div class="row survey-address-line" v-if="question.usePostalCode">
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
    <div class="row survey-address-line" v-if="question.usePhone">
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
    <div class="row survey-address-line" v-if="question.useFax">
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
    <div class="row survey-address-line" v-if="question.useEmail">
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
  </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive, computed, watch } from "@vue/composition-api";
import { canada, provinces, usa, states, otherCountries } from "@/utils/location-options";
import { getPrevAddresses } from "@/state/survey-state";

export default defineComponent({
  props: {
    question: Object,
    isSurveyEditor: Boolean
  },
  setup(props) {
    const state = reactive({
      key: 1
    });

    const q = props.question;
    const countryOptions = [canada, usa].concat(otherCountries);
    let readOnly = false;
    let emailMsg = "";
    let currCountry = loadValue(q.value).country;
    let fields = {
      useStreet: props.question.useStreet,
      useCity: props.question.useCity,
      useProvince: props.question.useProvince,
      useCountry: props.question.useCountry,
      usePostalCode: props.question.usePostalCode,
      useEmail: props.question.useEmail,
      usePhone: props.question.usePhone,
      useFax: props.question.useFax
    }
    let pendingValue = loadValue(q.value);
    let value = q.value;

    q.valueChangedCallback = () => {
      pendingValue = loadValue(q.value);;
      value = q.value;
    };

    function loadValue(val?) {
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
    };

    function updateValue() {
      const value = Object.assign({}, pendingValue);
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
        readOnly = false;
        pendingValue = loadValue();
      } else {
        readOnly = true;
        pendingValue = loadValue(data);
      }
      updateValue();
    }

    function validEmail(e) {
      const email = e.target._value;
      const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,3})+$/;
      if (re.test(email)) {
        updateValue();
        emailMsg = "";
      } else {
        emailMsg = "Please enter a valid e-mail address.";
      }
    };

    const regionOptions = computed(() => {
      const p = pendingValue;

      if (p && p.country) {
        return p.country === "CAN"
          ? provinces
          : states
      } else {
        return provinces.concat(states);
      }
    });

    const isDropDownRegion = computed(() => {
      const p = pendingValue;
      if (p.country !== currCountry) {
        currCountry = p.country;
        p.state = "";
      }
      return p && p.country && (p.country === "CAN" || p.country === "USA");
    });

    watch(getPrevAddresses, (newAddresses, oldAddresses) => {
      console.log("Change detected");
      console.log(newAddresses);
      console.log(oldAddresses);
      console.log(getPrevAddresses);
    })

    onMounted(() => {
      if (props.isSurveyEditor) {
        q.registerFunctionOnPropertyValueChanged("useStreet", (value) => {
          fields.useStreet = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("useCity", (value) => {
          fields.useCity = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("useProvince", (value) => {
          fields.useProvince = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("useCountry", (value) => {
          fields.useCountry = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("usePostalCode", (value) => {
          fields.usePostalCode = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("usePhone", (value) => {
          fields.usePhone = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("useFax", (value) => {
          fields.useFax = value;
          state.key++;
        });

        q.registerFunctionOnPropertyValueChanged("useEmail", (value) => {
          fields.useEmail = value;
          state.key++;
        });
      }
    });

    return {
      state,
      countryOptions,
      readOnly,
      emailMsg,
      currCountry,
      fields,
      pendingValue,
      value,
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
