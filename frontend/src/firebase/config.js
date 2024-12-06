// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlYO1mUdzr5qgN3RQ2ejoclSLRgCdCKrQ",
  authDomain: "smart-vote-cfa14.firebaseapp.com",
  projectId: "smart-vote-cfa14",
  storageBucket: "smart-vote-cfa14.firebasestorage.app",
  messagingSenderId: "554412468500",
  appId: "1:554412468500:web:47ad0106467f0a6871fa01",
  measurementId: "G-B5PMMC48ZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {app,auth,db,storage}