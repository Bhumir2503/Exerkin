// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyCrczYZiuTXMuOQAcfcgFdo_p_r34BqMWI",
   authDomain: "exerkin-958e0.firebaseapp.com",
   projectId: "exerkin-958e0",
   storageBucket: "exerkin-958e0.appspot.com",
   messagingSenderId: "708843610331",
   appId: "1:708843610331:web:42ab97f93a09675cceacfe",
   measurementId: "G-2MC1W8B9J3"
 };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getDatabase();
export const firestore = getFirestore(app);