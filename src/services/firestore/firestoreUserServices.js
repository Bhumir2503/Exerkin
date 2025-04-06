import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

// Collection references
const usersCollection = firestore().collection("users");
const usernamesCollection = firestore().collection("usernames");

// Save user profile to Firestore
// parameter: uid (string), userData (object)
// sets user document with the provided data in the users collection
// return: true
export const saveUserProfile = async (uid, userData) => {
	try {
		const userDocRef = usersCollection.doc(uid || auth().currentUser.uid);

		// Set or update the user document
		await userDocRef.set(userData, { merge: true });

		// If username is included, reserve it in the usernames collection
		if (userData.username) {
			await usernamesCollection.doc(userData.username.toLowerCase()).set({
				uid: uid || auth().currentUser.uid,
			});
		}
	} catch (error) {
		console.error("Error saving user profile:", error);
		throw error;
	}
};

// Get user profile from Firestore
// parameter: uid (string)
// return: user document data or null
export const getUserProfile = async (uid) => {
	try {
		const userDoc = await usersCollection
			.doc(uid || auth().currentUser.uid)
			.get();

		if (!userDoc.exists) {
			return null;
		}

		return userDoc.data();
	} catch (error) {
		console.error("Error getting user profile:", error);
		throw error;
	}
};

// checks to see if the user has a complete profile
// return: boolean, and object
export const hasCompleteProfile = async () => {
    if (!auth().currentUser) {
        return false;
    }

    try {
        const userDocData = await getUserProfile();
        return [!!userDocData, userDocData];
    } catch (error) {
        console.error("Error checking user setup:", error);
        return [false, "error"];
    }
};

// Check if username is available
// parameter: username (string)
// return: boolean
export const isUsernameAvailable = async (username) => {
	try {
		const usernameDoc = await usernamesCollection
			.doc(username.toLowerCase())
			.get();
		return !usernameDoc.exists;
	} catch (error) {
		console.error("Error checking username availability:", error);
		throw error;
	}
};

