<template>
  <div class="survey-address">
    <div class="row survey-address-line" v-if="selOptions.length">
      <div class="col-sm-6 form-inline">
        <label class="survey-sublabel">Copy from:</label>
        <select class="form-control ml-2" ref="copyFrom" @change="fillInData">
          <option value="">(Select Address)</option>
          <option v-for="(opt, inx) in selOptions" :key="inx" :value="opt.value">{{
            opt.label
          }}</option>
        </select>
      </div>
    </div>
    <div class="row survey-address-line">
      <div class="col-sm-6">
        <input
          class="form-control"
          placeholder="Street address, for example: 800 Hornby St. or Post Office Box"
          :id="question.inputId"
          v-model="pendingValue['street']"
          @change="updateValue"
          :readonly="readOnly"
        />
      </div>
    </div>
    <div class="row survey-address-line">
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
    <div class="row survey-address-line">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-state'"
          >Province / State / Region</label
        >
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
    </div>
    <div class="row survey-address-line pb-1">
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
    <div class="row survey-address-line">
      <div class="col-sm-6">
        <label class="survey-sublabel" :for="question.inputId + '-postcode'">Postal Code</label>
        <input
          class="form-control"
          :id="question.inputId + '-postcode'"
          v-model="pendingValue['postcode']"
          @change="updateValue"
          :readonly="readOnly"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { canada, provinces, usa, states } from "@/utils/location-options";
export default {
  props: {
    question: Object
  },
  data() {
    return {
      countryOptions: [canada, usa],
      selOptions: [],
      pendingValue: this.loadValue(this.question.value),
      value: this.question.value,
      readOnly: false
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
            const parts = [
              otherQVal.street,
              otherQVal.city,
              otherQVal.state,
              otherQVal.country,
              otherQVal.postcode
            ];
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
    //updateValue(_evt) {
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
        postcode: val.postcode || ""
      };
      return pending;
    },
    fillInData(e) {
      console.log("SELECTION MADE");
      const selIndex = e.target.options.selectedIndex;
      if (selIndex === 0) {
        this.readOnly = false;
        this.pendingValue = this.loadValue();
      } else if (selIndex > -1) {
        this.readOnly = true;
        this.pendingValue = this.loadValue(e.target.options[selIndex]._value);
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
    }
  },
  mounted() {
    const q = this.question;
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
