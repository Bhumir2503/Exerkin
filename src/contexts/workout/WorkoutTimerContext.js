import { createContext, useContext, useState, useEffect, useRef } from "react";
import { AppState } from "react-native";

const WorkoutTimerContext = createContext();

export const WorkoutTimerProvider = ({ children }) => {
	const [restDuration, setRestDuration] = useState(0);
	const [remainingRestTime, setRemainingRestTime] = useState(0);
	const [isResting, setIsResting] = useState(false);

	const restStartTimeRef = useRef(null);
	const intervalRef = useRef(null);
	const appState = useRef(AppState.currentState);

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState) => {
				appState.current = nextAppState;
			}
		);
		return () => subscription.remove();
	}, []);

	const updateRemainingTime = () => {
		if (!restStartTimeRef.current || !isResting) return;

		const now = Date.now();
		const elapsed = Math.floor((now - restStartTimeRef.current) / 1000);
		const timeLeft = Math.max(0, restDuration - elapsed);
		setRemainingRestTime(timeLeft);

		if (timeLeft === 0) stopRestTimer();
	};

	useEffect(() => {
		if (isResting) {
			updateRemainingTime(); // sync immediately
			intervalRef.current = setInterval(updateRemainingTime, 1000);
		}
		return () => clearInterval(intervalRef.current);
	}, [isResting]);

	const startRestTimer = (duration) => {
		const now = Date.now();
		restStartTimeRef.current = now;
		setRestDuration(duration);
		setRemainingRestTime(duration);
		setIsResting(true);
	};

	const stopRestTimer = () => {
		clearInterval(intervalRef.current);
		setIsResting(false);
		setRemainingRestTime(0);
		restStartTimeRef.current = null;
	};

	return (
		<WorkoutTimerContext.Provider
			value={{
				isResting,
				remainingRestTime,
				startRestTimer,
				stopRestTimer,
			}}
		>
			{children}
		</WorkoutTimerContext.Provider>
	);
};

export const useWorkoutTimer = () => useContext(WorkoutTimerContext);
