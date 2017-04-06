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
  button.btn.btn-info.btn-block(@click="login_firebase_with_github")
    | Sync Data via Firebase
  p.text-muted.text-center.small
    | The following domains are required to be accessable:
    br
    | googleapis.com, gstatic.com, firebaseapp.com, github.com
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
      tf_key: '',
      tf_value: ''
    }
  },
  components: {
    SetPassword
  },
  methods: {
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
      store.dispatch('login_firebase')
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
