import { useBlueprintTitle } from "../contexts/blueprint/BlueprintTitleContext";
import { useBlueprintNotes } from "../contexts/blueprint/BlueprintNotesContext";
import { useBlueprintExercises } from "../contexts/blueprint/BlueprintExercisesContext";
import { useBlueprintStorage } from "../contexts/blueprint/BlueprintStorageContext";
import { useBlueprintMeta } from "../contexts/blueprint/BlueprintMetaContext";

import { useUser } from "../contexts/UserContext";
import { useRealm } from "../contexts/RealmProvider";
import { addBlueprint } from "../services/functions/blueprintFunctions";

import { buildBlueprintObject } from "../services/helpers/objectBuilder";

import uuid from "react-native-uuid";

export const useBlueprintSession = () => {
	const realm = useRealm();
	const { user } = useUser();
	const { blueprintTitle, setBlueprintTitle } = useBlueprintTitle();
	const { blueprintNotes, setBlueprintNotes } = useBlueprintNotes();
	const { blueprintExercises, setBlueprintExercises, clearExercises } =
		useBlueprintExercises();
	const { setBlueprintStorage } = useBlueprintStorage();
	const { blueprintIdRef, formTypeRef } = useBlueprintMeta();

	const blueprintStart = () => {
		clearExercises();
		blueprintIdRef.current = uuid.v4();
		formTypeRef.current = "blueprint";
	};

	const blueprintFinish = async () => {
		const blueprintObject = buildBlueprintObject({
			userId: user.uid,
			blueprintId: blueprintIdRef.current,
			blueprintTitle: blueprintTitle,
			blueprintNotes: blueprintNotes,
			blueprintExercises: blueprintExercises,
			unitSystem: user.unitSystem,
		});

		try {
			await addBlueprint(realm, blueprintObject);
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
