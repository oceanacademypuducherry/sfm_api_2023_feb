const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,

  addDoc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBO5uUkfEh0xuxXDLH2n6jW73HLKhKeNUA",
  authDomain: "quit-smoking-ffce6.firebaseapp.com",
  projectId: "quit-smoking-ffce6",
  storageBucket: "quit-smoking-ffce6.appspot.com",
  messagingSenderId: "236232584201",
  appId: "1:236232584201:web:b68ec10057fe7c4632dcd8",
  measurementId: "G-G7GY7901S2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = db;
