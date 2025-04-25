import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useUser } from "../UserContext";

const WorkoutMetaContext = createContext();

export const WorkoutMetaProvider = ({ children }) => {
	const { user } = useUser();

    useEffect(() => {
        if (user) {
            setUnitSystem(user.unitSystem);
        }
    }
    , [user]);

	const workoutIdRef = useRef(null);
    const workoutStartTimeRef = useRef(null);
    const workoutEndTimeRef = useRef(null);
    const workoutCreatedAtRef = useRef(null);
	const [imageURL, setImageURL] = useState(null);
    const [base64Image, setBase64Image] = useState(null); //for realm right now
	const [unitSystem, setUnitSystem] = useState(
        user?.unitSystem || "imperial"
	);
    const blueprintIdRef = useRef(null);
    const isBlueprintRef = useRef(false);
    const formTypeRef = useRef(null);

    const resetWorkoutMeta = () => {
        workoutIdRef.current = null;
        workoutStartTimeRef.current = null;
        workoutEndTimeRef.current = null;
        workoutCreatedAtRef.current = null;
        setImageURL(null);
        setBase64Image(null);
        setUnitSystem(user?.unitSystem || "imperial");
        blueprintIdRef.current = null;
        isBlueprintRef.current = false;
        formTypeRef.current = null;
    }


	return (
		<WorkoutMetaContext.Provider
			value={{
                workoutIdRef,
                workoutStartTimeRef,
                workoutEndTimeRef,
                workoutCreatedAtRef,
                imageURL,
                setImageURL,
                base64Image,
                setBase64Image,
                unitSystem,
                setUnitSystem,
                blueprintIdRef,
                isBlueprintRef,
                formTypeRef,

                resetWorkoutMeta,

			}}
		>
			{children}
		</WorkoutMetaContext.Provider>
	);
};

export const useWorkoutMeta = () => useContext(WorkoutMetaContext);
