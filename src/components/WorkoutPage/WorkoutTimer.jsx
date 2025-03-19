import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, AppState } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export const formatTime = (seconds) => {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const sec = seconds % 60;
	let timeString = `${hrs.toString().padStart(2, "0")}:${mins
		.toString()
		.padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
	return timeString;
};

const WorkoutTimer = ({ visible, timeRef, startTimeStamp }) => {
	const [displayTime, setDisplayTime] = useState("00:00:00");
	const [isRunning, setIsRunning] = useState(false);

	// Track timestamp for background calculation
	const lastTickRef = useRef(Date.now());
	const appStateRef = useRef(AppState.currentState);
	const intervalRef = useRef(null);

	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Initialize timer with elapsed time if startTimeStamp is provided
	useEffect(() => {
		if (startTimeStamp) {
			const now = Date.now();
			// Convert Firestore timestamp to milliseconds if needed
			const startTime = startTimeStamp.toMillis
				? startTimeStamp.toMillis()
				: startTimeStamp;
			const initialElapsedSeconds = Math.floor((now - startTime) / 1000);

			// Set the initial timeRef value
			timeRef.current = initialElapsedSeconds;
			setDisplayTime(formatTime(initialElapsedSeconds));
		}
	}, [startTimeStamp]);

	// Use visible prop to toggle isRunning state of the timer
	useEffect(() => {
		if (visible) {
			setIsRunning(true);
		} else {
			setIsRunning(false);
			if (!startTimeStamp) {
				// Only reset if not using a persistent startTimeStamp
				timeRef.current = 0;
				setDisplayTime(formatTime(0));
			}
		}
	}, [visible, startTimeStamp]);

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
					if (isRunning || startTimeStamp) {
						if (startTimeStamp) {
							// If using startTimeStamp, calculate total elapsed time from start
							const startTime = startTimeStamp.toMillis
								? startTimeStamp.toMillis()
								: startTimeStamp;
							const totalElapsedSeconds = Math.floor(
								(now - startTime) / 1000
							);
							timeRef.current = totalElapsedSeconds;
						} else if (isRunning) {
							// Calculate elapsed time while in background
							const elapsedSeconds = Math.floor(
								(now - lastTickRef.current) / 1000
							);
							timeRef.current += elapsedSeconds;
						}
						setDisplayTime(formatTime(timeRef.current));
					}
				}

				lastTickRef.current = now;
				appStateRef.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, [isRunning, startTimeStamp]);

	// Handle timer logic
	useEffect(() => {
		// Clear any existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (isRunning || startTimeStamp) {
			// Store current timestamp when starting
			lastTickRef.current = Date.now();

			// Set up interval that updates every second
			intervalRef.current = setInterval(() => {
				const now = Date.now();

				if (startTimeStamp) {
					// If using startTimeStamp, calculate based on the original start time
					const startTime = startTimeStamp.toMillis
						? startTimeStamp.toMillis()
						: startTimeStamp;
					const totalElapsedSeconds = Math.floor(
						(now - startTime) / 1000
					);
					timeRef.current = totalElapsedSeconds;
				} else {
					// Otherwise, increment based on the elapsed time since last tick
					const elapsed = Math.floor(
						(now - lastTickRef.current) / 1000
					);
					if (elapsed >= 1) {
						timeRef.current += elapsed;
						lastTickRef.current = now;
					}
				}

				setDisplayTime(formatTime(timeRef.current));
			}, 1000);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning, startTimeStamp]);

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
