// lib/firebase.ts

import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCwuEBcOw-owbx4f8W8tOvYNf6yBcl3_cI",
  authDomain: "lost-japan.firebaseapp.com",
  projectId: "lost-japan",
  storageBucket: "lost-japan.firebasestorage.app",
  messagingSenderId: "34657974674",
  appId: "1:34657974674:web:cde944c058c740509f294b",
  measurementId: "G-ZWGLKB5WTS",
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)
const auth = getAuth(app)

export { app, analytics, db, auth }
