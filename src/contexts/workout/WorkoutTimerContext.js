import React, { createContext, useContext, useState } from "react";

const WorkoutTimerContext = createContext();

export const WorkoutTimerProvider = ({ children }) => {
	const [workoutTimer, setWorkoutTimer] = useState(0);

	return (
		<WorkoutTimerContext.Provider value={{ workoutTimer, setWorkoutTimer }}>
			{children}
		</WorkoutTimerContext.Provider>
	);
};

export const useWorkoutTimer = () => useContext(WorkoutTimerContext);
