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
	const [unitSystem, setUnitSystem] = useState(
        user?.unitSystem || "imperial"
	);
    const templateIdRef = useRef(null);
    const isTemplateRef = useRef(false);
    const formTypeRef = useRef(null);

    const resetWorkoutMeta = () => {
        workoutIdRef.current = null;
        workoutStartTimeRef.current = null;
        workoutEndTimeRef.current = null;
        workoutCreatedAtRef.current = null;
        setImageURL(null);
        setUnitSystem(user?.unitSystem || "imperial");
        templateIdRef.current = null;
        isTemplateRef.current = false;
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
                unitSystem,
                setUnitSystem,
                templateIdRef,
                isTemplateRef,
                formTypeRef,

                resetWorkoutMeta,

			}}
		>
			{children}
		</WorkoutMetaContext.Provider>
	);
};

export const useWorkoutMeta = () => useContext(WorkoutMetaContext);
