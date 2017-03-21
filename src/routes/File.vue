<template lang="jade">
div
  div.container
    div.row
      h1.text-center.col-md-12
        | {{get_title(path)}}
    div.row
      router-link.col-md-12.btn.btn-block.nav-btn.btn-link.btn-lg(:to="'/dir'+dirname(path)")
        span.glyphicon.glyphicon-chevron-up
  navigate-button-group(:priv_path = "priv_path", :next_path = "next_path")
  div.arti-con.center-block
    div.article(v-html="content")
  navigate-button-group(:priv_path = "priv_path", :next_path = "next_path")
</template>
<script>
import '../styles/buttons.css'
import Store from '../store'
import Bus from '../bus'
import NavigateButtonGroup from '../components/NavigateButtonGroup.vue'
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
  components: {
    NavigateButtonGroup
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
    Bus.$on('route-goto:file', path => {
      this.goto_path(path)
    })
  }
}
</script>
<style scoped>
.arti-con{
  width: 90%;
}
</style>
