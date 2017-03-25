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
</template>
<script>
import store from '../store'
import SetPassword from '../components/SetPassword.vue'
export default {
  data () {
    return {
      store,
      auto_lock_flag: !!localStorage['autolock'],
      set_pwd_flag: false
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
