<template lang="jade">
div
  div.container
    div.row
      h1.text-center.col-md-12.col-xs-12
        | {{get_title(path)}}
        span.small.text-muted(v-if="store.state.search_keywords")
          br
          | on "{{store.state.search_keywords}}"
    router-link.btn.btn-block.nav-btn.btn-link.btn-lg(:to="'/dir'+dirname(path)")
        span.glyphicon.glyphicon-chevron-up
  navigate-button-group(:priv_path = "priv_path", :next_path = "next_path")
  div.container(v-if="local_progress")
    div.row.botnavi
      button.btn.btn-block.btn-success.col-md-12.col-xs-12(@click="recover_progress")
        i.fa.fa-circle-o(aria-hidden="true")
        | RECOVER PROGRESS({{(local_progress*100).toFixed(1)}}%)
  h1.text-muted.text-center(v-if="loading")
    | Loading...
  div.arti-con.center-block(v-else)
    div.article(v-html="content", :class="{'night-shift': (image_night_shift && store.state.night_shift)}")
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
  fixed-btn-group(@refresh="sync")
    router-link.col-md-12.col-xs-12.btn.btn-block.nav-btn.btn-default.btn-lg(
      :to="'/dir'+dirname(path)")
      span.glyphicon.glyphicon-chevron-up
    button.btn(
        v-if="progress_needed",
        :class='{"btn-info": !progress_stored(), "btn-success": progress_stored()}',
        @click="store_progress"
      )
      i.fa.fa-star-o(aria-hidden="true")
      | {{(progress*100).toFixed(1)}}%
</template>
<script>
import '../styles/night-shift.css'
import '../styles/buttons.css'
import Store from '../store'
import Bus from '../bus'
import Settings from '../../settings.json'
import NavigateButtonGroup from '../components/NavigateButtonGroup.vue'
import FixedBtnGroup from '../components/FixedBtnGroup.vue'
import firebase from '../base'
export default {
  name: 'filebrowser',
  data () {
    return {
      content: '',
      path: '',
      next_path: '',
      priv_path: '',
      progress: 0,
      finished: false,
      local_progress: 0,
      loading: false,
      progress_needed: true,
      image_night_shift: Settings.night_shift.image,
      store: Store
    }
  },
  components: {
    NavigateButtonGroup,
    FixedBtnGroup
  },
  beforeRouteEnter (to, from, next) {
      next(vm => vm.goto_path(to.params.path))
  },
  methods: {
    set_finished(finished){
      this.finished = finished
      Store.dispatch('set_finished', {path: this.path, finished})
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
      Store.dispatch('set_progress', {path: this.path, progress: this.progress})
    },
    sync(){
      Store.dispatch('sync_with_firebase', {
        path: this.path,
        next: (progress, finished) => {
          this.local_progress =
            Math.max(
              0 || parseFloat(localStorage[`progress:${this.path}`]),
              progress)
          this.finished=
            finished || !!localStorage[`finished?${this.path}`]
          Store.dispatch('set_finished', {path: this.path, finished: this.finished})
          Store.dispatch('set_progress', {
            path: this.path,
            progress: local_progress
          })
        }
      })
    },
    goto_path (path) {
      Store.dispatch('enter_file')
      this.path = path ? '/' + path : '/'
      this.sync()
      this.load_path(this.path)
    },
    load_path (path) {
      this.loading = true
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
          this.loading = false
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
      return path && path.match(/\/([^\/]+?)(\.html*)?$/)[1]
    },
    dirname(path) {
      let res = path.match(/^(.*)\/[^/]+$/)
      return res ? res[1] || '' : ''
    },
    calc_index () {
      let filenames = Store.state.search_keywords ?
        Store.state.filenames.filter(s => {
          s = this.get_title(s.toLowerCase())
          for(let k of Store.state
              .search_keywords.toLowerCase().split(" "))
            if(s.indexOf(k) < 0)
              return false
          return true
        }) : Store.state.filenames
      let len = filenames.length
      let i = filenames.indexOf(this.path)
      this.priv_path =  i!=0 ? filenames[i-1] : null
      this.next_path =  i!=len-1 ? filenames[i+1] : null
    }
  },
  created(){
    Bus.$on('route-goto:file', path => {
      this.goto_path(path)
      this.calc_index()
    })
    Bus.$on('scroll', evt => {
      if(this.progress_needed =
        document.scrollingElement.scrollHeight >
        window.innerWidth){
        this.progress =
          document.scrollingElement.scrollTop /
          (document.scrollingElement.scrollHeight-window.innerWidth)
      }
    })
    Bus.$on('key-navi', dire => {
      let p = {
        priv: this.priv_path,
        next: this.next_path,
      }[dire]
      if(p){
        this.store_progress()
        this.$router.push("/file" + p)
      }
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
</style>
