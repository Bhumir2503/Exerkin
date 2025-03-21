import { createContext, useState, useContext, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import {
	getUserCache,
	updateUserCache,
} from "../cache/userCache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasCompleteProfile } from "../firestore/FirestoreUserServices";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [init, setInit] = useState(true);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [isNewUser, setIsNewUser] = useState(false);
	const [setupComplete, setSetupComplete] = useState(false);

	// Listen for auth state changes
	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	// Handle auth state changes
	// This function will be called when the user signs in or out
	// It will also be called when the app starts and the auth state is loaded
	async function onAuthStateChanged(authUser) {
		console.log(
			"(UserContext) - Auth state changed:",
			authUser ? "User logged in" : "User logged out"
		);

		// Reset states when user signs out
		if (!authUser) {
			setUser(null);
			setUsername("");
			setBio("");
			setIsNewUser(false);
			setSetupComplete(false);
			await AsyncStorage.clear();
			if (init) {
				setInit(false);
			}
			return;
		}

		// User is signed in
		setUser(authUser);

		// Check if the user has additional metadata from sign-in
		// This would only be available on fresh sign-ins, not app restarts
		const currentUser = auth().currentUser;
		if (currentUser && currentUser.metadata) {
			// Detect if this is likely a new user by comparing creationTime with lastSignInTime
			// This isn't perfect but helps when additionalUserInfo isn't available
			const creationTime = new Date(currentUser.metadata.creationTime);
			const lastSignInTime = new Date(
				currentUser.metadata.lastSignInTime
			);

			// If account was created less than 10 seconds before last sign in, likely new user
			const isRecentlyCreated =
				(lastSignInTime - creationTime) / 1000 < 10;

			if (isRecentlyCreated) {
				console.log("(UserContext) - Detected likely new user by creation time");
				setIsNewUser(true);
			}
		}

		// Now we always check user setup when auth state changes with a user
		try {
			console.log("(UserContext) - Checking user setup status... 1 read to firestore");
			const [setupComplete, userData] = await hasCompleteProfile(authUser);
			if (setupComplete) {
				console.log(
					"(UserContext) - User setup is complete, username:",
					userData.username
				);
				setUsername(userData.username);
				setBio(userData.bio || "");

				// Update local cache
				updateUserCache(userData);

				setSetupComplete(true);
				setIsNewUser(false);
			} else{
				console.log("(UserContext) - User setup is incomplete");
				setSetupComplete(false);
				setIsNewUser(true);
			}
		} catch (error) {
			// errors include network errors, permission errors, etc.

			console.error("(UserContext) - Error during user setup check:", error);
			// In case of error, try using cache
			try {
				const cachedUser = await getUserCache();
				if (cachedUser && cachedUser.username) {
					setUsername(cachedUser.username);
					setBio(cachedUser.bio || "");
					setSetupComplete(true);
					setIsNewUser(false);
				} else {
					// If no cache, treat as new user
					setIsNewUser(true);
					setSetupComplete(false);
				}
			} catch (cacheError) {
				console.error("(UserContext) - Cache error:", cacheError);
				setIsNewUser(true);
				setSetupComplete(false);
			}
		}

		if (init) {
			setInit(false);
		}
	}
	// Handle user sign out
	async function onLogout() {
		try {
			// Then sign out from Firebase
			await auth().signOut();

			// Clear local state
			setUser(null);
			setUsername("");
			setBio("");
			setIsNewUser(false);
			setSetupComplete(false);

			// Remove user data from cache
			await AsyncStorage.clear();

			console.log("(UserContext) - User signed out successfully!");
		} catch (error) {
			console.error("(UserContext) - Error signing out:", error);
				// At this point, we should inform the user that logout failed
				Alert.alert(
					"Logout Failed",
					"Please try again later or restart the app.",
					[{ text: "OK" }]
				);
			
		}
	}

	// Handle user setup completion
	// This function will be called when the user completes their profile setup (setUserName.jsx)
	function onSetupComplete() {
		setSetupComplete(true);
		setIsNewUser(false);
	}

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				init,
				username,
				setUsername,
				bio,
				setBio,
				onLogout,
				setIsNewUser,
				isNewUser,
				setupComplete,
				onSetupComplete,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);

export default UserContext;
