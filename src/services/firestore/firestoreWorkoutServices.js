import firestore from "@react-native-firebase/firestore";

const workoutsCollection = firestore().collection("workouts");

export const uploadWorkout = async (workout) => {
	try {
		await workoutsCollection.doc(workout.workoutId).set({
			...workout,
			updatedAt: firestore.FieldValue.serverTimestamp(),
		});
	} catch (error) {
		throw new Error(
			"(FirestoreWorkoutServices) - Error uploading workout:",
			error
		);
	}
};

export const editWorkoutInFirestore = async (workout) => {
	try {
		await workoutsCollection.doc(workout.workoutId).set(
			{
				...workout,
				exercises: workout.exercises,
				updatedAt: firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error uploading workout update:",
			error
		);
	}
};

export const removeWorkoutFromFirestore = async (workoutId) => {
	try {
		await workoutsCollection.doc(workoutId).set(
			{
				deleted: true,
				deletedAt: firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error removing workout:",
			error
		);
	}
};
