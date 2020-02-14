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
            <template>
              <div class="text-center mb-4">
                <h3 class="text-primary font-weight-bold">Login</h3>
              </div>
              <form role="form">
                <tabs fill class="flex-column flex-md-row" v-on:changeTab="activeTab = $event">
                  <!-- ADMIN tabs pane -->
                  <tab-pane title="Admin">
                    <base-input
                      v-if="loginType == 'Admin'"
                      alternative
                      placeholder="Admin"
                      addon-left-icon="ni ni-key-25"
                      :value="adminName"
                      :inputClasses="'hash'"
                      @input="adminName = $event"
                    ></base-input>
                  </tab-pane>

                  <!-- SUPER ADMIN tab pane -->
                  <tab-pane title="Super Admin">
                    <base-input
                      v-if="loginType == 'Super Admin'"
                      alternative
                      placeholder="Super Admin ID"
                      readonly
                      addon-left-icon="ni ni-key-25"
                      :value="sAdminID"
                      :inputClasses="'hash'"
                      @input="sAdminID = $event"
                    ></base-input>
                    <base-dropdown-input
                      addon-left-icon="ni ni-circle-08"
                      :value="sAdminName"
                      :placeHolder="'Super Admin Name'"
                      :list="sAdminList.map(ele => ele.Name)"
                      @input="sAdminName = $event"
                    ></base-dropdown-input>
                  </tab-pane>
                </tabs>
                <!-- END tabs -->

                <base-input
                  alternative
                  type="password"
                  placeholder="Password"
                  :value="pass"
                  addon-left-icon="ni ni-lock-circle-open"
                  :focused="true"
                  @input="pass = $event"
                ></base-input>

                <base-checkbox @input="isRemember = $event">Remember me</base-checkbox>
                <div class="text-center">
                  <base-button
                    v-if="loginType == 'Admin'"
                    type="primary"
                    class="my-4 login-btn"
                    @click="signIn('admin')"
                  >Sign In</base-button>
                  <base-button
                    v-if="loginType == 'Super Admin'"
                    type="primary"
                    class="my-4 login-btn"
                    @click="signIn('superAdmin')"
                  >Sign In</base-button>
                </div>
              </form>
            </template>
          </card>
          <div class="row mt-3">
            <div class="col-6">
              <a href="#" class="text-light">
                <small>Forgot password?</small>
              </a>
            </div>
            <div class="col-6 text-right">
              <router-link slot="title" to="/register" class="text-light">
                <small>Create new account</small>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import Tabs from "@/components/Tabs/Tabs.vue";
import TabPane from "@/components/Tabs/TabPane.vue";

import {
  HEADER,
  URL_ALL_SUPER_ADMINS,
  URL_SUPER_ADMINS_BY_ID
} from "../js/config";

export default {
  name: "login",
  components: {
    Tabs,
    TabPane
  },
  data() {
    return {
      sAdminList: [],
      sAdmin: {},
      adminName: "",
      sAdminID: "",
      sAdminName: "",
      pass: "",
      isRemember: false,
      loginType: "Admin",
      activeTab: null
    };
  },
  created() {
    this.setListener();
    this.loadSuperAdmins();
    this.adminName = "";
    this.sAdmin = this.$route.params.sAdmin;
    if (this.sAdminID != null && this.sAdmin != undefined) {
      this.sAdminID = this.sAdmin.SuperAdminID;
      this.sAdminName = this.sAdmin.Name;
    }
  },
  methods: {
    setListener() {
      this.$on("activeTab", val => {
        if (val == 0) {
          this.loginType = "Admin";
        } else {
          this.loginType = "SuperAdmin";
        }
      });
    },
    async loadSuperAdmins() {
      try {
        let rs = await axios.get(URL_ALL_SUPER_ADMINS, HEADER);
        if (rs.status == 200) {
          rs.data.payload.forEach(element => {
            this.sAdminList.push(element);
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async signIn(accountType) {
      try {
        if (accountType == "admin") {
          localStorage.removeItem("user");
          localStorage.setItem(
            "user",
            JSON.stringify({ Name: this.adminName })
          );
          this.$root.$emit("reloadUser");
          this.$router.push("/proposal/view");
        } else if (accountType == "superAdmin") {
          let rs = await axios.get(
            URL_SUPER_ADMINS_BY_ID + "/" + encodeURIComponent(this.sAdminID),
            HEADER
          );
          if (rs.status == 200 && rs.data.status == 200) {
            if (this.sAdminID == rs.data.payload.SuperAdminID) {
              localStorage.setItem("user", JSON.stringify(rs.data.payload));
              this.$root.$emit("reloadUser");
              this.$router.push("/quorum");
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  watch: {
    loginType: function(val) {
      //   console.log(val);
    },
    sAdminName: function(val) {
      this.sAdmin = this.sAdminList.find(ele => val == ele.Name);
      this.sAdminID = this.sAdmin.SuperAdminID;
    },
    activeTab: function(val) {
      this.loginType = val.tabName;
    }
  }
};
</script>

<style scoped>
.hash {
  max-width: calc(100% - 40px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.login-btn {
  margin-bottom: 0px !important;
}
</style>
