import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDfT-BYar0G6J-MlpuErqf34rjSvqxQTv8",
    authDomain: "estudanteplus-301c9.firebaseapp.com",
    projectId: "estudanteplus-301c9",
    storageBucket: "estudanteplus-301c9.appspot.com",
    messagingSenderId: "805131025821",
    appId: "1:805131025821:web:78e5b7c3cdcd7aad520374"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)
export { db }