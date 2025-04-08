// firestore Imports - AKA the cloud database
import {
	fetchNewWorkouts,
	fetchDeletedWorkouts,
	uploadWorkout,
	uploadWorkoutUpdate,
	removeWorkoutFromFirestore,
	markWorkoutAsDeleted,
} from "../firestore/firestoreWorkoutServices";

// Realm Imports - AKA the local database
import {
	getRealmWorkouts,
	setRealmWorkout,
	batchSetRealmWorkout,
	removeRealmWorkout,
	removeAllRealmWorkout,
	getPendingRealmWorkouts,
	markWorkoutAsSynced,
	mergeWorkoutsToRealm,
	removeWorkoutsFromRealm,
	getLastWorkoutSyncTime,
	updateLastWorkoutSyncTime,
} from "../database/realmWorkoutFunctions";

import firestore from "@react-native-firebase/firestore";
let workoutListenerUnsubscribe = null;

export const listenToWorkoutChanges = (userId, realm, setWorkoutHistory) => {
	if (!userId) return;

	if (workoutListenerUnsubscribe) {
		workoutListenerUnsubscribe(); // remove previous listener
	}

	const query = firestore()
		.collection("workouts")
		.where("userId", "==", userId);

	workoutListenerUnsubscribe = query.onSnapshot(async (snapshot) => {
		try {
			if (!snapshot.empty) {
				const workouts = snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						...data,
						startedAt: data.startedAt.toDate(),
						completedAt: data.completedAt.toDate(),
						updatedAt: data.updatedAt.toDate(),
						uploadedAt: data.uploadedAt.toDate(),
					};
				});

				// Sync to Realm
				realm.write(() => {
					workouts.forEach((workout) => {
						realm.create(
							"Workout",
							{
								...workout,
								syncStatus: "synced",
							},
							"modified"
						);
					});
				});

				// Update React state
				setWorkoutHistory([...workouts]);
			}
		} catch (err) {
			console.error("(WorkoutListener) - Error handling snapshot:", err);
		}
	});
};

export const unsubscribeWorkoutListener = () => {
	if (workoutListenerUnsubscribe) {
		workoutListenerUnsubscribe();
		workoutListenerUnsubscribe = null;
	}
};

export const syncPendingWorkoutsToFirestore = async (realm, userId) => {
	try {
		const pendingWorkouts = await getPendingRealmWorkouts(realm, userId);

		if (pendingWorkouts.length === 0) return;

		realm.write(() => {
			pendingWorkouts.forEach((workout) => {
				try {
					uploadWorkout({
						...(workout.toJSON?.() ?? { ...workout }),
						updatedAt: firestore.Timestamp.now(),
						uploadedAt: firestore.Timestamp.now(),
					});
					markWorkoutAsSynced(realm, workout.id);
				} catch (error) {
					console.error(
						"(Sync) Upload failed for",
						workout.id,
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

export const syncWorkoutsFromFirestore = async (realm, userId) => {
	try {
		const lastSynced = getLastWorkoutSyncTime(realm);
        const effectiveLastSynced = lastSynced.getTime() === new Date(0).getTime() ? new Date() : lastSynced;

		const [newWorkouts, deletedWorkouts] = await Promise.all([
			fetchNewWorkouts(userId, lastSynced),

			fetchDeletedWorkouts(userId, effectiveLastSynced),
		]);
		realm.write(() => {
			if (newWorkouts.length > 0)
				mergeWorkoutsToRealm(realm, newWorkouts);
			if (deletedWorkouts.length > 0) {
				const idsToDelete = deletedWorkouts.map((d) => d.deletedId);
				removeWorkoutsFromRealm(realm, idsToDelete);
			}
			updateLastWorkoutSyncTime(realm);
		});

	} catch (error) {
		console.error("(Sync) Error syncing from Firestore:", error);
	}
};

export const getWorkouts = async (realm, userId) => {
    try {
        const workouts = await getRealmWorkouts(realm, userId);
        return workouts;
    } catch (error) {
        console.error("(WorkoutFunctions) - Error getting workouts:", error);
    }
}

export const addWorkout = async (realm, userId, workoutData) => {
	try {
		await uploadWorkout(userId, workoutData);
		await setRealmWorkout(realm, userId, workoutData, "uploaded");
	} catch (error) {
		console.error("(WorkoutFunctions) - Error adding workout:", error);
		await setRealmWorkout(realm, userId, workoutData, "pending");
	}
};

export const deleteWorkout = async (realm, userId, workoutId) => {
	try {
		await removeWorkoutFromFirestore(workoutId);
		await markWorkoutAsDeleted({ workoutId: workoutId, userId: userId });
		await removeRealmWorkout(realm, userId, workoutId, "deleted");
	} catch (error) {
		console.error("(WorkoutFunctions) - Error deleting workout:", error);
		await removeRealmWorkout(realm, userId, workoutId, "pending");
	}
};
