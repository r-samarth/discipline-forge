import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-LmQA9Y9u2Bc6mg-_eYCF3UJSskfmDfA",
  authDomain: "discipline-forge-a85e3.firebaseapp.com",
  projectId: "discipline-forge-a85e3",
  storageBucket: "discipline-forge-a85e3.firebasestorage.app",
  messagingSenderId: "1019717937485",
  appId: "1:1019717937485:web:bb5dc586fdca6d01fd2f04",
  measurementId: "G-KCGDEDQ7W9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
