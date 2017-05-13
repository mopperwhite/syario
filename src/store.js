import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import SHA256 from 'js-sha256'
import firebase from './base'
import settings from '../settings.json'

function at_night(){
  let h = new Date().getHours()
  return h <= 6 || h > 22
}

export default new Vuex.Store({
  state: {
    has_dir_info: false,
    dir: '',
    filenames: [],
    selected_files: [],
    routes: new Map,
    messages: [],
    file_flag: false,
    night_shift: at_night(),
    locked: true,
    has_password: !!localStorage['password'],
    title: '',
    path: '/',
    firebase_user: null,
    firebase_enabled: false,
    search_keywords: localStorage['search_keywords'],
    default_title: document.getElementsByTagName("title")[0].text,
    selected_text: '',
    translated_text: '',
    youdao: null,
    theme_link: at_night() ? settings.themes.dark :  settings.themes.light
  },
  mutations: {
    set_youdao(state, youdao){
      state.youdao = youdao
    },
    set_translated_text(state, text){
      state.translated_text = text
    },
    set_selected_text(state, text){
      state.selected_text = text
    },
    enable_firebase(state){
      state.firebase_enabled = true
    },
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
      state.theme_link = s ? settings.themes.dark : settings.themes.light
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
    },
    set_firebase_user(state, user){
      state.firebase_user = user
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
    },
    login_firebase_github({commit, dispatch}){
      let provider = new firebase.auth.GithubAuthProvider()
      provider.addScope('repo')
      firebase.auth().signInWithPopup(provider).then(result => {
        let token = result.credential.accessToken
        let user = result.user
        commit('set_firebase_uid', user.uid)
      }).catch(error => {
        let errorCode = error.code
        let errorMessage = error.message
        let email = error.email
        let credential = error.credential
        dispatch('warn', `Failed to access Github: ${errorMessage}`)
      });
    },
    set_finished({commit, state}, {path, finished}){
      if(finished){
        localStorage[`finished?${path}`] = "t"
      }else{
        delete localStorage[`finished?${path}`]
      }
      if(state.firebase_user){
        firebase
          .database()
          .ref(`users/${state.firebase_user.uid}/articles/${SHA256(path)}`)
          .update({
            finished,
          })
      }
    },
    set_progress({commit, state}, {path, progress}){
      localStorage[`progress:${path}`] = progress
      if(state.firebase_user){
        firebase
          .database()
          .ref(`users/${state.firebase_user.uid}/articles/${SHA256(path)}`)
          .update({
            progress,
          })
      }
    },
    set_firebase_user({commit}, user){
      commit('set_firebase_user', user)
    },
    sync_with_firebase({commit, state}, {path, next}){
      if(!state.firebase_user) return;
      let nodekey = `users/${state.firebase_user.uid}/articles/${SHA256(path)}`
      firebase
        .database()
        .ref(nodekey)
        .once('value', snapshot => {
          let r = snapshot.val()
          if(r){
            next(r.progress, r.finished)
          }else {
            next(0, false)
          }
        })
    },
    firebase_login({commit, dispatch}, {email, password}){
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .catch(error => {
          let errorCode = error.code
          let errorMessage = error.message
          let email = error.email
          let credential = error.credential
          dispatch('warn', `Error: ${errorMessage}`)
        })
    },
    firebase_register({commit, dispatch}, {email, password}){
      firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(error => {
          let errorCode = error.code
          let errorMessage = error.message
          let email = error.email
          let credential = error.credential
          dispatch('warn', `Error: ${errorMessage}`)
        })
    },
    firebase_logout({commit}){
      firebase.auth().signOut()
        .catch(error => {
          dispatch('warn', `Error: ${error.errorMessage}`)
        })
    }
  },
})
