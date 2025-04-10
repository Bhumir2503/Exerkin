// firestore Imports - AKA the cloud database
import {
	uploadWorkout,
	removeWorkoutFromFirestore,
	markWorkoutAsDeleted,
} from "../firestore/firestoreWorkoutServices";

// Realm Imports - AKA the local database
import {
	getRealmWorkouts,
	setRealmWorkout,
	removeRealmWorkout,
	getPendingRealmWorkouts,
	mergeWorkoutsToRealm,
	removeWorkoutsFromRealm,
	getLastWorkoutSyncTime,
	updateLastWorkoutSyncTime,
} from "../database/realmWorkoutFunctions";

import firestore from "@react-native-firebase/firestore";

const workoutsCollection = firestore().collection("workouts");
const deletedWorkoutsCollection = firestore().collection("deletedWorkouts");

export const listenToWorkoutChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastWorkoutSyncTime(realm);
	const unsubscribe = workoutsCollection
		.where("userId", "==", userId)
		.where("updatedAt", ">", lastSynced)
		.onSnapshot((snapshot) => {
			if (snapshot.empty) {
				onUpdate();
				return;
			}
			const newWorkouts = snapshot.docs.map((doc) => ({
				...doc.data(),
			}));

			realm.write(() => {
				console.log("Testing	");
				mergeWorkoutsToRealm(realm, newWorkouts);
				updateLastWorkoutSyncTime(realm);
			});

			// Call the onUpdate function to notify about the update
			onUpdate();
		});
	return unsubscribe;
};

export const listenToDeletedWorkoutChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastWorkoutSyncTime(realm);
	const effectiveLastSynced =
		lastSynced.getTime() === new Date(0).getTime()
			? new Date()
			: lastSynced;
	return (unsubscribe = deletedWorkoutsCollection
		.where("userId", "==", userId)
		.where("deletedAt", ">", effectiveLastSynced)
		.onSnapshot((snapshot) => {
			if (snapshot.empty) {
				onUpdate();
				return;
			}

			const deletedWorkouts = snapshot.docs.map((doc) => ({
				...doc.data(),
			}));

			realm.write(() => {
				const idsToDelete = deletedWorkouts.map((d) => d.deletedId);
				removeWorkoutsFromRealm(realm, idsToDelete);
				updateLastWorkoutSyncTime(realm);
			});

			onUpdate();
		}));
};

export const syncPendingWorkoutsToFirestore = async (realm, userId) => {
	try {
		const pendingWorkouts = await getPendingRealmWorkouts(realm, userId);
		console.log(
			"(Sync) Syncing pending workouts to Firestore:",
			pendingWorkouts.length
		);

		if (pendingWorkouts.length === 0) return;

		console.log(
			"(Sync) Pending workouts to sync:",
			pendingWorkouts[0].exercises
		);
		realm.write(() => {
			pendingWorkouts.forEach((workout) => {
				// Convert to plain object
				const workoutData = {
					...workout,
					exercises: workout.exercises.map((exercise) => ({
						...exercise,
						sets: exercise.sets.map((set) => ({
							...set,
						})),
					})),
				};

				try {
					// Update sync status and upload workout to Firestore
					workout.syncStatus = "synced";
					uploadWorkout(userId, workoutData); // Convert to plain object
				} catch (error) {
					console.error(
						"(Sync) Upload failed for",
						workout.workoutId,
						error
					);
					workout.syncStatus = "failed";
				}
			});
		});
	} catch (error) {
		console.error("(Sync) Error syncing pending workouts:", error);
	}
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
	}
};

// Function to add a new workout to Firestore and Realm
export const addWorkout = async (realm, userId, workoutData) => {
	try {
		await uploadWorkout(userId, workoutData); // Upload workout data to Firestore
		await setRealmWorkout(realm, userId, workoutData, "synced"); // Set workout in Realm as synced
	} catch (error) {
		console.error("(WorkoutFunctions) - Error adding workout:", error); // Log error if adding workout fails
		await setRealmWorkout(realm, userId, workoutData, "pending"); // Set workout in Realm as pending if sync fails
	}
};

// Function placeholder for editing a workout (to be implemented)
export const editWorkout = () => {
	// Functionality for editing workouts will be implemented here
};

// Function to delete a workout from Firestore and mark it in Realm
export const deleteWorkout = async (realm, userId, workoutId) => {
	try {
		await removeWorkoutFromFirestore(workoutId); // Remove workout from Firestore
		await markWorkoutAsDeleted({ workoutId: workoutId, userId: userId }); // Mark workout as deleted in Firestore
		await removeRealmWorkout(realm, userId, workoutId, "deleted"); // Remove workout from Realm and mark as deleted
	} catch (error) {
		console.error("(WorkoutFunctions) - Error deleting workout:", error); // Log error if deleting workout fails
		await removeRealmWorkout(realm, userId, workoutId, "pending"); // Mark workout as pending in Realm if deletion fails
	}
};