// Importation des modules nécessaires de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuration Firebase (remplacez les valeurs par celles de votre projet Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyC2_n4KyEOlOTM4qH-sWge2_nnxt1r2RV8",
    authDomain: "piazzola-feb7b.firebaseapp.com",
    projectId: "piazzola-feb7b",
    storageBucket: "piazzola-feb7b.firebasestorage.app",
    messagingSenderId: "781495524688",
    appId: "1:781495524688:web:4585a173c13966c65d6055",
    measurementId: "G-1Z1PD4D3E4"
  };

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Obtenir l'instance d'authentification
const auth = getAuth(app);

// Configurer le fournisseur Google
const provider = new GoogleAuthProvider();

// Exporter les instances nécessaires pour les utiliser dans l'application
export { auth, provider };
