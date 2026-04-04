// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC62S7UJWccviCR6d1QcTpePK25Agafiao",
  authDomain: "repairment-7277c.firebaseapp.com",
  projectId: "repairment-7277c",
  storageBucket: "repairment-7277c.firebasestorage.app",
  messagingSenderId: "1032689726502",
  appId: "1:1032689726502:web:0fa1b7ca424b9d89a122e7",
  measurementId: "G-TS8TNH8MEC",
  databaseURL: "https://repairment-7277c-default-rtdb.firebaseio.com" // Make sure this URL is correct
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);