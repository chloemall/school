import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Importing getStorage from firebase storage module

const firebaseConfig = {
  apiKey: "AIzaSyA5teWBt8-cSgRVyek87W47_F0Kx3qWA9Y",
  authDomain: "college-1db7d.firebaseapp.com",
  projectId: "college-1db7d",
  storageBucket: "college-1db7d.appspot.com",
  messagingSenderId: "602520223496",
  appId: "1:602520223496:web:97bda029047d125afc76bd",
  measurementId: "G-009G1012MH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initializing Firebase Storage with the app instance

export { auth, db, storage }; // Exporting auth, db, and storage
