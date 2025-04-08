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
