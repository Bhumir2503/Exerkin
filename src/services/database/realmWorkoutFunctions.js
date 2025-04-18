export const getRealmWorkouts = async (realm, userId) => {
	try {
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

export const setRealmWorkout = async (realm, workoutData, syncStatus) => {
	try {
		realm.write(() => {
			realm.create(
				"Workout",
				{ ...workoutData, syncStatus: syncStatus },
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

export const setEditedRealmWorkout = async (realm, workoutData) => {
	const workout = {
		...workoutData,
		exercises: workoutData.exercises.map((exercise) => ({
			...exercise,
			sets: exercise.sets.map((set) => ({
				...set,
			})),
		})),
		syncStatus: "unsynced",
	};
	try {
		realm.write(() => {
			realm.create(
				"Workout",
				{
					...workout,
				},
				"modified"
			);
		});

		return workout;
	} catch (error) {
		console.error(
			"(RealmWorkoutFunctions) - Error setting edited workout:",
			error
		);
		return null;
	}
};

export const removeRealmWorkout = async (realm, workoutId) => {
	realm.write(() => {
		const workout = realm
			.objects("Workout")
			.filtered("workoutId == $0", workoutId)[0];

		if (workout) {
			// 🔁 Loop through each WorkoutExercise
			workout.exercises.forEach((exercise) => {
				// 🔁 Loop through each ExerciseSe
				exercise.sets.forEach((set) => {
					realm.delete(set);
				});
				// Delete the Exercise
				realm.delete(exercise);
			});

			// Finally delete the Workout
			realm.delete(workout);
		}
	});
};

// Merge Firestore workouts into Realm
export const mergeWorkoutsToRealm = (realm, workouts) => {
	workouts.forEach((workout) => {
		// Convert Firestore timestamps to JavaScript Date objects
		workout.startedAt = workout.startedAt.toDate();
		workout.completedAt = workout.completedAt.toDate();
		workout.createdAt = workout.createdAt.toDate();
		workout.updatedAt = workout.updatedAt.toDate();
		workout.deletedAt = null;
		workout.syncStatus = "synced";

		realm.create("Workout", workout, "modified");
	});
};

// Delete workouts from Realm
export const removeWorkoutsFromRealm = (realm, workoutIds) => {
	workoutIds.forEach((id) => {
		const workout = realm.objectForPrimaryKey("Workout", id);
		if (workout) {
			workout.exercises.forEach((ex) => {
				ex.sets.forEach((set) => {
					realm.delete(set);
				});
				realm.delete(ex);
			});
			realm.delete(workout);
		}
	});
};

// Get last synced time
export const getLastWorkoutSyncTime = (realm) => {
	const status = realm.objectForPrimaryKey("SyncStatus", "workouts");
	return status?.lastSynced || new Date(0);
};

// Update sync timestamp
export const updateLastWorkoutSyncTime = (realm) => {
	realm.create(
		"SyncStatus",
		{
			type: "workouts",
			lastSynced: new Date(),
		},
		"modified"
	);
};
