import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    has_dir_info: false,
    dir: '',
    filenames: [],
    routes: new Map,
    messages: []
  },
  mutations: {
    store_dir_info(state, info) {
      state.has_dir_info = true
      state.dir = info.dir
      state.filenames = info.filenames
    },
    register_route(state, {name, route}){
      state.routes.set(name, route)
    },
    send_message(state, m){
      state.messages.push(m)
    }
  },
  actions: {
    enter_dir ({commit}, info) {
      commit('store_dir_info', info)
    },
    route_created({commit}, d) {
      commit('register_route', d)
    },
    warn({commit}, message){
      commit('send_message', {type: 'warn', message, show: true})
    },
    error({commit}, message){
      commit('send_message', {type: 'error', message, show: true})
    }
  }
})
