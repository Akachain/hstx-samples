<template>
  <div class="profile-page">
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-style-1 shape-custom shape-skew alpha-4">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--500" no-body>
          <div class="px-4">
            <div class="d-flex justify-content-center position-absolute" id="loading">
              <sync-loader :loading="loading" :color="'green'" :size="'8px'"></sync-loader>
            </div>
            <div class="text-center my-5">
              <h3 class="text-success font-weight-bold">QUORUM</h3>
            </div>

            <div class="mb-3" v-if="sAdmin">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Proposal ID</th>
                    <th scope="col">Content</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(proposal, index) in proposalList" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td class="hash">{{ proposal.ProposalID }}</td>
                    <td>{{ proposal.Message }}</td>
                    <td class="action-btn">
                      <base-button
                        class="btn-1"
                        outline
                        type="primary"
                        @click="approve(index)"
                      >Approve</base-button>
                      <base-button
                        class="btn-1"
                        outline
                        type="danger"
                        @click="showWarning(index)"
                      >Reject</base-button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                class="text-info font-italic"
                v-if="proposalList && proposalList.length == 0"
              >There aren't any proposal.</div>
            </div>

            <div class="pt-5 py-5 border-top pl-3">
              <div class="row justify-content-start">
                <div class="col-lg-10">
                  <ul class="text-left">
                    <li>A quorum is the minimum number of votes that a transaction has to obtain in order to be considered valid.</li>
                    <li>Each HSTx transaction must be “Approved” by a majority of the Authority group.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </section>
    <custom-modal :isShowing="isOpenModal" v-on:changeSatus="isOpenModal = $event"></custom-modal>
  </div>
</template>

<script>
import axios from "axios";
import base64url from "base64url";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import BaseDropdown from "../components/BaseDropdown";
import CustomModal from "./components/CustomModal";

import { U2F } from "../js/u2f-api";

import {
  HEADER,
  URL_ALL_SUPER_ADMINS,
  URL_ALL_PROPOSALS,
  URL_CREATE_APPROVAL,
  URL_PENDING_PROPOSAL
} from "../js/config";

export default {
  components: {
    BaseDropdown,
    SyncLoader,
    CustomModal
  },
  data() {
    return {
      sAdmin: null,
      proposalList: [],
      loading: false,
      isOpenModal: false
    };
  },
  created() {
    if (this.isLogined()) {
      this.loadData();
    }
  },
  methods: {
    isLogined() {
      this.sAdmin = localStorage.getItem("user");
      if (this.sAdmin != null) {
        this.sAdmin = JSON.parse(this.sAdmin);
        return true;
      }
      return false;
    },
    async loadData() {
      try {
        let rs = await axios.get(
          URL_PENDING_PROPOSAL +
            "/" +
            encodeURIComponent(this.sAdmin.SuperAdminID),
          HEADER
        );
        if (rs.status == 200) {
          this.proposalList = rs.data.payload;
        }
        if (this.proposalList) {
          this.proposalList.sort(function(ele1, ele2) {
            return ele1.CreatedAt > ele2.CreatedAt ? -1 : 1;
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async approve(index) {
      try {
        this.loading = true;
        this.isOpenModal = true;

        let authRequest = {
          version: "U2F_V2",
          appId: "https://akc-sdk.akachain.io",
          challenge: base64url(this.proposalList[index].Message),
          keyHandle: this.sAdmin.SuperAdminID
        };

        U2F.sign(
          authRequest.appId,
          authRequest.challenge,
          [authRequest],
          async authResponse => {
            this.isOpenModal = false;
            if (authResponse.signatureData == null) {
              console.error(authResponse);
              return;
            }

            let approval = {
              ProposalID: this.proposalList[index].ProposalID,
              Challenge: base64url(this.proposalList[index].Message),
              keyHandle: this.sAdmin.SuperAdminID,
              clientData: authResponse.clientData,
              signatureData: authResponse.signatureData.toString("base64"),
              Status: "Approved"
            };
            await this.sendRequest(approval);
            this.loadData();
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async reject(index) {
      try {
        this.loading = true;
        this.isOpenModal = true;

        let authRequest = {
          version: "U2F_V2",
          appId: "https://akc-sdk.akachain.io",
          challenge: base64url(this.proposalList[index].Message),
          keyHandle: this.sAdmin.SuperAdminID
        };

        U2F.sign(
          authRequest.appId,
          authRequest.challenge,
          [authRequest],
          async authResponse => {
            let request = {
              ProposalID: this.proposalList[index].ProposalID,
              Challenge: base64url(this.proposalList[index].Message),
              keyHandle: this.sAdmin.SuperAdminID,
              clientData: authResponse.clientData,
              signatureData: authResponse.signatureData.toString("base64"),
              Status: "Rejected"
            };
            await this.sendRequest(request);
            this.loadData();
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },
    async sendRequest(request) {
      try {
        this.loading = true;
        let rs = await axios.post(URL_CREATE_APPROVAL, request, HEADER);
        this.loading = false;
        if (rs.status == 200 && rs.data.status == 200) {
          this.showSuccess("Approve successfully!");
        } else {
          console.log(rs.data.err);
          this.showFail("Submit failed!");
        }
      } catch (err) {
        console.log(err);
      }
    },
    showSuccess() {
      this.$swal.fire({
        type: "success",
        position: "top-end",
        title: "Signed successfully!",
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
    showFail(val) {
      this.$swal.fire({
        type: "error",
        title: "Oops...",
        text: val || "Signing failed!"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#dropdown-btn {
  top: 0;
  right: 15px;

  #sAdminBtn {
    width: 190px;
  }
}

#loading {
  top: 55px;
  left: 35px;
}

.action-btn {
  max-width: 300px;
  min-width: 250px;

  button {
    width: 100px;
    height: 40px;
  }
}

.view-detail:hover {
  cursor: pointer;
  text-decoration: underline;
}

.hash {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

button[disabled="disabled"] {
  cursor: not-allowed;
}
</style>
