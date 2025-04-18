import React, { createContext, useContext, useState } from "react";

const WorkoutNotesContext = createContext();

export const WorkoutNotesProvider = ({ children }) => {
	const [workoutNotes, setWorkoutNotes] = useState("");

	return (
		<WorkoutNotesContext.Provider value={{ workoutNotes, setWorkoutNotes }}>
			{children}
		</WorkoutNotesContext.Provider>
	);
};

export const useWorkoutNotes = () => useContext(WorkoutNotesContext);
