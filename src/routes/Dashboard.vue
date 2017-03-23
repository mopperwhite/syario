<template lang="jade">
div.center-block.dashboard
  h1
    i.fa.fa-cog
    | Dashboard
  button.btn.btn-link.btn-block.btn-lg(@click="back")
    i.glyphicon.glyphicon-chevron-left
    | Back
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
      set_pwd_flag: false
    }
  },
  components: {
    SetPassword
  },
  methods: {
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
}
</style>
