import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, AppState } from "react-native";
import { useTheme } from "../contexts/ThemeContext"; // Direct import

// Default time formatter
export const formatTime = (seconds) => {
	// Format as MM:SS if less than 1 hour
	if (seconds < 3600) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	} else {
		// Format as HH:MM:SS if 1 hour or more
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hrs.toString().padStart(2, "0")}:${mins
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}
};

const Timer = ({
	// Initial state values
	initialSeconds = 0,
	startTime = null, // Timestamp for absolute timing (can be null)

	// Optional props with defaults
	formatFunction = formatTime,
}) => {

    
	// Get theme directly from context
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Internal state
	const [seconds, setSeconds] = useState(initialSeconds);
	const [displayTime, setDisplayTime] = useState(
		formatFunction(initialSeconds)
	);

	// Timer is always running
	const isRunning = true;

	// Track timestamp for background calculation
	const lastTickRef = useRef(Date.now());
	const appStateRef = useRef(AppState.currentState);
	const intervalRef = useRef(null);

	// Initialize timer with elapsed time if startTime is provided
	useEffect(() => {
		if (startTime) {
			const now = Date.now();
			// Convert Firestore timestamp to milliseconds if needed
			const start = startTime.toMillis ? startTime.toMillis() : startTime;
			const initialElapsedSeconds = Math.floor((now - start) / 1000);

			setSeconds(initialElapsedSeconds);
			setDisplayTime(formatFunction(initialElapsedSeconds));
		}
	}, [startTime]);

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
					if (startTime) {
						// Calculate total elapsed time from absolute start
						const start = startTime.toMillis
							? startTime.toMillis()
							: startTime;
						const totalElapsedSeconds = Math.floor(
							(now - start) / 1000
						);
						setSeconds(totalElapsedSeconds);
					} else {
						// Calculate elapsed time while in background
						const elapsedSeconds = Math.floor(
							(now - lastTickRef.current) / 1000
						);
						setSeconds((prev) => prev + elapsedSeconds);
					}
				}

				lastTickRef.current = now;
				appStateRef.current = nextAppState;
			}
		);

		return () => {
			subscription.remove();
		};
	}, [startTime]);

	// Update displayed time whenever seconds changes
	useEffect(() => {
		setDisplayTime(formatFunction(seconds));
	}, [seconds, formatFunction]);

	// Handle timer logic
	useEffect(() => {
		// Clear any existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// Store current timestamp when starting
		lastTickRef.current = Date.now();

		// Set up interval that updates every second
		intervalRef.current = setInterval(() => {
			const now = Date.now();

			if (startTime) {
				// Calculate based on the original start time
				const start = startTime.toMillis
					? startTime.toMillis()
					: startTime;
				const totalElapsedSeconds = Math.floor((now - start) / 1000);
				setSeconds(totalElapsedSeconds);
			} else {
				// Increment based on the elapsed time since last tick
				const elapsed = Math.floor((now - lastTickRef.current) / 1000);
				if (elapsed >= 1) {
					setSeconds((prev) => prev + elapsed);
					lastTickRef.current = now;
				}
			}
		}, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [startTime]);

	return <Text style={styles.timeText}>{displayTime}</Text>;
};

// Theme-based styles only
const createStyles = (theme) => {
	return StyleSheet.create({
		timeText: {
			fontSize: 18,
			fontWeight: "bold",
			color: theme.textColorSecondary,
		},
	});
};

export default Timer;
