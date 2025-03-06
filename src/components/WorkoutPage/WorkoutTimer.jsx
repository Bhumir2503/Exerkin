import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
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
	const [displayTime, setDisplayTime] = useState("00:00:00"); // Only for display purposes
	const [isRunning, setIsRunning] = useState(false);

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

	useEffect(() => {
		let intervalID;

		if (isRunning) {
			intervalID = setInterval(() => {
				timeRef.current += 1;
				setDisplayTime(formatTime(timeRef.current));
			}, 1000);
		} else {
			timeRef.current = 0;
			setDisplayTime(formatTime(0));
		}

		return () => clearInterval(intervalID);
	}, [isRunning]);

	return (

			<Text style={styles.timeText}>{displayTime}</Text>

	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		timeText: { fontSize: 18, fontWeight: "bold", color: theme.textColorSecondary },
	});
};

export default WorkoutTimer;
