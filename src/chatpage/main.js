import Vue from 'vue'
import Chat from './Chat'
import router from '../router/chat_router'
// import Vuex from 'vuex'
import store from '../util/vuexx'

import WS from '../util/ws'

Vue.use(WS)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(Chat),
  store
}).$mount('#app')
