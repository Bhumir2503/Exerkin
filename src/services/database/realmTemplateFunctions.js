export const setRealmTemplate = async (realm, template, syncStatus) => {
	try {
		realm.write(() => {
			realm.create(
				"Template",
				{ ...template, syncStatus: syncStatus },
				"modified"
			);
		});
	} catch (error) {
		console.error(
			"(RealmTemplateFunctions) - Error setting template:",
			error
		);
	}
};

export const removeTemplateFromRealm = async (
	realm,
	templateId,
) => {
	realm.write(() => {
		const template = realm
			.objects("Template")
			.filtered("templateId == $0", templateId)[0];

		if (template) {
			template.exercises.forEach((exercise) => {
				exercise.sets.forEach((set) => {
					realm.delete(set);
				});
				realm.delete(exercise);
			});
			realm.delete(template);
		}
	});
};

export const mergeTemplatesToRealm = (realm, templates) => {
	templates.forEach((template) => {
		template.deletedAt = null;
		template.createdAt = template.createdAt.toDate();
		template.updatedAt = template.updatedAt.toDate();
		template.syncStatus = "synced";
		realm.create("Template", template, "modified");
	});
};

export const removeTemplatesFromRealm = (realm, ids) => {
	ids.forEach((id) => {
		const template = realm
			.objects("Template")
			.filtered("templateId == $0", id)[0];

		if (template) {
			template.exercises.forEach((exercise) => {
				exercise.sets.forEach((set) => {
					realm.delete(set);
				});
				realm.delete(exercise);
			});
			realm.delete(template);
		}
	});
};

export const getLastTemplateSyncTime = (realm) => {
	const status = realm.objectForPrimaryKey("SyncStatus", "templates");
	return status?.lastSynced || new Date(0);
};

export const updateLastTemplateSyncTime = (realm) => {
	realm.create(
		"SyncStatus",
		{ type: "templates", lastSynced: new Date() },
		"modified"
	);
};
