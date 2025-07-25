import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
	TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutTimer } from "../../../contexts/workout/WorkoutTimerContext";
import { useWorkoutMeta } from "../../../contexts/workout/WorkoutMetaContext";

const presetDurations = [30, 60, 120, 180, 300, 600, 1800];

const RestTimer = () => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { isResting, remainingRestTime, startRestTimer, stopRestTimer } =
		useWorkoutTimer();
	const { formTypeRef } = useWorkoutMeta();

	const [modalVisible, setModalVisible] = useState(false);
	const [selectedDuration, setSelectedDuration] = useState(60);

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

	if (formTypeRef.current === "edit") return null;

	return (
		<>
			<TouchableOpacity
				style={[styles.restButton, isResting && { width: 80 }]}
				onPress={() => setModalVisible(true)}
			>
				<View style={styles.buttonContent}>
					{!isResting ? (
						<Ionicons
							name="stopwatch-outline"
							size={20}
							color="#fff"
						/>
					) : (
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
							<Text style={styles.timerText}>
								{formatTime(remainingRestTime)}
							</Text>
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
											setSelectedDuration(preset)
										}
										disabled={isResting}
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
								onPress={() => startRestTimer(selectedDuration)}
								disabled={isResting}
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
								onPress={stopRestTimer}
								disabled={!isResting}
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
