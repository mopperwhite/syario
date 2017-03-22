<template lang="jade">
div
  div.container.pwd-con
    template(v-if="digit")
      div.dig-con.row(v-if="digit")
        div.text-center.col-md-12.col-xs-12
          template(v-if="length")
            i.fa(
              v-for="_ in parseInt(length)",
              :class="{'fa-circle': _ <= password.length, 'fa-circle-o': _ > password.length}")
          template(v-else)
            i.fa.fa-circle(v-for="_ in password.length")
      div.row(v-for="l in keyboard")
        template(v-for="n in l")
          button.btn.btn-default.col-md-4.col-xs-4.btn-large.dig-btn(
              @click="add_digit(n)",
              :class="{disabled: !digenabled(n)}"
            )
            span
              | {{n}}
    div.row(v-else)
      input.col-md-12.col-xs-12.text-center.text.large(
        type="password",
        @change="check_len",
        @keyup.enter="confirm"
        v-model="password"
      )

</template>
<script>
import {sha256} from 'js-sha256'
export default {
  props: {
    length: {

    },
    digit: {
      tpye: Boolean,
      value: false
    }
  },
  data () {
    return {
      password: '',
      keyboard: [
        ['1','2','3'],
        ['4','5','6'],
        ['7','8','9'],
        ['DEL', '0', 'OK']
      ]
    }
  },
  methods: {
    digenabled(n){
      return (this.length && this.password.length == this.length ?
        !(n >= '0' && n <= '9') : "OK"
      )
    },
    add_digit(d){
      switch (d) {
        case "DEL":
          if(this.password.length > 0){
            this.password = this.password.slice(0, -1)
          }else{
            this.$emit('cancel')
          }
          break
        case "OK":
          this.confirm()
          break
        default:
          this.password += d
          this.check_len()
      }
    },
    check_len(){
      if(this.length && this.password.length == this.length){
        this.confirm()
      }
    },
    confirm () {
      this.$emit('confirm', sha256(this.password))
      this.password = ''
    },
    cancel () {
      this.$emit('canceled')
      this.password = ''
    }
  }
}
</script>
<style scoped>
.dig-con{
  font-size: 2em;
}
.pwd-con{
  width: 70%;
  min-width: 12em;
}
.dig-btn{
  height: 2em;
  font-size: 2em;
}
.sig-dig{
  margin: 0 auto;
}
</style>
