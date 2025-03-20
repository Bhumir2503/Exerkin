import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, AppState } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

export const formatTime = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const sec = seconds % 60;
	let timeString = `${hrs.toString().padStart(2, "0")}:${mins
		.toString()
		.padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
	return timeString;
};

const WorkoutTimer = ({ visible }) => {
	const { WorkoutTimer, WorkoutStartTime } = useWorkout();

	const [displayTime, setDisplayTime] = useState("00:00:00");
	const [isRunning, setIsRunning] = useState(false);

	// Track timestamp for background calculation
	const lastTickRef = useRef(Date.now());
	const appStateRef = useRef(AppState.currentState);
	const intervalRef = useRef(null);

	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Initialize timer with elapsed time if WorkoutStartTime.current is provided
	useEffect(() => {
		if (WorkoutStartTime.current) {
			const now = Date.now();
			// Convert Firestore timestamp to milliseconds if needed
			const startTime = WorkoutStartTime.current.toMillis
				? WorkoutStartTime.current.toMillis()
				: WorkoutStartTime.current;
			const initialElapsedSeconds = Math.floor((now - startTime) / 1000);

			// Set the initial timeRef value
			WorkoutTimer.current = initialElapsedSeconds;
			setDisplayTime(formatTime(initialElapsedSeconds));
		}
	}, [WorkoutStartTime.current]);

	// Use visible prop to toggle isRunning state of the timer
	useEffect(() => {
		if (visible) {
			setIsRunning(true);
		} else {
			setIsRunning(false);
			if (!WorkoutStartTime.current) {
				// Only reset if not using a persistent WorkoutStartTime.current
				WorkoutTimer.current = 0;
				setDisplayTime(formatTime(0));
			}
		}
	}, [visible, WorkoutStartTime.current]);

	// Handle app state changes
	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			(nextAppState) => {
				const now = Date.now();

				// App is coming to foreground
				if (
					appStateRef.current.match(/inactive|background/) &&
					nextAppState === "active"
				) {
					if (isRunning || WorkoutStartTime.current) {
						if (WorkoutStartTime.current) {
							// If using WorkoutStartTime.current, calculate total elapsed time from start
							const startTime = WorkoutStartTime.current.toMillis
								? WorkoutStartTime.current.toMillis()
								: WorkoutStartTime.current;
							const totalElapsedSeconds = Math.floor(
								(now - startTime) / 1000
							);
							WorkoutTimer.current = totalElapsedSeconds;
						} else if (isRunning) {
							// Calculate elapsed time while in background
							const elapsedSeconds = Math.floor(
								(now - lastTickRef.current) / 1000
							);
							WorkoutTimer.current += elapsedSeconds;
						}
						setDisplayTime(formatTime(WorkoutTimer.current));
					}
				}

				lastTickRef.current = now;
				appStateRef.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, [isRunning, WorkoutStartTime.current]);

	// Handle timer logic
	useEffect(() => {
		// Clear any existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (isRunning || WorkoutStartTime.current) {
			// Store current timestamp when starting
			lastTickRef.current = Date.now();

			// Set up interval that updates every second
			intervalRef.current = setInterval(() => {
				const now = Date.now();

				if (WorkoutStartTime.current) {
					// If using WorkoutStartTime.current, calculate based on the original start time
					const startTime = WorkoutStartTime.current.toMillis
						? WorkoutStartTime.current.toMillis()
						: WorkoutStartTime.current;
					const totalElapsedSeconds = Math.floor(
						(now - startTime) / 1000
					);
					WorkoutTimer.current = totalElapsedSeconds;
				} else {
					// Otherwise, increment based on the elapsed time since last tick
					const elapsed = Math.floor(
						(now - lastTickRef.current) / 1000
					);
					if (elapsed >= 1) {
						WorkoutTimer.current += elapsed;
						lastTickRef.current = now;
					}
				}

				setDisplayTime(formatTime(WorkoutTimer.current));
			}, 1000);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning, WorkoutStartTime.current]);

	return <Text style={styles.timeText}>{displayTime}</Text>;
};

const createStyles = (theme) => {
	return StyleSheet.create({
		timeText: {
			fontSize: 18,
			fontWeight: "bold",
			color: theme.textColorSecondary,
		},
	});
};

export default WorkoutTimer;
