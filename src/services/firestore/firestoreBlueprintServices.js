import firestore from "@react-native-firebase/firestore";
const blueprintsCollection = firestore().collection("blueprints");

/*
 * Function to listen to blueprint changes in Firestore
 *
 * @param {string} userId - The ID of the user whose blueprints are being listened to
 * @param {function} setBlueprints - Function to update the blueprints state
 * @returns {function} - Unsubscribe function to stop listening to changes
 */
export const listenToBlueprintChanges = (userId, setBlueprints) => {
	const unsubscribe = blueprintsCollection
		.where("userId", "==", userId)
		.orderBy("createdAt", "desc")
		.onSnapshot(
			(snapshot) => {
				if (!snapshot || snapshot.empty) {
					console.log(
						"(FirestoreBlueprintServices) - No blueprints found for user:",
						userId
					);
					setBlueprints([]); // If no blueprints found, set empty list
					return;
				}
				console.log(
					"(FirestoreBlueprintServices) - Blueprints fetched for user:",
					userId,
					"- Count:",
					snapshot.docs.length
				);

				const newBlueprints = snapshot.docs.map((doc) => ({
					...doc.data(),
				}));
				setBlueprints(newBlueprints);
			},
			(error) => {
				console.error("Error fetching blueprints:", error);
			}
		);

	return unsubscribe;
};

/*
 * Function to save a blueprint in Firestore
 *
 * @param {Object} blueprint - The blueprint object to be saved
 * @throws {Error} - Throws an error if the blueprint ID is not provided or if there is an issue saving the blueprint
 */
export const saveBlueprintInFirestore = async (blueprint) => {
	if (!blueprint.blueprintId) {
		throw new Error("Blueprint ID is required to save the blueprint.");
	}

	try {
		await blueprintsCollection.doc(blueprint.blueprintId).set(blueprint);
		console.log(
			"(FirestoreBlueprintServices) - Blueprint saved successfully:",
			blueprint.blueprintId
		);
	} catch (error) {
		console.error(
			"(FirestoreBlueprintServices) - Error saving blueprint:",
			error
		);
		throw new Error("Error saving blueprint: " + error.message);
	}
};

/*
 * Function to update a blueprint in Firestore
 *
 * @param {Object} blueprint - The blueprint object to be updated
 * @throws {Error} - Throws an error if the blueprint ID is not provided or if there is an issue updating the blueprint
 */
export const updateBlueprintInFirestore = async (blueprint) => {
	if (!blueprint.blueprintId) {
		throw new Error("Blueprint ID is required to update the blueprint.");
	}

	try {
		await blueprintsCollection.doc(blueprint.blueprintId).set(blueprint, {
			merge: true, // Use merge to update existing fields without overwriting the entire document
		});
		console.log(
			"(FirestoreBlueprintServices) - Blueprint updated successfully:",
			blueprint.blueprintId
		);
	} catch (error) {
		console.error(
			"(FirestoreBlueprintServices) - Error updating blueprint:",
			error
		);
		throw new Error("Error updating blueprint: " + error.message);
	}
};

/*
 * Function to delete a blueprint in Firestore
 *
 * @param {string} blueprintId - The ID of the blueprint to be deleted
 * @throws {Error} - Throws an error if the blueprint ID is not provided or if there is an issue deleting the blueprint
 */
export const deleteBlueprintFromFirestore = async (blueprintId) => {
	if (!blueprintId) {
		throw new Error("Blueprint ID is required to delete the blueprint.");
	}

	try {
		await blueprintsCollection.doc(blueprintId).delete();
		console.log(
			"(FirestoreBlueprintServices) - Blueprint deleted successfully:",
			blueprintId
		);
	} catch (error) {
		console.error(
			"(FirestoreBlueprintServices) - Error deleting blueprint:",
			error
		);
		throw new Error("Error deleting blueprint: " + error.message);
	}
};
