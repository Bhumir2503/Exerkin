import { createContext, useState, useContext, useEffect, useRef } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRealm } from "./RealmProvider";
import {
	getUserFromRealm,
	saveUserInRealm,
} from "../services/database/realmUserFunctions";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userId, setUserId] = useState(null);
	const [username, setUsername] = useState("");
	const [motivation, setMotivation] = useState("");
	const [gender, setGender] = useState("male");
	const [unitSystem, setUnitSystem] = useState("imperial");
	const [isNewUser, setIsNewUser] = useState(true);
	const [setupComplete, setSetupComplete] = useState(false);

	const realm = useRealm();

	useEffect(() => {
		const unsubscribe = auth().onAuthStateChanged((authUser) => {
			handleAuthStateChanged(authUser);
		});

		return () => {
			unsubscribe();
			console.log("(UserContext) - Auth state listener unsubscribed");
		};
	}, []);

	// Listen for changes in the user document when the user is logged in
	useEffect(() => {
		if (!userId) return;

		const userDocRef = firestore().collection("users").doc(userId);
		const unsubscribe = userDocRef.onSnapshot(async (doc) => {
			if (doc.exists) {
				console.log(
					"(UserContext) - User document exists in Firestore"
				);
				handleData(doc.data());
			} else {
				const storedUser = await getUserFromRealm(realm, userId);
				if (storedUser) {
					console.log(
						"(UserContext) - User found in Realm:",
						storedUser
					);
					handleData(storedUser);
				} else {
					console.log(
						"(UserContext) - No user data found in Firestore or Realm"
					);
					setIsNewUser(true);
					setSetupComplete(false);
				}
			}
		});
		return () => {
			unsubscribe();
			console.log("(UserContext) - User document listener unsubscribed");
		};
	}, [userId]);

	const handleData = async (userData) => {
		if (!userData || !userData.userId) {
			console.log("(UserContext) - No user data found in Firestore");
			setIsNewUser(true);
			setSetupComplete(false);
			return;
		}

		setUsername(userData.username);
		setMotivation(userData.motivation);
		setGender(userData.gender);
		setUnitSystem(userData.unitSystem);
		setSetupComplete(true);
		setIsNewUser(false);

		try {
			await saveUserInRealm(realm, userData);
			console.log("(UserContext) - User saved in Realm successfully");
		} catch (error) {
			console.error("(UserContext) - Error saving user in Realm:", error);
		}
	};

	const handleAuthStateChanged = async (authUser) => {
		console.log(
			"(UserContext) - ",
			authUser ? "User is logged in" : "User is logged out"
		);

		if (!authUser) {
			resetUserState();
			return;
		}
		setUser(authUser);
		setUserId(authUser.uid);
	};

	const onLogout = async () => {
		try {
			await auth().signOut();

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

	const updateUsername = (newUsername) => {
		setUsername(newUsername);
	};

	const resetUserState = () => {
		setUser(null);
		setUserId(null);
		setIsNewUser(true);
		setSetupComplete(false);
		setUsername("");
		setMotivation("");
		setGender("male");
		setUnitSystem("imperial");
	};

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				username,
				setUsername,
				gender,
				setGender,
				unitSystem,
				setUnitSystem,
				onLogout,
				isNewUser,
				setIsNewUser,
				setupComplete,

				updateUsername,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
export default UserContext;
