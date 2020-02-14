<template>
  <div class="custom-control custom-checkbox" :class="[{disabled: disabled}, inlineClass]">
    <input
      :id="cbId"
      class="custom-control-input"
      type="checkbox"
      :disabled="disabled"
      v-model="model"
    />
    <label :for="cbId" class="custom-control-label">
      <slot>
        <span v-if="inline">&nbsp;</span>
      </slot>
    </label>
    <slot name="helpBlock">
      <div
        class="text-danger invalid-feedback"
        style="display: block;"
        v-if="error && error != ''"
      >{{ error }}</div>
    </slot>
  </div>
</template>
<script>
import { randomString } from "./stringUtils";

export default {
  name: "base-checkbox",
  model: {
    prop: "checked"
  },
  props: {
    checked: {
      type: [Array, Boolean],
      description: "Whether checkbox is checked"
    },
    disabled: {
      type: Boolean,
      description: "Whether checkbox is disabled"
    },
    inline: {
      type: Boolean,
      description: "Whether checkbox is inline"
    },
    error: {
      type: String,
      default: "",
      description: "Whether button is error"
    }
  },
  data() {
    return {
      cbId: "",
      touched: false
    };
  },
  computed: {
    model: {
      get() {
        return this.checked;
      },
      set(check) {
        if (!this.touched) {
          this.touched = true;
        }
        this.$emit("input", check);
      }
    },
    inlineClass() {
      if (this.inline) {
        return `form-check-inline`;
      }
    }
  },
  mounted() {
    this.cbId = randomString();
  }
};
</script>

<style lang="scss" scoped>
.invalid-feedback {
  padding-left: 15px;
  font-style: italic;
  margin-left: -16px;
}
</style>
