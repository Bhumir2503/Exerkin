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
								boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
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
									<Text style={styles.bold}></Text>{" "}
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
									{formatTimeToText(selectedWorkout.duration)}
								</Text>
								<Text style={styles.text}>
									{formatTimeStamptoTimeString(
										selectedWorkout.startedAt
									)}{" "}
									-{" "}
									{formatTimeStamptoTimeString(
										selectedWorkout.completedAt
									)}
								</Text>
							</View>
						</View>
						<ScrollView
							style={styles.scrollView}
							contentContainerStyle={styles.scrollViewContent}
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

	return (
		<View style={styles.exerciseCard}>
			<Text style={styles.exerciseTitle}>{exercise.name}</Text>
			{exercise.sets.map((set, index) => (
				<View key={index}>
					<Text style={styles.exerciseText}>
						{set.weight} lbs x {set.reps} reps
					</Text>
				</View>
			))}
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
			backgroundColor: "rgba(0, 0, 0, 0.5)",
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
			marginBottom: 5,
			fontWeight: "bold",
			color: themeStyle.textColor || "#000",
		},
		exerciseText: {
			fontSize: 14,
			color: themeStyle.textColorSecondary || "#000",
			marginBottom: 2,
		},
		closeButton: {
			backgroundColor: themeStyle.primary || "#3498db",
			padding: 15,
			alignItems: "center",
		},
		closeButtonText: {
			color: "#fff",
			fontWeight: "bold",
		},
	});

export default WorkoutHistoryModal;
