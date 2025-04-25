// firestore Imports - AKA the cloud database
import {
	uploadWorkout,
	removeWorkoutFromFirestore,
	editWorkoutInFirestore,
} from "../firestore/firestoreWorkoutServices";

// Realm Imports - AKA the local database
import {
	getRealmWorkouts,
	setRealmWorkout,
	setEditedRealmWorkout,
	removeRealmWorkout,
	mergeWorkoutsToRealm,
	removeWorkoutsFromRealm,
	getLastWorkoutSyncTime,
	updateLastWorkoutSyncTime,
} from "../database/realmWorkoutFunctions";

// Utility Imports
import firestore from "@react-native-firebase/firestore";

const workoutsCollection = firestore().collection("workouts");

export const listenToWorkoutChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastWorkoutSyncTime(realm);
	const unsubscribe = workoutsCollection
		.where("userId", "==", userId)
		.where("updatedAt", ">", lastSynced)
		.where("deleted", "==", false)
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log(
						"No new workouts found. -- 1 Read from firestore"
					);
					onUpdate();
					return;
				}

				console.log("New workouts found.  -- Reads from Firestore");
				const newWorkouts = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));

				realm.write(() => {
					mergeWorkoutsToRealm(realm, newWorkouts);
					updateLastWorkoutSyncTime(realm);
				});

				// Call the onUpdate function to notify about the update
				onUpdate();
			},
			(error) => {
				console.error("Error fetching workouts:", error);
				// Handle error here, if needed
			}
		);

	return unsubscribe;
};

export const listenToDeletedWorkoutChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastWorkoutSyncTime(realm);
	const effectiveLastSynced =
		lastSynced.getTime() === new Date(0).getTime()
			? new Date()
			: lastSynced;
	const unsubscribe = workoutsCollection
		.where("userId", "==", userId)
		.where("deletedAt", ">", effectiveLastSynced)
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log("No deleted workouts found.");
					onUpdate();
					return;
				}

				const deletedWorkouts = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				realm.write(() => {
					const idsToDelete = deletedWorkouts.map((d) => d.workoutId);
					removeWorkoutsFromRealm(realm, idsToDelete);
					updateLastWorkoutSyncTime(realm);
				});

				onUpdate();
			},
			(error) => {
				console.error("Error fetching deleted workouts:", error);
				// Handle error here, if needed
			}
		);

	return unsubscribe;
};

/*

Functions related to managing workouts in the app.

*/

// Function to retrieve workouts from Realm and Firestore
export const getWorkouts = async (realm, userId) => {
	try {
		const workouts = await getRealmWorkouts(realm, userId); // Retrieve workouts from Realm
		return workouts;
	} catch (error) {
		console.error("(WorkoutFunctions) - Error getting workouts:", error); // Log error if fetching workouts fails
		return [];
	}
};

// Function to add a new workout to Firestore and Realm
export const addWorkout = async (realm, workoutData) => {
	await setRealmWorkout(realm, workoutData, "unsynced"); // Set workout in Realm with synced status
	try {
		await uploadWorkout(workoutData); // Upload workout data to Firestore
	} catch (error) {
		console.error("(WorkoutFunctions) - Error adding workout:", error); // Log error if adding workout fails
	}
};

// Function placeholder for editing a workout (to be implemented)
export const editWorkout = async (realm, workoutData) => {
	const workout = await setEditedRealmWorkout(realm, workoutData); // Set edited workout in Realm
	try {
		await editWorkoutInFirestore(workout); // Upload workout data to Firestore
	} catch (error) {
		console.error("(WorkoutFunctions) - Error editing workout:", error); // Log error if editing workout fails
	}
	// Functionality for editing workouts will be implemented here
};

// Function to delete a workout from Firestore and mark it in Realm
export const deleteWorkout = async (realm, workoutId) => {
	await removeRealmWorkout(realm, workoutId); // Remove workout from Realm
	try {
		await removeWorkoutFromFirestore(workoutId); // Remove workout from Firestore
	} catch (error) {
		console.error("(WorkoutFunctions) - Error deleting workout:", error); // Log error if deleting workout fails
	}
};
