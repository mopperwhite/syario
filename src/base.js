const Firebase = require('firebase')
import settings from '../settings.json'
Firebase.initializeApp(settings.firebase)
export default Firebase
