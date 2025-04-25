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

export const mergeBlueprintsToRealm = (realm, blueprints) => {
    blueprints.forEach((blueprint) => {
        blueprint.deletedAt = blueprint.deletedAt || null;
        blueprint.createdAt = blueprint.createdAt.toDate();
        blueprint.updatedAt = blueprint.updatedAt.toDate();
        blueprint.syncStatus = "synced";
        realm.create("Blueprint", blueprint, "modified");
    });
};

export const removeBlueprintsFromRealm = (realm, ids) => {
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
}