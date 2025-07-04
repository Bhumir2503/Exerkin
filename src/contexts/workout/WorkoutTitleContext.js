import { createContext, useContext, useState } from "react";

const WorkoutTitleContext = createContext();

export const WorkoutTitleProvider = ({ children }) => {
	const [workoutTitle, setWorkoutTitle] = useState("");

	return (
		<WorkoutTitleContext.Provider value={{ workoutTitle, setWorkoutTitle }}>
			{children}
		</WorkoutTitleContext.Provider>
	);
};

export const useWorkoutTitle = () => useContext(WorkoutTitleContext);
