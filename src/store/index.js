import Vue from "vue";
import Vuex from "vuex";

import shipments from "./modules/shipments/index";
import vessel from "./modules/vessel/index";
import notifications from "./modules/notifications/notifications";


Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    shipments,
    vessel,
    notifications
  }
});
