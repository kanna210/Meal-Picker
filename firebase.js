// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAIAZdDSCpWjdZlFV_4-MUzJcRkxqwZS4",
  authDomain: "menu-6ca51.firebaseapp.com",
  projectId: "menu-6ca51",
  storageBucket: "menu-6ca51.firebasestorage.app",
  messagingSenderId: "685643870914",
  appId: "1:685643870914:web:ac79e70d8e9a5ddf12415b",
  measurementId: "G-FYYP035FPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
const db = getFirestore(app);

// Make db available to other files
export { db };