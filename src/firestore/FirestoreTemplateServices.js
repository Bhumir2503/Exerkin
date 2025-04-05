import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const templateCollection = firestore().collection("templates");
const deletedTemplateCollection = firestore().collection("deletedTemplates");

export const getTemplateFromFirestore = async (userId, lastSynced) => {
	try {
		const syncTimestamp =
			lastSynced || firestore.Timestamp.fromDate(new Date(0));

		const snapshot = await templateCollection
			.where("userId", "==", userId)
			.where("uploadedAt", ">", syncTimestamp)
			.get();

		console.log(
			"(FirestoreTemplateServices) - Retrieved documents count:",
			snapshot.size
		);

		if (snapshot.empty) {
			console.log(
				"(FirestoreTemplateServices) - No matching documents found"
			);
			return [];
		}

		const templates = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));

		return templates;
	} catch (error) {
		console.error(
			"(FirestoreTemplateServices) - Error getting documents:",
			error
		);
		return [];
	}
};

export const getDeletedTemplateFromFirestore = async (userId, lastSynced) => {
	try {
		const snapshot = await deletedTemplateCollection
			.where("userId", "==", userId)
			.where("uploadedAt", ">", lastSynced)
			.get();

		console.log(
			"(FirestoreTemplateServices) - Retrieved deleted documents count:",
			snapshot.size
		);

		if (snapshot.empty) {
			console.log(
				"(FirestoreTemplateServices) - No matching documents found"
			);
			return [];
		}

		const templates = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));

		return templates;
	} catch (error) {
		console.error(
			"(FirestoreTemplateServices) - Error getting documents:",
			error
		);
		return [];
	}
};

export const getUpdatedTemplateFromFirestore = async (userId, lastSynced) => {
	try {
		const snapshot = await templateCollection
			.where("userId", "==", userId)
			.where("updatedAt", ">", lastSynced)
			.get();

		console.log(
			"(FirestoreTemplateServices) - Retrieved updated documents count:",
			snapshot.size
		);

		if (snapshot.empty) {
			console.log(
				"(FirestoreTemplateServices) - No matching documents found"
			);
			return [];
		}

		const templates = snapshot.docs.map((doc) => ({
			...doc.data(),
			id: doc.id,
		}));

		return templates;
	} catch (error) {
		console.error(
			"(FirestoreTemplateServices) - Error getting documents:",
			error
		);
		return [];
	}
};

export const addTemplateToFirestore = async (template) => {
	try {
		await templateCollection.doc(template.id).set(template);
	} catch (error) {
		throw error;
	}
};
