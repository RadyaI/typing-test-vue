// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBO4J2W-5-ZEEbOmPO1GC-PBMhSBtGzCG4",
    authDomain: "typingmow.firebaseapp.com",
    projectId: "typingmow", 
    storageBucket: "typingmow.appspot.com",
    messagingSenderId: "250978096334",
    appId: "1:250978096334:web:ee2e11d7f404d072eb2c9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)