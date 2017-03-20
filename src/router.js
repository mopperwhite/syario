import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Dir from './routes/Dir.vue'
import File from './routes/File.vue'
import Store from './store'
const routes = [
  { path: '/',          redirect: '/dir'},
  { path: '/dir',       component: Dir},
  { path: '/dir/:path(.+)', component: Dir },
  { path: '/file/:path(.+)', component: File }
]

const router = new VueRouter({routes})

router.beforeEach((to, from, next) => {
  const rs = ['dir', 'file']
  for(let r of rs){
    let rg = new RegExp(`^\/${r}`)
    if(to.path.match(rg)){
      const p = Store.state.routes.get(r)
      if(p) p.goto_path(to.params.path || '/')
      break
    }
  }
  next()
})

export default router
