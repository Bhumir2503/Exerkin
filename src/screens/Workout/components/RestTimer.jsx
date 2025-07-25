import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutTimer } from "../../../contexts/workout/WorkoutTimerContext";
import { useWorkoutMeta } from "../../../contexts/workout/WorkoutMetaContext";

const presetDurations = [30, 60, 120, 180];
const TIME_ADJUSTMENT = 15; // Amount to add/subtract in seconds

const RestTimer = () => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const {
		isResting,
		remainingRestTime,
		setRemainingRestTime,
		startRestTimer,
		stopRestTimer,
	} = useWorkoutTimer();
	const { formTypeRef } = useWorkoutMeta();

	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDuration, setSelectedDuration] = useState(60);
	// Keep track of when the timer was last reset for proper key generation
	const [timerKey, setTimerKey] = useState(0);

	// Effect to reset the timer key when the timer starts/stops
	useEffect(() => {
		setTimerKey((prev) => prev + 1);
	}, [isResting]);

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
	};

	const formatDurationDisplay = (seconds) => {
		if (seconds < 60) return `${seconds}s`;
		if (seconds % 60 === 0) return `${seconds / 60}m`;
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}m ${secs}s`;
	};

	// Function to add time to the timer
	const addTime = () => {
		if (isResting) {
			// If timer is running, adjust the remaining time
			setRemainingRestTime((prev) => prev + TIME_ADJUSTMENT);
		} else {
			// If timer is not running, adjust the selected duration
			setSelectedDuration((prev) => prev + TIME_ADJUSTMENT);
			setRemainingRestTime(selectedDuration + TIME_ADJUSTMENT);
		}
	};

	// Function to subtract time from the timer
	const subtractTime = () => {
		if (isResting) {
			// If timer is running, adjust the remaining time but don't go below 1
			setRemainingRestTime((prev) => Math.max(1, prev - TIME_ADJUSTMENT));
		} else {
			// If timer is not running, adjust the selected duration
			const newDuration = Math.max(
				TIME_ADJUSTMENT,
				selectedDuration - TIME_ADJUSTMENT
			);
			setSelectedDuration(newDuration);
			setRemainingRestTime(newDuration);
		}
	};

	// Reset timer when a preset is selected
	const handlePresetSelection = (preset) => {
		setSelectedDuration(preset);
		setRemainingRestTime(preset);
		setTimerKey((prev) => prev + 1); // Force timer component to reset
	};

	if (formTypeRef.current === "edit") {
		return null; // Don't show the rest timer in template mode
	}

	return (
		<>
			<TouchableOpacity
				style={styles.restButton}
				onPress={() => setModalVisible(true)}
			>
				<View style={styles.buttonContent}>
					{!isResting && (
						<Ionicons
							name="stopwatch-outline"
							size={20}
							color="#fff"
						/>
					)}
					{isResting && (
						<Text style={styles.restButtonText}>
							{formatTime(remainingRestTime)}
						</Text>
					)}
				</View>
			</TouchableOpacity>

			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
				statusBarTranslucent={true}
			>
				<TouchableWithoutFeedback
					onPress={() => setModalVisible(false)}
				>
					<View style={styles.backgroundOverlay}></View>
				</TouchableWithoutFeedback>

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
								key={timerKey} // Add a key to properly reset the component
								isPlaying={isResting}
								duration={selectedDuration}
								initialRemainingTime={remainingRestTime}
								colors={[themeStyle.primary]}
								trailColor={`${themeStyle.primary}20`}
								size={200}
								strokeWidth={15}
								onComplete={() => {
									stopRestTimer();
									return { shouldRepeat: false };
								}}
							>
								{() => (
									<Text style={styles.timerText}>
										{formatTime(remainingRestTime)}
									</Text>
								)}
							</CountdownCircleTimer>
						</View>

						{/* Time adjustment buttons */}
						<View style={styles.timeAdjustmentContainer}>
							<TouchableOpacity
								style={[
									styles.timeAdjustButton,
									// Apply disabled style if appropriate
									isResting &&
										remainingRestTime <= TIME_ADJUSTMENT &&
										styles.disabledButton,
								]}
								onPress={subtractTime}
								// Disable the button if we can't subtract any more time
								disabled={
									isResting &&
									remainingRestTime <= TIME_ADJUSTMENT
								}
							>
								<Ionicons
									name="remove-circle"
									size={30}
									color={
										isResting &&
										remainingRestTime <= TIME_ADJUSTMENT
											? themeStyle.disabled || "#666666"
											: themeStyle.error
									}
								/>
								<Text
									style={[
										styles.timeAdjustButtonText,
										isResting &&
											remainingRestTime <=
												TIME_ADJUSTMENT &&
											styles.disabledText,
									]}
								>
									-{TIME_ADJUSTMENT}s
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.timeAdjustButton}
								onPress={addTime}
							>
								<Ionicons
									name="add-circle"
									size={30}
									color={themeStyle.primary}
								/>
								<Text style={styles.timeAdjustButtonText}>
									+{TIME_ADJUSTMENT}s
								</Text>
							</TouchableOpacity>
						</View>

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
											preset === selectedDuration &&
												styles.selectedDurationButton,
											isResting && styles.disabledButton,
										]}
										onPress={() =>
											handlePresetSelection(preset)
										}
										disabled={isResting} // Disable preset buttons when timer is running
									>
										<Text
											style={[
												styles.durationButtonText,
												preset === selectedDuration &&
													styles.selectedDurationText,
												isResting &&
													styles.disabledText,
											]}
										>
											{formatDurationDisplay(preset)}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>

						<View style={styles.controlsContainer}>
							<TouchableOpacity
								style={[
									styles.controlButton,
									styles.startButton,
									isResting && styles.disabledControlButton,
								]}
								onPress={() => {
									startRestTimer(selectedDuration);
									setTimerKey((prev) => prev + 1); // Force timer reset when starting
								}}
								disabled={isResting} // Disable start button when already running
							>
								<Text style={styles.controlButtonText}>
									Start
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.controlButton,
									styles.resetButton,
									!isResting && styles.disabledControlButton,
								]}
								onPress={() => {
									stopRestTimer();
									setTimerKey((prev) => prev + 1); // Force timer reset when stopping
								}}
								disabled={!isResting} // Disable stop button when not running
							>
								<Text style={styles.controlButtonText}>
									Stop
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		restButton: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			padding: 10,
			paddingHorizontal: 15,
			marginHorizontal: 10,
		},
		buttonContent: {
			flexDirection: "row",
			alignItems: "center",
		},
		restButtonText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 16,
		},
		backgroundOverlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.75)",
		},
		centeredView: { 
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		modalView: {
			width: "90%",
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 8,
			padding: 15,
			alignItems: "center",
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
			marginBottom: 15,
		},
		timerText: {
			color: themeStyle.textColor,
			fontSize: 36,
			fontWeight: "bold",
		},
		timeAdjustmentContainer: {
			flexDirection: "row",
			justifyContent: "center",
			width: "100%",
			marginBottom: 20,
		},
		timeAdjustButton: {
			alignItems: "center",
			marginHorizontal: 20,
		},
		timeAdjustButtonText: {
			color: themeStyle.textColor,
			marginTop: 5,
			fontWeight: "500",
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
			borderRadius: 6,
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
		disabledButton: {
			opacity: 0.5,
		},
		disabledText: {
			opacity: 0.5,
		},
		disabledControlButton: {
			opacity: 0.5,
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
			borderRadius: 6,
			minWidth: 90,
			alignItems: "center",
			margin: 5,
		},
		startButton: {
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

export default RestTimer;
