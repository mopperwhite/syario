import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

import App from './App.vue'
import router from './router'

if(!window.localStorage){
  window.localStorage = {}
}

new Vue({
  components: {
    App
  },
  router
}).$mount('#app')
