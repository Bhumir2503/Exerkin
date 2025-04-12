import { createContext, useState, useContext, useEffect, useRef } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hasCompleteProfile } from "../services/firestore/firestoreUserServices";

import { useRealm } from "./RealmProvider";
import {
	getRealmUser,
	setRealmUser,
} from "../services/database/realmUserFunctions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [init, setInit] = useState(true);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [gender, setGender] = useState("male");
	const [unitSystem, setUnitSystem] = useState("imperial");
	const [isNewUser, setIsNewUser] = useState(false);
	const [setupComplete, setSetupComplete] = useState(false);

	const realm = useRealm();
	const userDocUnsubscribeRef = useRef(null);

	// Listen for Firebase auth state changes
	useEffect(() => {
		let isMounted = true;
		const subscriber = auth().onAuthStateChanged((authUser) => {
			if (isMounted) handleAuthStateChanged(authUser);
		});

		return () => {
			console.log(
				"(UserContext) - Unsubscribing from auth state changes"
			);
			isMounted = false;
			subscriber();
			resetUserDocUnsubscribe();
		};
	}, []);

	const listenToUserDocChanges = (uid) => {
		if (!uid) return;

		resetUserDocUnsubscribe();

		const userDocRef = firestore().collection("users").doc(uid);
		const unsubscribe = userDocRef.onSnapshot((doc) => {
			if (doc.exists) {
				const userData = {
					...doc.data(),
					userId: doc.data().userId || doc.id,
				};
				console.log(
					"(UserContext) - User doc updated:",
					userData.username
				);

				setUsername(userData.username || "");
				setBio(userData.bio || "");
				setGender(userData.gender || "male");
				setUnitSystem(userData.unitSystem || "imperial");
				setSetupComplete(true);
				setIsNewUser(false);

				try {
					setRealmUser(realm, userData);
				} catch (e) {
					console.error("(UserContext) - Failed to setRealmUser:", e);
				}
			}
			else{
				console.log("(UserContext) - User doc does not exist");
				setIsNewUser(true);
				setSetupComplete(false);
			}
		});

		userDocUnsubscribeRef.current = unsubscribe;
	};

	const handleAuthStateChanged = async (authUser) => {
		console.log("(UserContext) - ", authUser ? "logged in" : "logged out");

		if (!authUser) {
			resetUserState();
			resetUserDocUnsubscribe();
			if (init) setInit(false);
			return;
		}

		setUser(authUser);

		try {
			console.log(
				"(UserContext) - Checking if user has completed setup...")
			listenToUserDocChanges(authUser.uid);
		} catch (error) {
			console.error(
				"(UserContext) - Error during user setup check:",
				error
			);

			try {
				const cachedUser = await getRealmUser(realm, authUser.uid);
				if (cachedUser && cachedUser.username) {
					setUsername(cachedUser.username);
					setBio(cachedUser.bio || "");
					setGender(cachedUser.gender || "male");
					setUnitSystem(cachedUser.unitSystem || "imperial");
					setSetupComplete(true);
					setIsNewUser(false);
				} else {
					setSetupComplete(false);
					setIsNewUser(true);
				}
			} catch (realmError) {
				console.error("(UserContext) - Realm error:", realmError);
				await onLogout();
				setIsNewUser(true);
				setSetupComplete(false);
			}
		}

		if (init) setInit(false);
	};

	const onLogout = async () => {
		try {
			await auth().signOut();

			resetUserDocUnsubscribe();

			resetUserState();

			if (realm) {
				realm.write(() => {
					realm.deleteAll();
				});
			}

			await AsyncStorage.clear();
			console.log("(UserContext) - User signed out successfully!");
		} catch (error) {
			console.error("(UserContext) - Error signing out:", error);
		}
	};

	const onSetupComplete = () => {
		setSetupComplete(true);
		setIsNewUser(false);
	};

	const resetUserDocUnsubscribe = () => {
		if (userDocUnsubscribeRef.current) {
			userDocUnsubscribeRef.current();
			userDocUnsubscribeRef.current = null;
		}
	};

	const resetUserState = () => {
		setUser(null);
		setUsername("");
		setBio("");
		setGender("male");
		setUnitSystem("imperial");
		setIsNewUser(false);
		setSetupComplete(false);
	};

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
				gender,
				setGender,
				unitSystem,
				setUnitSystem,
				onLogout,
				isNewUser,
				setIsNewUser,
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
