import { createContext, useState, useContext, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasCompleteProfile } from "../services/firestore/firestoreUserServices";

import { useRealm } from "./RealmProvider";
import { getRealmUser, setRealmUser } from "../services/database/realmUserFunctions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [init, setInit] = useState(true);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [isNewUser, setIsNewUser] = useState(false);
	const [setupComplete, setSetupComplete] = useState(false);
	

	const realm = useRealm();

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

			if(init) {
				setInit(false);
			}
			return;
		}

		// User is signed in
		setUser(authUser);

		try {
			console.log(
				"(UserContext) - Checking user setup status... 1 read to firestore"
			);

			const [setupCompleteResult, userData] = await hasCompleteProfile(
				authUser
			);

			if (setupCompleteResult) {
				console.log(
					"(UserContext) - User setup is complete, username:",
					userData.username
				);
				setUsername(userData.username);
				setBio(userData.bio || "");

		
				await setRealmUser(realm, authUser.uid, {
					uid: authUser.uid,
					username: userData.username,
					bio: userData.bio || "",
					email: userData.email,
					createdAt: userData.createdAt.toDate(),
					updatedAt: userData.updatedAt.toDate(),
					age: userData.age || "",
					height: userData.height || "",
					weight: userData.weight || "",
					setupComplete: true,
				});

				setSetupComplete(true);
				setIsNewUser(false);
			} else {
				console.log("(UserContext) - User setup is incomplete");
				setSetupComplete(false);
				setIsNewUser(true);
			}
		} catch (error) {
			console.error(
				"(UserContext) - Error during user setup check:",
				error
			);

			// 🔁 Fallback: try loading user from Realm instead of cache
			try {
				const cachedUser = await getRealmUser(realm, authUser.uid);
				if (cachedUser && cachedUser.username) {
					setUsername(cachedUser.username);
					setBio(cachedUser.bio || "");
					setSetupComplete(true);
					setIsNewUser(false);
				} else {
					setIsNewUser(true);
					setSetupComplete(false);
				}
			} catch (realmError) {
				console.error("(UserContext) - Realm error:", realmError);
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

			// Clear user data from Realm
			realm.write(() => {
				realm.deleteAll();
			});

			// Remove user data from cache
			await AsyncStorage.clear();

			console.log("(UserContext) - User signed out successfully!");
		} catch (error) {
			console.error("(UserContext) - Error signing out:", error);
			// At this point, we should inform the user that logout failed
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
