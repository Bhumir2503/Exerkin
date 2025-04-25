import { createContext, useContext, useState, useEffect } from "react";

import { useUser } from "../UserContext";
import { useRealm } from "../RealmProvider";

import {
	getBlueprints,
	listenToBlueprintChanges,
	listenToDeletedBlueprintChanges,
} from "../../services/functions/blueprintFunctions";

const BlueprintStorageContext = createContext();

export const BlueprintStorageProvider = ({ children }) => {
	const { user } = useUser();
	const realm = useRealm();

	const [storedBlueprints, setStoredBlueprints] = useState(null);

	useEffect(() => {
		if (!user) return;

		const unsubscribe = listenToBlueprintChanges(
			realm,
			user.uid,
			async () => {
				const updatedTemplates = await getBlueprints(realm, user.uid);
				setStoredBlueprints(updatedTemplates);
			}
		);

		return () => {
			unsubscribe();
		};
	}, [user, realm]);

	useEffect(() => {
		if (!user) return;

		const unsubscribe = listenToDeletedBlueprintChanges(
			realm,
			user.uid,
			async () => {
				const updatedTemplates = await getBlueprints(realm, user.uid);
				setStoredBlueprints(updatedTemplates);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [user, realm]);

	// const removeTemplateFromStorage = (templateId) => {
	// 	if (!storedBlueprints) return;
	// 	if (!user) return;
	// 	try {
	// 		deleteTemplate(realm, templateId);
	// 		const updatedTemplates = getBlueprints(realm, user.uid);
	// 		setStoredBlueprints(updatedTemplates);
	// 	} catch (error) {
	// 		console.error("Failed to delete template:", error);
	// 	}
	// };

	return (
		<BlueprintStorageContext.Provider
			value={{
				storedBlueprints,
				setStoredBlueprints,
			}}
		>
			{children}
		</BlueprintStorageContext.Provider>
	);
};

export const useBlueprintStorage = () => {
	const context = useContext(BlueprintStorageContext);
	if (!context) {
		throw new Error(
			"useBlueprintStorage must be used within a BlueprintStorageProvider"
		);
	}
	return context;
};
