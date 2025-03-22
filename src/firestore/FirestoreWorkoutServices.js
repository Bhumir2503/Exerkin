import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useUser } from "../contexts/UserContext";

// Collection references
const workoutsCollection = firestore().collection("workouts");
const deletedWorkoutsCollection = firestore().collection("deletedWorkouts");

export const getWorkoutsFromFirestore = async (userId, lastSynced) => {
	try {
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

export const getDeletedWorkoutsFromFirestore = async (userId, lastSynced) => {
	try {
		const snapshot = await deletedWorkoutsCollection
			.where("userId", "==", userId)
			.where("uploadedAt", ">", lastSynced)
			.get();

		console.log(
			"(FirestoreWorkoutServices) - Retrieved deleted documents count:",
			snapshot.size
		);

		if (snapshot.empty) {
			console.log(
				"(FirestoreWorkoutServices) - No matching deleted documents found"
			);
			return [];
		}

		const deletedWorkouts = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));

		return deletedWorkouts;
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error getting deleted documents:",
			error
		);
		return [];
	}
}

export const getUpdatedWorkoutsFromFirestore = async (userId, lastSynced) => {
	try {
		const snapshot = await workoutsCollection
			.where("userId", "==", userId)
			.where("updatedAt", ">", lastSynced)
			.get();

		console.log(
			"(FirestoreWorkoutServices) - Retrieved updated documents count:",
			snapshot.size
		);

		if (snapshot.empty) {
			console.log(
				"(FirestoreWorkoutServices) - No matching updated documents found"
			);
			return [];
		}

		const updatedWorkouts = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));

		return updatedWorkouts;
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error getting updated documents:",
			error
		);
		return [];
	}
}

export const addWorkoutToFirestore = async (workout) => {
	try {

		await workoutsCollection.doc(workout.id).set(workout);
	} catch (error) {
		throw error;
	}
};

export const deleteWorkoutFromWorkoutCollection = async (workoutId) => {
	try {

		await workoutsCollection.doc(workoutId).delete();
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export const addDeletedWorkoutToDeletedWorkoutsCollection = async (workout, uploadTime) => {
	try {
		await deletedWorkoutsCollection.doc(workout.id).set({
			id: workout.id,
			userId: workout.userId,
			deletedAt: workout.deletedAt,
			uploadedAt: firestore.Timestamp.now(),
		});
	} catch (error) {
		console.error(error);
		throw error;
	}	
}

export const updateWorkoutInFirestore = async (workout) => {
	try {
		await workoutsCollection.doc(workout.id).set(workout);
	} catch (error) {
		throw error;
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
