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
		console.log(
			"(FirestoreTemplateServices) - Adding template to Firestore:",
			template
		);
		await templateCollection.doc(template.id).set(template);
	} catch (error) {
		console.log("(FirestoreTemplateServices) - Error adding template:", error);
		throw error;
		
	}
};

export const addDeletedTemplateToFirestore = async (template) => {
	try {
		await deletedTemplateCollection.doc(template.id).set({
			templateId: template.id,
			userId: template.userId,
			deletedAt: template.deletedAt,
			uploadedAt: firestore.Timestamp.now(),
		});
	} catch (error) {
		throw error;
	}
}

export const deleteTemplateFromFirestore = async (templateId) => {
	try {
		await templateCollection.doc(templateId).delete();
	} catch (error) {
		throw error;
	}
}

