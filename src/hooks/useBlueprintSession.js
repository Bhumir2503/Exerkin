import { useBlueprintTitle } from "../contexts/blueprint/BlueprintTitleContext";
import { useBlueprintNotes } from "../contexts/blueprint/BlueprintNotesContext";
import { useBlueprintExercises } from "../contexts/blueprint/BlueprintExercisesContext";
import { useBlueprintStorage } from "../contexts/blueprint/BlueprintStorageContext";
import { useBlueprintMeta } from "../contexts/blueprint/BlueprintMetaContext";

import { useUser } from "../contexts/UserContext";

import uuid from "react-native-uuid";

export const useBlueprintSession = () => {
	const { user } = useUser();
	const { blueprintTitle, setBlueprintTitle } = useBlueprintTitle();
	const { blueprintNotes, setBlueprintNotes } = useBlueprintNotes();
	const { blueprintExercises, setBlueprintExercises, clearExercises } =
		useBlueprintExercises();
	const { blueprintStorage, setBlueprintStorage } = useBlueprintStorage();
	const { templateIdRef, blueprintCreatedAtRef, isTemplateRef, formTypeRef } =
		useBlueprintMeta();
};

    const blueprintStart = () => {
        clearExercises();
        templateIdRef.current = uuid.v4();
        blueprintCreatedAtRef.current = new Date();
        formTypeRef.current = "blueprint";
    };

    