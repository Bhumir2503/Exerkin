import Realm from "realm";
import {
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
} from "../schemas/workoutSchema";
import { getRealm } from "./realmConfig";

const realmConfig = {
	schema: [WorkoutSchema, WorkoutExerciseSchema, ExerciseSetSchema],
	schemaVersion: 1,
};

export const getRealmWorkouts = async (userId) => {
	try {
		const realm = await getRealm();
		const workouts = realm
			.objects("Workout")
			.filtered("userId == $0", userId);
		return workouts;
	} catch (error) {
		console.error(
			"(RealmWorkoutFunctions) - Error fetching workouts:",
			error
		);
		return [];
	}
};

export const setRealmWorkout = async (userId, workoutData, syncStatus) => {
	try {
		const realm = await getRealm();
		realm.write(() => {
			realm.create(
				"Workout",
				{
					userId: userId,
					syncStatus: syncStatus,
					...workoutData,
				},
				"modified"
			);
		});
	} catch (error) {
		console.error(
			"(RealmWorkoutFunctions) - Error setting workout:",
			error
		);
	}
};

export const batchSetRealmWorkout = async (userId, workoutData, syncStatus) => {
	const realm = await getRealm();
	realm.write(() => {
		workoutData.forEach((workout) => {
			realm.create(
				"Workout",
				{
					userId: userId,
					syncStatus: syncStatus,
					...workout,
				},
				"modified"
			);
		});
	});
};

export const removeRealmWorkout = async (userId, workoutId, syncStatus) => {
	const realm = await getRealm();

	realm.write(() => {
		const workout = realm
			.objects("Workout")
			.filtered("userId == $0 && id == $1", userId, workoutId)[0];

		if (workout) {
			// 🔁 Loop through each WorkoutExercise
			workout.exercises.forEach((exercise) => {
				// 🧨 Delete all ExerciseSets
				realm.delete(exercise.sets);
			});

			// 🧨 Delete all WorkoutExercises
			realm.delete(workout.exercises);

			// 💥 Finally delete the Workout
			realm.delete(workout);
		}

		// 📝 Add to DeletedWorkout collection
		realm.create("DeletedWorkout", {
			userId: userId,
			id: workoutId,
			deletedAt: new Date(),
			syncStatus: syncStatus,
		});
	});
};
export const removeAllRealmWorkout = async (userId) => {
	const realm = await getRealm();
	realm.write(() => {
		const workouts = realm
			.objects("Workout")
			.filtered("userId == $0", userId);
		if (workouts) {
			realm.delete(workouts);
		}
	});
};


// Get all workouts for a user that are pending sync
export const getPendingRealmWorkouts = async (userId) => {
	const realm = await getRealm();
	const pendingWorkouts = realm
		.objects("Workout")
		.filtered('userId == $0 AND syncStatus != "synced"', userId);
	return pendingWorkouts;
}

// Mark workout as synced
export const markWorkoutAsSynced = (realm, workoutId) => {
	const workout = realm.objectForPrimaryKey('Workout', workoutId);
	if (workout) {
		workout.syncStatus = 'synced';
	}
};

// Merge Firestore workouts into Realm
export const mergeWorkoutsToRealm = (realm, workouts) => {
	workouts.forEach((workout) => {
		// Convert Firestore timestamps to JavaScript Date objects
		workout.startedAt = workout.startedAt.toDate();
		workout.completedAt = workout.completedAt.toDate();
		workout.updatedAt = workout.updatedAt.toDate();
		workout.uploadedAt = workout.uploadedAt.toDate();
		realm.create('Workout', {
			...workout,
			syncStatus: 'synced',
		}, 'modified');
	});
};

// Delete workouts from Realm
export const removeWorkoutsFromRealm = (realm, workoutIds) => {
	workoutIds.forEach((id) => {
		const workout = realm.objectForPrimaryKey('Workout', id);
		if (workout) {
			workout.exercises.forEach((ex) => realm.delete(ex.sets));
			realm.delete(workout.exercises);
			realm.delete(workout);
		}
	});
};

// Get last synced time
export const getLastWorkoutSyncTime = (realm) => {
	const status = realm.objectForPrimaryKey('SyncStatus', 'workouts');
	return status?.lastSynced || new Date(0);
};

// Update sync timestamp
export const updateLastWorkoutSyncTime = (realm) => {
	realm.create('SyncStatus', {
		type: 'workouts',
		lastSynced: new Date(),
	}, 'modified');
};
