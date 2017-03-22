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
      store,
      theme_link: settings.themes.light,
    }
  },
  components: {
    MessageBox
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
      // document
      //   .getElementById('themeLink')
      //   .setAttribute('href', settings.themes[
      //     h > 6 && h < 22 ?
      //       'light':
      //     'dark'
      //   ])
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
