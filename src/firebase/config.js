import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase (ve a tu proyecto Firebase > Project Settings > General)
const firebaseConfig = {
  apiKey: "AIzaSyCAv-R-NX2UuFE_UMrIaI78EPrlfXYUPno",
  authDomain: "savemoney-5b8ec.firebaseapp.com",
  projectId: "savemoney-5b8ec",
  storageBucket: "savemoney-5b8ec.firebasestorage.app",
  messagingSenderId: "803083686419",
  appId: "1:803083686419:web:e4330d450c80cc783d25e6"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);


