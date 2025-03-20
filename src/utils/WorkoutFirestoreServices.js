import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../contexts/UserContext';

// Collection references
const workoutsCollection = firestore().collection('workouts');
const deletedWorkoutsCollection = firestore().collection('deletedWorkouts');

export const getWorkoutsFromFirestore = async (userId, lastSynced) => {
    try {
        const snapshot = await workoutsCollection.where('userId', '==', userId).where('updatedAt', '>', lastSynced).get();
        const workouts = snapshot.docs.map(doc => doc.data());
        return workouts;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

export const addWorkoutToFirestore = async (workout) => {
    try {
        await workoutsCollection.doc(workout.id).set(workout);
    } catch (error) {
        console.error("Error adding document to WorkoutCollection: ", error);
    }
}

export const deleteWorkoutFromFirestore = async (workoutId, time) => {
    const deletedWorkoutRef = deletedWorkoutsCollection.doc(workoutId);
    try {
        await workoutsCollection.doc(workoutId).delete();
    } catch (error) {
        console.error("Error removing document: ", error);
    }

    try {
        await deletedWorkoutRef.set({ id: workoutId, userId: auth().currentUser.uid, deletedAt: time });
    } catch (error) {
        console.error("Error adding document to deletedWorkout: ", error);
    }
}

//delete from workouts collection and add to deletedWorkouts collection
export const batchDeleteWorkoutFromFirestore = async (workoutIds) => {
    const time = firestore.Timestamp.now();
    const batch = firestore().batch();

    workoutIds.forEach((workoutId) => {
        const workoutRef = workoutsCollection.doc(workoutId);
        const deletedWorkoutRef = deletedWorkoutsCollection.doc(workoutId);


        batch.delete(workoutRef);
        batch.set(deletedWorkoutRef, { id: workoutId, userId: auth().currentUser.uid, deletedAt: time });
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error(error);
    }
}