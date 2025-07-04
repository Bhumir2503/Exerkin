import firestore from "@react-native-firebase/firestore";
const workoutsCollection = firestore().collection("workouts");

/*
 * Function to listen to workout changes in Firestore
 *
 * @param {string} userId - The ID of the user whose workouts are being listened to
 * @param {function} setWorkoutHistory - Function to update the workout history state
 * @returns {function} - Unsubscribe function to stop listening to changes
 */
export const listenToWorkoutChanges = (userId, setWorkoutHistory) => {
	const unsubscribe = workoutsCollection
		.where("userId", "==", userId)
		.orderBy("completedAt", "desc") // Order workouts by completion date
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log(
						"(FirestoreWorkoutServices) - No workouts found for user:",
						userId
					);
					setWorkoutHistory([]); // If no workouts found, set empty history
					return;
				}
				console.log(
					"(FirestoreWorkoutServices) - Workouts fetched for user:",
					userId,
					"- Count:",
					snapshot.docs.length
				);

				const newWorkouts = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				setWorkoutHistory(newWorkouts);
			},
			(error) => {
				console.error("Error fetching workouts:", error);
			}
		);

	return unsubscribe;
};

/*
 * Function to save a workout in Firestore
 *
 * @param {Object} workout - The workout object to be saved
 * @throws {Error} - Throws an error if the workout ID is not provided or if there is an issue saving the workout
 */
export const saveWorkoutInFirestore = async (workout) => {
	try {
		if (!workout.workoutId) {
			throw new Error("Workout ID is required to save the workout.");
		}

		await workoutsCollection.doc(workout.workoutId).set(workout);

		console.log(
			"(FirestoreWorkoutServices) - Workout saved successfully:",
			workout.workoutId
		);
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error saving workout in Firestore:",
			error
		);
		throw new Error(
			`Failed to save workout: ${error.message || "Unknown error"}`
		);
	}
};

/*
 * Function to update a workout in Firestore
 *
 * @param {Object} workout - The workout object to be updated
 * @throws {Error} - Throws an error if the workout ID is not provided or if there is an issue updating the workout
 */
export const updateWorkoutInFirestore = async (workout) => {
	try {
		if (!workout.workoutId) {
			throw new Error("Workout ID is required to update the workout.");
		}

		await workoutsCollection
			.doc(workout.workoutId)
			.set(workout, { merge: true });

		console.log(
			"(FirestoreWorkoutServices) - Workout updated successfully:",
			workout.workoutId
		);
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error updating workout in Firestore:",
			error
		);
	}
};

/*
 * Function to delete a workout from Firestore
 *
 * @param {string} workoutId - The ID of the workout to be deleted
 * @throws {Error} - Throws an error if the workout ID is not provided or if there is an issue deleting the workout
 */
export const deleteWorkoutFromFirestore = async (workoutId) => {
	try {
		if (!workoutId) {
			throw new Error("Workout ID is required to delete the workout.");
		}

		await workoutsCollection.doc(workoutId).delete();

		console.log(
			"(FirestoreWorkoutServices) - Workout deleted successfully:",
			workoutId
		);
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error deleting workout in Firestore:",
			error
		);
	}
};
