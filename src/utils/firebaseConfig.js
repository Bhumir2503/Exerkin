import { initializeApp, getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

// Initialize Firebase if it hasn't been already
let app;
try {
	app = getApp();
} catch (error) {
	app = initializeApp();
}

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };
