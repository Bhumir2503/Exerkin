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

const WorkoutTimer = ({ visible, timeRef }) => {
	const [displayTime, setDisplayTime] = useState("00:00:00");
	const [isRunning, setIsRunning] = useState(false);

	// Track timestamp for background calculation
	const lastTickRef = useRef(Date.now());
	const appStateRef = useRef(AppState.currentState);
	const intervalRef = useRef(null);

	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Use visible prop to toggle isRunning state of the timer
	useEffect(() => {
		if (visible) {
			setIsRunning(true);
		} else {
			setIsRunning(false);
			timeRef.current = 0;
			setDisplayTime(formatTime(0));
		}
	}, [visible]);

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
					if (isRunning) {
						// Calculate elapsed time while in background
						const elapsedSeconds = Math.floor(
							(now - lastTickRef.current) / 1000
						);
						timeRef.current += elapsedSeconds;
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
	}, [isRunning]);

	// Handle timer logic
	useEffect(() => {
		if (isRunning) {
			// Store current timestamp when starting
			lastTickRef.current = Date.now();

			// Set up interval that updates every second
			intervalRef.current = setInterval(() => {
				const now = Date.now();
				const elapsed = Math.floor((now - lastTickRef.current) / 1000);

				if (elapsed >= 1) {
					timeRef.current += elapsed;
					setDisplayTime(formatTime(timeRef.current));
					lastTickRef.current = now;
				}
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning]);

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
