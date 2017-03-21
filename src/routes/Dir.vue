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
    div.btn-con(v-for="d in dirs")
      router-link.btn.btn-block.btn-primary(:to=' "/dir" + d.path')
        | {{d.title}}
    div.btn-con('v-for'="f in files")
      router-link.btn.btn-block.btn-info(:to=' "/file" + f.path')
        | {{f.title}}
</template>
<script>
import '../styles/buttons.css'
import Store from '../store'
import Bus from '../bus'

export default {
  name: 'dirbrowser',
  data () {
    return {
      path: '',
      dirs: [],
      files: []
    }
  },
  beforeRouteEnter (to, from, next) {
      next(vm => vm.goto_path(to.params.path))
  },
  methods: {
    get_title(path){
      return path && path.match(/\/([^\/]+)\..*?$/)[1]
    },
    goto_path (path) {
      this.path = path ? '/' + path.split("|").join("/") : '/'
      this.load_path(this.path)
    },
    dirname(path) {
      let res = path.match(/^(.*)\/[^/]+$/)
      return res ? res[1] || '' : ''
    },
    load_path (path) {
      this.$http.get('dist/files'+
        (path == '/' ? '' : path)+'/index.json')
        .then(res => res.json())
        .then(data => {
          this.dirs = data.dirs
          this.files = data.files
          Store.dispatch('enter_dir', {
            dir: path,
            filenames: data.files.map(f => f.path)
          })
        })
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
</style>
