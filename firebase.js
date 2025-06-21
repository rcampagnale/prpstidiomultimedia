// firebase.js
console.log('🔥 firebase.js cargado');
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

// Extraemos las claves desde app.json → expo.extra
const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId
} = Constants.expoConfig.extra;

const firebaseConfig = {
  apiKey:            firebaseApiKey,
  authDomain:        firebaseAuthDomain,
  projectId:         firebaseProjectId,
  storageBucket:     firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId:             firebaseAppId,
};

console.log('🔍 firebaseConfig:', firebaseConfig);

// Inicializamos Firebase App
export const app = initializeApp(firebaseConfig);

// Inicializamos Firestore con long polling (para evitar errores de cliente offline en React Native)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

console.log('✅ Firebase y Firestore inicializados');
