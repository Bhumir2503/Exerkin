import { useBlueprintTitle } from "../contexts/blueprint/BlueprintTitleContext";
import { useBlueprintNotes } from "../contexts/blueprint/BlueprintNotesContext";
import { useBlueprintExercises } from "../contexts/blueprint/BlueprintExercisesContext";
import { useBlueprintMeta } from "../contexts/blueprint/BlueprintMetaContext";

import { useUser } from "../contexts/UserContext";

import uuid from "react-native-uuid";
import { serverTimestamp } from "@react-native-firebase/firestore";
import { saveBlueprintInFirestore } from "../services/firestore/firestoreBlueprintServices";

export const useBlueprintSession = () => {
	const { userId, unitSystem } = useUser();
	const { blueprintTitle, setBlueprintTitle } = useBlueprintTitle();
	const { blueprintNotes, setBlueprintNotes } = useBlueprintNotes();
	const { blueprintExercises, setBlueprintExercises, clearExercises } =
		useBlueprintExercises();
	const { blueprintIdRef } = useBlueprintMeta();

	const getCurrentBlueprintObject = () => {
		return {
			userId: userId,
			blueprintId: blueprintIdRef.current,
			name: blueprintTitle || "Untitled Blueprint",
			notes: blueprintNotes,
			exercises: blueprintExercises,
			unitSystem: unitSystem,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		};
	};

	const startBlueprint = () => {
		clearExercises();
		blueprintIdRef.current = uuid.v4();
		console.log("Blueprint started, " + blueprintIdRef.current);
	};

	const finishBlueprint = async () => {
		const blueprintObject = getCurrentBlueprintObject();

		try {
			saveBlueprintInFirestore(blueprintObject);
		} catch (error) {
			console.error("Error adding blueprint:", error);
		}
		cancelBlueprint();
	};

	const cancelBlueprint = () => {
		setBlueprintTitle("");
		setBlueprintNotes("");
		setBlueprintExercises([]);
	};

	return {
		startBlueprint,
		finishBlueprint,
		cancelBlueprint,
	};
};
