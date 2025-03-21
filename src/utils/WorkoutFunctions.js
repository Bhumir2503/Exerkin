import firestore from "@react-native-firebase/firestore";
import { getWorkoutHistoryCache, setWorkoutHistoryCache } from "../cache/workoutHistoryCache";
import { resetWorkoutResyncCache, addWorkoutToResyncCache, getWorkoutInResyncCache } from "../cache/ResyncCache";
import {
	addWorkoutToFirestore,
	getWorkoutsFromFirestore,
} from "../firestore/FirestoreWorkoutServices";



// Function to sync local completed workout that failed with firestore
// Mainly used when the user is offline and the workout is completed
// The workout is stored in the local cache and then synced with firestore when the user is online
export const resyncWorkouts = async () => {
    console.log("(WorkoutFunctions) - Syncing workouts");
    const resync = await getWorkoutInResyncCache();
    await resetWorkoutResyncCache();
    if (resync.length === 0) {
        console.log("(WorkoutFunctions) - No workouts to sync");
        return;
    }
    console.log("(WorkoutFunctions) - Syncing workouts");
    resync.forEach(async (workout) => {
        //reset the firestore timestamp to the workout.completedate timestamp seconds and nanoseconds
        workout.completedAt = firestore.Timestamp.fromDate(
            new Date(workout.completedAt.seconds * 1000)
        );
        workout.updatedAt = firestore.Timestamp.fromDate(
            new Date(workout.updatedAt.seconds * 1000)
        );
        workout.startedAt = firestore.Timestamp.fromDate(
            new Date(workout.startedAt.seconds * 1000)
        );
        workout.uploadedAt = firestore.Timestamp.now();
        try {
            await addWorkoutToFirestore(workout);
        } catch (error) {
            console.error(
                "(WorkoutFunctions) - Error adding workout to firestore: ",
                error
            );
            await addWorkoutToResyncCache(workout);
        }
    });
}


export const retrieveWorkoutHistory = async (userId) => {
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

	try {
		// Get new workouts from Firestore
		const newWorkouts = await getWorkoutsFromFirestore(
			userId,
			workoutHistory.lastSynced
		);

		console.log(
			"(WorkoutFunctions) - New workouts retrieved: ",
			newWorkouts?.length || 0
		);

		if (newWorkouts && newWorkouts.length > 0) {
			// Merge new workouts with existing ones
			// Using a Map to ensure we don't have duplicates based on workout ID
			const workoutMap = new Map();

			// Add existing workouts to the map
			workoutHistory.workouts.forEach((workout) => {
				workoutMap.set(workout.id, workout);
			});

			// Add or update with new workouts
			newWorkouts.forEach((workout) => {
				workoutMap.set(workout.id, workout);
			});

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