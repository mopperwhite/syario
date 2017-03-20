<template lang="jade">
div
  p
    router-link(
        v-if=" path != '/' ",
        :to="'/dir'+dirname(path)"
      )
      | ..
  div(v-for="d in dirs")
    p
      router-link(:to=' "/dir" + d.path')
        | {{d.title}}
  div('v-for'="f in files")
    p
      router-link(:to=' "/file" + f.path')
        | {{f.title}}
</template>
<script>
import Store from '../store'

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
    Store.dispatch('route_created', {name: 'dir', route: this})
  }
}
</script>
