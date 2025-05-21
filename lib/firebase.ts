// lib/firebase.ts

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCwuEBcOw-owbx4f8W8tOvYNf6yBcl3_cI",
  authDomain: "lost-japan.firebaseapp.com",
  projectId: "lost-japan",
  storageBucket: "lost-japan.appspot.com", // .app(X) → .app**spot**.com(맞음)
  messagingSenderId: "34657974674",
  appId: "1:34657974674:web:cde944c058c740509f294b"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, db, auth }
