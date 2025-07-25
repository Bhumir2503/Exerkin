import { createContext, useContext, useState } from "react";

const WorkoutImageContext = createContext();

export const WorkoutImageProvider = ({ children }) => {
	const [workoutImageURL, setWorkoutImageURL] = useState(null);

	return (
		<WorkoutImageContext.Provider
			value={{ workoutImageURL, setWorkoutImageURL }}
		>
			{children}
		</WorkoutImageContext.Provider>
	);
};

export const useWorkoutImage = () => useContext(WorkoutImageContext);
