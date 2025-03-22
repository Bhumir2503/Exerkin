import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function Stats({ navigation }) {
	const { workoutHistory } = useWorkout();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [filterType, setFilterType] = useState("1RM"); // "1RM", "Reps", "Volume"
	const [timeRange, setTimeRange] = useState("all"); // "week", "month", "3months", "all"
	const [viewMode, setViewMode] = useState("best"); // "best", "progress"

	// Popular exercise categories to track
	const popularExercises = [
		"Barbell Bench Press",
		"Barbell Deadlift",
		"Smith Machine Squat",
		"Pull Up",
		"Barbell Shoulder Press",
	];

	// Icon mapping for exercise types
	const exerciseIcons = {
		"Barbell Bench Press": "barbell-outline",
		"Barbell Deadlift": "barbell-outline",
		"Smith Machine Squat": "barbell-outline",
		"Pull Up": "body-outline",
		"Barbell Shoulder Press": "barbell-outline",
	};

	// Stats summary data
	const [statsSummary, setStatsSummary] = useState({
		totalWorkouts: 0,
		totalVolume: 0,
		avgDuration: "0:00",
		mostFrequentExercise: "-",
	});

	useEffect(() => {
		calculateStatsSummary();
	}, [workoutHistory]);

	const calculateStatsSummary = () => {
		if (!workoutHistory || workoutHistory.length === 0) {
			return;
		}

		// Calculate total workouts
		const totalWorkouts = workoutHistory.length;

		// Calculate total volume
		let totalVolume = 0;
		let exerciseFrequency = {};
		let totalDuration = 0;

		workoutHistory.forEach((workout) => {
			// Parse duration (assuming format like "1:30:45")
			const durationParts = workout.duration.split(":").map(Number);
			let durationInSeconds = 0;
			if (durationParts.length === 3) {
				durationInSeconds =
					durationParts[0] * 3600 +
					durationParts[1] * 60 +
					durationParts[2];
			} else if (durationParts.length === 2) {
				durationInSeconds = durationParts[0] * 60 + durationParts[1];
			}
			totalDuration += durationInSeconds;

			workout.exercises.forEach((exercise) => {
				// Track exercise frequency
				exerciseFrequency[exercise.name] =
					(exerciseFrequency[exercise.name] || 0) + 1;

				exercise.sets.forEach((set) => {
					// Calculate volume (weight * reps)
					if (set.weight && set.reps) {
						totalVolume += Number(set.weight) * Number(set.reps);
					}
				});
			});
		});

		// Find most frequent exercise
		let mostFrequentExercise = "-";
		let maxFrequency = 0;

		Object.entries(exerciseFrequency).forEach(([exercise, frequency]) => {
			if (frequency > maxFrequency) {
				maxFrequency = frequency;
				mostFrequentExercise = exercise;
			}
		});

		// Calculate average workout duration
		const avgDurationInSeconds = Math.round(totalDuration / totalWorkouts);
		const hours = Math.floor(avgDurationInSeconds / 3600);
		const minutes = Math.floor((avgDurationInSeconds % 3600) / 60);
		const seconds = avgDurationInSeconds % 60;

		const avgDuration =
			hours > 0
				? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
						.toString()
						.padStart(2, "0")}`
				: `${minutes}:${seconds.toString().padStart(2, "0")}`;

		setStatsSummary({
			totalWorkouts,
			totalVolume: Math.round(totalVolume),
			avgDuration,
			mostFrequentExercise,
		});
	};

	const filterWorkoutsByTime = (workouts) => {
		if (timeRange === "all") {
			return workouts;
		}

		const now = new Date();
		const cutoffDate = new Date();

		if (timeRange === "week") {
			cutoffDate.setDate(now.getDate() - 7);
		} else if (timeRange === "month") {
			cutoffDate.setMonth(now.getMonth() - 1);
		} else if (timeRange === "3months") {
			cutoffDate.setMonth(now.getMonth() - 3);
		}

		return workouts.filter((workout) => {
			const workoutDate = workout.completedAt.toDate();
			return workoutDate >= cutoffDate;
		});
	};

	// Filter workout history by exercise name
	const filterWorkoutData = (targetName, workouts) => {
		const filteredWorkouts = filterWorkoutsByTime(workouts);
		let filteredExercises = [];

		filteredWorkouts.forEach((workout) => {
			workout.exercises.forEach((exercise) => {
				if (exercise.name === targetName) {
					// Add workout date for progress tracking
					filteredExercises.push({
						...exercise,
						date: workout.completedAt.toDate(),
					});
				}
			});
		});

		return filteredExercises;
	};

	// Calculate one rep max
	const calcOneRepMax = (weight, reps) => {
		return Math.round(weight / (1.0278 - 0.0278 * reps));
	};

	// Get best lift based on filter type
	const getBestLift = (filteredExercises, filterType) => {
		if (filteredExercises.length < 1) {
			return { text: "No data available", isEstimated: true };
		}

		let bestOneRepMaxWeight = 0;
		let bestOneRepMaxReps = 0;
		let bestVolume = 0;
		let bestSetWeight = 0;
		let bestSetReps = 0;
		let bestVolumeSet = { weight: 0, reps: 0 };

		filteredExercises.forEach((exercise) => {
			if (Array.isArray(exercise.sets) && exercise.sets.length > 0) {
				exercise.sets.forEach((set) => {
					const weight = Number(set.weight);
					const reps = Number(set.reps);

					// Skip invalid data
					if (!weight || !reps) return;

					const setVolume = weight * reps;

					// Check for 1RM
					if (filterType === "1RM") {
						if (weight > bestOneRepMaxWeight) {
							bestOneRepMaxWeight = weight;
							bestOneRepMaxReps = reps;
						} else if (
							weight === bestOneRepMaxWeight &&
							reps > bestOneRepMaxReps
						) {
							bestOneRepMaxReps = reps;
						}
					}
					// Check for max weight
					else if (filterType === "Reps" && weight > bestSetWeight) {
						bestSetWeight = weight;
						bestSetReps = reps;
					}
					// Check for max volume
					else if (
						filterType === "Volume" &&
						setVolume > bestVolume
					) {
						bestVolume = setVolume;
						bestVolumeSet = { weight, reps };
					}
				});
			}
		});

		if (filterType === "1RM") {
			if (bestOneRepMaxReps === 0 || bestOneRepMaxWeight === 0) {
				return { text: "No data available", isEstimated: true };
			}

			if (bestOneRepMaxReps === 1) {
				return {
					text: `${bestOneRepMaxWeight}lbs`,
					isEstimated: false,
				};
			} else {
				const estimatedOneRM = calcOneRepMax(
					bestOneRepMaxWeight,
					bestOneRepMaxReps
				);
				return { text: `${estimatedOneRM}lbs`, isEstimated: true };
			}
		} else if (filterType === "Reps") {
			if (bestSetWeight === 0 || bestSetReps === 0) {
				return { text: "No data available", isEstimated: true };
			}
			return {
				text: `${bestSetWeight}lbs x ${bestSetReps} reps`,
				isEstimated: false,
			};
		} else if (filterType === "Volume") {
			if (bestVolume === 0) {
				return { text: "No data available", isEstimated: true };
			}
			return {
				text: `${bestVolumeSet.weight}lbs x ${bestVolumeSet.reps} (${bestVolume}lbs)`,
				isEstimated: false,
			};
		}
	};

	// Get progress data for charts
	const getProgressData = (exerciseName) => {
		const filteredExercises = filterWorkoutData(
			exerciseName,
			workoutHistory
		);

		if (filteredExercises.length < 2) {
			return null;
		}

		// Sort by date
		filteredExercises.sort((a, b) => a.date - b.date);

		const chartData = {
			labels: [],
			datasets: [
				{
					data: [],
					color: () => themeStyle.accent || themeStyle.primary,
					strokeWidth: 2,
				},
			],
		};

		filteredExercises.forEach((exercise) => {
			// Get best set based on current filter
			let bestValue = 0;

			if (filterType === "1RM") {
				let bestWeight = 0;
				let bestReps = 0;

				exercise.sets.forEach((set) => {
					const weight = Number(set.weight);
					const reps = Number(set.reps);

					if (weight > bestWeight) {
						bestWeight = weight;
						bestReps = reps;
					} else if (weight === bestWeight && reps > bestReps) {
						bestReps = reps;
					}
				});

				if (bestWeight > 0 && bestReps > 0) {
					bestValue =
						bestReps === 1
							? bestWeight
							: calcOneRepMax(bestWeight, bestReps);
				}
			} else if (filterType === "Reps") {
				exercise.sets.forEach((set) => {
					const weight = Number(set.weight);
					bestValue = Math.max(bestValue, weight);
				});
			} else if (filterType === "Volume") {
				exercise.sets.forEach((set) => {
					const setVolume = Number(set.weight) * Number(set.reps);
					bestValue = Math.max(bestValue, setVolume);
				});
			}

			if (bestValue > 0) {
				// Format date for display
				const date = exercise.date;
				const formattedDate = `${
					date.getMonth() + 1
				}/${date.getDate()}`;

				chartData.labels.push(formattedDate);
				chartData.datasets[0].data.push(bestValue);
			}
		});

		// Limit to 6 most recent data points if there are too many
		if (chartData.labels.length > 6) {
			chartData.labels = chartData.labels.slice(-6);
			chartData.datasets[0].data = chartData.datasets[0].data.slice(-6);
		}

		return chartData.datasets[0].data.length > 1 ? chartData : null;
	};

	const toggleFilterType = () => {
		if (filterType === "1RM") {
			setFilterType("Reps");
		} else if (filterType === "Reps") {
			setFilterType("Volume");
		} else {
			setFilterType("1RM");
		}
	};

	const toggleTimeRange = () => {
		if (timeRange === "all") {
			setTimeRange("week");
		} else if (timeRange === "week") {
			setTimeRange("month");
		} else if (timeRange === "month") {
			setTimeRange("3months");
		} else {
			setTimeRange("all");
		}
	};

	const toggleViewMode = () => {
		setViewMode(viewMode === "best" ? "progress" : "best");
	};

	const displayTimeRange = () => {
		switch (timeRange) {
			case "week":
				return "Past Week";
			case "month":
				return "Past Month";
			case "3months":
				return "Past 3 Months";
			default:
				return "All Time";
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons
						name="chevron-back"
						size={35}
						color={themeStyle.textColor}
					/>
				</TouchableOpacity>
				<Text style={styles.title}>Stats</Text>
				<View style={{ width: 35 }} />
			</View>

			<ScrollView style={styles.scrollContainer}>
				{/* Stats Summary */}
				<View style={styles.summaryContainer}>
					<Text style={styles.sectionTitle}>Summary</Text>
					<View style={styles.summaryGrid}>
						<View style={styles.summaryItem}>
							<Ionicons
								name="calendar-outline"
								size={24}
								color={themeStyle.primary}
								style={styles.summaryIcon}
							/>
							<Text style={styles.summaryValue}>
								{statsSummary.totalWorkouts}
							</Text>
							<Text style={styles.summaryLabel}>Workouts</Text>
						</View>
						<View style={styles.summaryItem}>
							<Ionicons
								name="barbell-outline"
								size={24}
								color={themeStyle.primary}
								style={styles.summaryIcon}
							/>
							<Text style={styles.summaryValue}>
								{statsSummary.totalVolume.toLocaleString()}
							</Text>
							<Text style={styles.summaryLabel}>
								Total Volume (lbs)
							</Text>
						</View>
						<View style={styles.summaryItem}>
							<Ionicons
								name="time-outline"
								size={24}
								color={themeStyle.primary}
								style={styles.summaryIcon}
							/>
							<Text style={styles.summaryValue}>
								{statsSummary.avgDuration}
							</Text>
							<Text style={styles.summaryLabel}>
								Avg Duration
							</Text>
						</View>
						<View style={styles.summaryItem}>
							<Ionicons
								name="star-outline"
								size={24}
								color={themeStyle.primary}
								style={styles.summaryIcon}
							/>
							<Text
								style={[styles.summaryValue, { fontSize: 16 }]}
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{statsSummary.mostFrequentExercise}
							</Text>
							<Text style={styles.summaryLabel}>
								Favorite Exercise
							</Text>
						</View>
					</View>
				</View>

				{/* Best Lifts */}
				<View style={styles.bestLiftsContainer}>
					<View style={styles.headerRow}>
						<Text style={styles.sectionTitle}>
							{viewMode === "best"
								? "Best Lifts"
								: "Progress Tracking"}
						</Text>
						<View style={styles.filterContainer}>
							<TouchableOpacity
								style={styles.filterButton}
								onPress={toggleViewMode}
							>
								<Ionicons
									name={
										viewMode === "best"
											? "trophy-outline"
											: "analytics-outline"
									}
									size={16}
									color={themeStyle.primary}
									style={{ marginRight: 5 }}
								/>
								<Text style={styles.filterButtonText}>
									View:{" "}
									{viewMode === "best" ? "Best" : "Progress"}
								</Text>
								<Ionicons
									name="swap-horizontal"
									size={16}
									color={themeStyle.primary}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.filtersRow}>
						<TouchableOpacity
							style={styles.filterChip}
							onPress={toggleFilterType}
						>
							<Ionicons
								name="options-outline"
								size={16}
								color={themeStyle.primary}
								style={{ marginRight: 5 }}
							/>
							<Text style={styles.filterChipText}>
								Metric: {filterType}
							</Text>
							<Ionicons
								name="chevron-down"
								size={14}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.filterChip}
							onPress={toggleTimeRange}
						>
							<Ionicons
								name="calendar-outline"
								size={16}
								color={themeStyle.primary}
								style={{ marginRight: 5 }}
							/>
							<Text style={styles.filterChipText}>
								{displayTimeRange()}
							</Text>
							<Ionicons
								name="chevron-down"
								size={14}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>
					</View>

					{viewMode === "best" ? (
						<View style={styles.bestLiftsBox}>
							{popularExercises.map((exercise, index) => (
								<View key={index} style={styles.exerciseRow}>
									<View style={styles.exerciseNameContainer}>
										<Ionicons
											name={
												exerciseIcons[exercise] ||
												"fitness-outline"
											}
											size={20}
											color={themeStyle.primary}
											style={styles.exerciseIcon}
										/>
										<Text
											style={styles.liftName}
											numberOfLines={1}
											ellipsizeMode="tail"
										>
											{exercise}
										</Text>
									</View>
									{(() => {
										const { text, isEstimated } =
											getBestLift(
												filterWorkoutData(
													exercise,
													workoutHistory
												),
												filterType
											);
										return (
											<Text
												style={
													isEstimated
														? styles.liftNameEstimated
														: styles.liftValue
												}
											>
												{text}
											</Text>
										);
									})()}
								</View>
							))}
						</View>
					) : (
						<View style={styles.progressContainer}>
							{popularExercises.map((exercise, index) => {
								const progressData = getProgressData(exercise);
								return (
									<View
										key={index}
										style={styles.progressCard}
									>
										<View style={styles.progressTitleRow}>
											<Ionicons
												name={
													exerciseIcons[exercise] ||
													"fitness-outline"
												}
												size={22}
												color={themeStyle.primary}
												style={styles.progressTitleIcon}
											/>
											<Text style={styles.progressTitle}>
												{exercise}
											</Text>
										</View>
										{progressData ? (
											<LineChart
												data={progressData}
												width={
													Dimensions.get("window")
														.width - 60
												}
												height={180}
												chartConfig={{
													backgroundColor:
														themeStyle.card,
													backgroundGradientFrom:
														themeStyle.card,
													backgroundGradientTo:
														themeStyle.card,
													decimalPlaces: 0,
													color: (opacity = 1) =>
														`rgba(${themeStyle.primary
															.replace("#", "")
															.match(/.{2}/g)
															.map((x) =>
																parseInt(x, 16)
															)
															.join(
																", "
															)}, ${opacity})`,
													labelColor: (opacity = 1) =>
														`rgba(${themeStyle.textColor
															.replace("#", "")
															.match(/.{2}/g)
															.map((x) =>
																parseInt(x, 16)
															)
															.join(
																", "
															)}, ${opacity})`,
													style: {
														borderRadius: 16,
													},
													propsForDots: {
														r: "5",
														strokeWidth: "2",
														stroke:
															themeStyle.accent ||
															themeStyle.primary,
													},
												}}
												bezier
												style={{
													marginVertical: 8,
													borderRadius: 16,
												}}
											/>
										) : (
											<View
												style={styles.noDataContainer}
											>
												<Text style={styles.noDataText}>
													Not enough data to show
													progress
												</Text>
											</View>
										)}
									</View>
								);
							})}
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

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
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: 20,
			marginTop: 10,
			marginBottom: 10,
		},
		title: {
			fontSize: 28,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		summaryContainer: {
			marginHorizontal: 20,
			marginTop: 15,
			padding: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
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
			borderRadius: 12,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 2,
			elevation: 1,
		},
		summaryIcon: {
			marginBottom: 10,
		},
		summaryValue: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.primary,
			marginBottom: 8,
			letterSpacing: 0.5,
		},
		summaryLabel: {
			fontSize: 13,
			color: themeStyle.textColorSecondary || themeStyle.textColor,
			fontWeight: "500",
			letterSpacing: 0.3,
		},
		sectionTitle: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 8,
			letterSpacing: 0.5,
		},
		bestLiftsContainer: {
			marginHorizontal: 20,
			marginTop: 20,
			marginBottom: 30,
		},
		bestLiftsBox: {
			padding: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 16,
			marginTop: 15,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
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
			backgroundColor: `${themeStyle.primary}20`, // Light tint of primary color
			paddingHorizontal: 14,
			paddingVertical: 8,
			borderRadius: 24,
			marginRight: 10,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 1,
			elevation: 1,
			borderWidth: 1,
			borderColor: `${themeStyle.primary}30`,
		},
		filterChipText: {
			color: themeStyle.primary,
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
			backgroundColor: `${themeStyle.primary}20`,
			paddingHorizontal: 12,
			paddingVertical: 7,
			borderRadius: 12,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.05,
			shadowRadius: 1,
			elevation: 1,
			borderWidth: 1,
			borderColor: `${themeStyle.primary}30`,
		},
		filterButtonText: {
			color: themeStyle.primary,
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
			borderBottomWidth: 1,
			borderBottomColor: `${themeStyle.primary}15`, // primary color with 15% opacity
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
			color: themeStyle.accent || themeStyle.primary,
			letterSpacing: 0.3,
		},
		liftNameEstimated: {
			fontSize: 17,
			fontStyle: "italic",
			color: themeStyle.textColorSecondary || themeStyle.textColor,
			letterSpacing: 0.3,
		},
		progressContainer: {
			marginTop: 10,
		},
		progressCard: {
			marginBottom: 24,
			padding: 20,
			backgroundColor: themeStyle.card,
			borderRadius: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 3,
		},
		progressTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 15,
			letterSpacing: 0.3,
			paddingLeft: 4,
		},
		noDataContainer: {
			height: 180,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: `${themeStyle.primary}10`, // Very light tint of primary color
			borderRadius: 12,
			borderWidth: 1,
			borderColor: `${themeStyle.primary}20`,
			marginVertical: 8,
		},
		noDataText: {
			color: themeStyle.textColorSecondary || themeStyle.textColor,
			fontStyle: "italic",
			fontSize: 15,
			letterSpacing: 0.3,
		},
	});
