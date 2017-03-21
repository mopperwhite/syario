<template lang="jade">
div
  div.container
    div.row
      h1.text-center.col-md-12.col-xs-12
        | {{get_title(path)}}
    router-link.btn.btn-block.nav-btn.btn-link.btn-lg(:to="'/dir'+dirname(path)")
        span.glyphicon.glyphicon-chevron-up
  navigate-button-group(:priv_path = "priv_path", :next_path = "next_path")
  div.container(v-if="local_progress")
    div.row.botnavi
      button.btn.btn-block.btn-success.col-md-12.col-xs-12(@click="recover_progress")
        i.fa.fa-circle-o(aria-hidden="true")
        | RECOVER PROGRESS({{(local_progress*100).toFixed(1)}}%)
  div.arti-con.center-block
    div.article(v-html="content")
  div.container
    div.row.botnavi
      router-link.col-md-6.col-xs-6.btn.btn-default(:to="'/dir'+dirname(path)")
        span.glyphicon.glyphicon-chevron-up
        | BACK
      button.btn.col-md-6.col-xs-6(
          :class="{'btn-info': !finished, 'btn-success': finished}"
          @click="set_finished(!finished)"
        )
        i.fa(
          :class="{'fa-lock': finished, 'fa-unlock': !finished}"
          aria-hidden="true")
        | {{ finished ? 'FINISHED' : 'READING' }}
  navigate-button-group(:priv_path = "priv_path", :next_path = "next_path")
  div.view-ctl.btn-group-vertical(
      role="group",
      :class='{"left-edge": left_hand, "right-edge": !left_hand}'
    )
    router-link.col-md-12.col-xs-12.btn.btn-block.nav-btn.btn-default.btn-lg(
      :to="'/dir'+dirname(path)")
      span.glyphicon.glyphicon-chevron-up
    button.btn(
        :class='{"btn-info": !progress_stored(), "btn-success": progress_stored()}',
        @click="store_progress"
      )
      i.fa.fa-star-o(aria-hidden="true")
      | {{(progress*100).toFixed(1)}}%
</template>
<script>
import '../styles/buttons.css'
import Store from '../store'
import Bus from '../bus'
import Settings from '../../settings.json'
import NavigateButtonGroup from '../components/NavigateButtonGroup.vue'
export default {
  name: 'filebrowser',
  data () {
    return {
      left_hand: Settings.left_hand,
      content: '',
      path: '',
      next_path: '',
      priv_path: '',
      progress: 0,
      finished: false,
      local_progress: 0
    }
  },
  components: {
    NavigateButtonGroup
  },
  beforeRouteEnter (to, from, next) {
      next(vm => vm.goto_path(to.params.path))
  },
  methods: {
    set_finished(val){
      if(this.finished = val){
        localStorage[`finished?${this.path}`] = "t"
        delete localStorage[`progress:${this.path}`]
      }else{
        delete localStorage[`finished?${this.path}`]
      }
    },
    progress_stored(){
      return Math.abs(this.progress - this.local_progress)<1e-3
    },
    recover_progress(){
      const height = document.scrollingElement.scrollHeight
      const wh = window.innerWidth
      document.scrollingElement.scrollTop = parseInt(this.local_progress*(height-wh))
      this.progress = this.local_progress
    },
    store_progress(){
      this.local_progress = this.progress
      localStorage[`progress:${this.path}`] = this.progress
    },
    goto_path (path) {
      this.path = path ? '/' + path : '/'
      this.local_progress = parseFloat(localStorage[`progress:${this.path}`])
      this.finished = localStorage[`finished?${this.path}`]
      this.load_path(this.path)
    },
    load_path (path) {
      this.$http.get('dist/files' + path)
        .then(res => res.body,
              res => {
                switch (res.status) {
                  case 404:
                    Store.dispatch('warn', 'File Not Found.')
                    break;
                  default:
                    Store.dispatch('error', 'Unknown Network Error.')
                }
              })
        .then(c => {
          this.content = c
        })
      if(!Store.state.has_dir_info){
        this.$http.get('dist/files'+
          this.dirname(this.path)+'/index.json')
          .then(
            res => res.json())
          .then(data => {
            Store.dispatch('enter_dir', {
              dir: path,
              filenames: data.files.map(f => f.path)
            })
            this.calc_index()
          })
      }else{
        this.calc_index()
      }
    },
    get_title(path){
      return path && path.match(/\/([^\/]+?)(\..*)?$/)[1]
    },
    dirname(path) {
      let res = path.match(/^(.*)\/[^/]+$/)
      return res ? res[1] || '' : ''
    },
    calc_index () {
      const len = Store.state.filenames.length
      const i = Store.state.filenames.indexOf(this.path)
      this.priv_path =  i!=0 ? Store.state.filenames[i-1] : null
      this.next_path =  i!=len-1 ? Store.state.filenames[i+1] : null
    }
  },
  created(){
    Bus.$on('route-goto:file', path => {
      this.goto_path(path)
    })
    document.addEventListener('scroll', evt => {
      this.progress = document.scrollingElement.scrollTop / (document.scrollingElement.scrollHeight-window.innerWidth)
      console.log(this.progress)
    })
  }
}
</script>
<style scoped>
.arti-con{
  width: 90%;
}
.article{
  font-size: 2em;
}
.view-ctl{
  position: fixed;
  bottom: 1em;
}
.left-edge{
  left: 1em;
}
.right-edge{
  right: 1em;
}
.view-ctl > button {
}
</style>
