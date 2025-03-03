// contexts/WorkoutContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import storage from "../utils/storage";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {




	return (
		<WorkoutContext.Provider
			value={{

			}}
		>
			{children}
		</WorkoutContext.Provider>
	);
};

export const useWorkout = () => useContext(WorkoutContext);
