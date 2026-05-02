import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAe5Nd-fcS13oRk0VPpK3M9ve1WJWa7vhA",
  authDomain: "homebase-c12bb.firebaseapp.com",
  projectId: "homebase-c12bb",
  storageBucket: "homebase-c12bb.firebasestorage.app",
  messagingSenderId: "1003688996038",
  appId: "1:1003688996038:web:c050a643a7a94c7134bbc7",
  measurementId: "G-RHV1TBD17J"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
