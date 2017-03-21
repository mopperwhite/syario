import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    has_dir_info: false,
    dir: '',
    filenames: [],
    routes: new Map,
    messages: [],
    file_flag: false,
  },
  mutations: {
    store_dir_info(state, info) {
      state.has_dir_info = true
      state.dir = info.dir
      state.filenames = info.filenames
    },
    send_message(state, m){
      state.messages.push(m)
    },
    set_file_flag(state, s){
      state.file_flag = s
    }
  },
  actions: {
    enter_dir ({commit}, info) {
      commit('store_dir_info', info)
    },
    warn({commit}, message){
      commit('send_message', {type: 'warn', message, show: true})
    },
    error({commit}, message){
      commit('send_message', {type: 'error', message, show: true})
    },
    enter_file({commit}) {
      commit('set_file_flag', true)
    },
    leave_file({commit}){
      commit('set_file_flag', false)
    }
  }
})
