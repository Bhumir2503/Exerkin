import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useUser } from "../contexts/UserContext";

// Collection references
const workoutsCollection = firestore().collection("workouts");
const deletedWorkoutsCollection = firestore().collection("deletedWorkouts");

export const getWorkoutsFromFirestore = async (userId, lastSynced) => {
	try {
		console.log(
			"(FirestoreWorkoutServices) - Getting workouts since:",
			lastSynced
		);

		// Ensure lastSynced is a valid Firestore timestamp
		const syncTimestamp =
			lastSynced || firestore.Timestamp.fromDate(new Date(0));

		const snapshot = await workoutsCollection
			.where("userId", "==", userId)
			.where("uploadedAt", ">", syncTimestamp)
			.get();

		console.log(
			"(FirestoreWorkoutServices) - Retrieved documents count:",
			snapshot.size
		);

		if (snapshot.empty) {
			console.log(
				"(FirestoreWorkoutServices) - No matching documents found"
			);
			return [];
		}

		// Map the documents to include both data and id
		const workouts = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id, // Ensure ID is included in case it's not in the data itself
		}));

		return workouts;
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error getting documents:",
			error
		);
		return []; // Return empty array instead of undefined on error
	}
};

export const addWorkoutToFirestore = async (workout) => {
	try {
		await workoutsCollection.doc(workout.id).set(workout);
	} catch (error) {
		throw error;
	}
};

export const deleteWorkoutFromFirestore = async (workoutId, time) => {
	const deletedWorkoutRef = deletedWorkoutsCollection.doc(workoutId);
	try {
		await workoutsCollection.doc(workoutId).delete();
	} catch (error) {
		console.error("Error removing document: ", error);
	}

	try {
		await deletedWorkoutRef.set({
			id: workoutId,
			userId: auth().currentUser.uid,
			deletedAt: time,
		});
	} catch (error) {
		console.error("Error adding document to deletedWorkout: ", error);
	}
};

//delete from workouts collection and add to deletedWorkouts collection
export const batchDeleteWorkoutFromFirestore = async (workoutIds) => {
	const time = firestore.Timestamp.now();
	const batch = firestore().batch();

	workoutIds.forEach((workoutId) => {
		const workoutRef = workoutsCollection.doc(workoutId);
		const deletedWorkoutRef = deletedWorkoutsCollection.doc(workoutId);

		batch.delete(workoutRef);
		batch.set(deletedWorkoutRef, {
			id: workoutId,
			userId: auth().currentUser.uid,
			deletedAt: time,
		});
	});

	try {
		await batch.commit();
	} catch (error) {
		console.error(error);
	}
};
