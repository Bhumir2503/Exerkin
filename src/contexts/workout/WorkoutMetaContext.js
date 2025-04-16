import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { useUser } from "../contexts/UserContext";

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
			}}
		>
			{children}
		</WorkoutMetaContext.Provider>
	);
};

export const useWorkoutMeta = () => useContext(WorkoutMetaContext);
