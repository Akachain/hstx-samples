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
                    <template>
                        <!-- <div class="text-muted text-center mb-3">
                                <small>Sign in with</small>
                            </div> -->
                        <!-- <div class="btn-wrapper text-center">
                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/github.svg">
                                    Github
                                </base-button>

                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/google.svg">
                                    Google
                                </base-button>
                            </div> -->
                    </template>
                    <template>
                        <!-- <div class="text-center text-muted mb-4">
                                <small>Or sign up with credentials</small>
                            </div> -->
                        <div class="text-center mb-4">
                            <h3 class="text-primary font-weight-bold">Register</h3>
                        </div>
                        <form role="form">
                            <base-input :value="name" alternative class="mb-3" placeholder="Name" addon-left-icon="ni ni-hat-3" @input="name = $event">
                            </base-input>
                            <base-input :value="pass" alternative type="password" placeholder="Password" addon-left-icon="ni ni-lock-circle-open" @input="changePass">
                            </base-input>
                            <div class="text-muted font-italic" v-if="passWeight">
                                <small>password strength:
                                    <span class="text-success font-weight-700">{{passWeight}}</span>
                                </small>
                            </div>
                            <base-checkbox @input="isCheck = $event">
                                <span>I agree with the
                                    <a href="#">Privacy Policy</a>
                                </span>
                            </base-checkbox>
                            <div class="text-center">
                                <base-button type="primary" class="my-4" @click="register">Create account</base-button>
                            </div>
                        </form>
                    </template>
                </card>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import axios from "axios";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";

import BaseDropdown from "../components/BaseDropdown";

import {
    HEADER,
    URL_CREATE_SUPER_ADMIN
} from "../js/config";

import {
    U2F
} from "../js/u2f-api";

export default {
    data() {
        return {
            pass: "",
            passWeight: "",
            name: "",
            isCheck: false
        }
    },
    methods: {
        changePass(val) {
            this.pass = val
            if (this.pass.length > 0 && this.pass.length < 6) {
                this.passWeight = 'weak'
            } else if (this.pass.length < 10) {
                this.passWeight = 'strong'
            } else if (this.pass.length >= 10) {
                this.passWeight = 'very strong'
            }
        },
        register() {
            if (!this.name || !this.pass) {
                console.log("Can't be empty!")
                return
            }
            if (!this.isCheck) {
                console.log("Have to check!")
                return
            }
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
                            Name: this.name,
                            registrationData: registrationResponse.registrationData
                        }
                        await this.registerSuperAdmin(superAdmin)
                    },
                    5000
            );
        },
        async registerSuperAdmin(superAdmin) {
            try {
                console.log(superAdmin)
                let rs = await axios.post(URL_CREATE_SUPER_ADMIN, superAdmin, HEADER);
                if (rs.status == 200 && rs.data.status == 200) {
                    this.showSuccess("Register successfully!")
                    this.$router.push('/quorum')
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

<style>
</style>
