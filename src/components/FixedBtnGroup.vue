<template lang="jade">
div.fixed-btn-group.btn-group-vertical(
    role="group",
    :class='{"left-edge": left_hand, "right-edge": !left_hand}'
  )
  slot
  button.btn.btn-default.fa.fa-moon-o(@click = "store.commit('set_night_shift', !store.state.night_shift)")
  button.btn.btn-default.fa.fa-refresh(@click="refresh")
  button.btn(
      v-if="store.state.has_password"
      @click="lock"
    )
    i.fa.fa-sign-out(aria-hidden="true")
</template>
<script>
import Settings from '../../settings.json'
import store from '../store'
export default {
  data () {
    return {
      store,
      left_hand: Settings.left_hand
    }
  },
  methods: {
    lock(){
      store.dispatch('lock')
    },
    refresh(){
      this.$emit('refresh')
    }
  }
}
</script>
<style scoped>
.fixed-btn-group{
  position: fixed;
  bottom: 20%;
}
.left-edge{
  left: 1em;
}
.right-edge{
  right: 1em;
}
</style>
