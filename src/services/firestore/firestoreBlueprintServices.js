import firestore from "@react-native-firebase/firestore";

const blueprintsCollection = firestore().collection("blueprints");

export const uploadBlueprintToFirestore = async (blueprint) => {
	console.log(
		"(FirestoreBlueprintServices) - Uploading blueprint to Firestore:",
		blueprint
	);
	try {
		await blueprintsCollection.doc(blueprint.blueprintId).set({
			...blueprint,
			updatedAt: firestore.FieldValue.serverTimestamp(),
		});
	} catch (error) {
		console.error(
			"(FirestoreBlueprintServices) - Error uploading blueprint:",
			error
		);
	}
};


export const removeBlueprintFromFirestore = async (blueprintId) => {
    try {
        await blueprintsCollection.doc(blueprintId).set(
            {
                deleted: true,
                deletedAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    } catch (error) {
        console.error(
            "(FirestoreBlueprintServices) - Error removing blueprint:",
            error
        );
    }
}