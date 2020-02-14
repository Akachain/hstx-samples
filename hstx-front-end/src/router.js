import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Components from "./views/Components.vue";
import Home from "./views/Home.vue";
import CreateProposal from "./views/CreateProposal.vue";
import ViewProposal from "./views/ViewProposal.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Quorum from "./views/Quorum.vue";
import Temp from "./views/Temp.vue";
import Guide from "./views/Guide.vue";

Vue.use(Router);

let router = new Router({
  linkExactActiveClass: "active",
  routes: [{
      path: "/",
      redirect: '/home'
    },
    {
      path: "/sample",
      name: "components",
      components: {
        header: AppHeader,
        default: Components,
        footer: AppFooter
      }
    },
    {
      path: "/home",
      name: "home",
      components: {
        header: AppHeader,
        default: Home,
        footer: AppFooter
      }
    },
    {
      path: "/proposal/create",
      name: "createProposal",
      components: {
        header: AppHeader,
        default: CreateProposal,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true,
        isSuperAdmin: false
      }
    },
    {
      path: "/proposal/view",
      name: "viewProposal",
      components: {
        header: AppHeader,
        default: ViewProposal,
        footer: AppFooter
      }
    },
    {
      path: "/quorum",
      name: "quorum",
      components: {
        header: AppHeader,
        default: Quorum,
        footer: AppFooter
      },
      meta: {
        requiresAuth: true,
        isSuperAdmin: true
      }
    },
    {
      path: "/temp",
      name: "temp",
      components: {
        header: AppHeader,
        default: Temp,
        footer: AppFooter
      }
    },
    {
      path: "/guide",
      name: "guide",
      components: {
        header: AppHeader,
        default: Guide,
        footer: AppFooter
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter
      },
      props: true
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: AppHeader,
        default: Register,
        footer: AppFooter
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return {
        selector: to.hash
      };
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  }
});

router.beforeEach((to, from, next) => {
  const freePages = ['home', 'guide', 'temp', 'components', 'login', 'register', 'viewProposal']
  if (freePages.includes(to.name)) { // Free pages
    next()
  } else if (to.matched.some(record => record.meta.requiresAuth)) { // Auth pages
    if (localStorage.getItem('user') == null) { // Not login, redirect to home
      next({
        path: '/home'
      })
    } else {
      let user = JSON.parse(localStorage.getItem('user'))
      if (to.matched.some(record => record.meta.isSuperAdmin)) { // Require Super Admin
        if (user.SuperAdminID != null) {
          next()
        } else {
          next({
            name: 'viewProposal'
          })
        }
      } else { // Not require Super Admin
        next()
      }
    }
  }
})

export default router