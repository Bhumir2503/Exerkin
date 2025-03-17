import {
	StyleSheet,
	Modal,
	TouchableWithoutFeedback,
	View,
	ScrollView,
	Text,
	Pressable,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
	formatTimeStamptoDateString,
	formatTimeStamptoTimeString,
	formatTimeToText,
} from "../../utils/TimeFormat";

const WorkoutHistoryModal = ({ selectedWorkout, setSelectedWorkout }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const closeModal = () => {
		setSelectedWorkout(null);
	};

	return (
		<Modal
			visible={!!selectedWorkout}
			animationType="fade"
			transparent={true}
		>
			<View style={styles.modalOverlay}>
				<TouchableWithoutFeedback onPress={closeModal}>
					<View style={styles.backgroundOverlay} />
				</TouchableWithoutFeedback>

				{selectedWorkout && (
					<View style={styles.modalContainer}>
						<View
							style={{
								paddingHorizontal: 20,
								paddingTop: 20,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Text style={styles.title}>
									{selectedWorkout.name}
								</Text>
								<Text style={styles.text}>
									{formatTimeStamptoDateString(
										selectedWorkout.date
									)}
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "space-between",
								}}
							>
								<Text style={styles.text}>
									{selectedWorkout.duration
										? formatTimeToText(
												selectedWorkout.duration
										  )
										: "No duration"}
								</Text>
								<Text style={styles.text}>
									{selectedWorkout.startedAt
										? formatTimeStamptoTimeString(
												selectedWorkout.startedAt
										  )
										: ""}{" "}
									{selectedWorkout.startedAt &&
									selectedWorkout.completedAt
										? "-"
										: ""}{" "}
									{selectedWorkout.completedAt
										? formatTimeStamptoTimeString(
												selectedWorkout.completedAt
										  )
										: ""}
								</Text>
							</View>
						</View>
						<ScrollView
							style={styles.scrollView}
							contentContainerStyle={styles.scrollViewContent}
							bounces={false}
							showsVerticalScrollIndicator={false}
						>
							<View>
								{selectedWorkout.exercises.map(
									(exercise, index) => (
										<ExerciseCard
											key={index}
											exercise={exercise}
										/>
									)
								)}
							</View>
						</ScrollView>
						<Pressable
							style={styles.closeButton}
							onPress={closeModal}
						>
							<Text style={styles.closeButtonText}>Close</Text>
						</Pressable>
					</View>
				)}
			</View>
		</Modal>
	);
};

const ExerciseCard = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Function to render set information based on exercise type
	const renderSetInfo = (set) => {
		if (
			exercise.type === "weightlifting"
		) {
			return `${set.weight || 0} lbs × ${set.reps || 0} reps`;
		} else if (exercise.type === "bodyweight") {
			return `${set.reps || 0} reps`;
		} else if (exercise.type === "cardio-distance") {
			return `${set.time || "0:00"} - ${set.distance || 0} miles`;
		} else if (exercise.type === "cardio-time") {
			return `${set.time || "0:00"}`;
		} else if (exercise.type === "assisted-weight") {
			return `-${set.weight || 0} lbs × ${set.reps || 0} reps`;
		}

		// Default fallback if type is unknown or undefined
		if (set.weight && set.reps) {
			return `${set.weight} lbs × ${set.reps} reps`;
		} else if (set.reps) {
			return `${set.reps} reps`;
		} else if (set.time) {
			return `${set.time}${
				set.distance ? ` - ${set.distance} miles` : ""
			}`;
		}

		return "No data";
	};

	return (
		<View style={styles.exerciseCard}>
			<Text style={styles.exerciseTitle}>{exercise.name}</Text>
			{exercise.sets &&
				exercise.sets.map((set, index) => (
					<View key={index} style={styles.setRow}>
						<Text style={styles.setNumber}>Set {index + 1}</Text>
						<Text style={styles.exerciseText}>
							{renderSetInfo(set)}
						</Text>
					</View>
				))}
			{(!exercise.sets || exercise.sets.length === 0) && (
				<Text style={styles.exerciseText}>No sets recorded</Text>
			)}
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		modalOverlay: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		backgroundOverlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.75)",
		},
		modalContainer: {
			backgroundColor: themeStyle.backgroundColor,
			width: "90%",
			maxHeight: "80%",
			borderRadius: 10,
			padding: 0,
			overflow: "hidden",
			zIndex: 1,
		},
		scrollView: {
			width: "100%",
			padding: 20,
			paddingVertical: 10,
		},
		scrollViewContent: {
			paddingBottom: 0,
		},
		title: {
			fontSize: 18,
			fontWeight: "bold",
			marginBottom: 15,
			color: themeStyle.primary || "#000",
		},
		text: {
			fontSize: 16,
			marginBottom: 15,
			color: themeStyle.textColor || "#000",
		},
		bold: {
			fontWeight: "bold",
		},
		exerciseCard: {
			backgroundColor: themeStyle.card,
			padding: 15,
			borderRadius: 10,
			marginBottom: 15,
		},
		exerciseTitle: {
			fontSize: 16,
			marginBottom: 10,
			fontWeight: "bold",
			color: themeStyle.textColor || "#000",
		},
		setRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 5,
			paddingVertical: 3,
		},
		setNumber: {
			fontSize: 16,
			fontWeight: "500",
			color: themeStyle.textColorSecondary || "#000",
		},
		exerciseText: {
			fontSize: 16,
			color: themeStyle.textColorSecondary || "#000",
		},
		closeButton: {
			backgroundColor: themeStyle.primary || "#3498db",
			padding: 15,
			alignItems: "center",
		},
		closeButtonText: {
			fontSize: 16,
			color: "#fff",
			fontWeight: "bold",
		},
	});

export default WorkoutHistoryModal;
