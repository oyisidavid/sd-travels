import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD82c8Xq_1NJKCrPOlwiTo-u_N9_8jmvts",
  authDomain: "sd-travel-1.firebaseapp.com",
  projectId: "sd-travel-1",
  storageBucket: "sd-travel-1.firebasestorage.app",
  messagingSenderId: "268416992117",
  appId: "1:268416992117:web:e6df17def15d871779c93c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
    db, 
    auth, 
    storage,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    ref,
    uploadBytesResumable,
    getDownloadURL
};
