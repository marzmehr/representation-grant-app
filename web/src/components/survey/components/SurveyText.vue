// This overrides the current SurveyText.
<template>
  <div>
    <!-- 
        This is excluded because it causes Vue to infinite render loop.
        :aria-label="question.ariaLabel"
    -->
    <input
      :value="textValue"
      @change="change"
      @keyup="keyup"
      :disabled="question.isInputReadOnly"
      :class="question.getControlClass()"
      :type="question.inputType"
      :maxlength="question.getMaxLength()"
      :min="question.renderedMin"
      :max="question.renderedMax"
      :step="question.renderedStep"
      :size="question.inputSize"
      :id="question.inputId"
      :list="question.dataListId"
      :placeholder="question.renderedPlaceHolder"
      :autocomplete="question.autoComplete"
      :aria-required="question.ariaRequired"
      :style="inputStyle"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
    />
    <datalist v-if="question.dataListId" :id="question.dataListId">
      <option v-for="item in question.dataList" :value="item" :key="item"></option>
    </datalist>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
@Component
export class SurveyText extends Vue {
  @Prop() question;
  mounted() {
    if (!this.question.value && this.question.defaultSubstitution)
      this.question.value = this.question.defaultSubstitution;
  }
  setValue(value) {
    if (value == "" && this.question.defaultSubstitution) {
      this.question.value = this.question.defaultSubstitution;
    } else {
      this.question.value = value;
    }
  }
  change(event: any) {
    this.setValue(event.target.value);
  }
  keyup(event: any) {
    if (!this.question.isInputTextUpdate) return;
    this.setValue(event.target.value);
  }
  get textValue(): any {
    const value = this.question.value;
    if (value == this.question.defaultSubstitution) return "";
    return value;
  }
  get inputStyle(): any {
    return this.question.inputStyle;
  }
}
export default SurveyText;
</script>
