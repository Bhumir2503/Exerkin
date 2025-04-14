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
import { formatTimeStamptoDateString } from "../../services/helpers/timeFormatter";

// Workout History Component
// Displays a list of past workouts with details such as date, time, and notes.
const WorkoutHistory = ({navigation}) => {
	const { workoutHistory } = useWorkout();
	const { themeStyle } = useTheme();
	const [selectedWorkout, setSelectedWorkout] = useState(null);
	const styles = createStyles(themeStyle);

	const handlePressOnWorkout = (workout) => {
		setSelectedWorkout(workout);
	};

	const truncateTitle = (text, maxLength = 20) => {
		if (!text) return "No title";
	
		if (text.length > maxLength) {
			return text.substring(0, maxLength - 3).trim() + " ...";
		}
		return text;
	}

	const truncateNotes = (text, maxLength = 50) => {
		if (!text) return "No notes";
	
		//splitting by punctuation
		const sentences = text.match(/[^.!?]+[.!?]*/g);
	
		if (sentences && sentences.length > 0) {
			//when there is punctuation, return this
			let truncatedText = sentences[0].trim();
			if (truncatedText.length >= maxLength) {
				return truncatedText.substring(0, maxLength - 3).trim() + " ...";
			}
	
			//add part of the second sentence.
			if (sentences.length > 1) {
				let secondSentenceHalf = sentences[1].trim().split(" ").slice(0, 4).join(" ");
				let combinedText = `${truncatedText} ${secondSentenceHalf}`;
	
				if (combinedText.length > maxLength) {
					return truncatedText + " ...";
				}
				return combinedText + " ...";
			}
	
			return truncatedText + " ...";
		} 
	
		// if there is no punctuation, split by spaces and limit
		if (text.includes(" ")) {
			// Truncate by words
			const words = text.split(" ");
			let truncatedText = words.slice(0, 15).join(" ");
	
			if (text.length > maxLength) {
				return truncatedText + " ...";
			}
			return truncatedText;
		}
	
		// if there is no space or punctuation, stop using hardcode maxlength.
		return text.substring(0, maxLength - 3) + " ...";
	};

	const generateNumExercises = (num) => {
		if (num != 1) {
			return `${num} exercises`;
		}
		else{
			return `${num} exercise`;
		}
	}

	// if the workout history is empty, display a message
	// otherwise, display the workout history
	return workoutHistory.length > 0 ? (
		<View>
			<FlatList
				bounces={false}
				showsVerticalScrollIndicator={false}
				style={{ width: "100%" }}
				data={[...workoutHistory].sort(
					(a, b) => b.startedAt - a.startedAt
				)}
				renderItem={({ item }) => (
					<TouchableWithoutFeedback
						onPress={() => handlePressOnWorkout(item)}
					>
						<View style={styles.workoutCard}>
							<View style={styles.workoutHeader}>
								<Text style={styles.workoutTitle}>
									{item.name ? truncateTitle(item.name) : "Workout"} -{" "}
									{formatTimeStamptoDateString(item.startedAt)}
								</Text>
								<Text style={styles.syncStatus}>
									{item.syncStatus !== "synced" &&
										"Unsynced"
									}
								</Text>
							</View>  
							<Text style={styles.workoutTime}>
								{generateNumExercises(item.exercises.length)}
							</Text>
							<Text style={styles.workoutNote}>
								{truncateNotes(item.notes)}
							</Text>
						</View>
					</TouchableWithoutFeedback>
				)}
				keyExtractor={(item) => item.workoutId}
			/>

			<WorkoutHistoryModal
				selectedWorkout={selectedWorkout}
				setSelectedWorkout={setSelectedWorkout}
				navigation={navigation}
			/>
		</View>
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
			borderRadius: 8,
			marginBottom: 20,

		},
		workoutTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		syncStatus: {
			fontSize: 14,
			color: themeStyle.accent,
			fontWeight: "bold",
			textAlign: "right",
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
			borderRadius: 8,
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
