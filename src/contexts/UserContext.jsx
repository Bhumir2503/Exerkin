import { createContext, useState, useContext, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, setUser, updateUser, removeUser } from "../cache/userCache";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [init, setInit] = useState(true);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [isNewUser, setIsNewUser] = useState(false);
	const [setupComplete, setSetupComplete] = useState(false);

	// Check if the user has completed setup
	useEffect(() => {
		const checkSetupStatus = async () => {
			if (user) {
				try {
					// First check if we have the username in cache
					const cachedUser = await getUser();
					if (cachedUser && cachedUser.username) {
						setUsername(cachedUser.username);
						setBio(cachedUser.bio || "");
						setSetupComplete(true);
						return;
					}

					// If we get here, we need to check Firestore or set up a new profile
					// Default to considering this a new user that needs setup
					// This avoids permission errors before rules are properly set
					setIsNewUser(true);
					setSetupComplete(false);

					// Try to check Firestore, but handle permission errors gracefully
					try {
						const userDoc = await firestore()
							.collection("users")
							.doc(user.uid)
							.get();

						if (userDoc.exists) {
							const userData = userDoc.data();
							setUsername(userData.username || "");
							setBio(userData.bio || "");

							// Update cache with Firestore data
							updateUser({
								username: userData.username,
								bio: userData.bio || "",
								height: userData.height || "",
								weight: userData.weight || "",
								age: userData.age || "",
							});

							setSetupComplete(true);
							setIsNewUser(false);
						}
					} catch (firestoreError) {
						console.log(
							"Firestore check failed, proceeding with new user setup:",
							firestoreError.message
						);
						// Keep the isNewUser as true and setupComplete as false
					}
				} catch (error) {
					console.error("Error checking user setup:", error);
					// Default to requiring setup if there's any error
					setIsNewUser(true);
					setSetupComplete(false);
				}
			}
		};

		if (user && !init) {
			checkSetupStatus();
		}
	}, [user, init]);

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	function onAuthStateChanged(authUser) {
		setUser(authUser);

		// Reset states when user signs out
		if (!authUser) {
			setUsername("");
			setBio("");
			setIsNewUser(false);
			setSetupComplete(false);
		}

		if (init) {
			setInit(false);
		}
	}

 async function onLogout() {
		try {
			await auth().signOut();
			console.log("User signed out!");

			// Optional: Clear user data from local storage
			await removeUser();

			// Reset local state
			setUser(null);
			setUsername("");
			setBio("");
			setIsNewUser(false);
			setSetupComplete(false);
			setInit(true);
		} catch (error) {
			console.error("Error signing out:", error);
		}
 }

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
