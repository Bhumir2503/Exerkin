import { getTemplateCache, setTemplateCache, addTemplateToCache, removeTemplateFromCache } from "../cache/templateCache";
import {
	getTemplateFromFirestore,
	getDeletedTemplateFromFirestore,
    addTemplateToFirestore,
    addDeletedTemplateToFirestore,
    removeTemplateFromFirestore,
} from "../firestore/FirestoreTemplateServices";

import firestore from "@react-native-firebase/firestore";

// Helper function to ensure workout timestamps are proper Firestore timestamps
const formatWorkoutTimestamps = (workout) => {
	// Create a copy of the workout to avoid modifying the original
	const formattedWorkout = { ...workout };

	// Format timestamps if they exist
	if (formattedWorkout.completedAt) {
		formattedWorkout.completedAt = convertToFirestoreTimestamp(
			formattedWorkout.completedAt
		);
	}

	if (formattedWorkout.updatedAt) {
		formattedWorkout.updatedAt = convertToFirestoreTimestamp(
			formattedWorkout.updatedAt
		);
	}

	if (formattedWorkout.startedAt) {
		formattedWorkout.startedAt = convertToFirestoreTimestamp(
			formattedWorkout.startedAt
		);
	}

	// Always set uploadedAt to current time for syncing
	formattedWorkout.uploadedAt = firestore.Timestamp.now();

	return formattedWorkout;
};

// Helper function to convert any timestamp-like object to a proper Firestore timestamp
const convertToFirestoreTimestamp = (timestamp) => {
	// If it's already a Firestore timestamp, return it
	if (timestamp && typeof timestamp.toDate === "function") {
		return timestamp;
	}

	// If it has seconds property (serialized Firestore timestamp)
	if (timestamp && timestamp.seconds) {
		return firestore.Timestamp.fromDate(new Date(timestamp.seconds * 1000));
	}

	// If it's a Date object
	if (timestamp instanceof Date) {
		return firestore.Timestamp.fromDate(timestamp);
	}

	// If it's a number (milliseconds since epoch)
	if (typeof timestamp === "number") {
		return firestore.Timestamp.fromDate(new Date(timestamp));
	}

	// If it's a string (ISO date string)
	if (typeof timestamp === "string") {
		return firestore.Timestamp.fromDate(new Date(timestamp));
	}

	// Default: return current timestamp
	return firestore.Timestamp.now();
};

export const syncTempalates = (async) => {};

export const retrieveTemplates = async (userId) => {
	let templateCache = await getTemplateCache();
	if (!templateCache || templateCache.length === 0) {
		console.log("(TemplateFunctions) - No templates found in cache");
		templateCache = {
			lastSynced: firestore.Timestamp.fromDate(new Date(0)),
			templates: [],
		};
	}

	templateCache.lastSynced = convertToFirestoreTimestamp(
		templateCache.lastSynced
	);

	try {
		const newTemplates = await getTemplateFromFirestore(
			userId,
			templateCache.lastSynced
		);

		const deletedTemplates = await getDeletedTemplateFromFirestore(
			userId,
			templateCache.lastSynced
		);

		console.log(
			"(TemplateFunctions) - Retrieved documents count:",
			newTemplates.length
		);
		console.log(
			"(TemplateFunctions) - Retrieved deleted documents count:",
			deletedTemplates.length
		);

		if (
			(newTemplates && newTemplates.length > 0) ||
			(deleteTemplate && deletedTemplates.length > 0)
		) {
            const templateMap = new Map();

            templateCache.templates.forEach((template) => {
                templateMap.set(template.id, template);
            });

            if(newTemplates && newTemplates.length > 0) {
                newTemplates.forEach((template) => {
                    templateMap.set(template.id, formatWorkoutTimestamps(template));
                });
            }

            if(deletedTemplates && deletedTemplates.length > 0) {
                deletedTemplates.forEach((template) => {
                    templateMap.delete(template.id);
                });
            }   

            const updatedTemplates = Array.from(templateMap.values());

            templateCache.templates = updatedTemplates;
            templateCache.lastSynced = firestore.Timestamp.now();

            await setTemplateCache(templateCache);

            return updatedTemplates;
		}
	} catch (e) {}
};

export const addTemplate = async (template) => {
    await addTemplateToCache(template, template.uploadedAt);

    try{
        await addTemplateToFirestore(template);
    }
    catch (e) {
        console.log(e);
        // !TODO Come back and handle this error by moving it to a sync cache for templates
    }
};

export const deleteTemplate = async (template) => {
    await removeTemplateFromCache(template.id, template.deletedAt );

    try {
        await removeTemplateFromFirestore(template.id);
    } catch (e) {
        console.log(e);
        // !TODO Come back and handle this error by moving it to a sync cache for templates
    }

    try {
        await addDeletedTemplateToFirestore(template);
    } catch (e) {
        console.log(e);
        // !TODO Come back and handle this error by moving it to a sync cache for templates
    }

};

export const updateTemplate = async (template) => {};
