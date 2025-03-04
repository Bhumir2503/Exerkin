import { createContext, useState, useContext, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { getUserCache,  updateUserCache, removeUserCache } from "../cache/userCache";
import { checkUserSetup } from "../utils/UserFirestoreService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [init, setInit] = useState(true);
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [isNewUser, setIsNewUser] = useState(false);
	const [setupComplete, setSetupComplete] = useState(false);
	const [oneTry, setOneTry] = useState(true);

	// Check if the user has completed setup
	useEffect(() => {
		const checkSetupStatus = async () => {
			// statement is placeholder for network
			if (true) {
				if (isNewUser) {
					// go to set username page
					// setup firebase docs
				} else {
					// check if user has completed setup
					console.log("Checking user setup status...");
					const [setupComplete, userData] = await checkUserSetup(
						user
					);
					console.log(userData);
					if (setupComplete) {
						setUsername(userData.username);
						setBio(userData.bio);
						
						// Update local cache
						updateUserCache({
							username: userData.username,
							bio: userData.bio || "",
							height: userData.height || "",
							weight: userData.weight || "",
							age: userData.age || "",
							createdAt: userData.createdAt,
							updatedAt: userData.updatedAt,
							followers: userData.followers,
							following: userData.following,
							postCount: userData.postCount,
						});
						
						setSetupComplete(true);
						console.log("User setup is complete!");

					} else {
						// Error occurred in fetching user data so check cache before proceeding as new user
						if(userData === "error") {
							//check cache
							const cachedUser = await getUserCache();
							if (cachedUser) {
								setUsername(cachedUser.username);
								setBio(cachedUser.bio);
								setSetupComplete(true);
							}
							return;
						}

						// go to set username page
						// setup firebase docs
						setIsNewUser(true);
					}
				}
			}
		};
		if (user && !init && oneTry) {
			checkSetupStatus();
			setOneTry(false);
		}
	}, [user, init]);

	// Listen for auth state changes
	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	// Handle auth state changes
	// This function will be called when the user signs in or out
	// It will also be called when the app starts and the auth state is loaded
	async function onAuthStateChanged(authUser) {
		setUser(authUser);

		// Reset states when user signs out
		if (!authUser) {
			setUsername("");
			setBio("");
			setIsNewUser(false);
			setSetupComplete(false);
			await removeUserCache();
		}

		if (init) {
			setInit(false);
		}
	}

	// Handle user sign out
	async function onLogout() {
		try {
			await auth().signOut();
			console.log("User signed out!");
		} catch (error) {
			//try again

			console.error("Error signing out:", error);
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
