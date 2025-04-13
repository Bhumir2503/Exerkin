import React, {
	createContext,
	useState,
	useContext,
	useRef,
	useEffect,
} from "react";

import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

import {
	addTemplate,
	getTemplates,
	listenToDeletedTemplateChanges,
	listenToTemplateChanges,
} from "../services/functions/templateFunctions";

import { useUser } from "./UserContext";
import { useRealm } from "./RealmProvider";
import { buildTemplateObject } from "../services/helpers/objectBuilder";

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
	const { user } = useUser();
	const realm = useRealm();

	const TemplateId = useRef(null);
	const [storedTemplate, setStoredTemplate] = useState([]);
	const [templateExercises, setTemplateExercises] = useState([]);
	const unitSystem = useRef(user?.unitSystem || "imperial");

	const TemplateTitle = useRef("");
	const TemplateNote = useRef("");

	useEffect(() => {
		if (!user) return;

		const unsubscribe = listenToTemplateChanges(
			realm,
			user.uid,
			async () => {
				const updatedTemplates = await getTemplates(realm, user.uid);
				setStoredTemplate(updatedTemplates);
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
				setStoredTemplate(updatedTemplates);
			}
		);
		return () => {
			unsubscribe();
		};
	}, [user, realm]);

	const templateStarted = () => {
		setTemplateExercises([]);
		TemplateId.current = uuid.v4();
	};

	const cancelTemplate = async () => {
		setTemplateExercises([]);
		TemplateTitle.current = "";
		TemplateNote.current = "";
	};

	const saveTemplate = async () => {
		const template = buildTemplateObject(
			TemplateId.current,
			user.uid,
			TemplateTitle.current,
			TemplateNote.current,
			templateExercises,
			unitSystem.current,
			"synced"
		);

		addTemplate(realm, template);
		cancelTemplate();
	};

	const addExerciseToTemplate = (exercise) => {
		setTemplateExercises((prevExercises) => [
			...prevExercises,
			{ ...exercise },
		]);
	};

	const addSetToTemplateExercise = (exerciseId, set) => {
		setTemplateExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.exerciseId === exerciseId
					? { ...exercise, sets: [...exercise.sets, set] }
					: exercise
			)
		);
	};

	const updateSetInTemplateExercise = (exerciseId, index, set) => {
		setTemplateExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.exerciseId === exerciseId
					? {
							...exercise,
							sets: exercise.sets.map((s, i) =>
								i === index ? { ...s, ...set } : s
							),
					  }
					: exercise
			)
		);
	};

	const removeSetFromTemplateExercise = (exerciseId, index) => {
		setTemplateExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.exerciseId === exerciseId
					? {
							...exercise,
							sets: exercise.sets.filter((_, i) => i !== index),
					  }
					: exercise
			)
		);
	};

	return (
		<TemplateContext.Provider
			value={{
				TemplateId,
				storedTemplate,
				setStoredTemplate,
				templateExercises,
				setTemplateExercises,
				TemplateTitle,
				TemplateNote,

				templateStarted,
				saveTemplate,
				cancelTemplate,
				addExerciseToTemplate,
				addSetToTemplateExercise,
				updateSetInTemplateExercise,
				removeSetFromTemplateExercise,
			}}
		>
			{children}
		</TemplateContext.Provider>
	);
};

export const useTemplate = () => useContext(TemplateContext);
