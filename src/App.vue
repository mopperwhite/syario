<template lang="jade">
  div#app
    link(
      rel="stylesheet",
      :href="store.state.theme_link"
    )
    div
      div.msg-box(v-for="m in store.state.messages")
        message-box(
          :msg = "m.message",
          :type = "m.type",
          v-if = "m.show"
          @close = "m.show = false"
        )

    div(v-if="store.state.has_password && store.state.locked")
      h1.text-center
        i.fa.fa-lock
        | Locked
      password(@confirm="confirm_pwd", digit, length=6)
    div(v-show="!store.state.has_password || !store.state.locked")
      router-view
      router-link.btn.btn-link.btn-block(to="/dashboard")
        i.fa.fa-cog
        | Dashboard
</template>

<script>
import settings from '../settings.json'
import store from './store'
import firebase from './base'
import Bus from './bus'
import MessageBox from './components/MessageBox.vue'
import Password from './components/Password.vue'

export default {
  name: 'app',
  data () {
    return {
      store,
      theme_link: settings.themes.light,
    }
  },
  components: {
    MessageBox,
    Password
  },
  methods: {
    check_time(){
      let h = new Date().getHours()
      if(h > 6 && h < 22){
        store.dispatch('night_shift_off')
        this.theme_link = settings.themes.light
      }else{
        store.dispatch('night_shift_on')
        this.theme_link = settings.themes.dark
      }
    },
    password_enabled(){
      return !!localStorage['password']
    },
    confirm_pwd(pwd){
      if(pwd == localStorage['password']){
        store.dispatch('unlock')
        document.title = store.state.title
      }
    }
  },
  created(){
    // this.check_time()
    // setInterval(() => {
    //   this.check_time()
    // }, 5000)
    window.addEventListener('scroll', evt => {
      if(store.state.file_flag){
        Bus.$emit('scroll', evt)
      }
    })
    document.title = store.state.default_title
    document.addEventListener('visibilitychange', evt => {
      if(document.hidden){
        document.title = store.state.default_title
        if(localStorage['autolock']){
          store.dispatch('lock')
        }
      }else{
        if(!localStorage['autolock']){
          document.title = store.state.title
        }
      }
    })
    this.$http.get('firebase.json')
    .then(res => res.json())
    .then(config => {
      Bus.$emit('init_firebase', config)
    })
    this.$http.get('youdao.json')
    .then(res => res.json())
    .then(config => {
      store.commit('set_youdao', config)
    })
  }
}
</script>
<style scoped>
.msg-box{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}
</style>

