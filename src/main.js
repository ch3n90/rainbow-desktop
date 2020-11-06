import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import Vuex from 'vuex'
import store from './util/vuexx'

import WS from './util/ws'

Vue.use(WS)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
