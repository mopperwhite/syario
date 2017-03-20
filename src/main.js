import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

import App from './App.vue'
import router from './router'

new Vue({
  components: {
    App
  },
  router
}).$mount('#app')
