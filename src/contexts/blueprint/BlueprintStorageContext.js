import { createContext, useContext, useState, useEffect } from "react";

import { useUser } from "../UserContext";
import { useRealm } from "../RealmProvider";
import {
	getTemplates,
	listenToDeletedTemplateChanges,
	listenToTemplateChanges,
	deleteTemplate,
} from "../../services/functions/templateFunctions";

const BlueprintStorageContext = createContext();

export const BlueprintStorageProvider = ({ children }) => {
	const { user } = useUser();
	const realm = useRealm();

	const [storedBlueprints, setStoredBlueprints] = useState(null);

	useEffect(() => {
		if (!user) return;

		const unsubscribe = listenToTemplateChanges(
			realm,
			user.uid,
			async () => {
				const updatedTemplates = await getTemplates(realm, user.uid);
				setStoredBlueprints(updatedTemplates);
			}
		);

		return () => {
			unsubscribe();
		};
	}, [user, realm]);

	useEffect(() => {
		if (!user) return;

		const unsubscribe = listenToDeletedTemplateChanges(
			realm,
			user.uid,
			async () => {
				const updatedTemplates = await getTemplates(realm, user.uid);
				setStoredBlueprints(updatedTemplates);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [user, realm]);

	const removeTemplateFromStorage = (templateId) => {
		if (!storedBlueprints) return;
		if (!user) return;
		try {
			deleteTemplate(realm, templateId);
			const updatedTemplates = getTemplates(realm, user.uid);
			setStoredBlueprints(updatedTemplates);
		} catch (error) {
			console.error("Failed to delete template:", error);
		}
	};

	return (
		<BlueprintStorageContext.Provider
			value={{
				storedBlueprints,
				setStoredBlueprints,
				removeTemplateFromStorage,
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
