import firestore from "@react-native-firebase/firestore";

const blueprintCollection = firestore().collection("blueprints");
import {
	getLastBlueprintSyncTime,
	updateLastBlueprintSyncTime,
	mergeBlueprintsToRealm,
	removeBlueprintFromRealm,
	removeMultipleBlueprintFromRealm,
	addBlueprintToRealm,
} from "../database/realmBlueprintFunction";

import {
	uploadBlueprintToFirestore,
	removeBlueprintFromFirestore,
} from "../firestore/firestoreBlueprintServices";

export const getBlueprints = async (realm) => {
	try {
		const blueprints = realm.objects("Blueprint").sorted("createdAt", true);
		return blueprints;
	} catch (error) {
		console.error("Error fetching blueprints:", error);
		return [];
	}
};

export const addBlueprint = async (realm, blueprint) => {
	addBlueprintToRealm(realm, blueprint, "unsynced");
	try {
		uploadBlueprintToFirestore(blueprint);
	} catch (error) {
		console.error("Error uploading blueprint to Firestore:", error);
	}
};

export const deleteBlueprint = async (realm, blueprintId) => {
	removeBlueprintFromRealm(realm, blueprintId);
	try {
		await removeBlueprintFromFirestore(blueprintId);
	} catch (error) {
		console.error("Error removing blueprint from Firestore:", error);
	}
};

export const listenToBlueprintChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastBlueprintSyncTime(realm);

	const unsubscribe = blueprintCollection
		.where("userId", "==", userId)
		.where("updatedAt", ">", lastSynced)
		.where("deleted", "==", false)
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log(
						"No new blueprints found. -- 1 Read from firestore"
					);
					onUpdate();
					return;
				}
				console.log("New blueprints found.  -- Reads from Firestore");
				const newBlueprints = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));

				realm.write(() => {
					mergeBlueprintsToRealm(realm, newBlueprints);
					updateLastBlueprintSyncTime(realm);
				});

				onUpdate();
			},
			(error) => {
				console.error("Error fetching blueprints:", error);
			}
		);
	return unsubscribe;
};

export const listenToDeletedBlueprintChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastBlueprintSyncTime(realm);
	const effectiveLastSynced =
		lastSynced.getTime() === new Date(0).getTime()
			? new Date()
			: lastSynced;

	const unsubscribe = blueprintCollection
		.where("userId", "==", userId)
		.where("deletedAt", ">", effectiveLastSynced)
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log(
						"No deleted blueprints found. -- 1 Read from firestore"
					);
					onUpdate();
					return;
				}
				console.log("Deleted blueprints found.");
				const deletedBlueprints = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));

				realm.write(() => {
					const idsToDelete = deletedBlueprints.map(
						(blueprint) => blueprint.blueprintId
					);

					removeMultipleBlueprintFromRealm(realm, idsToDelete);
					updateLastBlueprintSyncTime(realm);
				});

				onUpdate();
			},
			(error) => {
				console.error("Error fetching deleted blueprints:", error);
			}
		);
	return unsubscribe;
};
