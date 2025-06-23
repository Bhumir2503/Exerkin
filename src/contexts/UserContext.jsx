import { createContext, useState, useContext, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "./ThemeContext";

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

	const { changeTheme } = useTheme();

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
		const unsubscribe = userDocRef.onSnapshot((doc) => {
			if (doc.exists()) {
				console.log(`(UserContext) - User document exists`);
				handleData(doc.data());
			} else {
				console.log("(UserContext) - User document does not exist");
				changeTheme("midnightPurple");
				setIsNewUser(true);
				setSetupComplete(false);
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
			changeTheme("midnightPurple");
			setIsNewUser(true);
			setSetupComplete(false);
			return;
		}

		changeTheme(userData.preferences.theme);
		setUsername(userData.username);
		setMotivation(userData.motivation);
		setGender(userData.gender);
		setUnitSystem(userData.unitSystem);
		setSetupComplete(true);
		setIsNewUser(false);
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
			await auth().signOut(); // Sign out from Firebase Auth
			resetUserState(); // Reset UserContext state

			firestore().terminate(); // Terminate Firestore connection
			console.log("(UserContext) - Firestore connection terminated");

			firestore().clearPersistence(); // Clear Firestore persistence
			console.log("(UserContext) - Firestore persistence cleared");

			await AsyncStorage.clear(); // Clear AsyncStorage
			console.log("(UserContext) - User signed out successfully!");
		} catch (error) {
			console.error("(UserContext) - Error signing out:", error);
		}
	};

	const updateUsername = (newUsername) => {
		setUsername(newUsername);
	};

	const resetUserState = () => {
		changeTheme("midnightPurple");
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
				motivation,
				setMotivation,
				updateUsername,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
export default UserContext;
