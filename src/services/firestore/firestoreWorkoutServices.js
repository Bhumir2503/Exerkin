import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const workoutsCollection = firestore().collection("workouts");
const deletedWorkoutsCollection = firestore().collection("deletedWorkouts");

export const fetchNewWorkouts = async (userId, lastSynced) => {
	try {
		const snapshot = await workoutsCollection
			.where("userId", "==", userId)
			.where("updatedAt", ">", lastSynced)
			.get();

		console.log(
			"(FirestoreWorkoutServices) - Retrieved documents count:",
			snapshot.size
		);
		if (snapshot.empty) {
			return [];
		}

		const workouts = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));

		return workouts;
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error fetching new workouts:",
			error
		);
		return [];
	}
};

export const fetchDeletedWorkouts = async (userId, lastSynced) => {
	try {
		const snapshot = await deletedWorkoutsCollection
			.where("userId", "==", userId)
			.where("deletedAt", ">", lastSynced)
			.get();

		console.log(
			"(FirestoreWorkoutServices) - Retrieved deleted documents count:",
			snapshot.size
		);

		if (snapshot.empty) {
			return [];
		}

		const deletedWorkouts = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));

		return deletedWorkouts;
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error fetching deleted workouts:",
			error
		);
		return [];
	}
};

export const uploadWorkout = async (userId, workout) => {
	try {
		await workoutsCollection.doc(workout.id).set({
			...workout,
			userId: userId,
			updatedAt: new Date(),
			uploadedAt: new Date(),
		});
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error uploading workout:",
			error
		);
	}
};

export const uploadWorkoutUpdate = async (workout) => {
	try {
		await workoutsCollection.doc(workout.id).set(
			{
				...workout,
				updatedAt: firestore.Timestamp.now(),
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
		await workoutsCollection.doc(workoutId).delete();
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error removing workout:",
			error
		);
	}
};

export const markWorkoutAsDeleted = async (workout) => {
	try {
		await deletedWorkoutsCollection.doc(workout.id).set({
			id: workout.id,
            userId: workout.userId,
            deletedAt: new Date(),
		});
	} catch (error) {
		console.error(
			"(FirestoreWorkoutServices) - Error marking workout as deleted:",
			error
		);
	}
};
