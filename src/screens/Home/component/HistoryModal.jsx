import {
	StyleSheet,
	Modal,
	TouchableWithoutFeedback,
	View,
	ScrollView,
	Text,
	Pressable,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import {
	formatTimeStamptoTimeString,
	formatTimestampToShortDate,
} from "../../../services/helpers/timestampFormatFunctions";
import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";
import { useBlueprintSession } from "../../../hooks/useBlueprintSession";
import { trigger } from "react-native-haptic-feedback";

const HistoryModal = ({ selectedWorkout, setSelectedWorkout, navigation }) => {
	const { themeStyle } = useTheme();
	const { removeWorkoutFromHistory } = useWorkoutHistory();
	const { startEditWorkout, workoutIdRef } = useWorkoutSession();
	const { createBlueprintFromWorkout } = useBlueprintSession();

	const styles = createStyles(themeStyle);

	const closeModal = () => {
		setSelectedWorkout(null);
	};

	const handleDelete = () => {
		closeModal();
		removeWorkoutFromHistory(selectedWorkout);
	};

	const handleEdit = () => {
		trigger("impactLight");
		
		closeModal();
		startEditWorkout(selectedWorkout);
		navigation.navigate("WorkoutModalScreen");
	};

	const handleSaveAsTemplate = () => {
		// Add save as template functionality here
		createBlueprintFromWorkout(selectedWorkout);
		// You would typically save the workout as a template in your app
	};

	return (
		<Modal
			visible={!!selectedWorkout}
			animationType="fade"
			transparent={true}
			statusBarTranslucent={true}
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
									marginBottom: 15,
								}}
							>
								<Text style={styles.title}>
									{selectedWorkout.name === ""
										? "Untitled Workout"
										: selectedWorkout.name}
								</Text>
								<View style={styles.actionButtons}>
									{!selectedWorkout.isBlueprint && (
										<Pressable
											style={styles.iconButton}
											onPress={handleSaveAsTemplate}
										>
											<Ionicons
												name="bookmark-outline"
												size={24}
												color={
													themeStyle.success || "#000"
												}
											/>
										</Pressable>
									)}

									<Pressable
										style={{
											...styles.iconButton,
											opacity:
												workoutIdRef.current !== null
													? 0.5
													: 1,
										}}
										onPress={handleEdit}
										disabled={workoutIdRef.current !== null}
									>
										<Ionicons
											name="create-outline"
											size={24}
											color={themeStyle.accent || "#000"}
										/>
									</Pressable>
									<Pressable
										style={styles.iconButton}
										onPress={handleDelete}
									>
										<Ionicons
											name="trash-outline"
											size={24}
											color={themeStyle.error || "#000"}
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
									{formatTimestampToShortDate(
										selectedWorkout.completedAt
									)}
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
							{selectedWorkout.notes !== "" && (
								<View style={{ marginTop: 10 }}>
									<Text
										style={styles.notes}
										ellipsizeMode="tail"
									>
										<Text style={{ fontWeight: "bold" }}>
											Notes:{" "}
										</Text>
										{selectedWorkout.notes}
									</Text>
								</View>
							)}
						</View>

						<ScrollView
							style={styles.scrollView}
							contentContainerStyle={styles.scrollViewContent}
							bounces={false}
							showsVerticalScrollIndicator={false}
						>
							<View>
								{selectedWorkout.imageURL && (
									<View
										style={{
											alignItems: "center",
											width: "100%",
										}}
									>
										<Image
											source={{
												uri: selectedWorkout.imageURL,
											}}
											style={{
												width: "100%",
												maxHeight: 400,
												resizeMode: "stretch",
												aspectRatio: 4 / 3,
												marginBottom: 15,
												borderRadius: 8,
											}}
										/>
									</View>
								)}
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
		if (exercise.type === "weightlifting") {
			return `${set.weight || 0} ${
				exercise.unitSystem === "imperial" ? "lbs" : "kgs"
			} × ${set.reps || 0} reps`;
		} else if (exercise.type === "bodyweight") {
			return `${set.reps || 0} reps`;
		} else if (exercise.type === "cardio-distance") {
			return `${set.time || "0:00"} - ${set.distance || 0} ${
				exercise.unitSystem === "imperial" ? "mi" : "km"
			}`;
		} else if (exercise.type === "cardio-time") {
			return `${set.time || "0:00"}`;
		} else if (exercise.type === "assisted-weight") {
			return `-${set.weight || 0} ${
				exercise.unitSystem === "imperial" ? "-lbs" : "-kgs"
			} × ${set.reps || 0} reps`;
		}

		// Default fallback if type is unknown or undefined
		if (set.weight && set.reps) {
			return `${set.weight} ${
				exercise.unitSystem === "imperial" ? "lbs" : "kgs"
			} × ${set.reps} reps`;
		} else if (set.reps) {
			return `${set.reps} reps`;
		} else if (set.time) {
			return `${set.time}${
				set.distance
					? ` - ${set.distance} ${
							exercise.unitSystem === "imperial" ? "mi" : "km"
					  }`
					: ""
			}`;
		} else if (set.distance) {
			return `${set.distance} ${
				exercise.unitSystem === "imperial" ? "mi" : "km"
			}`;
		} else if (set.weight) {
			return `${set.weight} ${
				exercise.unitSystem === "imperial" ? "lbs" : "kgs"
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
			borderRadius: 8,
			padding: 0,
			overflow: "hidden",
			zIndex: 1,
		},
		scrollView: {
			width: "100%",
			padding: 20,
			paddingVertical: 0,
			paddingTop: 10,
		},
		scrollViewContent: {
			paddingBottom: 20,
		},
		title: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor || "#000",
			flex: 2,
		},
		text: {
			fontSize: 14,
			color: themeStyle.textColorSecondary || "#000",
		},
		notes: {
			fontSize: 14,
			color: themeStyle.textColorSecondary || "#000",
			marginBottom: 10,
		},
		bold: {
			fontWeight: "bold",
		},
		exerciseCard: {
			backgroundColor: themeStyle.card,
			padding: 15,
			borderRadius: 6,
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
		actionButtons: {
			flex: 1.5,
			flexDirection: "row",
			justifyContent: "flex-end",
			alignItems: "center",
			backgroundColor: themeStyle.backgroundColor,
		},
		iconButton: {
			padding: 5,
			marginLeft: 10,
		},
	});

export default HistoryModal;
