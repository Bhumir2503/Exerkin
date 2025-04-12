import { uploadTemplate } from "../firestore/firestoreTemplateServices";

import {
	setRealmTemplate,
	getLastTemplateSyncTime,
	updateLastTemplateSyncTime,
	mergeTemplatesToRealm,
	removeTemplatesFromRealm,
} from "../database/realmTemplateFunctions";

import firestore from "@react-native-firebase/firestore";

const templatesCollection = firestore().collection("templates");

export const listenToTemplateChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastTemplateSyncTime(realm);

	console.log("lastSynced", lastSynced);
	console.log("userId", userId);
	const unsubscribe = templatesCollection
		.where("userId", "==", userId)
		.where("updatedAt", ">", lastSynced)
		.where("deletedAt", "==", null)
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					onUpdate();
					return;
				}
				const newTemplates = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));

				realm.write(() => {
					mergeTemplatesToRealm(realm, newTemplates);
					updateLastTemplateSyncTime(realm);
				});

				// Call the onUpdate function to notify about the update
				onUpdate();
			},
			(error) => {
				console.error("Error fetching templates:", error);
				// Handle error here, if needed
			}
		);
	return unsubscribe;
};

export const listenToDeletedTemplateChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastTemplateSyncTime(realm);
	const effectiveLastSynced =
		lastSynced.getTime() === new Date(0).getTime()
			? new Date()
			: lastSynced;

	const unsubscribe = templatesCollection
		.where("userId", "==", userId)
		.where("deletedAt", ">", effectiveLastSynced)
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					onUpdate();
					return;
				}

				const deletedTemplates = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));

				realm.write(() => {
					const idsToDelete = deletedTemplates.map(
						(d) => d.deletedId
					);
					removeTemplatesFromRealm(realm, idsToDelete);
					updateLastTemplateSyncTime(realm);
				});

				// Call the onUpdate function to notify about the update
				onUpdate();
			},
			(error) => {
				console.error("Error fetching deleted templates:", error);
				// Handle error here, if needed
			}
		);

	return unsubscribe;
};

export const getTemplates = async (realm) => {
	try {
		const templates = realm.objects("Template");
		return templates;
	} catch (error) {
		console.error("Error getting templates:", error);
		return [];
	}
};

export const addTemplate = async (realm, template) => {
	try {
		await uploadTemplate(template);
		await setRealmTemplate(realm, template, "synced");
	} catch (e) {
		console.error("Error adding template:", e);
		template.syncStatus = "pending";
		await setRealmTemplate(realm, template, "pending");
	}
};
