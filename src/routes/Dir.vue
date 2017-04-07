<template lang="jade">
div
  h1.dir-path
    span
      | {{path}}
  div.center-block.con
    router-link.btn.btn-block.nav-btn.btn-lg.btn-link(
        v-if=" path != '/' ",
        :to="'/dir'+dirname(path)"
      )
      span.glyphicon.glyphicon-chevron-up
    div.form-group
        input.form-control.search-input(
          type="search",
          v-model="search_words",
          @input="store.dispatch('keywords_changed', search_words)"
        )
    div.btn-con(v-for="d in dirs")
      router-link.btn.btn-block.btn-primary(
          :to=' "/dir" + d.path',
          v-if="!search_words || match_search(d.title)"
        )
        i.fa.fa-folder-o
        | {{d.title}}
    div.btn-con('v-for'="f in files")
      router-link.btn.btn-block(
          v-if="!search_words || match_search(f.title)",
          :to=' "/file" + f.path',
          :class='{"btn-info": !f.finished, "btn-success": f.finished}'
        )
        | {{f.title}}
  fixed-btn-group(@refresh="sync_finished")
</template>
<script>
import '../styles/buttons.css'
import Store from '../store'
import Bus from '../bus'
import FixedBtnGroup from '../components/FixedBtnGroup.vue'

export default {
  name: 'dirbrowser',
  data () {
    return {
      path: '',
      dirs: [],
      files: [],
      search_words: '',
      store: Store,
    }
  },
  components: {
    FixedBtnGroup
  },
  beforeRouteEnter (to, from, next) {
      next(vm => vm.goto_path(to.params.path))
  },
  methods: {
    match_search(s){
      s = s.toLowerCase()
      for(let k of this.search_words.toLowerCase().split(" "))
        if(s.indexOf(k) < 0)
          return false
      return true
    },
    file_read(path){
      return localStorage[`finished?${path}`]
    },
    get_title(path){
      return path && path.match(/\/([^\/]+)\..*?$/)[1]
    },
    goto_path (path) {
      this.search_words = Store.state.search_keywords
      this.path = path ? '/' + path.split("|").join("/") : '/'
      this.load_path(this.path)
    },
    dirname(path) {
      let res = path.match(/^(.*)\/[^/]+$/)
      return res ? res[1] || '' : ''
    },
    sync_finished(){
      for(let f of this.files){
        Store.dispatch('sync_with_firebase', {
          path: f.path,
          next: (progress, finished) => {
            f.finished =
              finished || !!localStorage[`finished?${f.path}`]
            Store.dispatch('set_finished', {
              path: f.path,
              finished: f.finished
            })
          }
        })
      }
    },
    load_path (path) {
      this.$http.get('dist/files'+
        (path == '/' ? '' : path)+'/index.json')
        .then(res => res.json())
        .then(data => {
          this.dirs = data.dirs
          for(let f of data.files){
            f.finished =
              !!localStorage[`finished?${f.path}`]
          }
          this.files = data.files
          this.sync_finished()
          Store.dispatch('enter_dir', {
            dir: path,
            filenames: data.files.map(f => f.path)
          })
        })
    },
    lock(){
      Store.dispatch('lock')
    }
  },
  created () {
    Bus.$on('route-goto:dir', path => {
      this.goto_path(path)
    })
  }
}
</script>
<style scoped>
.con{
  width: 90%;
}
.btn-con{
  margin-top: 1em;
  font-size: 1.5em;
}
h1.dir-path{
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  overflow-x: hidden;
  overflow-y: hidden;
  text-align: center;;
  direction: rtl;
  white-space: nowrap;
}
.search-input{
  text-align: center;
  font-size: 1.5em;
}
</style>
