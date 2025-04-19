import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";
import { useTheme } from "../../../contexts/ThemeContext";

import InfoCard from "../../../components/InfoCard";
import HistoryModal from "./HistoryModal";

import { formatTimeStamptoDateString } from "../../../services/helpers/timeFormatter";

const WorkoutHistory = ({ navigation }) => {
	const { workoutHistory } = useWorkoutHistory();
	const { themeStyle } = useTheme();

	const styles = createStyles(themeStyle);

	const [selectedWorkout, setSelectedWorkout] = useState(null);
	const workoutHistoryLength = workoutHistory.length;

	const truncateTitle = (text, maxLength = 20) => {
		if (!text) return "No title";

		if (text.length > maxLength) {
			return text.substring(0, maxLength - 3).trim() + " ...";
		}
		return text;
	};

	const truncateNotes = (text, maxLength = 50) => {
		if (!text) return "No notes";

		//splitting by punctuation
		const sentences = text.match(/[^.!?]+[.!?]*/g);

		if (sentences && sentences.length > 0) {
			//when there is punctuation, return this
			let truncatedText = sentences[0].trim();
			if (truncatedText.length >= maxLength) {
				return (
					truncatedText.substring(0, maxLength - 3).trim() + " ..."
				);
			}

			//add part of the second sentence.
			if (sentences.length > 1) {
				let secondSentenceHalf = sentences[1]
					.trim()
					.split(" ")
					.slice(0, 4)
					.join(" ");
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
		} else {
			return `${num} exercise`;
		}
	};

	if (workoutHistoryLength === 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Workout History</Text>
				<InfoCard
					title="No Workouts Found"
					message="You haven't logged any workouts yet."
					icon="alert"
					width="100%"
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Past {workoutHistoryLength === 1 ? "Workout" : "Workouts"}
			</Text>
			<FlatList
				keyExtractor={(item) => item.workoutId}
				data={[...workoutHistory].sort(
					(a, b) => b.startedAt - a.startedAt
				)}
				style={{ width: "100%", flex: 1, borderTopRightRadius: 8, borderTopLeftRadius: 8 }}
				contentContainerStyle={{
					paddingBottom: 75,
				}}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => setSelectedWorkout(item)}
						style={styles.workoutCard}
					>
						<View style={styles.workoutHeader}>
							<Text style={styles.workoutTitle}>
								{item.name
									? truncateTitle(item.name)
									: "Workout"}{" "}
								- {formatTimeStamptoDateString(item.startedAt)}
							</Text>
							{item.syncStatus !== "synced" && (
								<Ionicons
									name="cloud-offline-outline"
									size={20}
									color={themeStyle.accent}
								/>
							)}
						</View>
						<Text style={styles.workoutTime}>
							{generateNumExercises(item.exercises.length)}
						</Text>
						<Text style={styles.workoutNote}>
							{truncateNotes(item.notes)}
						</Text>
					</Pressable>
				)}
			/>
			<HistoryModal
				selectedWorkout={selectedWorkout}
				setSelectedWorkout={setSelectedWorkout}
				navigation={navigation}
			/>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: 20,
			paddingTop: 20,
			backgroundColor: themeStyle.backgroundColor,
		},
		title: {
			fontSize: 20,
			fontWeight: "bold",

			color: themeStyle.textColor,
		},
		workoutCard: {
			backgroundColor: themeStyle.card,
			padding: 20,
			borderRadius: 8,
			marginVertical: 10,
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

		workoutHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
		},
	});

export default WorkoutHistory;
