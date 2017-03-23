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
    night_shift: false,
    locked: true,
    has_password: !!localStorage['password'],
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
    },
    set_night_shift(state, s){
      state.night_shift = s
    },
    set_lock(state, s){
      state.locked = s
    },
    set_pwd_state(state, s){
      state.has_password = s
    }
  },
  actions: {
    enter_dir ({commit}, info) {
      commit('store_dir_info', info)
    },
    warn({commit}, message){
      commit('send_message', {type: 'warn', message, show: true})
    },
    info({commit}, message){
      commit('send_message', {type: 'info', message, show: true})
    },
    error({commit}, message){
      commit('send_message', {type: 'error', message, show: true})
    },
    enter_file({commit}) {
      commit('set_file_flag', true)
    },
    leave_file({commit}){
      commit('set_file_flag', false)
    },
    night_shift_on({commit}){
      commit('set_night_shift', true)
    },
    night_shift_off({commit}){
      commit('set_night_shift', false)
    },
    lock({commit}){
      commit('set_lock', true)
    },
    unlock({commit}){
      commit('set_lock', false)
    },
    set_password({commit}, pwd){
      localStorage['password'] = pwd
      commit('set_pwd_state', true)
    },
    del_password({commit}){
      delete localStorage['password']
      commit('set_pwd_state', false)
    },

  }
})
