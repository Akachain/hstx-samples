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
                <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
                    <!-- <template>
                        <div class="text-muted text-center mb-3">
                            <small>Sign in with</small>
                        </div>
                        <div class="btn-wrapper text-center">
                            <base-button type="neutral">
                                <img slot="icon" src="img/icons/common/github.svg">
                                Github
                            </base-button>

                            <base-button type="neutral">
                                <img slot="icon" src="img/icons/common/google.svg">
                                Google
                            </base-button>
                        </div>
                    </template> -->
                    <template>
                        <!-- <div class="text-center text-muted mb-4">
                            <small>Or sign in with credentials</small>
                        </div> -->
                        <div class="text-center mb-4">
                            <h3 class="text-primary font-weight-bold">Login</h3>
                        </div>
                        <form role="form">
                            <base-input alternative placeholder="Super Admin ID" addon-left-icon="ni ni-key-25" :value="sAdminID" :inputClasses="'hash'" :readonly="sAdminID ? 'readonly' : false" @input="sAdminID = $event">
                            </base-input>
                            <base-input alternative placeholder="Super Admin Name" addon-left-icon="ni ni-circle-08" :value="sAdminName" :readonly="sAdminName ? 'readonly' : false" @input="sAdminName = $event">
                            </base-input>
                            <base-input alternative type="password" placeholder="Password" :value="pass" addon-left-icon="ni ni-lock-circle-open" :focused="true" @input="pass = $event">
                            </base-input>
                            <base-checkbox @input="isRemember = $event">
                                Remember me
                            </base-checkbox>
                            <div class="text-center">
                                <base-button type="primary" class="my-4" @click="signIn()">Sign In</base-button>
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
                        <!-- <a href="#" class="text-light">
                                <small>Create new account</small>
                            </a> -->
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

import {
    HEADER,
    URL_SUPER_ADMINS_BY_ID
} from "../js/config";

export default {
    data() {
        return {
            sAdmin: {},
            sAdminID: "",
            sAdminName: "",
            pass: "",
            isRemember: false
        }
    },
    created() {
        this.sAdmin = this.$route.params.sAdmin
        console.log(this.sAdmin)
        if (this.sAdminID != null && this.sAdmin != undefined) {
            this.sAdminID = this.sAdmin.SuperAdminID
            this.sAdminName = this.sAdmin.Name
        }
    },
    methods: {
        async signIn() {
            try {
                let rs = await axios.get(
                    URL_SUPER_ADMINS_BY_ID + "/" + encodeURIComponent(this.sAdminID),
                    HEADER
                );
                if (rs.status == 200 && rs.data.status == 200) {
                    if (this.sAdminID == rs.data.payload.SuperAdminID)
                    localStorage.setItem('isLogined', 'true')
                    localStorage.setItem('sAdmin', JSON.stringify(rs.data.payload))
                    this.$router.push('/quorum')
                }
            } catch (err) {
                console.log(err)
            }
        }
    }
};
</script>

<style>
.hash {
    max-width: calc(100% - 40px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

input[readonly="readonly"] {
    background-color: #fff !important;
    cursor: not-allowed;
}
</style>
