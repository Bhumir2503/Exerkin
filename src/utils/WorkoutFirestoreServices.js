import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Collection references
const workoutsCollection = firestore().collection('workouts');

export const getWorkouts = async (userId) => {
    try {
        const workouts = await workoutsCollection.where('userId', '==', userId).get();
        return workouts.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const addWorkout = async (workout) => {
    try {
        await workoutsCollection.doc(workout.id).set(workout);
    } catch (error) {
        console.error(error);
    }
}