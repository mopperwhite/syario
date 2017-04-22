import Vue from 'vue'
import VueResource from 'vue-resource'
import KeyboardJs from 'keyboardjs'
import Hammer from 'hammerjs'

Vue.use(VueResource)

import App from './App.vue'
import router from './router'
import bus from './bus'

if(!window.localStorage){
  window.localStorage = {}
}

KeyboardJs.on('left', evt => {
  bus.$emit('key-navi', 'priv')
})
KeyboardJs.on('right', evt => {
  bus.$emit('key-navi', 'next')
})

const hammertime = new Hammer(document.body)
hammertime.on('swipeleft', evt => {
  bus.$emit('key-navi', 'next')
})
hammertime.on('swiperight', evt => {
  bus.$emit('key-navi', 'priv')
})

new Vue({
  components: {
    App
  },
  router
}).$mount('#app')
