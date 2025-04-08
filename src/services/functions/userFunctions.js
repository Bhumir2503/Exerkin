import {
	getLastUserSyncTime,
	updateLastUserSyncTime,
} from "../database/realmUserFunctions";

export const fetchUserFromFirestore = async (userId) => {};

const listenToUserDocChanges = async (uid, userDocUnsubscribeRef) => {
	if (!uid) return;

	if (userDocUnsubscribeRef.current) {
		userDocUnsubscribeRef.current();
		userDocUnsubscribeRef.current = null;
	}

	const userDocRef = firestore().collection("users").doc(uid);
	const unsubscribe = userDocRef.onSnapshot((doc) => {
		if (doc.exists) {
			const userData = doc.data();
			console.log("(UserContext) - User doc updated:", userData);

			setUsername(userData.username || "");
			setBio(userData.bio || "");
			setGender(userData.gender || "male");
			setUnitSystem(userData.unitSystem || "imperial");
			// Optionally sync to Realm here
		}
	});

	userDocUnsubscribeRef.current = unsubscribe;
};
