<template lang="jade">
div.center-block.dashboard
  h1
    i.fa.fa-cog
    | Dashboard
  set-password(v-if="set_pwd_flag", @done="set_pwd_flag = false")
  button.btn.btn-info.btn-block(v-else, @click="set_pwd_flag = true")
    | Set Passowrd
  button.btn.btn-danger.btn-block(@click="erase_pwd")
    | Erase Password
</template>
<script>
import SetPassword from '../components/SetPassword.vue'
export default {
  data () {
    return {
      set_pwd_flag: false
    }
  },
  components: {
    SetPassword
  },
  methods: {
    erase_pwd () {
      if(confirm('Erase your passowrd?'))
        delete localStorage['password']
    }
  }
}
</script>
<style scoped>
.dashboard{
  width: 90%;
}
</style>
