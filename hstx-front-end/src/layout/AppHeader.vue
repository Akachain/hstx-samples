<template>
  <header class="header-global">
    <base-nav class="navbar-main" transparent type effect="light" expand>
      <router-link slot="brand" class="navbar-brand mr-lg-5" to="/home">
        <img src="img/brand/logoAkahain.png" alt="logo" />
      </router-link>

      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
        <div tag="li" class="nav-item">
          <router-link to="/home" role="button" class="nav-link nav-link-inner--text">About</router-link>
        </div>
        <base-dropdown
          class="nav-item"
          menu-classes="dropdown-menu-xl"
          v-if="user && !user.SuperAdminID"
        >
          <router-link
            slot="title"
            to="/proposal/view"
            data-toggle="dropdown"
            role="button"
            class="nav-link nav-link-inner--text"
          >
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
                <p
                  class="description d-none d-md-inline-block mb-0"
                >We use a simple quorum-based voting protocol to create a separation of duty functionality.</p>
              </div>
            </router-link>
            <router-link to="/proposal/view" role="button" class="media d-flex align-items-start">
              <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
                <i class="ni ni-collection"></i>
              </div>
              <div class="media-body ml-3 text-left">
                <h6 class="heading text-warning mb-md-1">View proposals</h6>
                <p
                  class="description d-none d-md-inline-block mb-0"
                >Each HSTx transaction must be “Approved” by a majority of the Authority group.</p>
              </div>
            </router-link>
          </div>
        </base-dropdown>
        <div tag="li" class="nav-item" v-if="user && user.SuperAdminID">
          <router-link to="/quorum" role="button" class="nav-link nav-link-inner--text">Quorum</router-link>
        </div>
        <div tag="li" class="nav-item">
          <router-link to="/guide" role="button" class="nav-link nav-link-inner--text">How to use</router-link>
        </div>
      </ul>
      <div class="ml-auto">
        <div v-if="user" class="user">
          <i>
            Hello,
            <b>{{user.Name}}</b>
          </i>
          <base-dropdown>
            <base-button
              id="userBtn"
              slot="title"
              type="secondary"
              class="dropdown-toggle btn btn-info"
            >▽</base-button>
            <span class="dropdown-item">Profile</span>
            <span class="dropdown-item">Settings</span>
            <hr class="my-1" />
            <span class="dropdown-item" @click="logOut()">Logout</span>
          </base-dropdown>
          <!-- <div
            class="userSetting text-primary"
            ref="settingBox"
            :class="isHideSetting ? 'hide' : ''"
            @blur="hideSeting()"
          >
            <span>Profile</span>
            <br />
            <span>Settings</span>
            <hr class="my-1" />
            <span @click="logOut()">Logout</span>
          </div>-->
        </div>
        <div v-if="!user" class="login">
          <div id="sign-in" @click="login()">Sign in</div>
          <base-button
            id="sign-up"
            type="button"
            class="btn pt-1"
            size="sm"
            @click="register()"
          >Sign up</base-button>
        </div>
      </div>
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
  },
  data() {
    return {
      user: null
    };
  },
  created() {
    this.loadUser();
    this.$root.$on("reloadUser", () => {
      this.loadUser();
    });
  },
  methods: {
    loadUser() {
      try {
        this.user = JSON.parse(localStorage.getItem("user"));
      } catch (err) {
        console.log(err.message);
      }
    },
    login() {
      this.$router.push({
        name: "login"
      });
    },
    register() {
      this.$router.push("/register");
    },
    logOut() {
      localStorage.removeItem("user");
      this.$root.$emit("reloadUser");
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped lang="scss">
.nav-link-inner--text {
  &:hover {
    text-decoration: underline;
  }
}

.user {
  right: 0;
  color: white;
  position: relative;
  font-size: 14.4px;

  #userBtn {
    margin-left: 5px;
    background: transparent;
    padding: 3px 0px 5px 4px;
    box-shadow: none;
    border: none;
    &:hover {
      cursor: pointer;
      transform: none;
    }
    &:after {
      content: none;
    }
  }

  .dropdown-menu.show {
    background: red;
  }
}

.userSetting {
  position: absolute;
  right: 0;
  font-size: 14px;
  width: 130px;
  background: rgba(255, 255, 255, 0.75);
  color: black;
  border-radius: 5px;
  text-align: right;
  padding: 5px 10px;
  > span {
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

.login {
  color: white;
}

#sign-in {
  display: inline;
  margin-right: 8px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}

#sign-up {
  text-transform: none;
  font-size: 16px;
  color: white;
  font-weight: 500;
  background: transparent;
  border: 1px solid white;
  &:hover {
    transform: none;
  }
}
</style>