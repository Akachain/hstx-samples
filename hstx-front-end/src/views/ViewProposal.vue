<template>
<div class="profile-page">
    <section class="section-profile-cover section-shaped my-0">
        <div class="shape shape-style-1 shape-default shape-skew alpha-4">
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
                    <div class="text-center mt-5">
                        <h3 class="text-success font-weight-bold">VIEW PROPOSAL</h3>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-lg-4 order-lg-1">
                            <div class="card-profile-stats d-flex justify-content-center">
                                <div>
                                    <span class="heading">{{ numberOfProposal }}</span>
                                    <span class="description">Proposal</span>
                                </div>
                                <div>
                                    <span class="heading">{{ numberOfApproved }}</span>
                                    <span class="description">Approved</span>
                                </div>
                                <div>
                                    <span class="heading">{{ numberOfReject }}</span>
                                    <span class="description">Aborted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Proposal ID</th>
                                    <th scope="col">Content</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(proposal, index) in proposalList" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td class="hash">{{ proposal.ProposalID }}</td>
                                    <td>{{ proposal.Message }}</td>
                                    <td :class="[proposal.Status == 'Approved' ? 'text-success' : '', proposal.Status == 'Rejected' ? 'text-danger' : '', proposal.Status == 'Pending' ? 'text-info' : '']">{{ proposal.Status }}</td>
                                    <td>
                                        <base-button class="btn-1" outline type="info" :disabled="proposal.Status == 'Committed'" @click="commit(index)">Commit</base-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="text-info font-italic" v-if="proposalList.length == 0">There aren't any proposal.</div>
                    </div>
                    <div class="mt-5 py-5 border-top ml-3">
                        <div class="row justify-content-start">
                            <div class="col-lg-10">
                                <ul class="text-left">
                                    <li>Only authorized users can approve HSTx Proposal: CEO, Chief Accountant, Super System Admin, etc.</li>
                                    <li>Each HSTx proposal needs a quorum of approval from the majority of ADMIN_HSTX_QUORUM_GROUP.</li>
                                </ul>
                            </div>
                        </div>
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

import {
    HEADER,
    URL_ALL_ADMINS,
    URL_ALL_PROPOSALS,
    URL_COMMIT_PROPOSAL
} from "../js/config";
import {
    async
} from 'q';

export default {
    name: "viewProposal",
    components: {SyncLoader},
    data() {
        return {
            proposalList: [],
            numberOfProposal: 0,
            numberOfApproved: 0,
            numberOfReject: 0,
            adminID: "",
            adminList: [],
            loading: false
        };
    },
    created() {
        this.loadData()
        this.loadAdmins()
    },
    methods: {
        async loadData() {
            try {
                this.loading = true
                let rs = await axios.get(URL_ALL_PROPOSALS, HEADER);
                this.loading = false
                if (rs.status == 200) {
                    this.proposalList = rs.data.payload;
                }
                if (this.proposalList) {
                    this.proposalList.sort(function (ele1, ele2) {
                        return ele1.CreateDateTime > ele2.CreateDateTime ? -1 : 1;
                    });
                    this.numberOfProposal = this.proposalList.length

                    let a = new Array()
                    a.filter

                    let count = this.proposalList.filter(function (ele) {
                        return ele.Status == "Approved"
                    })
                    this.numberOfApproved = count.length

                    count = this.proposalList.filter(function (ele) {
                        return ele.Status == "Rejected"
                    })
                    this.numberOfReject = count.length
                }
            } catch (err) {
                console.log(err);
            }
        },
        async loadAdmins() {
            try {
                this.loading = true
                let rs = await axios.get(URL_ALL_ADMINS, HEADER);
                this.loading = false
                if (rs.status == 200) {
                    rs.data.payload.forEach(element => {
                        this.adminList.push(element.AdminID);
                    });
                }
                if (this.adminList.length > 0) {
                    this.adminID = this.adminList[0];
                }
                this.loadData();
            } catch (err) {
                console.log(err)
            }
        },
        async commit(index) {
            try {
                this.loading = true;
                let rs = await axios.post(
                    URL_COMMIT_PROPOSAL, {
                        AdminID: this.adminID,
                        ProposalID: this.proposalList[index].ProposalID
                    },
                    HEADER
                );
                this.loading = false;
                if (rs.status == 200) {
                    if (rs.data.status == 200) {
                        this.showSuccess()
                        this.loadData();
                    } else {
                        // console.log(rs.data.err)
                        this.showFail()
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },
        showSuccess() {
            this.$swal.fire({
                type: "success",
                position: 'top-end',
                title: "Commit successfully!",
                showConfirmButton: false,
                timer: 1500,
            });
        },
        showFail() {
            this.$swal.fire({
                type: "error",
                title: "Oops...",
                text: 'This proposal hasn\'t gotten enough signatures yet!',
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.hash {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#loading {
    top: 110px;
    left: 35px;
}

button[disabled="disabled"] {
    cursor: not-allowed;
}
</style>
