import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Argon from "./plugins/argon-kit";
import VueSweetalert2 from 'vue-sweetalert2';

import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.use(Argon);
Vue.use(VueSweetalert2);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
