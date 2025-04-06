import firestore from "@react-native-firebase/firestore";
import {
	getWorkoutHistoryCache,
	setWorkoutHistoryCache,
	addWorkoutToHistoryCache,
	removeWorkoutFromHistoryCache,
	updateWorkoutInHistoryCache,
} from "../cache/workoutHistoryCache";
import {
	getSyncCache,
	setWorkoutSyncCache,
	cacheWorkoutAddition,
	cacheWorkoutDeletion,
	cacheWorkoutDeletionAdd,
	cacheWorkoutUpdate,
	checkStorageCapacity,
} from "../cache/syncCache";
import {
	addWorkoutToFirestore,
	getWorkoutsFromFirestore,
	getDeletedWorkoutsFromFirestore,
	deleteWorkoutFromWorkoutCollection,
	addDeletedWorkoutToDeletedWorkoutsCollection,
	updateWorkoutInFirestore,
} from "../firestore/FirestoreWorkoutServices";

import {
	fetchNewWorkouts,
	fetchDeletedWorkouts,
	uploadWorkout,
	uploadWorkoutUpdate,
	removeWorkoutFromFirestore,
	markWorkoutAsDeleted,
} from "../services/firestore/firestoreWorkoutServices";

// Function to sync local completed workout that failed with firestore
// Handles all sync operations: added, updated, and deleted workouts
export const resyncWorkouts = async () => {
	try {
		// Get the current sync cache
		const resync = await getSyncCache();

		if (
			resync.added.length === 0 &&
			resync.updated.length === 0 &&
			resync.deleted.length === 0 &&
			resync.deleteAdd.length === 0
		) {
			console.log("(WorkoutFunctions) - No workouts to sync");
			return;
		}

		console.log("(WorkoutFunctions) - Syncing workouts:");
		console.log("  - Added: ", resync.added.length);
		console.log("  - Updated: ", resync.updated.length);
		console.log("  - Deleted: ", resync.deleted.length);
		console.log("  - DeleteAdd: ", resync.deleteAdd.length);

		// Track successful and failed operations
		const successfulAdds = [];
		const failedAdds = [];
		const successfulUpdates = [];
		const failedUpdates = [];
		const successfulDeletes = [];
		const failedDeletes = [];
		const successfulDeleteAdds = [];
		const failedDeleteAdds = [];

		// Process added workouts
		for (const workout of resync.added) {
			try {
				// Ensure timestamps are properly formatted
				const formattedWorkout = formatWorkoutTimestamps(workout);

				// Upload to Firestore
				await addWorkoutToFirestore(formattedWorkout);
				successfulAdds.push(workout);
				console.log("Successfully uploaded workout: ", workout.id);
			} catch (error) {
				failedAdds.push(workout);
				console.error("Error adding workout to firestore: ", error);
			}
		}

		// Process updated workouts
		for (const workout of resync.updated) {
			try {
				// Ensure timestamps are properly formatted
				const formattedWorkout = formatWorkoutTimestamps(workout);

				// Update in Firestore
				await updateWorkoutInFirestore(formattedWorkout);
				successfulUpdates.push(workout);
				console.log("Successfully updated workout: ", workout.id);
			} catch (error) {
				failedUpdates.push(workout);
				console.error("Error updating workout in firestore: ", error);
			}
		}

		// Process deleted workouts
		for (const workout of resync.deleted) {
			workout.deletedAt = convertToFirestoreTimestamp(workout.deletedAt);
			try {
				// Delete from Firestore
				console.log(workout.id);
				await deleteWorkoutFromWorkoutCollection(workout.id);
				successfulDeletes.push(workout);
				console.log("Successfully deleted workout: ", workout.id);
			} catch (error) {
				failedDeletes.push(workout);
				console.error("Error deleting workout from firestore: ", error);
			}
		}

		// Process deleteAdd workouts
		for (const workout of resync.deleteAdd) {
			workout.deletedAt = convertToFirestoreTimestamp(workout.deletedAt);
			try {
				// Add to deletedWorkouts collection
				await addDeletedWorkoutToDeletedWorkoutsCollection(
					workout,
					firestore.Timestamp.now()
				);
				successfulDeleteAdds.push(workout);
				console.log(
					"Successfully added workout to deletedWorkouts: ",
					workout.id
				);
			} catch (error) {
				failedDeleteAdds.push(workout);
				console.error(
					"Error adding workout to deletedWorkouts collection: ",
					error
				);
			}
		}

		// Update the sync cache to only contain the failed operations
		const updatedSyncCache = {
			added: failedAdds,
			updated: failedUpdates,
			deleted: failedDeletes,
			deleteAdd: failedDeleteAdds,
		};

		// Save the updated sync cache
		await setWorkoutSyncCache(updatedSyncCache);

		console.log(
			`Sync complete: ${
				successfulAdds.length +
				successfulUpdates.length +
				successfulDeletes.length +
				successfulDeleteAdds.length
			} successful, ${
				failedAdds.length +
				failedUpdates.length +
				failedDeletes.length +
				failedDeleteAdds.length
			} failed`
		);

		// Return the results
		return {
			successful: {
				added: successfulAdds,
				updated: successfulUpdates,
				deleted: successfulDeletes,
				deletedAdd: successfulDeleteAdds,
			},
			failed: {
				added: failedAdds,
				updated: failedUpdates,
				deleted: failedDeletes,
				deleteAdd: failedDeleteAdds,
			},
		};
	} catch (error) {
		console.error("Error during resync process:", error);
		return {
			successful: { added: [], updated: [], deleted: [], deleteAdd: [] },
			failed: {
				added: resync.added || [],
				updated: resync.updated || [],
				deleted: resync.deleted || [],
				deleteAdd: resync.deleteAdd || [],
			},
		};
	}
};

// Helper function to ensure workout timestamps are proper Firestore timestamps
const formatWorkoutTimestamps = (workout) => {
	// Create a copy of the workout to avoid modifying the original
	const formattedWorkout = { ...workout };

	// Format timestamps if they exist
	if (formattedWorkout.completedAt) {
		formattedWorkout.completedAt = convertToFirestoreTimestamp(
			formattedWorkout.completedAt
		);
	}

	if (formattedWorkout.updatedAt) {
		formattedWorkout.updatedAt = convertToFirestoreTimestamp(
			formattedWorkout.updatedAt
		);
	}

	if (formattedWorkout.startedAt) {
		formattedWorkout.startedAt = convertToFirestoreTimestamp(
			formattedWorkout.startedAt
		);
	}

	// Always set uploadedAt to current time for syncing
	formattedWorkout.uploadedAt = firestore.Timestamp.now();

	return formattedWorkout;
};

// Helper function to convert any timestamp-like object to a proper Firestore timestamp
const convertToFirestoreTimestamp = (timestamp) => {
	// If it's already a Firestore timestamp, return it
	if (timestamp && typeof timestamp.toDate === "function") {
		return timestamp;
	}

	// If it has seconds property (serialized Firestore timestamp)
	if (timestamp && timestamp.seconds) {
		return firestore.Timestamp.fromDate(new Date(timestamp.seconds * 1000));
	}

	// If it's a Date object
	if (timestamp instanceof Date) {
		return firestore.Timestamp.fromDate(timestamp);
	}

	// If it's a number (milliseconds since epoch)
	if (typeof timestamp === "number") {
		return firestore.Timestamp.fromDate(new Date(timestamp));
	}

	// If it's a string (ISO date string)
	if (typeof timestamp === "string") {
		return firestore.Timestamp.fromDate(new Date(timestamp));
	}

	// Default: return current timestamp
	return firestore.Timestamp.now();
};

export const retrieveWorkoutHistory = async (userId) => {
	console.log("checking async storage capacity");
	const storageCapacity = await checkStorageCapacity();
	console.log("storage capacity", storageCapacity);

	console.log("(WorkoutFunctions) - Retrieving workout history");
	let workoutHistory = await getWorkoutHistoryCache();

	// Initialize cache if it's empty
	if (!workoutHistory || workoutHistory.length === 0) {
		console.log(
			"(WorkoutFunctions) - No workout history found, initializing empty cache"
		);
		workoutHistory = {
			lastSynced: firestore.Timestamp.fromDate(new Date(0)),
			workouts: [],
		};
	}

	workoutHistory.lastSynced = convertToFirestoreTimestamp(
		workoutHistory.lastSynced
	);

	try {
		// Try to resync any pending changes to firestore
		await resyncWorkouts();

		// Get new workouts from Firestore
		const newWorkouts = await getWorkoutsFromFirestore(
			userId,
			workoutHistory.lastSynced
		);

		// Get deleted workouts from Firestore
		const deletedWorkouts = await getDeletedWorkoutsFromFirestore(
			userId,
			workoutHistory.lastSynced
		);

		console.log(
			"(WorkoutFunctions) - New workouts retrieved: ",
			newWorkouts?.length || 0
		);
		console.log(
			"(WorkoutFunctions) - Deleted workouts retrieved: ",
			deletedWorkouts?.length || 0
		);

		// Process updates if we have new or deleted workouts
		if (
			(newWorkouts && newWorkouts.length > 0) ||
			(deletedWorkouts && deletedWorkouts.length > 0)
		) {
			// Create a map of all existing workouts for easier manipulation
			const workoutMap = new Map();

			// Add existing workouts to the map
			workoutHistory.workouts.forEach((workout) => {
				workoutMap.set(workout.id, workout);
			});

			// Add new workouts to the map (overwriting any existing ones with the same ID)
			if (newWorkouts && newWorkouts.length > 0) {
				newWorkouts.forEach((workout) => {
					workoutMap.set(workout.id, workout);
				});
			}

			// Remove deleted workouts from the map
			if (deletedWorkouts && deletedWorkouts.length > 0) {
				deletedWorkouts.forEach((deletedWorkout) => {
					workoutMap.delete(deletedWorkout.id);
				});
			}

			// Convert map back to array
			const mergedWorkouts = Array.from(workoutMap.values());

			// Update the cache with new data and current timestamp
			const updatedCache = {
				lastSynced: firestore.Timestamp.now(),
				workouts: mergedWorkouts,
			};

			// Save to cache
			await setWorkoutHistoryCache(updatedCache);

			return updatedCache;
		}

		return workoutHistory;
	} catch (error) {
		console.error(
			"(WorkoutFunctions) - Error retrieving workout history: ",
			error
		);
		return workoutHistory; // Return existing data in case of error
	}
};

export const addWorkoutToHistory = async (workout) => {
	console.log("(WorkoutFunctions) - Adding workout to history");

	// Add workout to workoutHistoryCache
	await addWorkoutToHistoryCache(workout, workout.uploadedAt);

	// Try to add to firestore. If it fails, catch the error and add it to syncCache
	try {
		await addWorkoutToFirestore(workout);
	} catch (error) {
		console.error(
			"(WorkoutFunctions) - Error adding workout to firestore: ",
			error
		);
		await cacheWorkoutAddition(workout);
	}
};

export const deleteWorkoutFromHistory = async (workout) => {
	console.log("(WorkoutFunctions) - Deleting workout from history");

	// Delete workout from workoutHistoryCache
	await removeWorkoutFromHistoryCache(workout.id, workout.deletedAt);

	// Try to delete from firestore. If it fails, catch the error and add it to syncCache
	try {
		await deleteWorkoutFromWorkoutCollection(workout.id);
	} catch (error) {
		console.error(
			"(WorkoutFunctions) - Error deleting workout from firestore: ",
			error
		);
		await cacheWorkoutDeletion(workout);
	}

	// Add workout to deletedWorkouts collection
	try {
		await addDeletedWorkoutToDeletedWorkoutsCollection(
			workout,
			workout.uploadedAt
		);
	} catch (error) {
		console.error(
			"(WorkoutFunctions) - Error adding workout to deletedWorkouts collection: ",
			error
		);
		await cacheWorkoutDeletionAdd(workout);
	}
};

export const updateWorkoutInHistory = async (workout) => {
	console.log("(WorkoutFunctions) - Updating workout in history");

	// Update workout in workoutHistoryCache
	await updateWorkoutInHistoryCache(workout);

	try {
		console.log("(WorkoutFunctions) - Updating workout in firestore");
		await updateWorkoutInFirestore(workout);
	} catch (error) {
		console.error(
			"(WorkoutFunctions) - Error updating workout in firestore: ",
			error
		);
		await cacheWorkoutUpdate(workout);
	}
};
