import { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";
import { useTheme } from "../../../contexts/ThemeContext";

import InfoCard from "../../../components/InfoCard";
import HistoryModal from "./HistoryModal";

import { formatTimestampToShortDate } from "../../../services/helpers/timestampFormatFunctions";

const WorkoutHistory = ({ navigation }) => {
	const { workoutHistory } = useWorkoutHistory();
	const { themeStyle } = useTheme();

	const styles = createStyles(themeStyle);

	const [selectedWorkout, setSelectedWorkout] = useState(null);
	const workoutHistoryLength = workoutHistory.length;

	const truncateTitle = (text, maxLength = 20) => {
		return text;
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
				data={workoutHistory}
				style={{
					width: "100%",
					flex: 1,
					borderTopRightRadius: 8,
					borderTopLeftRadius: 8,
				}}
				contentContainerStyle={{
					paddingBottom: 75,
				}}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => (
					<Pressable
						onPress={() => setSelectedWorkout(item)}
						style={styles.workoutCard}
					>
						<View style={styles.workoutLeftSection}>
							<View style={styles.workoutHeader}>
								<Text style={styles.workoutTitle}>
									{item.name
										? truncateTitle(item.name)
										: "Untitled Workout"}
								</Text>
								{item.imageURL !== null && (
									<Ionicons
										name="image-outline"
										size={20}
										color={themeStyle.accent}
									/>
								)}
							</View>
							<Text style={styles.workoutDate}>
								Completed:{" "}
								{formatTimestampToShortDate(item.completedAt)}
							</Text>
							{item.notes && (
								<Text
									style={styles.workoutNote}
									numberOfLines={2}
								>
									{item.notes}
								</Text>
							)}
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginTop: 8,
								}}
							>
								<Ionicons
									name="barbell-outline"
									size={20}
									color={themeStyle.textColor}
								/>
								<Text style={styles.exerciseCount}>
									{generateNumExercises(
										item.exercises.length
									)}
								</Text>
							</View>
						</View>
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
			padding: 16,
			borderRadius: 8,
			marginVertical: 10,
			borderWidth: 1,
			borderColor: themeStyle.borderColor,
		},
		workoutHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
		},
		workoutLeftSection: {
			flex: 1,
		},
		workoutTitle: {
			fontSize: 20,
			fontWeight: "700",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		workoutDate: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			marginBottom: 2,
		},
		exerciseCount: {
			marginLeft: 8,
			fontSize: 14,
			color: themeStyle.textColorSecondary,
		},
		workoutNote: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginTop: 8,
			lineHeight: 20,
			fontStyle: "italic",
		},
	});

export default WorkoutHistory;
