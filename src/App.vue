<template lang="jade">
  #app
    link(
      rel="stylesheet",
      :href="theme_link"
    )
    div
      div(v-for="m in store.state.messages")
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
      }
    }
  },
  created(){
    this.check_time()
    setInterval(() => {
      this.check_time()
    }, 5000)
    window.addEventListener('scroll', evt => {
      if(store.state.file_flag){
        Bus.$emit('scroll', evt)
      }
    })
  }
}
</script>

<style>
</style>
