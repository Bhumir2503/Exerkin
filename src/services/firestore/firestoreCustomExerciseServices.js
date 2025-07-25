import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";
/*
 * Function to listen to custom exercise changes in Firestore
 *
 * @param {string} userId - The ID of the user whose custom exercises are being listened to
 * @param {function} setCustomExercises - Function to update the custom exercises state
 * @return {function} - Unsubscribe function to stop listening to changes
 */
export const listenToCustomExerciseChanges = (userId, setCustomExercises) => {
	const unsubscribe = firestore()
		.collection("customExercises")
		.where("userId", "==", userId)
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log(
						"(FirestoreWorkoutServices) - No custom exercises found for user:",
						userId
					);
					setCustomExercises([]); // If no custom exercises found, set empty list
					return;
				}
				console.log(
					"(FirestoreWorkoutServices) - Custom exercises fetched for user:",
					userId,
					"- Count:",
					snapshot.docs.length
				);

				const newExercises = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				setCustomExercises(newExercises);
			},
			(error) => {
				console.error("Error fetching custom exercises:", error);
			}
		);
	return unsubscribe;
};

/*
 * Function to save a custom exercise in Firestore
 *
 * @param {Object} exercise - The custom exercise object to be saved
 * @throws {Error} - Throws an error if the exercise name or user ID is not provided or if there is an issue saving the exercise
 */

export const saveCustomExerciseToFirestore = async (exercise) => {
	if (!exercise.name || !exercise.userId) {
		throw new Error(
			"Exercise name and user ID are required to save the exercise."
		);
	}

	try {
		const exerciseId = uuid.v4(); // Generate a unique ID for the exercise
		await firestore()
			.collection("customExercises")
			.doc(exerciseId)
			.set({
				docId: exerciseId,
				...exercise,
				createdAt: firestore.FieldValue.serverTimestamp(),
			});

		console.log(
			"(FirestoreWorkoutServices) - Custom exercise saved successfully:",
			exerciseId
		);
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error saving custom exercise:",
			error
		);
		throw new Error(
			`Failed to save custom exercise: ${
				error.message || "Unknown error"
			}`
		);
	}
};
