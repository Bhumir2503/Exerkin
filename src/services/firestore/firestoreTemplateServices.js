import firestore from "@react-native-firebase/firestore";

const templatesCollection = firestore().collection("templates");

export const uploadTemplate = async (template) => {
    console.log(
        "(FirestoreTemplateServices) - Uploading template to Firestore:",
        template
    );
	try {
		await templatesCollection
			.doc(template.templateId)
			.set({ ...template, updatedAt: new Date() });
	} catch (error) {
		console.error(
			"(FirestoreTemplateServices) - Error uploading template:",
			error
		);
	}
};
