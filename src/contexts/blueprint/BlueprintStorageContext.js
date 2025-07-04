import { createContext, useContext, useState, useEffect } from "react";

import { useUser } from "../UserContext";
import {
	listenToBlueprintChanges,
	deleteBlueprintFromFirestore,
} from "../../services/firestore/firestoreBlueprintServices";

const BlueprintStorageContext = createContext();

export const BlueprintStorageProvider = ({ children }) => {
	const { userId } = useUser();

	const [storedBlueprints, setStoredBlueprints] = useState(null);

	useEffect(() => {
		if (!userId) return;

		const unsubscribe = listenToBlueprintChanges(
			userId,
			setStoredBlueprints
		);

		return () => {
			unsubscribe();
		};
	}, [userId]);

	const removeBlueprintFromStorage = async (blueprintId) => {
		try {
			await deleteBlueprintFromFirestore(blueprintId);
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
