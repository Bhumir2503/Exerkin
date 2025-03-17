import {
	Modal,
	View,
	Pressable,
	TouchableWithoutFeedback,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const TemplatePreviewModal = ({ visible, onClose, onStart, template }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const closeModal = () => {
		onClose();
	};

	const startWorkout = () => {
		onStart();
		closeModal();
	};

	// Calculate total exercises
	const totalExercises = template?.exercises?.length || 0;

	// Function to render set information based on exercise type
	const renderSetInfo = (set, exercise) => {
		if (exercise.type === "weightlifting") {
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
		<Modal visible={visible} animationType="fade" transparent={true}>
			<View style={styles.modalOverlay}>
				<TouchableWithoutFeedback onPress={closeModal}>
					<View style={styles.backgroundOverlay} />
				</TouchableWithoutFeedback>
				<View style={styles.modalContainer}>
					{/* Header with close button */}
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>
							{template?.name || "Workout Template"}
						</Text>
						<TouchableOpacity
							onPress={() => console.log("menu button pressed")}
						>
							<Ionicons
								name="ellipsis-horizontal"
								size={24}
								color={themeStyle.textColor}
							/>
						</TouchableOpacity>
					</View>

					{/* Content */}
					<ScrollView
						style={styles.scrollContent}
						showsVerticalScrollIndicator={false}
						bounces={false}
					>
						<View style={styles.modalContent}>
							{/* Template Stats */}
							<View style={styles.statsContainer}>
								<View style={styles.statItem}>
									<Ionicons
										name="barbell-outline"
										size={24}
										color={themeStyle.primary}
									/>
									<Text style={styles.statValue}>
										{totalExercises}
									</Text>
									<Text style={styles.statLabel}>
										Exercises
									</Text>
								</View>

								<View style={styles.statItem}>
									<Ionicons
										name="time-outline"
										size={24}
										color={themeStyle.primary}
									/>
									<Text style={styles.statValue}>~45</Text>
									<Text style={styles.statLabel}>
										Minutes
									</Text>
								</View>

								<View style={styles.statItem}>
									<Ionicons
										name="flame-outline"
										size={24}
										color={themeStyle.primary}
									/>
									<Text style={styles.statValue}>~320</Text>
									<Text style={styles.statLabel}>
										Calories
									</Text>
								</View>
							</View>

							{/* Exercise List */}
							<Text style={styles.sectionTitle}>Exercises</Text>

							{template?.exercises &&
							template.exercises.length > 0 ? (
								template.exercises.map((exercise, index) => (
									<View
										key={exercise.id || index}
										style={styles.exerciseItem}
									>
										<View style={styles.exerciseHeader}>
											<Text style={styles.exerciseName}>
												{exercise.name}
											</Text>
											<Text style={styles.exerciseSets}>
												{exercise.sets?.length || 0}{" "}
												sets
											</Text>
										</View>

										{exercise.sets &&
										exercise.sets.length > 0 ? (
											<View style={styles.setsList}>
												{exercise.sets.map(
													(set, setIndex) => (
														<View
															key={setIndex}
															style={
																styles.setRow
															}
														>
															<Text
																style={
																	styles.setNumber
																}
															>
																Set{" "}
																{setIndex + 1}
															</Text>
															<Text
																style={
																	styles.setDetails
																}
															>
																{renderSetInfo(
																	set,
																	exercise
																)}
															</Text>
														</View>
													)
												)}
											</View>
										) : (
											<Text style={styles.noSetsText}>
												No sets recorded
											</Text>
										)}
									</View>
								))
							) : (
								<View style={styles.emptyState}>
									<Ionicons
										name="fitness-outline"
										size={40}
										color={themeStyle.textColor}
										style={{ opacity: 0.5 }}
									/>
									<Text style={styles.emptyText}>
										No exercises in this template
									</Text>
								</View>
							)}
						</View>
					</ScrollView>

					{/* Action Buttons */}
					<View style={styles.buttonView}>
						<TouchableOpacity
							onPress={closeModal}
							style={styles.closeButton}
						>
							<Text style={styles.closeText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={startWorkout}
							style={styles.submit}
						>
							<Text style={styles.submitText}>Start Workout</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
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
			borderRadius: 15,
			overflow: "hidden",
			zIndex: 1,
		},
		modalHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			paddingHorizontal: 20,
			paddingTop: 25,
			paddingBottom: 15,
		},
		scrollContent: {
			width: "100%",
		},
		modalContent: {
			paddingHorizontal: 20,
		},
		modalTitle: {
			color: themeStyle.textColor,
			fontSize: 22,
			fontWeight: "bold",
		},
		sectionTitle: {
			color: themeStyle.textColor,
			fontSize: 18,
			fontWeight: "bold",
			marginTop: 20,
			marginBottom: 10,
		},
		statsContainer: {
			flexDirection: "row",
			justifyContent: "space-around",
			marginVertical: 15,
			backgroundColor: themeStyle.card,
			borderRadius: 10,
			padding: 15,
		},
		statItem: {
			alignItems: "center",
		},
		statValue: {
			color: themeStyle.textColor,
			fontSize: 18,
			fontWeight: "bold",
			marginTop: 5,
		},
		statLabel: {
			color: themeStyle.textColor,
			fontSize: 12,
			opacity: 0.7,
		},
		exerciseItem: {
			backgroundColor: themeStyle.card,
			borderRadius: 10,
			padding: 15,
			marginBottom: 10,
		},
		exerciseHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 8,
		},
		exerciseName: {
			color: themeStyle.textColor,
			fontSize: 16,
			fontWeight: "bold",
		},
		exerciseSets: {
			color: themeStyle.primary,
			fontSize: 14,
		},
		setsList: {
			borderTopWidth: 1,
			borderTopColor: "rgba(255,255,255,0.1)",
			paddingTop: 8,
		},
		setRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 5,
			paddingVertical: 3,
		},
		setNumber: {
			fontSize: 14,
			fontWeight: "500",
			color: themeStyle.textColorSecondary || themeStyle.textColor,
			opacity: 0.8,
		},
		setDetails: {
			color: themeStyle.textColor,
			fontSize: 14,
		},
		noSetsText: {
			color: themeStyle.textColor,
			fontSize: 14,
			opacity: 0.7,
			fontStyle: "italic",
			marginTop: 5,
		},
		emptyState: {
			alignItems: "center",
			justifyContent: "center",
			paddingVertical: 30,
			opacity: 0.7,
		},
		emptyText: {
			color: themeStyle.textColor,
			fontSize: 16,
			marginTop: 10,
		},
		buttonView: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			padding: 20,
			paddingHorizontal: 15,
		},
		closeButton: {
			padding: 12,
			paddingHorizontal: 20,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: "rgba(255,255,255,0.2)",
		},
		closeText: {
			color: themeStyle.textColor,
			fontWeight: "bold",
			fontSize: 16,
		},
		submit: {
			backgroundColor: themeStyle.primary,
			padding: 12,
			paddingHorizontal: 20,
			borderRadius: 8,
			shadowColor: themeStyle.primary,
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.3,
			shadowRadius: 3,
			elevation: 4,
		},
		submitText: {
			color: "white",
			fontWeight: "bold",
			fontSize: 16,
		},
	});
};

export default TemplatePreviewModal;
