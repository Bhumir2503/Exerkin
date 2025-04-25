import { useBlueprintTitle } from "../contexts/blueprint/BlueprintTitleContext";
import { useBlueprintNotes } from "../contexts/blueprint/BlueprintNotesContext";
import { useBlueprintExercises } from "../contexts/blueprint/BlueprintExercisesContext";
import { useBlueprintStorage } from "../contexts/blueprint/BlueprintStorageContext";
import { useBlueprintMeta } from "../contexts/blueprint/BlueprintMetaContext";

import { useUser } from "../contexts/UserContext";
import { useRealm } from "../contexts/RealmProvider";
import { addBlueprint, getBlueprints } from "../services/functions/blueprintFunctions";

import { buildBlueprintObject } from "../services/helpers/objectBuilder";

import uuid from "react-native-uuid";

export const useBlueprintSession = () => {
	const realm = useRealm();
	const { user } = useUser();
	const { blueprintTitle, setBlueprintTitle } = useBlueprintTitle();
	const { blueprintNotes, setBlueprintNotes } = useBlueprintNotes();
	const { blueprintExercises, setBlueprintExercises, clearExercises } =
		useBlueprintExercises();
	const { setStoredBlueprints } = useBlueprintStorage();
	const { blueprintIdRef } = useBlueprintMeta();

	const blueprintStart = () => {
		clearExercises();
		blueprintIdRef.current = uuid.v4();
		console.log("Blueprint started, " + blueprintIdRef.current);
	};

	const blueprintFinish = async () => {
		const blueprintObject = buildBlueprintObject({
			userId: user.uid,
			blueprintId: blueprintIdRef.current,
			blueprintTitle: blueprintTitle,
			blueprintNotes: blueprintNotes,
			blueprintExercises: blueprintExercises,
			unitSystem: "imperial",
		});

		try {
			await addBlueprint(realm, blueprintObject);
			const updatedBlueprints = await getBlueprints(realm, user.uid);
			setStoredBlueprints(updatedBlueprints);
		} catch (error) {
			console.error("Error adding blueprint:", error);
		}
		blueprintCancel();
	};

	const blueprintCancel = () => {
		setBlueprintTitle("");
		setBlueprintNotes("");
		setBlueprintExercises([]);
	};

	return {
		blueprintStart,
		blueprintFinish,
		blueprintCancel,
	};
};
