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
                    <div class="text-center mt-5">
                        <h3 class="text-success font-weight-bold">CREATE PROPOSAL</h3>
                        <br>
                        <br>
                        <div class="row justify-content-center">
                            <div class="col-lg-6 col-sm-6">
                                <textarea class="form-control" placeholder="Proposal" v-model="proposalContent"></textarea>
                            </div>
                        </div>
                        <div class="row justify-content-center pt-4">
                            <base-button class="btn-1" style="height: 46px" type="primary" @click="createProposal()">Create</base-button>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center pt-1">
                        <sync-loader :loading="loading" :color="'green'" :size="'8px'"></sync-loader>
                    </div>
                    <div class="mt-5 py-5 border-top ml-3">
                        <div class="row justify-content-start">
                            <div class="col-lg-10">
                                <p>We use a simple quorum-based voting protocol to create a separation of duty functionality:
                                    <ul class="text-left">
                                        <li>We define a group of “Authority” who has permission to “Approve” HSTx.</li>
                                        <li>Each HSTx transaction must be “Approved” by a majority of the Authority group.</li>
                                        <li>However, before reaching majority approval or executing, if there is any “Reject” from one Authority, the transaction must be aborted.</li>
                                    </ul>
                                </p>
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
    URL_CREATE_PROPOSAL
} from "../js/config";

export default {
    name: "createProposal",
    components: {
        SyncLoader
    },
    data() {
        return {
            proposalContent: "",
            loading: false
        }
    },
    created() {},
    methods: {
        async createProposal() {
            try {
                this.loading = true
                let rs = await axios.post(URL_CREATE_PROPOSAL, {
                    "Message": this.proposalContent,
                    "CreatedBy": "Admin1"
                }, HEADER);
                this.loading = false
                if (rs.status == 200) {
                    this.proposalContent = ""
                    this.$router.push('/proposal/view')
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    textarea {
        height: 200px;
    }
</style>