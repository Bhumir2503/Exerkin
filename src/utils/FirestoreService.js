import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { updateUser } from "../cache/userCache";

// Collection references
const usersCollection = firestore().collection("users");
const usernamesCollection = firestore().collection("usernames");

/**
 * Create or update a user profile in Firestore
 * @param {string} uid - User ID
 * @param {object} userData - User data to save
 */
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

		// Update local cache
		await updateUser(userData);

		return true;
	} catch (error) {
		console.error("Error saving user profile:", error);
		throw error;
	}
};

/**
 * Check if a username is already taken
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} - True if username is available
 */
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

/**
 * Get a user's profile from Firestore
 * @param {string} uid - User ID (optional, defaults to current user)
 * @returns {Promise<object>} - User profile data
 */
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

/**
 * Check if the current user has a complete profile
 * @returns {Promise<boolean>} - True if user has a profile with username
 */
export const hasCompleteProfile = async () => {
	try {
		if (!auth().currentUser) {
			return false;
		}

		const profile = await getUserProfile();
		return !!profile && !!profile.username;
	} catch (error) {
		console.error("Error checking profile status:", error);
		return false;
	}
};

/**
 * Update specific fields of a user's profile
 * @param {Object} fields - Fields to update
 * @returns {Promise<boolean>} - Success status
 */
export const updateProfile = async (fields) => {
	try {
		if (!auth().currentUser) {
			throw new Error("No authenticated user");
		}

		await saveUserProfile(auth().currentUser.uid, fields);
		return true;
	} catch (error) {
		console.error("Error updating profile:", error);
		throw error;
	}
};
