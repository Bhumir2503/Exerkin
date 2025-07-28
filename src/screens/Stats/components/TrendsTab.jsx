// components/TrendsTab.jsx
import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { LineChart, BarChart, ProgressChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutHistory } from "../../../contexts/workout/WorkoutHistoryContext";
import useStatsCalculations from "../../../hooks/useStatsCalculations";

const TrendsTab = () => {
	const { themeStyle } = useTheme();
	const { workoutHistory } = useWorkoutHistory();
	const styles = createStyles(themeStyle);
	const [selectedPeriod, setSelectedPeriod] = useState("3M"); // 1M, 3M, 6M, 1Y
	const [selectedMetric, setSelectedMetric] = useState("volume"); // volume, frequency, duration, strength

	const {
		statsSummary,
		weeklyActivity,
		monthlyData,
		getTrendData,
		getPerformanceMetrics,
	} = useStatsCalculations(workoutHistory);

	const screenWidth = Dimensions.get("window").width;

	// Mock trend data - in real implementation, this would come from useStatsCalculations
	const getTrendDataForPeriod = (metric, period) => {
		const baseData = {
			volume: {
				labels: [
					"Week 1",
					"Week 2",
					"Week 3",
					"Week 4",
					"Week 5",
					"Week 6",
				],
				datasets: [
					{
						data: [12000, 14500, 13800, 16200, 15400, 17800],
						color: (opacity = 1) =>
							`rgba(255, 107, 107, ${opacity})`,
						strokeWidth: 3,
					},
				],
				unit: "lbs",
				trend: "+14.2%",
			},
			frequency: {
				labels: [
					"Week 1",
					"Week 2",
					"Week 3",
					"Week 4",
					"Week 5",
					"Week 6",
				],
				datasets: [
					{
						data: [4, 5, 3, 6, 4, 5],
						color: (opacity = 1) =>
							`rgba(78, 205, 196, ${opacity})`,
						strokeWidth: 3,
					},
				],
				unit: "workouts",
				trend: "+25%",
			},
			duration: {
				labels: [
					"Week 1",
					"Week 2",
					"Week 3",
					"Week 4",
					"Week 5",
					"Week 6",
				],
				datasets: [
					{
						data: [45, 52, 38, 58, 47, 55],
						color: (opacity = 1) =>
							`rgba(69, 183, 209, ${opacity})`,
						strokeWidth: 3,
					},
				],
				unit: "min",
				trend: "+22.2%",
			},
			strength: {
				labels: [
					"Week 1",
					"Week 2",
					"Week 3",
					"Week 4",
					"Week 5",
					"Week 6",
				],
				datasets: [
					{
						data: [315, 320, 325, 330, 335, 340],
						color: (opacity = 1) =>
							`rgba(254, 202, 87, ${opacity})`,
						strokeWidth: 3,
					},
				],
				unit: "lbs (1RM)",
				trend: "+7.9%",
			},
		};
		return baseData[metric];
	};

	const currentTrendData = getTrendDataForPeriod(
		selectedMetric,
		selectedPeriod
	);

	const chartConfig = {
		backgroundColor: themeStyle.card,
		backgroundGradientFrom: themeStyle.card,
		backgroundGradientTo: themeStyle.card,
		color: (opacity = 1) =>
			`rgba(${hexToRgb(themeStyle.primary)}, ${opacity})`,
		labelColor: (opacity = 1) =>
			`rgba(${hexToRgb(themeStyle.textColor)}, ${opacity})`,
		strokeWidth: 3,
		barPercentage: 0.7,
		useShadowColorFromDataset: false,
		decimalPlaces: 0,
		propsForDots: {
			r: "6",
			strokeWidth: "2",
			stroke: themeStyle.primary,
			fill: themeStyle.card,
		},
		propsForBackgroundLines: {
			strokeDasharray: "5,5",
			stroke: `${themeStyle.borderColor}50`,
		},
	};

	const renderMetricSelector = () => (
		<View style={styles.metricSelector}>
			{[
				{
					key: "volume",
					label: "Volume",
					icon: "cube-outline",
					color: "#FF6B6B",
				},
				{
					key: "frequency",
					label: "Frequency",
					icon: "calendar-outline",
					color: "#4ECDC4",
				},
				{
					key: "duration",
					label: "Duration",
					icon: "time-outline",
					color: "#45B7D1",
				},
				{
					key: "strength",
					label: "Strength",
					icon: "barbell-outline",
					color: "#FECA57",
				},
			].map((metric) => (
				<TouchableOpacity
					key={metric.key}
					style={[
						styles.metricButton,
						selectedMetric === metric.key &&
							styles.activeMetricButton,
						{
							borderColor:
								selectedMetric === metric.key
									? metric.color
									: themeStyle.borderColor,
						},
					]}
					onPress={() => setSelectedMetric(metric.key)}
				>
					<Ionicons
						name={metric.icon}
						size={18}
						color={
							selectedMetric === metric.key
								? metric.color
								: themeStyle.textColorSecondary
						}
					/>
					<Text
						style={[
							styles.metricButtonText,
							selectedMetric === metric.key && {
								color: metric.color,
							},
						]}
					>
						{metric.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);

	const renderPeriodSelector = () => (
		<View style={styles.periodSelector}>
			{["1M", "3M", "6M", "1Y"].map((period) => (
				<TouchableOpacity
					key={period}
					style={[
						styles.periodButton,
						selectedPeriod === period && styles.activePeriodButton,
					]}
					onPress={() => setSelectedPeriod(period)}
				>
					<Text
						style={[
							styles.periodButtonText,
							selectedPeriod === period &&
								styles.activePeriodButtonText,
						]}
					>
						{period}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);

	const renderTrendChart = () => (
		<View style={styles.chartContainer}>
			<View style={styles.chartHeader}>
				<View>
					<Text style={styles.chartTitle}>
						{selectedMetric.charAt(0).toUpperCase() +
							selectedMetric.slice(1)}{" "}
						Trend
					</Text>
					<Text style={styles.chartSubtitle}>
						Last {selectedPeriod} • {currentTrendData.unit}
					</Text>
				</View>
				<View style={styles.trendIndicator}>
					<Ionicons
						name={
							currentTrendData.trend.startsWith("+")
								? "trending-up"
								: "trending-down"
						}
						size={20}
						color={
							currentTrendData.trend.startsWith("+")
								? "#32CD32"
								: "#FF6B6B"
						}
					/>
					<Text
						style={[
							styles.trendValue,
							{
								color: currentTrendData.trend.startsWith("+")
									? "#32CD32"
									: "#FF6B6B",
							},
						]}
					>
						{currentTrendData.trend}
					</Text>
				</View>
			</View>

			<LineChart
				data={currentTrendData}
				width={screenWidth - 60}
				height={220}
				chartConfig={{
					...chartConfig,
					color: currentTrendData.datasets[0].color,
					propsForDots: {
						...chartConfig.propsForDots,
						stroke: currentTrendData.datasets[0].color(1),
					},
				}}
				style={styles.chart}
				bezier
				withDots={true}
				withInnerLines={true}
				withOuterLines={false}
				withVerticalLabels={true}
				withHorizontalLabels={true}
			/>
		</View>
	);

	const renderPerformanceMetrics = () => {
		const performanceData = [
			{
				title: "Workout Consistency",
				value: 0.85,
				color: "#4ECDC4",
				description: "85% of planned workouts completed",
			},
			{
				title: "Progressive Overload",
				value: 0.72,
				color: "#FF6B6B",
				description: "72% of exercises showing improvement",
			},
			{
				title: "Recovery Quality",
				value: 0.68,
				color: "#45B7D1",
				description: "Based on workout frequency & intensity",
			},
		];

		return (
			<View style={styles.performanceContainer}>
				<Text style={styles.sectionTitle}>Performance Indicators</Text>
				<View style={styles.performanceGrid}>
					{performanceData.map((item, index) => (
						<View key={index} style={styles.performanceCard}>
							<View style={styles.performanceHeader}>
								<Text style={styles.performanceTitle}>
									{item.title}
								</Text>
								<Text
									style={[
										styles.performanceValue,
										{ color: item.color },
									]}
								>
									{Math.round(item.value * 100)}%
								</Text>
							</View>
							<View style={styles.progressBarContainer}>
								<View style={styles.progressBarBackground}>
									<View
										style={[
											styles.progressBarFill,
											{
												width: `${item.value * 100}%`,
												backgroundColor: item.color,
											},
										]}
									/>
								</View>
							</View>
							<Text style={styles.performanceDescription}>
								{item.description}
							</Text>
						</View>
					))}
				</View>
			</View>
		);
	};

	const renderWorkoutHeatmap = () => {
		// Generate mock heatmap data - in real implementation, this would be calculated from workout history
		const heatmapData = Array.from({ length: 7 }, (_, weekIndex) =>
			Array.from({ length: 7 }, (_, dayIndex) => ({
				day: dayIndex,
				week: weekIndex,
				count: Math.floor(Math.random() * 4),
			}))
		).flat();

		const maxCount = Math.max(...heatmapData.map((d) => d.count));
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		return (
			<View style={styles.heatmapContainer}>
				<Text style={styles.sectionTitle}>Activity Heatmap</Text>
				<Text style={styles.heatmapSubtitle}>Last 7 weeks</Text>

				<View style={styles.heatmapGrid}>
					<View style={styles.heatmapDayLabels}>
						{days.map((day, index) => (
							<Text key={index} style={styles.heatmapDayLabel}>
								{day}
							</Text>
						))}
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
					>
						<View style={styles.heatmapWeeks}>
							{Array.from({ length: 7 }, (_, weekIndex) => (
								<View
									key={weekIndex}
									style={styles.heatmapWeek}
								>
									{Array.from(
										{ length: 7 },
										(_, dayIndex) => {
											const dataPoint = heatmapData.find(
												(d) =>
													d.week === weekIndex &&
													d.day === dayIndex
											);
											const intensity = dataPoint
												? dataPoint.count / maxCount
												: 0;
											const backgroundColor =
												intensity > 0
													? `rgba(${hexToRgb(
															themeStyle.primary
													  )}, ${
															0.2 +
															intensity * 0.8
													  })`
													: `${themeStyle.primary}10`;

											return (
												<View
													key={dayIndex}
													style={[
														styles.heatmapCell,
														{ backgroundColor },
													]}
												>
													<Text
														style={[
															styles.heatmapCellText,
															{
																color:
																	intensity >
																	0.5
																		? "#FFFFFF"
																		: themeStyle.textColor,
															},
														]}
													>
														{dataPoint?.count || 0}
													</Text>
												</View>
											);
										}
									)}
								</View>
							))}
						</View>
					</ScrollView>
				</View>
			</View>
		);
	};

	const renderPersonalRecords = () => {
		const recentPRs = [
			{
				exercise: "Bench Press",
				value: "225 lbs",
				date: "2 days ago",
				type: "1RM",
			},
			{
				exercise: "Squat",
				value: "315 lbs",
				date: "1 week ago",
				type: "1RM",
			},
			{
				exercise: "Pull-ups",
				value: "15 reps",
				date: "3 days ago",
				type: "Reps",
			},
			{
				exercise: "Plank",
				value: "3:45",
				date: "5 days ago",
				type: "Duration",
			},
		];

		return (
			<View style={styles.recordsContainer}>
				<View style={styles.recordsHeader}>
					<Text style={styles.sectionTitle}>
						Recent Personal Records
					</Text>
					<TouchableOpacity style={styles.viewAllButton}>
						<Text style={styles.viewAllText}>View All</Text>
						<Ionicons
							name="chevron-forward"
							size={16}
							color={themeStyle.primary}
						/>
					</TouchableOpacity>
				</View>

				{recentPRs.map((record, index) => (
					<View key={index} style={styles.recordItem}>
						<View style={styles.recordIcon}>
							<Ionicons name="trophy" size={20} color="#FFD700" />
						</View>
						<View style={styles.recordInfo}>
							<Text style={styles.recordExercise}>
								{record.exercise}
							</Text>
							<Text style={styles.recordDate}>{record.date}</Text>
						</View>
						<View style={styles.recordValue}>
							<Text style={styles.recordValueText}>
								{record.value}
							</Text>
							<Text style={styles.recordType}>{record.type}</Text>
						</View>
					</View>
				))}
			</View>
		);
	};

	return (
		<ScrollView
			style={styles.tabContent}
			showsVerticalScrollIndicator={false}
		>
			{/* Time Period and Metric Selectors */}
			<View style={styles.selectorContainer}>
				{renderPeriodSelector()}
				{renderMetricSelector()}
			</View>

			{/* Main Trend Chart */}
			{renderTrendChart()}

			{/* Performance Metrics */}
			{renderPerformanceMetrics()}

			{/* Activity Heatmap */}
			{renderWorkoutHeatmap()}

			{/* Recent Personal Records */}
			{renderPersonalRecords()}

			{/* Additional Insights */}
			<View style={styles.insightsContainer}>
				<Text style={styles.sectionTitle}>
					Insights & Recommendations
				</Text>
				<View style={styles.insightCard}>
					<Ionicons name="bulb" size={24} color="#FECA57" />
					<View style={styles.insightContent}>
						<Text style={styles.insightTitle}>
							Consistency Opportunity
						</Text>
						<Text style={styles.insightText}>
							You're most active on Tuesdays and Thursdays.
							Consider adding a weekend session to maintain
							momentum.
						</Text>
					</View>
				</View>
				<View style={styles.insightCard}>
					<Ionicons name="trending-up" size={24} color="#32CD32" />
					<View style={styles.insightContent}>
						<Text style={styles.insightTitle}>
							Strength Progress
						</Text>
						<Text style={styles.insightText}>
							Your squat has improved by 15% this month. Great
							work on progressive overload!
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
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
		selectorContainer: {
			marginHorizontal: 20,
			marginTop: 15,
		},
		periodSelector: {
			flexDirection: "row",
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			padding: 4,
			marginBottom: 15,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		periodButton: {
			flex: 1,
			paddingVertical: 10,
			alignItems: "center",
			borderRadius: 8,
		},
		activePeriodButton: {
			backgroundColor: themeStyle.primary,
		},
		periodButtonText: {
			fontSize: 14,
			fontWeight: "600",
			color: themeStyle.textColorSecondary,
		},
		activePeriodButtonText: {
			color: "#FFFFFF",
		},
		metricSelector: {
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "space-between",
		},
		metricButton: {
			width: "48%",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			paddingVertical: 12,
			paddingHorizontal: 16,
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			borderWidth: 2,
			marginBottom: 8,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 2,
		},
		activeMetricButton: {
			borderWidth: 2,
		},
		metricButtonText: {
			fontSize: 14,
			fontWeight: "600",
			color: themeStyle.textColorSecondary,
			marginLeft: 8,
		},
		chartContainer: {
			marginHorizontal: 20,
			marginTop: 25,
			backgroundColor: themeStyle.card,
			borderRadius: 16,
			padding: 20,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 4 },
			shadowOpacity: 0.1,
			shadowRadius: 8,
			elevation: 5,
		},
		chartHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "flex-start",
			marginBottom: 20,
		},
		chartTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		chartSubtitle: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
		},
		trendIndicator: {
			flexDirection: "row",
			alignItems: "center",
		},
		trendValue: {
			fontSize: 16,
			fontWeight: "bold",
			marginLeft: 4,
		},
		chart: {
			marginVertical: 8,
			borderRadius: 16,
		},
		performanceContainer: {
			marginHorizontal: 20,
			marginTop: 25,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 15,
			letterSpacing: 0.3,
		},
		performanceGrid: {
			gap: 12,
		},
		performanceCard: {
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			padding: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		performanceHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 12,
		},
		performanceTitle: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
		},
		performanceValue: {
			fontSize: 18,
			fontWeight: "bold",
		},
		progressBarContainer: {
			marginBottom: 8,
		},
		progressBarBackground: {
			height: 6,
			backgroundColor: `${themeStyle.primary}20`,
			borderRadius: 3,
		},
		progressBarFill: {
			height: 6,
			borderRadius: 3,
		},
		performanceDescription: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
		heatmapContainer: {
			marginHorizontal: 20,
			marginTop: 25,
		},
		heatmapSubtitle: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginBottom: 15,
		},
		heatmapGrid: {
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			padding: 15,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		heatmapDayLabels: {
			marginBottom: 8,
		},
		heatmapDayLabel: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			marginBottom: 4,
			width: 30,
		},
		heatmapWeeks: {
			flexDirection: "row",
		},
		heatmapWeek: {
			marginRight: 4,
		},
		heatmapCell: {
			width: 30,
			height: 30,
			borderRadius: 4,
			marginBottom: 4,
			justifyContent: "center",
			alignItems: "center",
		},
		heatmapCellText: {
			fontSize: 10,
			fontWeight: "600",
		},
		recordsContainer: {
			marginHorizontal: 20,
			marginTop: 25,
		},
		recordsHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 15,
		},
		viewAllButton: {
			flexDirection: "row",
			alignItems: "center",
		},
		viewAllText: {
			fontSize: 14,
			color: themeStyle.primary,
			fontWeight: "600",
			marginRight: 4,
		},
		recordItem: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			padding: 16,
			marginBottom: 8,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 2,
		},
		recordIcon: {
			marginRight: 12,
		},
		recordInfo: {
			flex: 1,
		},
		recordExercise: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginBottom: 2,
		},
		recordDate: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
		},
		recordValue: {
			alignItems: "flex-end",
		},
		recordValueText: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.primary,
		},
		recordType: {
			fontSize: 10,
			color: themeStyle.textColorSecondary,
			marginTop: 2,
		},
		insightsContainer: {
			marginHorizontal: 20,
			marginTop: 25,
			marginBottom: 20,
		},
		insightCard: {
			flexDirection: "row",
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			padding: 16,
			marginBottom: 12,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		insightContent: {
			flex: 1,
			marginLeft: 12,
		},
		insightTitle: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		insightText: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			lineHeight: 20,
		},
	});

export default TrendsTab;
