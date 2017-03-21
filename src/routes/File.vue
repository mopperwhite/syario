<template lang="jade">
div
  h1.text-center
    | {{get_title(path)}}
  router-link.btn.btn-block(:to="'/dir'+dirname(path)")
      span.glyphicon.glyphicon-chevron-up
  div.arti-con
    div.article(v-html="content")
  div.container
    div.btn-group.row.navi-btn-group
      router-link.btn.col-md-6(
          :class="{disabled: !priv_path}",
          @click='alert("FUCK")',
          :to='"/file" + priv_path')
        span.glyphicon.glyphicon-chevron-left
      router-link.btn.col-md-6(
          :class="{disabled: !next_path}"
          @click='goto_path("/file" + next_path)',
          :to='"/file" + next_path')
        span.glyphicon.glyphicon-chevron-right
</template>
<script>
import '../styles/buttons.css'
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
      this.path = path ? '/' + path : '/'
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
    Store.dispatch('route_created', {name: 'file', route: this})
  }
}
</script>
<style scoped>
.navi-btn-group {
  width: 100%;
  margin: 0;
}
.arti-con{
  padding-left: 10%;
  padding-right: 10%;
}
.article {
}
.article > img {
  width: 1px;
  margin-left: auto;
  margin-right: auto;
}
</style>
