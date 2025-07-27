// components/LiftsTab.jsx
import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";
import useStatsCalculations from "../../../hooks/useStatsCalculations";

const LiftsTab = () => {
	const { themeStyle } = useTheme();
	const { workoutHistory } = useWorkoutHistory();
	const styles = createStyles(themeStyle);
	const [filterType, setFilterType] = useState("1RM");
	const [viewMode, setViewMode] = useState("best");
	const {
		popularExercises,
		exerciseIcons,
		filterWorkoutData,
		getBestLift,
		getProgressData,
	} = useStatsCalculations(workoutHistory);

	const toggleFilterType = () => {
		const options = ["1RM", "Reps", "Volume"];
		const index = options.indexOf(filterType);
		setFilterType(options[(index + 1) % options.length]);
	};

	return (
		<View style={styles.tabContent}>
			<View style={styles.headerRow}>
				<Text style={styles.sectionTitle}>
					{viewMode === "best" ? "Best Lifts" : "Progress Tracking"}
				</Text>
				<TouchableOpacity
					onPress={() =>
						setViewMode(viewMode === "best" ? "progress" : "best")
					}
				>
					<Ionicons
						name="swap-horizontal"
						size={20}
						color={themeStyle.primary}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.filtersRow}>
				<TouchableOpacity
					style={styles.filterChip}
					onPress={toggleFilterType}
				>
					<Text style={styles.filterChipText}>
						Metric: {filterType}
					</Text>
				</TouchableOpacity>
			</View>

			{viewMode === "best"
				? popularExercises.map((exercise, index) => {
						const { text } = getBestLift(
							filterWorkoutData(exercise),
							filterType
						);
						return (
							<View key={index} style={styles.exerciseRow}>
								<Text style={styles.liftName}>{exercise}</Text>
								<Text style={styles.liftValue}>{text}</Text>
							</View>
						);
				  })
				: popularExercises.map((exercise, index) => {
						const chartData = getProgressData(exercise, filterType);
						return (
							<View key={index} style={styles.progressCard}>
								<Text style={styles.progressTitle}>
									{exercise}
								</Text>
								{chartData ? (
									<LineChart
										data={chartData}
										width={
											Dimensions.get("window").width - 60
										}
										height={180}
										chartConfig={{
											backgroundColor: themeStyle.card,
											backgroundGradientFrom:
												themeStyle.card,
											backgroundGradientTo:
												themeStyle.card,
											color: () => themeStyle.primary,
											labelColor: () =>
												themeStyle.textColor,
										}}
										style={{
											marginVertical: 8,
											borderRadius: 16,
										}}
									/>
								) : (
									<Text style={styles.noDataText}>
										Not enough data
									</Text>
								)}
							</View>
						);
				  })}
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

export default LiftsTab;
