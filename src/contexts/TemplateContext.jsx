import React, {
	createContext,
	useState,
	useContext,
    useRef,
} from "react";

import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

import { addTemplate } from "../utils/TemplateFuntions";


import { useUser } from "./UserContext";

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
	const [init, setInit] = useState(false);
	const { user } = useUser();

    const TemplateId = useRef(null);
    const [storedTemplate, setStoredTemplate] = useState([]);
    const [templateExercises, setTemplateExercises] = useState([]);

    const TemplateTitle = useRef("");
    const TemplateNote = useRef("");
    const TemplateStartTime = useRef(null);

    const templateStarted = () => {
        setTemplateExercises([]);
        TemplateStartTime.current = firestore.Timestamp.now();
        TemplateId.current = uuid.v4()
    }

    const saveTemplate = async () => {
        // check if there is something to sync to firestore 

        // create the tempalate exercise object
        if(templateExercises.length === 0) {
            console.log("(TemplateContext) - No exercises to save");
            return;
        }

        if(TemplateTitle.current === "") {
            TemplateTitle.current = "Untitled Blueprint";
        }
        if(TemplateNote.current === "") {
            TemplateNote.current = "No notes";
        }

        const template = {
            id: TemplateId.current,
            title: TemplateTitle.current,
            note: TemplateNote.current,
            exercises: templateExercises,
            createdAt: firestore.Timestamp.now(),
            updatedAt: firestore.Timestamp.now(),
            uploadedAt: firestore.Timestamp.now(),
            userId: user.uid,
        }

        // add to stored template
        setStoredTemplate((prevTemplates) => [...prevTemplates, template]);
        //add to cache and firestore
        await addTemplate(template);

        //reset the useStates
        cancelTemplate(); 
    }

    const cancelTemplate = async () => {
        setTemplateExercises([]);
        TemplateTitle.current = "";
        TemplateNote.current = "";
        TemplateStartTime.current = null;
    }

    const addExerciseToTemplate = (exercise) => {
        setTemplateExercises((prevExercises) => [...prevExercises, exercise]);
    }

    const addSetToTemplateExercise = (exerciseId, set) => {
        setTemplateExercises((prevExercises) =>
            prevExercises.map((exercise) =>
                exercise.id === exerciseId
                    ? { ...exercise, sets: [...exercise.sets, set] }
                    : exercise
            )
        );
    };

    const updateSetInTemplateExercise = (exerciseId, index, set) => {
        setTemplateExercises((prevExercises) =>
            prevExercises.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.map((s, i) =>
                            i === index ? { ...s, ...set } : s
                        ),
                    }
                    : exercise
            )
        );
    }

    const removeSetFromTemplateExercise = (exerciseId, index) => {
        setTemplateExercises((prevExercises) =>
            prevExercises.map((exercise) =>
                exercise.id === exerciseId
                    ? {
                        ...exercise,
                        sets: exercise.sets.filter((_, i) => i !== index),
                    }
                    : exercise
            )
        );
    }



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
                TemplateStartTime,

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
