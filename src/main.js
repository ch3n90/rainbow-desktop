import Vue from 'vue'
import App from './App.vue'
import router from './router/auth_router'
import store from './util/vuexx'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
