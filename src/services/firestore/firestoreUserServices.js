import firestore from "@react-native-firebase/firestore";
import { auth } from "@react-native-firebase/auth";

// Collection references
const usersCollection = firestore().collection("users");
const usernamesCollection = firestore().collection("usernames");

/*
 * Function to save user data in Firestore
 *
 * @param {Object} userData - The user data object containing user details
 * @returns {Promise<void>} - A promise that resolves when the user data is saved
 * @throws {Error} - Throws an error if the user ID is not provided or if
 */
export const saveUserInFirestore = async (userData) => {
	try {
		const resolvedUid = userData.userId || auth().currentUser?.uid;
		if (!resolvedUid)
			throw new Error("User ID not provided or authenticated");

		const userDocRef = usersCollection.doc(resolvedUid);

		const username = userData.username.toLowerCase();

		const usernameDocRef = firestore()
			.collection("usernames")
			.doc(username);

		const batch = firestore().batch();

		batch.set(userDocRef, userData);
		batch.set(usernameDocRef, { userId: resolvedUid });

		// Commit the batch
		await batch.commit();

		console.log("Batch commit successful");
	} catch (error) {
		console.error("Error saving user profile (batch):", error);
		throw error;
	}
};

/*
 * Function to get the current user's profile from Firestore
 *
 * @returns {Promise<Object|null>} - A promise that resolves to the user profile data or null if not found
 * @throws {Error} - Throws an error if there is an issue retrieving the user profile
 */
export const getUserFromFirestore = async (userId) => {
	try {
		const resolvedUid = userId || auth().currentUser?.uid;
		const userDoc = await usersCollection.doc(resolvedUid).get();

		if (!userDoc.exists) {
			return null;
		}

		return userDoc.data();
	} catch (error) {
		console.error("Error getting user profile:", error);
		throw error;
	}
};

/*
 * Function to get the current user's profile from Firestore
 *
 * @returns {Promise<Object|null>} - A promise that resolves to the user profile data or null if not found
 * @throws {Error} - Throws an error if there is an issue retrieving the user profile
 */
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

/*
 * Function to get the current user's profile from Firestore
 *
 * @returns {Promise<Object|null>} - A promise that resolves to the user profile data or null if not found
 * @throws {Error} - Throws an error if there is an issue retrieving the user profile
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

export const fetchUserData = async (userId, lastSynced) => {
	try {
		const snapshot = await usersCollection
			.where("userId", "==", userId)
			.where("updatedAt", ">", lastSynced)
			.get();

		if (snapshot.empty) {
			return [];
		}

		const userData = snapshot.docs.map((doc) => ({
			...doc.data(),
		}));

		return userData;
	} catch (error) {
		console.error(
			"(FirestoreUserServices) - Error fetching user data:",
			error
		);
		return [];
	}
};
