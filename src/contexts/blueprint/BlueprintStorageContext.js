import { createContext, useContext, useState, useEffect } from "react";

import { useUser } from "../UserContext";
import { useRealm } from "../RealmProvider";

import {
	getBlueprints,
	deleteBlueprint,
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

	const removeBlueprintFromStorage = async (blueprintId) => {
		if (!storedBlueprints || !user) return;
		try {
			await deleteBlueprint(realm, blueprintId);
			const updatedBlueprints = await getBlueprints(realm, user.uid);
			setStoredBlueprints(updatedBlueprints);
		} catch (error) {
			console.error("Error removing blueprint from storage:", error);
		}
	};

	return (
		<BlueprintStorageContext.Provider
			value={{
				storedBlueprints,
				setStoredBlueprints,
				removeBlueprintFromStorage,
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
