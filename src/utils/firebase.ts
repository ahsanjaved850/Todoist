// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const firebaseConfig = {
  apiKey: GOOGLE_API_KEY,
  authDomain: "todoist-ae3a3.firebaseapp.com",
  projectId: "todoist-ae3a3",
  storageBucket: "todoist-ae3a3.appspot.com",
  messagingSenderId: "488604132119",
  appId: "1:488604132119:web:bbd50484f49ec49d96cd52",
  measurementId: "G-T1DQXYM7HV",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
