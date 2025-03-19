import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
	Pressable,
	FlatList,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

const RestTimer = () => {
	const { themeStyle } = useTheme();
	const { workoutCancelled, activeId } = useWorkout();
	const styles = createStyles(themeStyle);

	// Timer state
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(60); // Default 60 seconds
	const [remainingTime, setRemainingTime] = useState(duration);
	const [key, setKey] = useState(0); // For resetting the timer
	const [modalVisible, setModalVisible] = useState(false);
	// Removed isPaused state since we're using isPlaying for toggle
	const [completed, setCompleted] = useState(false);

	// Predefined timer durations - reduced to 4 options
	const presetDurations = [30, 60, 120, 180];

	// Ref to track previous activeId to detect workout changes
	const prevActiveIdRef = useRef(null);

	// Reset timer when workout is canceled/finished (detected by activeId change)
	useEffect(() => {
		if (prevActiveIdRef.current && prevActiveIdRef.current !== activeId) {
			handleReset();
		}
		prevActiveIdRef.current = activeId;
	}, [activeId]);

	// Removed handleStart in favor of handleStartPause

	const handlePause = () => {
		setIsPlaying(false);
	};

	// Start/pause toggle function
	const handleStartPause = () => {
		if (isPlaying) {
			handlePause();
		} else {
			if (completed) {
				// If timer completed, reset it first
				setKey((prevKey) => prevKey + 1);
				setCompleted(false);
			}
			setIsPlaying(true);
		}
	};

	const handleReset = () => {
		setIsPlaying(false);
		setCompleted(false);
		setKey((prevKey) => prevKey + 1);
		setRemainingTime(duration);
	};

	const handleComplete = () => {
		setIsPlaying(false);
		setCompleted(true);
		return { shouldRepeat: false };
	};

	const handleSelectDuration = (newDuration) => {
		setDuration(newDuration);
		setRemainingTime(newDuration);
		setKey((prevKey) => prevKey + 1);
		setCompleted(false);
	};

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
	};

	const formatDurationDisplay = (seconds) => {
		if (seconds < 60) {
			return `${seconds}s`;
		} else if (seconds % 60 === 0) {
			return `${seconds / 60}m`;
		} else {
			const mins = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${mins}m ${secs}s`;
		}
	};

	return (
		<>
			{/* Main Rest Timer Button/Display */}
			<TouchableOpacity
				style={styles.restButton}
				onPress={() => setModalVisible(true)}
			>
				<View style={styles.buttonContent}>
					{!isPlaying && (
						<Ionicons
							name="stopwatch-outline"
							size={20}
							color={"#fff"}
						/>
					)}
					{isPlaying && (
						<Text style={styles.restButtonText}>
							{isPlaying
								? `${formatTime(remainingTime)}`
								: completed
								? "DONE"
								: remainingTime < duration
								? `${formatTime(remainingTime)}`
								: ""}
						</Text>
					)}
				</View>
			</TouchableOpacity>

			{/* Hidden timer to keep running when modal is closed */}
			<View style={{ display: "none" }}>
				<CountdownCircleTimer
					key={key}
					isPlaying={isPlaying}
					duration={duration}
					colors={[themeStyle.primary]}
					onComplete={handleComplete}
					onUpdate={(remainingTime) =>
						setRemainingTime(remainingTime)
					}
				>
					{() => null}
				</CountdownCircleTimer>
			</View>

			{/* Rest Timer Modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
				statusBarTranslucent={true}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<View style={styles.timerHeader}>
							<Text style={styles.modalTitle}>Rest Timer</Text>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								style={styles.closeButton}
							>
								<Ionicons
									name="close"
									size={24}
									color={themeStyle.textColor}
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.timerContainer}>
							<CountdownCircleTimer
								key={key}
								isPlaying={isPlaying}
								duration={duration}
								colors={[themeStyle.primary]}
								onComplete={handleComplete}
								onUpdate={(remainingTime) => {
									// No need to update remainingTime here as it's updated by the hidden timer
								}}
								size={200}
								strokeWidth={15}
							>
								{() => (
									<Text style={styles.timerText}>
										{formatTime(remainingTime)}
									</Text>
								)}
							</CountdownCircleTimer>
						</View>

						{/* Timer Duration Selector */}
						<View style={styles.durationSelectorContainer}>
							<Text style={styles.durationTitle}>
								Select Rest Duration
							</Text>
							<View style={styles.durationButtonsContainer}>
								{presetDurations.map((preset) => (
									<TouchableOpacity
										key={preset}
										style={[
											styles.durationButton,
											preset === duration &&
												styles.selectedDurationButton,
										]}
										onPress={() =>
											handleSelectDuration(preset)
										}
									>
										<Text
											style={[
												styles.durationButtonText,
												preset === duration &&
													styles.selectedDurationText,
											]}
										>
											{formatDurationDisplay(preset)}
										</Text>
									</TouchableOpacity>
								))}
							</View>

							{/* Custom Duration Slider or Quick Add/Subtract */}
							<View style={styles.customDurationContainer}>
								<TouchableOpacity
									style={styles.adjustButton}
									onPress={() => {
										const newDuration = Math.max(
											5,
											duration - 15
										);
										handleSelectDuration(newDuration);
									}}
								>
									<Ionicons
										name="remove"
										size={22}
										color="#fff"
									/>
								</TouchableOpacity>

								<Text style={styles.currentDurationText}>
									{formatDurationDisplay(duration)}
								</Text>

								<TouchableOpacity
									style={styles.adjustButton}
									onPress={() => {
										const newDuration = duration + 15;
										handleSelectDuration(newDuration);
									}}
								>
									<Ionicons
										name="add"
										size={22}
										color="#fff"
									/>
								</TouchableOpacity>
							</View>
						</View>

						<View style={styles.controlsContainer}>
							<TouchableOpacity
								style={[
									styles.controlButton,
									isPlaying
										? styles.pauseButton
										: styles.startButton,
								]}
								onPress={handleStartPause}
							>
								<Text style={styles.controlButtonText}>
									{isPlaying
										? "Pause"
										: completed
										? "Restart"
										: "Start"}
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[
									styles.controlButton,
									styles.resetButton,
								]}
								onPress={handleReset}
							>
								<Text style={styles.controlButtonText}>
									Reset
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		restButton: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: themeStyle.primary,
			borderRadius: 12,
			padding: 10,
			paddingHorizontal: 15,
		},
		buttonContent: {
			flexDirection: "row",
			alignItems: "center",
		},
		restButtonText: {
			color: "#fff",
			fontWeight: "bold",
			width: 50,
			textAlign: "center",
			fontSize: 16,
		},
		centeredView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "rgba(0, 0, 0, 0.5)",
		},
		modalView: {
			width: "90%",
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 20,
			padding: 15,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 4,
			elevation: 5,
		},
		timerHeader: {
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 20,
		},
		modalTitle: {
			color: themeStyle.textColor,
			fontSize: 18,
			fontWeight: "bold",
		},
		closeButton: {
			padding: 5,
		},
		timerContainer: {
			alignItems: "center",
			marginTop: 5,
			marginBottom: 25,
		},
		timerText: {
			color: themeStyle.textColor,
			fontSize: 36,
			fontWeight: "bold",
		},
		durationSelectorContainer: {
			width: "100%",
			marginBottom: 15,
			alignItems: "center",
		},
		durationTitle: {
			color: themeStyle.textColor,
			fontSize: 18,
			fontWeight: "600",
			marginBottom: 12,
			textAlign: "center",
		},
		durationButtonsContainer: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "center",
			marginBottom: 15,
		},
		durationButton: {
			backgroundColor: themeStyle.card || "#2A2A2A",
			borderRadius: 12,
			paddingVertical: 10,
			paddingHorizontal: 15,
			margin: 5,
			minWidth: 70,
			alignItems: "center",
		},
		selectedDurationButton: {
			backgroundColor: themeStyle.primary,
		},
		durationButtonText: {
			color: themeStyle.textColor,
			fontWeight: "500",
		},
		selectedDurationText: {
			color: "#FFFFFF",
			fontWeight: "bold",
		},
		customDurationContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			marginTop: 5,
		},
		adjustButton: {
			backgroundColor: themeStyle.card || "#666",
			borderRadius: 18,
			width: 36,
			height: 36,
			alignItems: "center",
			justifyContent: "center",
		},
		currentDurationText: {
			color: themeStyle.textColor,
			fontWeight: "bold",
			fontSize: 20,
			marginHorizontal: 15,
			minWidth: 80,
			textAlign: "center",
		},
		controlsContainer: {
			flexDirection: "row",
			justifyContent: "space-around",
			width: "100%",
			marginTop: 15,
			flexWrap: "wrap",
		},
		controlButton: {
			padding: 12,
			borderRadius: 10,
			minWidth: 90,
			alignItems: "center",
			margin: 5,
		},
		startButton: {
			backgroundColor: themeStyle.primary,
		},
		pauseButton: {
			backgroundColor: themeStyle.accent || "#FF9500",
		},
		resumeButton: {
			backgroundColor: themeStyle.primary,
		},
		resetButton: {
			backgroundColor: themeStyle.error,
		},
		controlButtonText: {
			color: "#FFFFFF",
			fontWeight: "bold",
			fontSize: 16,
		},
	});
};

export default RestTimer;
