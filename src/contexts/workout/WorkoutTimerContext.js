import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
} from "react";
import { AppState } from "react-native";

const WorkoutTimerContext = createContext();

export const WorkoutTimerProvider = ({ children }) => {
	// this is the duration of the workout in seconds
	const [workoutTimer, setWorkoutTimer] = useState(0);

	const [restDuration, setRestDuration] = useState(0); // total rest time (e.g., 30s)
	const [isResting, setIsResting] = useState(false);
	const [remainingRestTime, setRemainingRestTime] = useState(0);
	const [appState, setAppState] = useState(AppState.currentState);

	const restStartTimeRef = useRef(null);
	const intervalRef = useRef(null);
	const lastSetTimeRef = useRef(Date.now());

	// Track app focus/background
	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState) => {
				setAppState(nextAppState);
			}
		);

		return () => subscription.remove();
	}, []);

	// Background-safe rest countdown with support for timer adjustments
	useEffect(() => {
		if (!isResting || !restStartTimeRef.current) return;

		const updateRemaining = () => {
			const now = Date.now();
			// Calculate elapsed time since the timer started or was last adjusted
			const elapsed = Math.floor((now - restStartTimeRef.current) / 1000);
			const timeLeft = Math.max(0, restDuration - elapsed);
			setRemainingRestTime(timeLeft);

			if (timeLeft === 0) stopRestTimer();
		};

		updateRemaining(); // Immediately update once
		intervalRef.current = setInterval(updateRemaining, 1000);

		return () => clearInterval(intervalRef.current);
	}, [isResting, restDuration]);

	// Watch for changes to remainingRestTime and update the timer accordingly
	useEffect(() => {
		if (isResting) {
			// If remainingRestTime was manually adjusted
			const now = Date.now();
			if (now - lastSetTimeRef.current > 100) {
				// Threshold to avoid loops
				// Recalculate start time based on new remaining time
				const newStartTime =
					now - (restDuration - remainingRestTime) * 1000;
				restStartTimeRef.current = newStartTime;
				lastSetTimeRef.current = now;
			}
		}
	}, [remainingRestTime]);

	const startRestTimer = (duration) => {
		const now = Date.now();
		restStartTimeRef.current = now;
		lastSetTimeRef.current = now;
		setRestDuration(duration);
		setRemainingRestTime(duration);
		setIsResting(true);
	};

	const stopRestTimer = () => {
		setRemainingRestTime(0);
		setIsResting(false);
		restStartTimeRef.current = null;
		clearInterval(intervalRef.current);
	};

	return (
		<WorkoutTimerContext.Provider
			value={{
				workoutTimer,
				setWorkoutTimer,
				isResting,
				setIsResting,
				restDuration,
				setRestDuration,
				remainingRestTime,
				setRemainingRestTime,
				startRestTimer,
				stopRestTimer,
			}}
		>
			{children}
		</WorkoutTimerContext.Provider>
	);
};

export const useWorkoutTimer = () => useContext(WorkoutTimerContext);
