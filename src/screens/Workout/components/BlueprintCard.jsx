import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Modal,
	TouchableWithoutFeedback,
	ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "../../../components/Buttons/TextButton";

import { useTheme } from "../../../contexts/ThemeContext";
import { useState } from "react";
import { useBlueprintStorage } from "../../../contexts/blueprint/BlueprintStorageContext";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";

import { formatTimeStamptoDateString } from "../../../services/helpers/timestampFormatFunctions";

import { trigger } from "react-native-haptic-feedback";

const BlueprintCard = ({ blueprint, navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const { removeBlueprintFromStorage } = useBlueprintStorage();
	const { startBlueprint } = useWorkoutSession();

	const handleStart = () => {
		trigger("impactLight");
		closeModal();
		startBlueprint(blueprint);
		navigation.navigate("WorkoutModalScreen");
	};

	// Count sets in each exercise
	const getSetCount = (exercise) => {
		return exercise.sets ? exercise.sets.length : 0;
	};

	// Open modal with blueprint details
	const openModal = () => {
		setSelectedTemplate(blueprint);
	};

	// Close modal
	const closeModal = () => {
		setSelectedTemplate(null);
	};

	// Handle view action from modal
	const handleStartTemplate = () => {
		closeModal();
	};

	// Exercise Card component for the modal
	const ExerciseCard = ({ exercise }) => (
		<View style={styles.exerciseCard}>
			<View style={styles.exerciseHeader}>
				<Text style={styles.exerciseName}>{exercise.name}</Text>
				<Text style={styles.exerciseType}>
					{exercise.exerciseType.includes("cardio")
						? "Cardio"
						: "Strength"}
				</Text>
			</View>

			{exercise.notes && (
				<Text style={styles.exerciseNotes}>{exercise.notes}</Text>
			)}

			<View style={styles.setsInfo}>
				<Ionicons name="list" size={16} color={themeStyle.textColor} />
				<Text style={styles.setsText}>
					{getSetCount(exercise)}{" "}
					{getSetCount(exercise) === 1 ? "set" : "sets"}
				</Text>
			</View>
		</View>
	);

	return (
		<View style={styles.cardContainer}>
			<View style={styles.cardHeader}>
				<View>
					<Text style={styles.templateName}>{blueprint.name}</Text>
					<Text style={styles.dateText}>
						Created:{" "}
						{formatTimeStamptoDateString(blueprint.createdAt)}
					</Text>
				</View>
			</View>

			<View style={styles.contentSection}>
				{blueprint.note && (
					<Text style={styles.noteText} numberOfLines={2}>
						{blueprint.note}
					</Text>
				)}

				<View style={styles.statsRow}>
					<View style={styles.statItem}>
						<Ionicons
							name="barbell-outline"
							size={16}
							color={themeStyle.textColor}
						/>
						<Text style={styles.statText}>
							{blueprint.exercises
								? blueprint.exercises.length
								: 0}{" "}
							exercises
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.buttonContainer}>
				<TextButton text="View Blueprint" onPress={openModal} />
			</View>

			{/* Modal for Blueprint Details */}
			<Modal
				visible={!!selectedTemplate}
				animationType="fade"
				transparent={true}
				statusBarTranslucent={true}
			>
				<View style={styles.modalOverlay}>
					<TouchableWithoutFeedback onPress={closeModal}>
						<View style={styles.backgroundOverlay} />
					</TouchableWithoutFeedback>

					{selectedTemplate && (
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
										marginBottom: 15,
									}}
								>
									<Text style={styles.title}>
										{selectedTemplate.name}
									</Text>
									<View style={styles.actionButtons}>
										<Pressable
											style={styles.iconButton}
											onPress={handleStart}
										>
											<Ionicons
												name="play-outline"
												size={24}
												color={
													themeStyle.success || "#000"
												}
											/>
										</Pressable>
										<Pressable
											style={styles.iconButton}
											onPress={() =>
												removeBlueprintFromStorage(
													selectedTemplate.blueprintId
												)
											}
										>
											<Ionicons
												name="trash-outline"
												size={24}
												color={
													themeStyle.error || "#000"
												}
											/>
										</Pressable>
									</View>
								</View>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Text style={styles.text}>
										{formatTimeStamptoDateString(
											selectedTemplate.createdAt
										)}
									</Text>
								</View>
								{selectedTemplate.note &&
									selectedTemplate.note !== "" && (
										<Text style={styles.text}>
											<Text
												style={{ fontWeight: "bold" }}
											>
												Notes:
											</Text>{" "}
											{selectedTemplate.note}
										</Text>
									)}
							</View>
							<ScrollView
								style={styles.scrollView}
								contentContainerStyle={styles.scrollViewContent}
								bounces={false}
								showsVerticalScrollIndicator={false}
							>
								<View>
									{selectedTemplate.exercises &&
									selectedTemplate.exercises.length > 0 ? (
										selectedTemplate.exercises.map(
											(exercise, index) => (
												<ExerciseCard
													key={
														exercise.uniqueId ||
														index
													}
													exercise={exercise}
												/>
											)
										)
									) : (
										<View
											style={styles.noExercisesContainer}
										>
											<Text
												style={styles.noExercisesText}
											>
												No exercises added to this
												blueprint
											</Text>
										</View>
									)}
								</View>
							</ScrollView>
							<Pressable
								style={styles.closeButton}
								onPress={closeModal}
							>
								<Text style={styles.closeButtonText}>
									Close
								</Text>
							</Pressable>
						</View>
					)}
				</View>
			</Modal>
		</View>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		cardContainer: {
			backgroundColor: theme.card || theme.backgroundColor,
			borderRadius: 8,
			padding: 18,
			marginVertical: 10,
			borderWidth: 1,
			borderColor: theme.borderColor || "rgba(0,0,0,0.08)",
		},
		cardHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 12,
		},
		templateName: {
			fontSize: 20,
			fontWeight: "700",
			color: theme.textColor,
			marginBottom: 4,
		},
		dateText: {
			fontSize: 12,
			color: theme.textColorSecondary || "gray",
		},
		contentSection: {
			marginBottom: 16,
		},
		exercisePreview: {
			fontSize: 16,
			fontWeight: "500",
			color: theme.textColor,
			marginBottom: 8,
		},
		noteText: {
			fontSize: 14,
			color: theme.textColorSecondary || "gray",
			marginBottom: 12,
			fontStyle: "italic",
		},
		statsRow: {
			flexDirection: "row",
			alignItems: "center",
		},
		statItem: {
			flexDirection: "row",
			alignItems: "center",
			marginRight: 16,
		},
		statText: {
			fontSize: 13,
			color: theme.textColorSecondary || "gray",
			marginLeft: 5,
		},
		buttonContainer: {
			flexDirection: "row",
			justifyContent: "flex-end",
			alignItems: "center",
		},
		startButton: {
			backgroundColor: theme.primary,
			paddingVertical: 10,
			paddingHorizontal: 20,
			borderRadius: 6,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
		},
		startButtonText: {
			color: "#FFFFFF",
			fontSize: 14,
			fontWeight: "600",
			letterSpacing: 0.5,
		},
		iconButtons: {
			flexDirection: "row",
			alignItems: "center",
		},
		iconButton: {
			width: 36,
			height: 36,
			borderRadius: 18,
			justifyContent: "center",
			alignItems: "center",
			marginLeft: 10,
		},

		// Modal styles matching your example
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
			width: "90%",
			maxHeight: "80%",
			backgroundColor: theme.backgroundColor,
			borderRadius: 8,
			overflow: "hidden",
		},
		title: {
			fontSize: 22,
			fontWeight: "bold",
			color: theme.textColor,
			flex: 2,
		},
		actionButtons: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "flex-end",
			flex: 1.5,
		},
		text: {
			fontSize: 14,
			color: theme.textColorSecondary,
			marginBottom: 8,
		},
		scrollView: {
			width: "100%",
			marginTop: 10,
		},
		scrollViewContent: {
			padding: 20,
			paddingTop: 10,
		},
		closeButton: {
			backgroundColor: theme.primary,
			alignItems: "center",
			justifyContent: "center",
			padding: 14,
			marginTop: 10,
		},
		closeButtonText: {
			color: "#FFFFFF",
			fontSize: 16,
			fontWeight: "bold",
		},

		// Exercise Card styles
		exerciseCard: {
			backgroundColor: theme.card,
			borderRadius: 6,
			padding: 15,
			marginBottom: 12,
		},
		exerciseHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 8,
		},
		exerciseName: {
			fontSize: 16,
			fontWeight: "bold",
			color: theme.textColor,
			flex: 1,
		},
		exerciseType: {
			fontSize: 12,
			color: theme.textColor,
			backgroundColor: theme.accent || "rgba(0,0,0,0.05)",
			paddingHorizontal: 8,
			paddingVertical: 4,
			borderRadius: 4,
		},
		exerciseNotes: {
			fontSize: 13,
			color: theme.textColorSecondary,
			marginBottom: 8,
			fontStyle: "italic",
		},
		setsInfo: {
			flexDirection: "row",
			alignItems: "center",
		},
		setsText: {
			fontSize: 13,
			color: theme.textColorSecondary || "gray",
			marginLeft: 5,
		},
		noExercisesContainer: {
			padding: 30,
			justifyContent: "center",
			alignItems: "center",
		},
		noExercisesText: {
			fontSize: 15,
			color: theme.textColorSecondary,
			fontStyle: "italic",
			textAlign: "center",
		},
	});
};

export default BlueprintCard;
