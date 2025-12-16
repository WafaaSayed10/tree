import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBrXGtROvZ-QN3sWtsBipbaaAm6gae7B8s",
    authDomain: "tree-5fdf5.firebaseapp.com",
    projectId: "tree-5fdf5",
    storageBucket: "tree-5fdf5.firebasestorage.app",
    messagingSenderId: "1029870586398",
    appId: "1:1029870586398:web:6cb388bfc198ff8aebfc0f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);