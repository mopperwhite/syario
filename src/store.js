import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    has_dir_info: false,
    dir: '',
    filenames: [],
    selected_files: [],
    routes: new Map,
    messages: [],
    file_flag: false,
    night_shift: false,
    locked: true,
    has_password: !!localStorage['password'],
    title: '',
    path: '/',
    search_keywords: localStorage['search_keywords'],
    default_title: document.getElementsByTagName("title")[0].text,
  },
  mutations: {
    store_dir_info(state, info) {
      state.has_dir_info = true
      state.dir = info.dir
      state.selected_files =
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
    },
    set_title(state, t){
      state.title = t
    },
    set_path(state, p){
      state.path = p
    },
    set_keywords(state, ks){
      state.search_keywords = ks
      localStorage['search_keywords'] = ks
    }
  },
  actions: {
    enter_dir ({commit}, info) {
      commit('store_dir_info', info)
    },
    set_title({commit}, t){
      commit('set_title', t)
    },
    view_path({commit}, path){
      let res = path && path.match('\/([^\/]*)$')
      commit('set_title', (res && res[1]) || '/')
      commit('set_path', path)
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
    keywords_changed({commit}, ks){
      commit('set_keywords', ks)
    }
  }
})
