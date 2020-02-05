<template>
    <header class="header-global">
        <base-nav class="navbar-main" transparent type="" effect="light" expand>
            <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
                <img src="img/brand/white.png" alt="logo">
            </router-link>

            <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
                <base-dropdown class="nav-item" menu-classes="dropdown-menu-xl">
                    <router-link slot="title" to="/proposal/view" data-toggle="dropdown" role="button" class="nav-link nav-link-inner--text">
                        <i class="ni ni-ui-04 d-lg-none"></i>
                        <span class="nav-link-inner--text">Proposal</span>
                    </router-link>
                    <div class="dropdown-menu-inner">
                        <router-link to="/proposal/create" role="button" class="media d-flex align-items-start">
                            <div class="icon icon-shape bg-gradient-primary rounded-circle text-white">
                                <i class="ni ni-spaceship"></i>
                            </div>
                            <div class="media-body ml-3 text-left">
                                <h6 class="heading text-primary mb-md-1">Create proposal</h6>
                                <p class="description d-none d-md-inline-block mb-0">We use a simple quorum-based voting protocol to create a separation of duty functionality.</p>
                            </div>
                        </router-link>
                        <router-link to="/proposal/view" role="button" class="media d-flex align-items-start">
                            <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
                                <i class="ni ni-collection"></i>
                            </div>
                            <div class="media-body ml-3 text-left">
                                <h6 class="heading text-warning mb-md-1">View proposals</h6>
                                <p class="description d-none d-md-inline-block mb-0">Each HSTx transaction must be “Approved” by a majority of the Authority group.</p>
                            </div>
                        </router-link>
                    </div>
                </base-dropdown>
                <div tag="li" class="nav-item">
                    <router-link to="/quorum" role="button" class="nav-link nav-link-inner--text">Quorum</router-link>
                </div>
                <div tag="li" class="nav-item">
                    <router-link to="/guide" role="button" class="nav-link nav-link-inner--text">How to use</router-link>
                </div>
            </ul>
        </base-nav>
    </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown
  }
};
</script>
<style>
</style>
