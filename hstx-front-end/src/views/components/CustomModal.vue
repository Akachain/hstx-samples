<template>
  <!-- Modals -->
  <div class="row">
    <div class="col-md-4">
      <modal
        :show.sync="show"
        gradient="info"
        modal-classes="modal-danger modal-dialog-centered"
      >
        <h6 slot="header" class="modal-title" id="modal-title-notification">High Secure</h6>

        <div class="py-3 text-center">
          <moon-loader class="position-absolute inner-loader" :color="'yellow'" :size="'34px'"></moon-loader>
          <img class="position-relative usb-img" src="/img/guide/usb.png" height="150" />
          <h4 class="heading mt-4">You need to</h4>
          <p>Insert your securiy U2F USB then touch it.</p>
          <scale-loader></scale-loader>
        </div>

        <template slot="footer">
          <base-button
            type="link"
            text-color="white"
            class="ml-auto"
            @click="show = false"
          >Close</base-button>
        </template>
      </modal>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Modal from "@/components/Modal.vue";
import ScaleLoader from "vue-spinner/src/ScaleLoader";
import MoonLoader from "vue-spinner/src/MoonLoader";

import { U2F } from "../../js/u2f-api";
import { HEADER, URL_CREATE_SUPER_ADMIN } from "../../js/config";

export default {
  name: "custom-modal",
  components: {
    Modal,
    ScaleLoader,
    MoonLoader
  },
  props: {
    isShowing: {
      type: Boolean,
      default: false,
      description: "Show modal"
    },
    request: {
      type: Object,
      default: null,
      description: "u2f request"
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    register() {
      let registrationRequest = {
        version: this.request.version,
        appId: this.request.appId,
        challenge: this.request.challenge
      };

      U2F.register(
        registrationRequest.appId,
        [registrationRequest],
        [],
        async registrationResponse => {
          let superAdmin = {
            Name: this.request.name,
            registrationData: registrationResponse.registrationData
          };
          try {
            this.$emit("changeSatus", false);
            await this.registerSuperAdmin(superAdmin);
          } catch (err) {
            console, log(err);
          }
        },
        15000
      );
    },
    async registerSuperAdmin(superAdmin) {
      try {
        let rs = await axios.post(URL_CREATE_SUPER_ADMIN, superAdmin, HEADER);
        if (rs.status == 200 && rs.data.status == 200) {
          this.$emit("respond", { type: "register", result: rs.data });
        }
      } catch (err) {
        throw err;
      }
    }
  },
  watch: {
    show: function(val) {
      if (!val) {
        this.$emit('changeStatus', val);
      }
    },
    isShowing: function(val) {
      this.show = this.isShowing;
    },
    request: function(val) {
      if (this.request != null && this.request.type == "register") {
        this.register();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.modal-body {
  padding-bottom: 0;
}
.inner-loader {
  z-index: 0;
  top: 113px;
  left: 224px;
}
.usb-img {
  z-index: 1;
}
</style>>
