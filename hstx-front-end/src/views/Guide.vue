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
                    <div class="text-center my-5">
                        <h3 class="text-success font-weight-bold">HOW TO USE</h3>
                    </div>

                    <div class="pt-5 py-5 border-top pl-3">
                        <div>
                            <b>Cold Signing:</b>
                            <br>
                            Each HSTx requires manual approvals in the form of Digital Signatures (DSA) from authorized entities to be considered valid. As the process involves high risk, it should be carried by multiple parties separately.
                        </div>
                        <br>
                        <div>
                            <b>Phase 1: HSTx proposal</b>
                            <br>
                            An administrator creates a HSTx proposal and submits.
                            <br>
                            The transaction content is written into the ledger through a chaincode function.
                            <div class="px-4 pt-2">
                                <img src="/img/guide/create.gif" class="img-fluid img-thumbnail mx-auto" alt="">
                            </div>
                        </div>
                        <br> <br>
                        <div>
                            <b>Phase 2: Quorum</b>
                            <br>
                            Only authorized users can <i>approve</i> HSTx Proposal.
                            <br>
                            Each HSTx proposal needs a quorum of approval from the majority of ADMIN_HSTX_QUORUM_GROUP (at least 3 approvals).
                            <div class="px-4 pt-2">
                                <img src="/img/guide/sign.gif" class="img-fluid img-thumbnail mx-auto" alt="">
                            </div>
                            <br>
                            An admin is able to <i>reject</i> the proposal.
                            <div class="px-4 pt-2">
                                <img src="/img/guide/reject.gif" class="img-fluid img-thumbnail mx-auto" alt="">
                            </div>
                        </div>
                        <br> <br>
                        <div>
                            <b>Phase 3: Commit</b>
                            <br>
                            An administrator commits the proposal to be execute.
                            <br>
                            If a proposal got enough signatures from ADMIN_HSTX_QUORUM_GROUP (3 signatures), the commitment would be successful.
                            <div class="px-4 pt-2">
                                <img src="/img/guide/commit.gif" class="img-fluid img-thumbnail mx-auto" alt="">
                            </div>
                            <br>
                            <b><i>Otherwise</i></b>, the commitment would be failed.
                            <div class="px-4 pt-2">
                                <img src="/img/guide/commit-failed.gif" class="img-fluid img-thumbnail mx-auto" alt="">
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
export default {};
</script>

<style lang="scss" scoped>
</style>
