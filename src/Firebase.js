// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC5MNHkmJEPA-W1lsBeg9uDBZPpVdjxoQ",
  authDomain: "bettereventsco-e28be.firebaseapp.com",
  projectId: "bettereventsco-e28be",
  storageBucket: "bettereventsco-e28be.appspot.com",
  messagingSenderId: "771360651927",
  appId: "1:771360651927:web:ac8d027078becd6fabc7d2",
  measurementId: "G-B7SEH10BTL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();