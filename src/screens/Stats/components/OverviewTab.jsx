// components/OverviewTab.jsx
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";
import useStatsCalculations from "../../../hooks/useStatsCalculations";

const OverviewTab = () => {
	const { themeStyle } = useTheme();
	const { workoutHistory } = useWorkoutHistory();
	const styles = createStyles(themeStyle);
	const { statsSummary, weeklyActivity } =
		useStatsCalculations(workoutHistory);

	const renderSummaryItem = (icon, value, label, iconColor) => (
		<View style={styles.summaryItem}>
			<View style={styles.summaryIcon}>
				<Ionicons
					name={icon}
					size={24}
					color={iconColor || themeStyle.primary}
				/>
			</View>
			<Text style={styles.summaryValue}>{value}</Text>
			<Text style={styles.summaryLabel}>{label}</Text>
		</View>
	);

	const renderWeeklyHeatmap = () => {
		const days = ["S", "M", "T", "W", "T", "F", "S"];
		const maxActivity = Math.max(...weeklyActivity, 1);

		return (
			<View style={styles.weeklyHeatmap}>
				{weeklyActivity.map((count, index) => {
					const intensity = count / maxActivity;
					const backgroundColor =
						intensity > 0
							? `rgba(${hexToRgb(themeStyle.primary)}, ${
									0.2 + intensity * 0.8
							  })`
							: `${themeStyle.primary}15`;

					return (
						<View key={index} style={styles.dayColumn}>
							<View
								style={[
									styles.activityIndicator,
									{ backgroundColor },
								]}
							>
								<Text
									style={[
										styles.activityCount,
										{
											color:
												intensity > 0.5
													? "#FFFFFF"
													: themeStyle.textColor,
										},
									]}
								>
									{}
								</Text>
							</View>
							<Text style={styles.dayLabel}>{days[index]}</Text>
						</View>
					);
				})}
			</View>
		);
	};

	return (
		<View style={styles.tabContent}>
			{/* Quick Stats Summary */}
			<View style={styles.summaryContainer}>
				<Text style={styles.sectionTitle}>Quick Stats</Text>
				<View style={styles.summaryGrid}>
					{renderSummaryItem(
						"barbell-outline",
						statsSummary.totalWorkouts,
						"Total Workouts",
						"#FF6B6B"
					)}
					{renderSummaryItem(
						"fitness-outline",
						statsSummary.totalVolume,
						"Total Volume",
						"#4ECDC4"
					)}
					{renderSummaryItem(
						"time-outline",
						statsSummary.totalDuration,
						"Total Time",
						"#45B7D1"
					)}
					{renderSummaryItem(
						"flame-outline",
						`${statsSummary.workoutStreak} days`,
						"Current Streak",
						"#FECA57"
					)}
				</View>
			</View>

			{/* Detailed Stats */}
			<View style={styles.additionalStatsContainer}>
				<Text style={styles.sectionTitle}>Detailed Overview</Text>
				<View style={styles.detailedStatsBox}>
					<View style={styles.statRow}>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Total Sets</Text>
							<Text style={styles.statValue}>
								{statsSummary.totalSets}
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Total Reps</Text>
							<Text style={styles.statValue}>
								{statsSummary.totalReps}
							</Text>
						</View>
					</View>
					<View style={styles.statRow}>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Avg Duration</Text>
							<Text style={styles.statValue}>
								{statsSummary.avgDuration}
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Avg Volume</Text>
							<Text style={styles.statValue}>
								{statsSummary.avgVolume}
							</Text>
						</View>
					</View>
					<View style={styles.statRow}>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>
								Longest Workout
							</Text>
							<Text style={styles.statValue}>
								{statsSummary.longestWorkout}
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Best Day</Text>
							<Text style={styles.statValue}>
								{statsSummary.bestDay}
							</Text>
						</View>
					</View>
					<View style={styles.statRow}>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Workouts/Week</Text>
							<Text style={styles.statValue}>
								{statsSummary.workoutsPerWeek}
							</Text>
						</View>
						<View style={styles.statItem}>
							<Text style={styles.statLabel}>Total Distance</Text>
							<Text style={styles.statValue}>
								{statsSummary.totalDistance}
							</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Weekly Activity Pattern */}
			<View style={styles.weeklyContainer}>
				<Text style={styles.sectionTitle}>Weekly Activity Pattern</Text>
				{renderWeeklyHeatmap()}
			</View>

			{/* Personal Records Summary */}
			<View style={styles.recordsContainer}>
				<Text style={styles.sectionTitle}>Total Quick View</Text>
				<View style={styles.recordsGrid}>
					<View style={styles.recordItem}>
						<Ionicons
							name="trophy-outline"
							size={20}
							color="#FFD700"
						/>
						<Text style={styles.recordValue}>
							{workoutHistory.length}
						</Text>
						<Text style={styles.recordLabel}>Workouts</Text>
					</View>
					<View style={styles.recordItem}>
						<Ionicons
							name="trending-up-outline"
							size={20}
							color="#32CD32"
						/>
						<Text style={styles.recordValue}>
							{statsSummary.totalExercises}
						</Text>
						<Text style={styles.recordLabel}>Exercises</Text>
					</View>
					<View style={styles.recordItem}>
						<Ionicons
							name="time-outline"
							size={20}
							color="#FF69B4"
						/>
						<Text style={styles.recordValue}>
							{statsSummary.totalSets}
						</Text>
						<Text style={styles.recordLabel}>Sets</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
				result[3],
				16
		  )}`
		: "74, 144, 226"; // Default blue
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		summaryContainer: {
			marginTop: 15,
			padding: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 8,
		},
		summaryGrid: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "space-between",
			marginTop: 15,
		},
		summaryItem: {
			width: "48%",
			marginBottom: 15,
			padding: 16,
			backgroundColor: `${themeStyle.primary}8`,
			borderRadius: 6,
			alignItems: "center",
			borderWidth: 1,
			borderColor: `${themeStyle.primary}75`,
		},
		summaryIcon: {
			marginBottom: 8,
		},
		summaryValue: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 4,
			letterSpacing: 0.5,
		},
		summaryLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			fontWeight: "600",
			letterSpacing: 0.3,
			textAlign: "center",
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 12,
			letterSpacing: 0.3,
		},
		additionalStatsContainer: {
			marginTop: 20,
		},
		detailedStatsBox: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 20,
		},
		statRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 16,
		},
		statItem: {
			width: "48%",
		},
		statLabel: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginBottom: 6,
			fontWeight: "500",
		},
		statValue: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		weeklyContainer: {
			marginTop: 20,
		},
		weeklyHeatmap: {
			flexDirection: "row",
			justifyContent: "space-between",
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 15,
			marginBottom: 5,
		},
		dayColumn: {
			alignItems: "center",
		},
		activityIndicator: {
			width: 36,
			height: 36,
			borderRadius: 6,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 8,
		},
		activityCount: {
			fontSize: 14,
			fontWeight: "bold",
		},
		dayLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			fontWeight: "500",
		},
		recordsContainer: {
			marginTop: 20,
		},
		recordsGrid: {
			flexDirection: "row",
			justifyContent: "space-around",
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 20,
		},
		recordItem: {
			alignItems: "center",
		},
		recordValue: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginTop: 8,
			marginBottom: 4,
		},
		recordLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			fontWeight: "500",
		},
	});

export default OverviewTab;
