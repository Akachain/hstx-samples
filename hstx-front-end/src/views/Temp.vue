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
                    <div class="text-right my-5 position-absolute" id="dropdown-btn">
                        <base-dropdown>
                            <base-button id="adminBtn" slot="title" type="secondary" class="dropdown-toggle btn btn-info">{{admin.Name}}</base-button>
                            <a v-for="(ele, index) in adminList" :key="index" class="dropdown-item" href="javascript:void(0)" @click="changeAdmin(ele.SuperAdminID)">{{ele.Name}}</a>
                        </base-dropdown>
                    </div>

                    <div class="mb-3">
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
                                    <td>{{ proposal.Data }}</td>
                                    <td class="action-btn">
                                        <base-button class="btn-1" outline type="primary" @click="sign(index)">Register</base-button>
                                        <base-button class="btn-1" outline type="danger" @click="showWarning(index)">Sign</base-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="text-info font-italic" v-if="proposalList.length == 0">There aren't any proposal.</div>
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

                    <div>
                        <base-button class="btn-1" outline type="primary" @click="sign(index)">Register</base-button>
                        <base-button class="btn-1" outline type="danger" @click="reject(index)">Sign</base-button>
                    </div>
                </div>
            </card>
        </div>
    </section>
</div>
</template>

<script>
import axios from "axios";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";

import BaseDropdown from "../components/BaseDropdown";

import {
    HEADER,
    URL_ALL_SUPER_ADMINS,
    URL_ALL_ADMINS,
    URL_PROPOSAL_NOT_SIGN,
    URL_CREATE_QUORUM,
    URL_CREATE_REJECT,
    URL_CREATE_SUPER_ADMIN,
    URL_CREATE_APPROVAL
} from "../js/config";

import {
    U2F
} from "../js/u2f-api";

export default {
    components: {
        BaseDropdown,
        SyncLoader
    },
    data() {
        return {
            admin: {},
            adminID: "",
            adminList: [],
            proposalList: [],
            loading: false
        };
    },
    created() {
        this.loadAdmins();
    },
    methods: {
        async loadAdmins() {
            try {
                let rs = await axios.get(URL_ALL_SUPER_ADMINS, HEADER);
                if (rs.status == 200) {
                    rs.data.payload.forEach(element => {
                        this.adminList.push(element);
                    });
                    this.admin = this.adminList[0]
                }
                if (this.adminList.length > 0) {
                    this.adminID = this.adminList[0];
                }
                console.log(this.adminList)
                this.loadData();
            } catch (err) {
                console.log(err);
            }
        },
        async loadData() {
            try {
                let rs = await axios.get(
                    URL_PROPOSAL_NOT_SIGN + "/" + this.adminID,
                    HEADER
                );
                if (rs.status == 200) {
                    this.proposalList = rs.data.payload;
                }
                if (this.proposalList) {
                    this.proposalList.sort(function (ele1, ele2) {
                        return ele1.CreateDateTime > ele2.CreateDateTime ? -1 : 1;
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        changeAdmin(val) {
            this.adminList.forEach((ele, i) => {
                if (ele.SuperAdminID == val) {
                    this.admin = ele
                    console.log(this.admin)
                    return false
                }
            })
            // this.loadData();
        },
        async sign(index) {
            try {
                this.loading = true;

                let registrationRequest = {
                    version: "U2F_V2",
                    appId: "https://akc-sdk.akachain.io",
                    challenge: "7BSRjdL3FYrBTf739AAzkMHUAVb3nb-BNPfX542ZGFI"
                };
                U2F.register(
                    registrationRequest.appId,
                    [registrationRequest],
                    [],
                    async registrationResponse => {
                            console.log(registrationResponse);

                            let superAdmin = {
                                Name: `Admin${this.adminList.length}`,
                                registrationData: registrationResponse.registrationData
                            }
                            let rs = await this.registerSuperAdmin(superAdmin)
                        },
                        3000
                );
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false
            }
        },
        async reject(index) {
            try {
                this.loading = true;

                let authRequest = {
                    version: "U2F_V2",
                    appId: "https://akc-sdk.akachain.io",
                    challenge: "AfPfYKmNWfP-9jyGsuEL5k0IH2ScBuiSQGfj-UEWYKc",
                    keyHandle: this.admin.SuperAdminID
                };

                U2F.sign(
                    authRequest.appId,
                    authRequest.challenge,
                    [authRequest],
                    async authResponse => {
                        console.log(authResponse);

                        let approval = {
                            ProposalID: "bb377ae69801b5eee1ea5dc69d00990418ea715db83aa6c1663dffb908694b61",
                            Challenge: "7BSRjdL3FYrBTf739AAzkMHUAVb3nb-BNPfX542ZGFI",
                            keyHandle: this.admin.SuperAdminID,
                            clientData: authResponse.clientData,
                            signatureData: authResponse.signatureData.toString('base64')
                        }
                        await this.sendApproval(approval)
                    }
                );
            } catch (err) {
                console.log(err);
            } finally {
                this.loading = false
            }
        },
        async registerSuperAdmin(superAdmin) {
            try {
                this.loading = true
                console.log(superAdmin)
                let rs = await axios.post(URL_CREATE_SUPER_ADMIN, superAdmin, HEADER);
                this.loading = false
                if (rs.status == 200 && rs.data.status == 200) {
                    this.showSuccess("Register successfully!")
                } else {
                    console.log(rs.data.err)
                }
            } catch (err) {
                console.log(err)
            }
        },
        async sendApproval(approval) {
            try {
                this.loading = true
                console.log(approval)
                let rs = await axios.post(URL_CREATE_APPROVAL, approval, HEADER);
                this.loading = false
                if (rs.status == 200 && rs.data.status == 200) {
                    this.showSuccess("Approve successfully!")
                } else {
                    console.log(rs.data.err)
                }
            } catch (err) {
                console.log(err)
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
    }
};
</script>

<style lang="scss" scoped>
#dropdown-btn {
    top: 0;
    right: 15px;

    #adminBtn {
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

.hash {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
