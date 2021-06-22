import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import NavBar from '../src/components/ui/NavBar'

Vue.component('NavBar', NavBar);

Vue.config.productionTip = false
export const bus = new Vue();


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
