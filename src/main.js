import Vue from 'vue'
import VueResource from 'vue-resource'
import KeyboardJs from 'keyboardjs'
import Hammer from 'hammerjs'

Vue.use(VueResource)

import App from './App.vue'
import router from './router'
import bus from './bus'
import store from './store'

if(!window.localStorage){
  window.localStorage = {}
}

KeyboardJs.on('left', evt => {
  bus.$emit('key-navi', 'priv')
})
KeyboardJs.on('right', evt => {
  bus.$emit('key-navi', 'next')
})

delete Hammer.defaults.cssProps.userSelect
const hammertime = new Hammer(document.body)
hammertime.on('swipeleft', evt => {
  bus.$emit('key-navi', 'next')
})
hammertime.on('swiperight', evt => {
  bus.$emit('key-navi', 'priv')
})

function get_selection(){
  let sel = window.getSelection()
  if(!sel.baseNode){
    store.commit('set_selected_text', '')
  }else{
    let text = sel.baseNode.textContent.slice(sel.baseOffset, sel.extentOffset)
    store.commit('set_selected_text', text)
  }
}
if(/iPad|iPhone|iPod/.test(navigator.userAgent)){
  setInterval(get_selection, 50)
}else{
  document.addEventListener('selectionchange', get_selection, false)
}


new Vue({
  components: {
    App
  },
  router
}).$mount('#app')
