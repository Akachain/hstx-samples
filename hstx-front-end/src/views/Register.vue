<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default shape-skew">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container py-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0"
          >
            <template></template>
            <template>
              <div class="text-center mb-4">
                <h3 class="text-primary font-weight-bold">Register</h3>
              </div>
              <form role="form">
                <tabs fill class="flex-column flex-md-row" v-on:changeTab="activeTab = $event">
                  <!-- ADMIN tabs pane -->
                  <tab-pane title="Admin"></tab-pane>

                  <!-- SUPER ADMIN tab pane -->
                  <tab-pane title="Super Admin"></tab-pane>
                </tabs>
                <!-- END tabs pane -->
                <base-input
                  :value="name"
                  :error="err_name"
                  alternative
                  class="mb-3"
                  placeholder="Name"
                  addon-left-icon="ni ni-hat-3"
                  @input="name = $event"
                ></base-input>
                <base-input
                  :value="pass"
                  :error="err_pass"
                  alternative
                  type="password"
                  placeholder="Password"
                  addon-left-icon="ni ni-lock-circle-open"
                  @input="changePass"
                ></base-input>
                <div class="text-muted font-italic pass-weight" v-if="passWeight">
                  <small>
                    password strength:
                    <span class="text-success font-weight-700">{{passWeight}}</span>
                  </small>
                </div>
                <base-checkbox @input="isCheck = $event" :error="err_argree">
                  <span>
                    I agree with the
                    <a href="#">Privacy Policy</a>
                  </span>
                </base-checkbox>
                <div class="text-center">
                  <base-button
                    v-if="registerType == 'Admin'"
                    type="primary create-btn"
                    class="my-4"
                    @click="register"
                  >Create account</base-button>
                  <base-button
                    v-if="registerType == 'Super Admin'"
                    type="primary create-btn"
                    class="my-4"
                    v-b-tooltip.hover.bottom
                    title="Require u2f USB"
                    @click="register"
                  >Create account</base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
    <custom-modal
      :isShowing="isOpenModal"
      :request="request"
      v-on:changeStatus="isOpenModal = $event"
      v-on:respond="respond = $event"
    ></custom-modal>
  </section>
</template>

<script>
import axios from "axios";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import BTooltip from "bootstrap-vue/es/directives/tooltip/tooltip";
import Tabs from "@/components/Tabs/Tabs.vue";
import TabPane from "@/components/Tabs/TabPane.vue";
import BaseDropdown from "../components/BaseDropdown";
import CustomModal from "./components/CustomModal";

import { HEADER, URL_CREATE_SUPER_ADMIN } from "../js/config";

import { U2F } from "../js/u2f-api";

export default {
  name: "register",
  directives: {
    BTooltip
  },
  components: {
    Tabs,
    TabPane,
    CustomModal
  },
  data() {
    return {
      pass: "",
      passWeight: "",
      name: "",
      isCheck: false,
      err_name: "",
      err_pass: "",
      err_argree: "",
      activeTab: null,
      registerType: "Admin",
      isOpenModal: false,
      request: {},
      respond: {}
    };
  },
  methods: {
    changePass(val) {
      this.pass = val;
      if (this.pass.length >= 0 && this.pass.length < 6) {
        this.passWeight = "weak";
      } else if (this.pass.length < 10) {
        this.passWeight = "strong";
      } else if (this.pass.length >= 10) {
        this.passWeight = "very strong";
      }
    },
    checkValidation() {
      let isValid = true;
      if (!this.name) {
        this.err_name = "Can't be empty!";
        isValid = false;
      } else {
        this.err_name = "";
      }
      if (!this.pass) {
        this.err_pass = "Can't be empty!";
        isValid = false;
      } else {
        this.err_pass = "";
      }
      if (!this.isCheck) {
        this.err_argree = "You must agree the policy.";
        isValid = false;
      } else {
        this.err_argree = "";
      }
      return isValid;
    },
    register() {
      if (!this.checkValidation()) return;

      if (this.registerType == "Admin") {
        this.showSuccess("Register successfully!");
        this.$router.push("/login");
      } else if ((this.registerType = "Super Admin")) {
        this.request = {
          version: "U2F_V2",
          appId: "https://akc-sdk.akachain.io",
          challenge: "7BSRjdL3FYrBTf739AAzkMHUAVb3nb-BNPfX542ZGFI",
          name: this.name,
          type: "register"
        };
        this.isOpenModal = true;
      }
    },
    showSuccess(title) {
      this.$swal.fire({
        type: "success",
        position: "top-end",
        title: title,
        showConfirmButton: false,
        timer: 1500
      });
    },
    showWarning(index) {
      this.$swal
        .fire({
          title: "Are you sure to reject this proposal?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, reject!"
        })
        .then(result => {
          if (result.value) {
            this.reject(index);
            Swal.fire(
              "Rejected!",
              "The proposal has been rejected.",
              "success"
            );
          }
        });
    },
    showFail() {
      this.$swal.fire({
        type: "error",
        title: "Oops...",
        text: "Signing failed!"
      });
    }
  },
  watch: {
    name: function(val) {
      this.err_name = "";
    },
    pass: function(val) {
      this.err_pass = "";
    },
    isCheck: function(val) {
      this.err_argree = "";
    },
    activeTab: function(val) {
      this.registerType = val.tabName;
    },
    isOpenModal: function(val){
      if (!val) {
        this.request = null;
      }
    },
    respond: function(val) {
      if (this.respond.type == "register") {
        this.showSuccess("Register successfully!");
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pass-weight {
  margin-top: -16px;
  padding-bottom: 16px;
}
.create-btn {
  margin-bottom: 0px !important;
}
</style>>
