<template lang="jade">
div
  p
    router-link(
        :to="'/dir'+dirname(path)"
      )
      | ..
  div(v-if="path.match(/\.html$/)",v-html="content")
  div(v-else)
    img(:src=" 'dist/files' + path")
  div
    router-link(v-if="priv_path",
        @click='alert("FUCK")',
        :to='"/file" + priv_path')
      | Priv
    router-link(v-if="next_path",
        @click='goto_path("/file" + next_path)',
        :to='"/file" + next_path')
      | Next
</template>
<script>
import Store from '../store'

export default {
  name: 'filebrowser',
  data () {
    return {
      content: '',
      path: '',
      next_path: '',
      priv_path: '',
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
    load_path (path) {
      this.$http.get('dist/files' + path)
        .then(res => res.body)
        .then(c => {
          this.content = c
        })
      if(!Store.state.has_dir_info){
        this.$http.get('dist/files'+
          this.dirname(this.path)+'/index.json')
          .then(res => res.json())
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
    Store.dispatch('route_created', {name: 'file', route: this})
  }
}
</script>
