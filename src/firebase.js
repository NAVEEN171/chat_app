// Import the functions you need from the SDKs you need
import React from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATxX7NaXo8IhoDJBE-9pBFk-60w_0BB2Y",
  authDomain: "bgimages-31c69.firebaseapp.com",
  projectId: "bgimages-31c69",
  storageBucket: "bgimages-31c69.appspot.com",
  messagingSenderId: "749336269778",
  appId: "1:749336269778:web:a03698554de62cbb6f6e0b",
  measurementId: "G-1Z3T7HCMZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage=getStorage(app);
