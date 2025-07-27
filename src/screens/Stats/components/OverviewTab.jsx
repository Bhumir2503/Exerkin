// components/OverviewTab.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";
import useStatsCalculations from "../../../hooks/useStatsCalculations";

const OverviewTab = () => {
	const { themeStyle } = useTheme();
	const { workoutHistory } = useWorkoutHistory();
	const styles = createStyles(themeStyle);
	const { statsSummary, weeklyActivity, monthlyData } =
		useStatsCalculations(workoutHistory);

	return (
		<View style={styles.tabContent}>
			<View style={styles.summaryContainer}>
				<Text style={styles.sectionTitle}>Summary</Text>
				{/* Total Workouts, Volume, Duration, Streak */}
			</View>
			<View style={styles.additionalStatsContainer}>
				<Text style={styles.sectionTitle}>Detailed Stats</Text>
				{/* Sets, Reps, Weight, Focus, etc */}
			</View>
			<View style={styles.chartContainer}>
				<Text style={styles.sectionTitle}>Monthly Activity</Text>
				<BarChart
					data={monthlyData}
					width={340}
					height={200}
					yAxisSuffix=""
					chartConfig={{
						backgroundColor: themeStyle.card,
						backgroundGradientFrom: themeStyle.card,
						backgroundGradientTo: themeStyle.card,
						color: () => themeStyle.primary,
						labelColor: () => themeStyle.textColor,
					}}
				/>
			</View>
			<View style={styles.weeklyContainer}>
				<Text style={styles.sectionTitle}>Weekly Activity</Text>
				{/* Weekly heatmap using weeklyActivity */}
			</View>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		scrollContainer: {
			flex: 1,
			width: "100%",
		},
		topBar: {
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
		},
		title: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor,

			textAlign: "center",
			marginLeft: 10,
			textAlign: "center",
		},
		tabBar: {
			flexDirection: "row",
			justifyContent: "space-around",
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
			paddingBottom: 0,
		},
		tab: {
			alignItems: "center",
			paddingVertical: 12,
			paddingHorizontal: 16,
			position: "relative",
		},
		tabText: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			marginTop: 4,
		},
		activeTabText: {
			color: themeStyle.primary,
			fontWeight: "600",
		},
		tabIndicator: {
			position: "absolute",
			bottom: 0,
			left: 8,
			right: 8,
			height: 3,
			borderTopLeftRadius: 3,
			borderTopRightRadius: 3,
			backgroundColor: "transparent",
		},
		activeTabIndicator: {
			backgroundColor: themeStyle.primary,
		},
		tabContent: {
			paddingBottom: 30,
		},
		summaryContainer: {
			marginHorizontal: 20,
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
			padding: 15,
			backgroundColor: `${themeStyle.primary}15`, // Very light tint of primary color
			borderRadius: 6,
			alignItems: "center",
		},
		summaryIcon: {
			marginBottom: 10,
		},
		summaryValue: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 8,
			letterSpacing: 0.5,
		},
		summaryLabel: {
			fontSize: 13,
			color: themeStyle.textColorSecondary,
			fontWeight: "500",
			letterSpacing: 0.3,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 12,
			letterSpacing: 0.3,
		},
		additionalStatsContainer: {
			marginHorizontal: 20,
			marginTop: 20,
		},
		detailedStatsBox: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 15,
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
			marginBottom: 4,
		},
		statValue: {
			fontSize: 17,
			fontWeight: "600",
			color: themeStyle.textColor,
		},
		bestLiftsContainer: {
			marginHorizontal: 20,
			marginTop: 20,
			marginBottom: 30,
		},
		bestLiftsBox: {
			padding: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			marginTop: 15,
		},
		headerRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		filtersRow: {
			flexDirection: "row",
			marginTop: 10,
			marginBottom: 5,
		},
		filterChip: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.card,
			paddingHorizontal: 14,
			paddingVertical: 8,
			borderRadius: 6,
			marginRight: 10,
			borderWidth: 1,
			borderColor: themeStyle.borderColor,
		},
		filterChipText: {
			color: themeStyle.textColorSecondary,
			fontSize: 14,
			marginRight: 5,
			fontWeight: "600",
			letterSpacing: 0.2,
		},
		filterContainer: {
			flexDirection: "row",
			alignItems: "center",
		},
		filterButton: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.card,
			paddingHorizontal: 12,
			paddingVertical: 7,
			borderRadius: 6,
			borderWidth: 1,
			borderColor: themeStyle.borderColor,
		},
		filterButtonText: {
			color: themeStyle.textColorSecondary,
			fontSize: 14,
			marginRight: 5,
			fontWeight: "600",
			letterSpacing: 0.2,
		},
		exerciseRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			paddingVertical: 14,
			marginHorizontal: 2,
		},
		exerciseNameContainer: {
			flexDirection: "row",
			alignItems: "center",
			flex: 1,
		},
		exerciseIcon: {
			marginRight: 8,
		},
		progressTitleRow: {
			flexDirection: "row",
			alignItems: "center",
		},
		progressTitleIcon: {
			marginRight: 8,
		},
		liftName: {
			fontSize: 16,
			color: themeStyle.textColor,
			flex: 1,
			fontWeight: "500",
			letterSpacing: 0.2,
		},
		liftValue: {
			fontSize: 17,
			fontWeight: "bold",
			color: themeStyle.primary,
			letterSpacing: 0.3,
		},
		liftNameEstimated: {
			fontSize: 17,
			fontStyle: "italic",
			color: themeStyle.textColorSecondary,
			letterSpacing: 0.3,
		},
		progressContainer: {
			marginTop: 10,
		},
		progressCard: {
			marginBottom: 24,
			padding: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 8,
		},
		progressTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 15,
			letterSpacing: 0.3,
			paddingLeft: 4,
		},
		chartContainer: {
			marginHorizontal: 20,
			marginTop: 20,
		},
		chartBox: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 15,
			alignItems: "center",
		},
		chartLabel: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			textAlign: "center",
			marginTop: 5,
		},
		weeklyContainer: {
			marginHorizontal: 20,
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
			color: "#FFFFFF",
			fontSize: 14,
			fontWeight: "bold",
		},
		dayLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
		trendRow: {
			flexDirection: "row",
			justifyContent: "space-around",
			width: "100%",
			padding: 10,
		},
		trendItem: {
			alignItems: "center",
		},
		trendLabel: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginBottom: 6,
		},
		trendValue: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.primary,
		},
		muscleGroupsContainer: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 15,
		},
		muscleGroupItem: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: 10,
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
		},
		muscleGroupIndicator: {
			width: 16,
			height: 16,
			borderRadius: 6,
			marginRight: 10,
		},
		muscleGroupName: {
			fontSize: 16,
			color: themeStyle.textColor,
			flex: 1,
		},
		muscleGroupCount: {
			fontSize: 15,
			color: themeStyle.textColorSecondary,
			fontWeight: "500",
		},
		noDataContainer: {
			height: 180,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: `${themeStyle.primary}10`, // Very light tint of primary color
			borderRadius: 6,
			borderWidth: 1,
			borderColor: `${themeStyle.primary}20`,
			marginVertical: 8,
		},
		noDataText: {
			color: themeStyle.textColorSecondary,
			fontStyle: "italic",
			fontSize: 15,
			letterSpacing: 0.3,
		},
	});

export default OverviewTab;
