<template lang="jade">
  #app
    div
      div(v-for="m in store.state.messages")
        message-box(
          :msg = "m.message",
          :type = "m.type",
          v-if = "m.show"
          @close = "m.show = false"
        )
    router-view
</template>

<script>
import settings from '../settings.json'
import store from './store'
import Bus from './bus'
import MessageBox from './components/MessageBox.vue'

export default {
  name: 'app',
  data () {
    return {
      store
    }
  },
  components: {
    MessageBox
  },
  methods: {
    check_theme(){
      let h = new Date().getHours()
      document
        .getElementById('themeLink')
        .setAttribute('href', settings.themes[
          h > 6 && h < 22 ?
            'light':
          'dark'
        ])
    }
  },
  created(){
    this.check_theme()
    setInterval(() => {
      this.check_theme()
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
