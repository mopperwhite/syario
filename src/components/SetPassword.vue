<template lang="jade">
div
  h2
    |Set Password
  div(v-if="sf")
    h3
      |New Password
    password(digit, length=6, @confirm="new_pwd", @cancel="cancel")
  div(v-if="cf")
    h3
      |Confirm Password
    password(digit, length=6, @confirm="com_pwd", @cancel="cancel")
</template>
<script>
import Store from '../store'
import Password from './Password.vue'
export default {
  data () {
    return {
      pwd: '',
      pwd_cd: '',
      sf: true,
      cf: false
    }
  },
  methods:{
    new_pwd (pwd) {
      this.pwd = pwd
      this.cf = true
      this.sf = false
    },
    com_pwd (pwd) {
      this.pwd_cd = pwd
      if(this.pwd == this.pwd_cd){
        localStorage['password'] = this.pwd
        Store.dispatch('info', 'Succeed')
      }else{
        Store.dispatch('warn', 'Password Not Comfirmed')
      }
      this.$emit('done')
    },
    cancel(){
      this.$emit('done')
    }
  },
  components: {
    Password
  }
}
</script>
<style scoped>
</style>
