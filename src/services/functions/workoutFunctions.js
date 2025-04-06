// firestore Imports - AKA the cloud database
import {
	fetchNewWorkouts,
	fetchDeletedWorkouts,
	uploadWorkout,
	uploadWorkoutUpdate,
	removeWorkoutFromFirestore,
	markWorkoutAsDeleted,
} from "../firestore/firestoreWorkoutServices";

// Realm Imports - AKA the local database
import {
    getRealmWorkouts,
    setRealmWorkout,
    batchSetRealmWorkout,
    removeRealmWorkout,
    removeAllRealmWorkout,
} from "../database/realmWorkoutFunctions";

// Sync Status Imports - AKA the sync status database
import {
    getLastSynced,
    updateLastSynced,
} from "../database/realmSyncStatusFunction";

export const syncWorkoutsFromFirestore = async (userId) => {

}

export const addWorkout = async (userId, workoutData) => {
    try{
        await uploadWorkout(userId, workoutData);
        await setRealmWorkout(userId, workoutData, "uploaded");
    }catch(error){
        console.error("(WorkoutFunctions) - Error adding workout:", error);
        await setRealmWorkout(userId, workoutData, "pending");
    }
}

export const deleteWorkout = async (userId, workoutId) => {
    try{
        await removeWorkoutFromFirestore(workoutId);
        await markWorkoutAsDeleted({id: workoutId, userId: userId});
        await removeRealmWorkout(userId, workoutId, "deleted");
    }catch(error){
        console.error("(WorkoutFunctions) - Error deleting workout:", error);
        await removeRealmWorkout(userId, workoutId, "pending");
    }
}