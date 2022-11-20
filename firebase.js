// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjHy0u9SmML140uXQUCLv944Mpm498J5g",
  authDomain: "linkedin-clone-3dccb.firebaseapp.com",
  projectId: "linkedin-clone-3dccb",
  storageBucket: "linkedin-clone-3dccb.appspot.com",
  messagingSenderId: "424920140635",
  appId: "1:424920140635:web:d979053a66840129c7287e"
};

// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = app.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
