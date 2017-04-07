const Firebase = require('firebase')
import store from './store'
import bus from './bus'
bus.$on('init_firebase', config => {
  Firebase.initializeApp(config)
  Firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      store.dispatch('set_firebase_user', {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      })
    } else {
      store.dispatch('set_firebase_user', null)
    }
    store.commit('enable_firebase')
  })
})
export default Firebase
