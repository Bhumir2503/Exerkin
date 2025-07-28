// components/LiftsTab.jsx
import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	ScrollView,
	Alert,
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
	const [selectedExercise, setSelectedExercise] = useState(null);
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

	const getMetricIcon = (metric) => {
		switch (metric) {
			case "1RM":
				return "barbell-outline";
			case "Reps":
				return "repeat-outline";
			case "Volume":
				return "cube-outline";
			default:
				return "stats-chart-outline";
		}
	};

	const getMetricColor = (metric) => {
		switch (metric) {
			case "1RM":
				return "#FF6B6B";
			case "Reps":
				return "#4ECDC4";
			case "Volume":
				return "#45B7D1";
			default:
				return themeStyle.primary;
		}
	};

	const renderBestLiftsView = () => (
		<View style={styles.liftsContainer}>
			<View style={styles.liftsHeader}>
				<View style={styles.rankHeader}>
					<Text style={styles.rankHeaderText}>Rank</Text>
				</View>
				<View style={styles.exerciseHeader}>
					<Text style={styles.exerciseHeaderText}>Exercise</Text>
				</View>
				<View style={styles.valueHeader}>
					<Text style={styles.valueHeaderText}>{filterType}</Text>
				</View>
			</View>

			{popularExercises.slice(0, 10).map((exercise, index) => {
				const { text, value } = getBestLift(
					filterWorkoutData(exercise),
					filterType
				);
				const isPersonalRecord = index < 3; // Top 3 are PRs

				return (
					<TouchableOpacity
						key={index}
						style={[
							styles.exerciseRow,
							isPersonalRecord && styles.prRow,
						]}
						onPress={() => setSelectedExercise(exercise)}
					>
						<View style={styles.rankContainer}>
							<View
								style={[
									styles.rankBadge,
									{
										backgroundColor:
											index === 0
												? "#FFD700"
												: index === 1
												? "#C0C0C0"
												: index === 2
												? "#CD7F32"
												: `${themeStyle.primary}20`,
									},
								]}
							>
								<Text
									style={[
										styles.rankText,
										{
											color:
												index < 3
													? "#FFFFFF"
													: themeStyle.primary,
										},
									]}
								>
									{index + 1}
								</Text>
							</View>
							{isPersonalRecord && (
								<Ionicons
									name="trophy"
									size={16}
									color="#FFD700"
									style={styles.trophyIcon}
								/>
							)}
						</View>

						<View style={styles.exerciseInfo}>
							<Text style={styles.liftName} numberOfLines={1}>
								{exercise}
							</Text>
							<Text style={styles.exerciseSubtext}>
								{filterWorkoutData(exercise).length} workouts
							</Text>
						</View>

						<View style={styles.valueContainer}>
							<Text style={styles.liftValue}>{text}</Text>
							{filterType === "1RM" && (
								<Text style={styles.estimatedLabel}>est.</Text>
							)}
						</View>

						<Ionicons
							name="chevron-forward"
							size={20}
							color={themeStyle.textColorSecondary}
						/>
					</TouchableOpacity>
				);
			})}

			{popularExercises.length === 0 && (
				<View style={styles.noDataContainer}>
					<Ionicons
						name="barbell-outline"
						size={48}
						color={themeStyle.textColorSecondary}
					/>
					<Text style={styles.noDataText}>
						No lift data available yet
					</Text>
					<Text style={styles.noDataSubtext}>
						Complete some workouts to see your best lifts
					</Text>
				</View>
			)}
		</View>
	);

	const renderProgressView = () => (
		<ScrollView showsVerticalScrollIndicator={false}>
			{popularExercises.slice(0, 6).map((exercise, index) => {
				const chartData = getProgressData(exercise, filterType);
				const { text: bestValue } = getBestLift(
					filterWorkoutData(exercise),
					filterType
				);

				return (
					<View key={index} style={styles.progressCard}>
						<View style={styles.progressHeader}>
							<View style={styles.progressTitleContainer}>
								<Text style={styles.progressTitle}>
									{exercise}
								</Text>
								<View style={styles.progressStats}>
									<Text style={styles.progressBest}>
										Best: {bestValue}
									</Text>
									<Text style={styles.progressWorkouts}>
										{filterWorkoutData(exercise).length}{" "}
										workouts
									</Text>
								</View>
							</View>
							<TouchableOpacity
								style={styles.expandButton}
								onPress={() =>
									Alert.alert(
										"Exercise Details",
										`View detailed analytics for ${exercise}`
									)
								}
							>
								<Ionicons
									name="analytics-outline"
									size={20}
									color={themeStyle.primary}
								/>
							</TouchableOpacity>
						</View>

						{chartData ? (
							<View style={styles.chartContainer}>
								<LineChart
									data={chartData}
									width={Dimensions.get("window").width - 60}
									height={180}
									chartConfig={{
										backgroundColor: themeStyle.card,
										backgroundGradientFrom: themeStyle.card,
										backgroundGradientTo: themeStyle.card,
										color: (opacity = 1) =>
											`rgba(${hexToRgb(
												getMetricColor(filterType)
											)}, ${opacity})`,
										labelColor: (opacity = 1) =>
											`rgba(${hexToRgb(
												themeStyle.textColor
											)}, ${opacity})`,
										strokeWidth: 3,
										propsForDots: {
											r: "6",
											strokeWidth: "2",
											stroke: getMetricColor(filterType),
											fill: themeStyle.card,
										},
										propsForBackgroundLines: {
											strokeDasharray: "5,5",
											stroke: `${themeStyle.borderColor}50`,
										},
									}}
									style={{
										marginVertical: 8,
										borderRadius: 16,
									}}
									bezier
									withDots={true}
									withInnerLines={true}
									withOuterLines={false}
								/>
								<View style={styles.chartLegend}>
									<View style={styles.legendItem}>
										<View
											style={[
												styles.legendDot,
												{
													backgroundColor:
														getMetricColor(
															filterType
														),
												},
											]}
										/>
										<Text style={styles.legendText}>
											{filterType} Progress
										</Text>
									</View>
								</View>
							</View>
						) : (
							<View style={styles.noChartData}>
								<Ionicons
									name="trending-up-outline"
									size={32}
									color={themeStyle.textColorSecondary}
								/>
								<Text style={styles.noDataText}>
									Not enough data for trend analysis
								</Text>
								<Text style={styles.noDataSubtext}>
									Need at least 2 workouts with this exercise
								</Text>
							</View>
						)}
					</View>
				);
			})}
		</ScrollView>
	);

	return (
		<View style={styles.tabContent}>
			{/* Header Section */}
			<View style={styles.headerSection}>
				<View style={styles.headerRow}>
					<View style={styles.titleContainer}>
						<Ionicons
							name={getMetricIcon(filterType)}
							size={24}
							color={getMetricColor(filterType)}
							style={styles.titleIcon}
						/>
						<Text style={styles.sectionTitle}>
							{viewMode === "best"
								? "Personal Records"
								: "Progress Tracking"}
						</Text>
					</View>
					<TouchableOpacity
						style={styles.viewToggle}
						onPress={() =>
							setViewMode(
								viewMode === "best" ? "progress" : "best"
							)
						}
					>
						<Ionicons
							name={
								viewMode === "best" ? "trending-up" : "trophy"
							}
							size={20}
							color={themeStyle.primary}
						/>
						<Text style={styles.toggleText}>
							{viewMode === "best" ? "Progress" : "Records"}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Filter Controls */}
				<View style={styles.filtersContainer}>
					<TouchableOpacity
						style={[
							styles.filterChip,
							{ borderColor: getMetricColor(filterType) },
						]}
						onPress={toggleFilterType}
					>
						<Ionicons
							name={getMetricIcon(filterType)}
							size={16}
							color={getMetricColor(filterType)}
						/>
						<Text
							style={[
								styles.filterChipText,
								{ color: getMetricColor(filterType) },
							]}
						>
							{filterType}
						</Text>
						<Ionicons
							name="chevron-down"
							size={16}
							color={getMetricColor(filterType)}
						/>
					</TouchableOpacity>

					<View style={styles.metricInfo}>
						<Text style={styles.metricLabel}>
							{filterType === "1RM"
								? "Estimated Max"
								: filterType === "Reps"
								? "Max Reps"
								: "Total Volume"}
						</Text>
					</View>
				</View>
			</View>

			{/* Content */}
			{viewMode === "best" ? renderBestLiftsView() : renderProgressView()}
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
		: "74, 144, 226";
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		tabContent: {
			flex: 1,
			paddingBottom: 30,
		},
		headerSection: {
			marginHorizontal: 20,
			marginTop: 15,
			marginBottom: 20,
		},
		headerRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 15,
		},
		titleContainer: {
			flexDirection: "row",
			alignItems: "center",
		},
		titleIcon: {
			marginRight: 10,
		},
		sectionTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
			letterSpacing: 0.3,
		},
		viewToggle: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: `${themeStyle.primary}15`,
			paddingHorizontal: 12,
			paddingVertical: 8,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: `${themeStyle.primary}30`,
		},
		toggleText: {
			marginLeft: 6,
			fontSize: 14,
			fontWeight: "600",
			color: themeStyle.primary,
		},
		filtersContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		filterChip: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.card,
			paddingHorizontal: 16,
			paddingVertical: 10,
			borderRadius: 25,
			borderWidth: 2,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		filterChipText: {
			fontSize: 16,
			fontWeight: "700",
			marginHorizontal: 8,
			letterSpacing: 0.5,
		},
		metricInfo: {
			alignItems: "flex-end",
		},
		metricLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			fontStyle: "italic",
		},
		liftsContainer: {
			marginHorizontal: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 16,
			padding: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
			elevation: 5,
		},
		liftsHeader: {
			flexDirection: "row",
			alignItems: "center",
			paddingBottom: 12,
			borderBottomWidth: 2,
			borderBottomColor: themeStyle.borderColor,
			marginBottom: 12,
		},
		rankHeader: {
			width: 60,
		},
		exerciseHeader: {
			flex: 1,
			paddingHorizontal: 8,
		},
		valueHeader: {
			width: 80,
			alignItems: "center",
		},
		rankHeaderText: {
			fontSize: 12,
			fontWeight: "700",
			color: themeStyle.textColorSecondary,
			textTransform: "uppercase",
			letterSpacing: 1,
		},
		exerciseHeaderText: {
			fontSize: 12,
			fontWeight: "700",
			color: themeStyle.textColorSecondary,
			textTransform: "uppercase",
			letterSpacing: 1,
		},
		valueHeaderText: {
			fontSize: 12,
			fontWeight: "700",
			color: themeStyle.textColorSecondary,
			textTransform: "uppercase",
			letterSpacing: 1,
		},
		exerciseRow: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: 16,
			borderBottomWidth: 1,
			borderBottomColor: `${themeStyle.borderColor}30`,
		},
		prRow: {
			backgroundColor: `${themeStyle.primary}08`,
			borderRadius: 12,
			borderBottomWidth: 0,
			marginVertical: 2,
			paddingHorizontal: 12,
		},
		rankContainer: {
			width: 60,
			alignItems: "center",
		},
		rankBadge: {
			width: 32,
			height: 32,
			borderRadius: 16,
			justifyContent: "center",
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
			shadowRadius: 4,
			elevation: 3,
		},
		rankText: {
			fontSize: 14,
			fontWeight: "bold",
		},
		trophyIcon: {
			position: "absolute",
			top: -4,
			right: -4,
		},
		exerciseInfo: {
			flex: 1,
			paddingHorizontal: 12,
		},
		liftName: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginBottom: 2,
		},
		exerciseSubtext: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
		valueContainer: {
			width: 80,
			alignItems: "center",
		},
		liftValue: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.primary,
			textAlign: "center",
		},
		estimatedLabel: {
			fontSize: 10,
			color: themeStyle.textColorSecondary,
			fontStyle: "italic",
		},
		progressCard: {
			marginHorizontal: 20,
			marginBottom: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 16,
			padding: 20,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
			elevation: 5,
		},
		progressHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
			marginBottom: 16,
		},
		progressTitleContainer: {
			flex: 1,
		},
		progressTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		progressStats: {
			flexDirection: "row",
			alignItems: "center",
		},
		progressBest: {
			fontSize: 14,
			fontWeight: "600",
			color: themeStyle.primary,
			marginRight: 12,
		},
		progressWorkouts: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
		expandButton: {
			padding: 8,
			borderRadius: 8,
			backgroundColor: `${themeStyle.primary}15`,
		},
		chartContainer: {
			alignItems: "center",
		},
		chartLegend: {
			flexDirection: "row",
			justifyContent: "center",
			marginTop: 12,
		},
		legendItem: {
			flexDirection: "row",
			alignItems: "center",
		},
		legendDot: {
			width: 8,
			height: 8,
			borderRadius: 4,
			marginRight: 6,
		},
		legendText: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
		noDataContainer: {
			alignItems: "center",
			paddingVertical: 40,
		},
		noChartData: {
			alignItems: "center",
			paddingVertical: 30,
		},
		noDataText: {
			fontSize: 16,
			color: themeStyle.textColorSecondary,
			marginTop: 12,
			textAlign: "center",
		},
		noDataSubtext: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginTop: 4,
			textAlign: "center",
			fontStyle: "italic",
		},
	});

export default LiftsTab;
