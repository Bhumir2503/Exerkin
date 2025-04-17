import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";

import {
	workoutStreak,
	getWorkoutsThisWeek,
} from "../../../services/helpers/workoutHistoryHelpers";

const Stats = () => {
	const { themeStyle } = useTheme();
	const { workoutHistory } = useWorkoutHistory();

	const stats = [
		{ label: "Workouts", value: workoutHistory.length || 0 },
		{ label: "Streak", value: workoutStreak(workoutHistory) || 0 },
		{ label: "This Week", value: getWorkoutsThisWeek(workoutHistory) || 0 },
	];

	const styles = createStyles(themeStyle);

	return (
		<View style={styles.container}>
			{stats.map((stat, index) => (
				<View key={index} style={styles.statContainer}>
					<Text style={styles.statValue}>{stat.value}</Text>
					<Text style={styles.statLabel}>{stat.label}</Text>
				</View>
			))}
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flexDirection: "row",
			justifyContent: "space-around",
			paddingVertical: 15,
            paddingBottom: 0,
			marginTop: 10,
			marginHorizontal: 20,
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 12,
		},
		statContainer: {
			alignItems: "center",
		},
		statLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			marginTop: 4,
		},
		statValue: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
	});

export default Stats;
