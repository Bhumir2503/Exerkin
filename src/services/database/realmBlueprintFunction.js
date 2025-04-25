export const getLastBlueprintSyncTime = (realm) => {
	const status = realm.objectForPrimaryKey("SyncStatus", "blueprints");
	return status?.lastSynced || new Date(0);
};

export const updateLastBlueprintSyncTime = (realm) => {
	realm.create(
		"SyncStatus",
		{ type: "blueprints", lastSynced: new Date() },
		"modified"
	);
};

export const addBlueprintToRealm = (realm, blueprint, syncStatus) => {
	try {
		realm.write(() => {
			realm.create(
				"Blueprint",
				{
					...blueprint,
					syncStatus: syncStatus,
				},
				"modified"
			);
		});
	} catch (error) {
		console.error("Error writing to Realm:", error);
	}
};

export const mergeBlueprintsToRealm = (realm, blueprints) => {
	blueprints.forEach((blueprint) => {
		blueprint.deletedAt = blueprint.deletedAt || null;
		blueprint.createdAt = blueprint.createdAt.toDate();
		blueprint.updatedAt = blueprint.updatedAt.toDate();
		blueprint.syncStatus = "synced";

		realm.create("Blueprint", blueprint, "modified");
	});
};

export const removeBlueprintFromRealm = (realm, blueprintId) => {
	realm.write(() => {
		const blueprint = realm
			.objects("Blueprint")
			.filtered("blueprintId == $0", blueprintId)[0];

		if (blueprint) {
			blueprint.exercises.forEach((exercise) => {
				exercise.sets.forEach((set) => {
					realm.delete(set);
				});
				realm.delete(exercise);
			});
			realm.delete(blueprint);
		}
	});
};

export const removeMultipleBlueprintFromRealm = (realm, ids) => {
	ids.forEach((id) => {
		const blueprint = realm
			.objects("Blueprint")
			.filtered("blueprintId == $0", id)[0];

		if (blueprint) {
			blueprint.exercises.forEach((exercise) => {
				exercise.sets.forEach((set) => {
					realm.delete(set);
				});
				realm.delete(exercise);
			});
			realm.delete(blueprint);
		}
	});
};
