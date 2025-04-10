export const migrationVersion7 = (oldRealm, newRealm) => {
	// Loop through all objects in the old realm

	if (oldRealm.schemaVersion < 7) {
		const oldObjects = oldRealm.objects("Template");
		const newObjects = newRealm.objects("Template");

		for (let i = 0; i < oldObjects.length; i++) {
			const oldObject = oldObjects[i];
			const newObject = newObjects[i];
			newObject.templateId = oldObject.id;
		}

		const oldWorkoutObjects = oldRealm.objects("Workout");
		const newWorkoutObjects = newRealm.objects("Workout");

		for (let i = 0; i < oldWorkoutObjects.length; i++) {
			const oldObject = oldWorkoutObjects[i];
			const newObject = newWorkoutObjects[i];

			newObject.workoutId = oldObject.id;
		}

        const oldDeletedWorkoutObjects = oldRealm.objects("DeletedWorkout");
        const newDeletedWorkoutObjects = newRealm.objects("DeletedWorkout");
        for (let i = 0; i < oldDeletedWorkoutObjects.length; i++) {
            const oldObject = oldDeletedWorkoutObjects[i];
            const newObject = newDeletedWorkoutObjects[i];

            newObject.deletedId = oldObject.id;
        }

        const oldUserObjects = oldRealm.objects("User");
        const newUserObjects = newRealm.objects("User");
        for (let i = 0; i < oldUserObjects.length; i++) {
            const oldObject = oldUserObjects[i];
            const newObject = newUserObjects[i];

            newObject.userId = oldObject.uid;
        }
	}
};

export const migrationVersion8 = (oldRealm, newRealm) => {
	migrationVersion7(oldRealm, newRealm);

	if (oldRealm.schemaVersion < 8) {
		const oldObjects = oldRealm.objects("User");
		const newObjects = newRealm.objects("User");

		for (let i = 0; i < oldObjects.length; i++) {
			const oldObject = oldObjects[i];
			const newObject = newObjects[i];

			newObject.unitSystem = oldObject.unitSystem || "imperial"; // Default to imperial if not set
			newObject.gender = oldObject.gender || "male"
		}
	}
}


export const migrationVersion9 = (oldRealm, newRealm) => {
	migrationVersion8(oldRealm, newRealm);

	if (oldRealm.schemaVersion < 9) {
		const oldObjects = oldRealm.objects("WorkoutExercise");
		const newObjects = newRealm.objects("WorkoutExercise");
		for (let i = 0; i < oldObjects.length; i++) {
			const oldObject = oldObjects[i];
			const newObject = newObjects[i];

			newObject.type = oldObject.type || "cardio-time"; // Default to weight if not set
			newObject.notes = oldObject.notes || ""; // Default to empty string if not set
			newObject.order = oldObject.order || 0; // Default to 0 if not set
			newObject.createdAt = oldObject.createdAt || new Date(); // Default to current date if not set
			newObject.updatedAt = oldObject.updatedAt || new Date(); // Default to current date if not set
			newObject.completed = oldObject.completed || false; // Default to false if not set
			newObject.sets = oldObject.sets || []; // Default to empty array if not set
		}

	}
}

export const migrationVersion12 = (oldRealm, newRealm) => {
	migrationVersion9(oldRealm, newRealm);

	if (oldRealm.schemaVersion < 12) {
		const oldObjects = oldRealm.objects("WorkoutExercise");
		const newObjects = newRealm.objects("WorkoutExercise");
		for (let i = 0; i < oldObjects.length; i++) {
			const oldObject = oldObjects[i];
			const newObject = newObjects[i];

			newObject.exerciseId = oldObject.id || i; // Copy the id to exerciseId
		}
	}
}