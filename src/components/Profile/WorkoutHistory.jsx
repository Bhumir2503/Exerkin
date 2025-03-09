import { useState, useEffect } from "react";
import {
	Text,
	View,
	FlatList,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native";
import { useWorkout } from "../../contexts/WorkoutContext";
import { useTheme } from "../../contexts/ThemeContext";
import WorkoutHistoryModal from "./WorkoutHistoryModal";


// Workout History Component
// Displays a list of past workouts with details such as date, time, and notes.
const WorkoutHistory = () => {
	const { workoutHistory } = useWorkout();
	const { themeStyle } = useTheme();
	const [selectedWorkout, setSelectedWorkout] = useState(null);
	const styles = createStyles(themeStyle);

	// Function to format the date from a timestamp
	const formatDate = (timestamp) => {
		if (!timestamp) return "No date";
		if (timestamp.seconds) {
			return new Date(timestamp.seconds * 1000).toLocaleDateString();
		}
		return new Date(timestamp).toLocaleDateString();
	};

	// if the workout history is empty, display a message
	// otherwise, display the workout history
	return workoutHistory.length > 0 ? (
		<>
			<FlatList
				bounces={false}
				showsVerticalScrollIndicator={false}
				style={{ width: "100%", padding: 20 }}
				data={[...workoutHistory].sort(
					(a, b) => b.date.seconds - a.date.seconds
				)}
				renderItem={({ item }) => (
					<TouchableWithoutFeedback
						onPress={() => setSelectedWorkout(item)}
					>
						<View style={styles.workoutCard}>
							<View style={styles.workoutHeader}>
								<Text style={styles.workoutTitle}>
									{item.name ? item.name : "Workout"} -{" "}
									{formatDate(item.date)}
								</Text>
								<Text style={styles.workoutTime}>
									{item.time}
								</Text>
							</View>
							<Text style={styles.workoutTime}>
								{item.exercises.length} workouts
							</Text>
							<Text style={styles.workoutNote}>
								{item.note || "No notes"}
							</Text>
						</View>
					</TouchableWithoutFeedback>
				)}
				keyExtractor={(item) => item.id}
			/>
			<WorkoutHistoryModal
				selectedWorkout={selectedWorkout}
				setSelectedWorkout={setSelectedWorkout}
			/>
		</>
	) : (
		<Text style={styles.noWorkoutsText}>No workouts to display</Text>
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

export default WorkoutHistory;
