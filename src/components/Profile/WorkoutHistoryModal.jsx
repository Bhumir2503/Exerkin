import {
	StyleSheet,
	Modal,
	TouchableWithoutFeedback,
	View,
	ScrollView,
	Text,
	Pressable,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

// Workout History Modal Component
// Displays detailed information about a selected workout, including exercises and sets.
const WorkoutHistoryModal = ({ selectedWorkout, setSelectedWorkout }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<Modal
			visible={!!selectedWorkout}
			animationType="fade"
			transparent={true}
		>
			<TouchableWithoutFeedback onPress={() => setSelectedWorkout(null)}>
				<View style={styles.modalOverlay}>
					<TouchableWithoutFeedback>
						<View style={styles.modalContainer}>
							<ScrollView style={styles.modalScrollView}>
								{selectedWorkout && (
									<View>
										<Text style={styles.workoutTitle}>
											{selectedWorkout.name}
										</Text>
										<Text>
											Time: {selectedWorkout.time}
										</Text>
										<Text>
											Note:{" "}
											{selectedWorkout.note || "No notes"}
										</Text>

										{/* Display exercises */}
										{selectedWorkout.exercises &&
										selectedWorkout.exercises.length > 0 ? (
											<View>
												<Text
													style={styles.sectionTitle}
												>
													Exercises:
												</Text>
												{selectedWorkout.exercises.map(
													(exercise, index) => (
														<View
															key={index}
															style={
																styles.exerciseItem
															}
														>
															<Text
																style={
																	styles.exerciseName
																}
															>
																{exercise.name}
															</Text>

															{exercise.sets.map(
																(
																	set,
																	setIndex
																) => (
																	<View
																		key={
																			setIndex
																		}
																		style={
																			styles.setItem
																		}
																	>
																		<Text>
																			Set{" "}
																			{setIndex +
																				1}
																			:
																		</Text>
																		<Text>
																			{
																				set.weight
																			}{" "}
																			lbs
																		</Text>

																		<Text>
																			<Text
																				style={{
																					fontStyle:
																						"italic",
																				}}
																			>
																				reps:
																			</Text>{" "}
																			{
																				set.reps
																			}
																		</Text>
																	</View>
																)
															)}
														</View>
													)
												)}
											</View>
										) : (
											<Text style={styles.noWorkoutsText}>
												No exercises recorded
											</Text>
										)}
									</View>
								)}
								{/* <Button title="Close" onPress={() => setSelectedWorkout(null)} /> */}
							</ScrollView>
							<View style={styles.closeButtonContainer}>
								<Pressable
									onPress={() => setSelectedWorkout(null)}
									style={styles.closeButton}
								>
									<Text style={styles.closeButtonText}>
										Close
									</Text>
								</Pressable>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			backgroundColor: themeStyle.backgroundColor,
		},
		topBar: {
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		profileSection: {
			padding: 20,
			paddingBottom: 20,
			flexDirection: "row",
			alignItems: "center",
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
		},
		username: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		clearButtonContainer: {
			marginTop: 20,
		},
		workoutCard: {
			backgroundColor: themeStyle.card,
			padding: 20,
			borderRadius: 10,
			marginBottom: 20,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
		workoutTime: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginTop: 5,
		},
		workoutNote: {
			fontSize: 14,
			fontStyle: "italic",
			color: themeStyle.textColorSecondary,
			marginTop: 5,
		},
		modalOverlay: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "rgba(0, 0, 0, 0.5)",
		},
		modalContainer: {
			width: "80%",
			height: "75%",
			backgroundColor: "white",
			borderRadius: 10,
			padding: 20,

			justifyContent: "space-between",
		},
		modalScrollView: {
			flex: 1,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			marginTop: 15,
			color: themeStyle.textColor,
		},
		exerciseItem: {
			backgroundColor: themeStyle.card,
			padding: 10,
			marginVertical: 5,
			borderRadius: 8,
		},
		exerciseName: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 5,
		},
		setItem: {
			backgroundColor: themeStyle.cardSecondary,
			padding: 8,
			marginVertical: 4,
			borderRadius: 6,
			flexDirection: "row",
			justifyContent: "space-evenly",
		},
		closeButtonContainer: {
			alignItems: "center",
			justifyContent: "center",
			paddingVertical: 15,
			borderTopWidth: 1,
			borderColor: "#ccc",
		},
		closeButton: {
			backgroundColor: "#B22222",
			paddingVertical: 12,
			paddingHorizontal: 40,
			borderRadius: 8,
		},
		closeButtonText: {
			color: "white",
			fontSize: 18,
			fontWeight: "bold",
		},
		workoutHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
		},
	});

export default WorkoutHistoryModal;
