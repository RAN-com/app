// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs,deleteDoc,doc,updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBb7HihkPwkG8vNgZh5oSsFAzev1ICnA2M",
    authDomain: "nutrition-7b61a.firebaseapp.com",
    projectId: "nutrition-7b61a",
    storageBucket: "nutrition-7b61a.firebasestorage.app",
    messagingSenderId: "913564196178",
    appId: "1:913564196178:web:a35adb9f64a0adf88eae8b",
    measurementId: "G-R19DG2ECGQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export { collection, addDoc, getDocs,deleteDoc,doc,updateDoc };
