<template lang="jade">
div.center-block.dashboard.container
  h1
    i.fa.fa-cog
    | Dashboard
  button.btn.btn-link.btn-block.btn-lg(@click="back")
    i.glyphicon.glyphicon-chevron-left
    | Back
  button.btn.btn-block(
      :class="{'btn-success': auto_lock_flag, 'btn-warning': !auto_lock_flag, 'disabled': !store.state.has_password}",
      @click="set_autolock(!auto_lock_flag)"
    )
    i.fa(:class="{'fa-lock': auto_lock_flag, 'fa-unlock': !auto_lock_flag}")
    | Autolock
  set-password(v-if="set_pwd_flag", @done="set_pwd_flag = false")
  button.btn.btn-info.btn-block(v-else, @click="set_pwd_flag = true")
    | Set Passowrd
  button.btn.btn-danger.btn-block(@click="erase_pwd")
    | Erase Password
  button.btn.btn-danger.btn-block(@click="clear_localstorage")
    | Clear Local Records
  template(v-if="store.state.firebase_enabled")
    h3.text-center
      | Sync Your Progress via Firebase
    p.text-muted.text-center.small
      | The following domains are required to be accessable:
      br
      | googleapis.com, gstatic.com, firebaseapp.com, github.com
    template(v-if="store.state.firebase_user")
      h4.text-center.text-success
        | Hello, {{store.state.firebase_user.email}}
      button.btn.btn-warning.btn-block(v-if="", @click="firebase_logout")
        | Logout
    template(v-else)
      div.form-group
        label(for='email') Email
        input.form-control(name="email", type='email', v-model='fb_email' placeholder='holder')
      div.form-group
        label(for='password') Password
        input.form-control(type='password', name='password', v-model="fb_pwd" placeholder='holder')
      button.btn.btn-primary.btn-block(@click="firebase_login(fb_email, fb_pwd)")
        | Login
      button.btn.btn-info.btn-block(@click="firebase_register(fb_email, fb_pwd)")
        | Create Account
</template>
<script>
import firebase from '../base'
import store from '../store'
import SetPassword from '../components/SetPassword.vue'
export default {
  data () {
    return {
      store,
      auto_lock_flag: !!localStorage['autolock'],
      set_pwd_flag: false,
      fb_email: '',
      fb_pwd: ''
    }
  },
  components: {
    SetPassword
  },
  methods: {
    clear_localstorage () {
      if(confirm('Do you want to delete ALL your local data\nincluding password and progress?'))
        localStorage.clear()
    },
    set_autolock(s) {
      this.auto_lock_flag = s
      if(s){
        localStorage['autolock'] = true
      }else{
        delete localStorage['autolock']
      }
    },
    erase_pwd () {
      if(confirm('Erase your passowrd?'))
        store.dispatch('del_password')
    },
    back () {
      window.history.back()
    },
    login_firebase_with_github(){
      store.dispatch('login_firebase_github')
    },
    firebase_login(email, password){
      store.dispatch('firebase_login', {email, password})
    },
    firebase_register(email, password){
      store.dispatch('firebase_register', {email, password})
    },
    firebase_logout(){
      store.dispatch('firebase_logout')
    }
  }
}
</script>
<style scoped>
.dashboard{
  width: 90%;
  font-size: 2em;
}
</style>
