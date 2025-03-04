import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../contexts/UserContext';

// Collection references
const workoutsCollection = firestore().collection('workouts');
const deletedWorkoutsCollection = firestore().collection('deletedWorkouts');

export const getWorkoutsFromFirestore = async (userId) => {
    try {
        const workouts = await workoutsCollection.where('userId', '==', userId).get();
        return workouts.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const addWorkoutToFirestore = async (workout) => {
    try {
        await workoutsCollection.doc(workout.id).set(workout);
    } catch (error) {
        console.error(error);
    }
}

export const deleteWorkoutFromFirestore = async (workoutId) => {
    try {
        await workoutsCollection.doc(workoutId).delete();
    } catch (error) {
        console.error(error);
    }
}

//delete from workouts collection and add to deletedWorkouts collection
export const batchDeleteWorkoutFromFirestore = async (workoutIds) => {

    const batch = firestore().batch();

    workoutIds.forEach((workoutId) => {
        const workoutRef = workoutsCollection.doc(workoutId);
        const deletedWorkoutRef = deletedWorkoutsCollection.doc(workoutId);

        batch.delete(workoutRef);
        batch.set(deletedWorkoutRef, { id: workoutId, userId: auth().currentUser.uid });
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error(error);
    }
}