import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Store from './store'
import Bus from './bus'

import Dir from './routes/Dir.vue'
import File from './routes/File.vue'
import Dashboard from './routes/Dashboard.vue'

const routes = [
  { path: '/',          redirect: '/dir'},
  { path: '/dir',       component: Dir},
  { path: '/dir/:path(.+)', component: Dir },
  { path: '/file/:path(.+)', component: File },
  { path: '/dashboard' , component: Dashboard }
]

const router = new VueRouter({routes})
router.beforeEach((to, from, next) => {
  const rs = ['dir', 'file']
  for(let r of rs){
    let rg = new RegExp(`^\/${r}`)
    if(to.path.match(rg)){
      Bus.$emit(`route-goto:${r}`, to.params.path || '/')
      break
    }
  }
  if(to.path.match(/^\/file/)){
    Store.dispatch('enter_file')
    Store.dispatch('set_title', to.params.path)
    document.title = Store.state.title
  }else if(to.path.match(/^\/dir/)){
    Store.dispatch('leave_file')
    Store.dispatch('set_title', to.params.path ? to.params.path+"/": '/')
    document.title = Store.state.title
  }else{
    document.title = Store.state.default_title
  }

  next()
})
window.R = router
export default router
