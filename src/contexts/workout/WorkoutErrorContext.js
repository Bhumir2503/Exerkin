import React, { createContext, useContext, useState } from "react";

const WorkoutErrorContext = createContext();

export const WorkoutErrorProvider = ({ children }) => {
    const [workoutError, setWorkoutError] = useState("");

    return (
        <WorkoutErrorContext.Provider value={{ workoutError, setWorkoutError }}>
            {children}
        </WorkoutErrorContext.Provider>
    );
};

export const useWorkoutError = () => useContext(WorkoutErrorContext);
