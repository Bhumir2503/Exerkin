import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

export default function Stats({ navigation }) {
	const { workoutHistory } = useWorkout();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [filterType, setFilterType] = useState("1RM"); // "1RM", "Reps", "Volume"
	const [timeRange, setTimeRange] = useState("all"); // "week", "month", "3months", "all"
	const [viewMode, setViewMode] = useState("best"); // "best", "progress", "activity", "body"
	const [activeTab, setActiveTab] = useState("overview"); // "overview", "lifts", "trends", "body"

	// Helper function to safely convert timestamp to date
	const safeToDate = (timestamp) => {
		if (!timestamp) return new Date();
		if (timestamp instanceof Date) return timestamp;
		if (timestamp.toDate && typeof timestamp.toDate === "function") {
			return timestamp.toDate();
		}
		if (timestamp.seconds && timestamp.nanoseconds) {
			// Handle Firestore timestamp object manually
			return new Date(
				timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
			);
		}
		// If it's a number or string that can be parsed as a date
		return new Date(timestamp);
	};

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
		// Added statistics
		totalSets: 0,
		totalReps: 0,
		weightLifted: 0,
		longestWorkout: "0:00",
		workoutStreak: 0,
		workoutsPerWeek: 0,
		bodyPartFocus: {},
		progressRate: 0,
		bestDay: "N/A",
	});

	// Weekly activity data for heatmap
	const [weeklyActivity, setWeeklyActivity] = useState([
		{ day: "Mon", count: 0 },
		{ day: "Tue", count: 0 },
		{ day: "Wed", count: 0 },
		{ day: "Thu", count: 0 },
		{ day: "Fri", count: 0 },
		{ day: "Sat", count: 0 },
		{ day: "Sun", count: 0 },
	]);

	// Body part distribution data
	const [bodyPartData, setBodyPartData] = useState([]);

	// Monthly workout data
	const [monthlyData, setMonthlyData] = useState({
		labels: [],
		datasets: [{ data: [] }],
	});

	useEffect(() => {
		calculateStatsSummary();
		calculateWeeklyActivity();
		calculateBodyPartDistribution();
		calculateMonthlyProgress();
	}, [workoutHistory]);

	// Calculate workout streak
	const calculateWorkoutStreak = () => {
		if (!workoutHistory || workoutHistory.length === 0) return 0;

		// Sort workouts by date (newest first)
		const sortedWorkouts = [...workoutHistory].sort(
			(a, b) => safeToDate(b.completedAt) - safeToDate(a.completedAt)
		);

		let streak = 1;
		let currentDate = safeToDate(sortedWorkouts[0].completedAt);
		currentDate.setHours(0, 0, 0, 0); // Reset time to start of day

		// Check for consecutive days
		for (let i = 1; i < sortedWorkouts.length; i++) {
			const workoutDate = safeToDate(sortedWorkouts[i].completedAt);
			workoutDate.setHours(0, 0, 0, 0);

			// Calculate difference in days
			const diffDays = Math.round(
				(currentDate - workoutDate) / (1000 * 60 * 60 * 24)
			);

			if (diffDays === 1) {
				// Consecutive day
				streak++;
				currentDate = workoutDate;
			} else if (diffDays === 0) {
				// Same day, continue checking
				continue;
			} else {
				// Streak broken
				break;
			}
		}

		return streak;
	};

	// Calculate weekly activity heatmap
	const calculateWeeklyActivity = () => {
		if (!workoutHistory || workoutHistory.length === 0) return;

		const dayCounter = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat (0-6)

		workoutHistory.forEach((workout) => {
			const workoutDate = safeToDate(workout.completedAt);
			const dayOfWeek = workoutDate.getDay(); // 0 = Sunday, 6 = Saturday
			dayCounter[dayOfWeek]++;
		});

		// Rearrange to Mon-Sun order
		const monToSun = [
			{ day: "Mon", count: dayCounter[1] },
			{ day: "Tue", count: dayCounter[2] },
			{ day: "Wed", count: dayCounter[3] },
			{ day: "Thu", count: dayCounter[4] },
			{ day: "Fri", count: dayCounter[5] },
			{ day: "Sat", count: dayCounter[6] },
			{ day: "Sun", count: dayCounter[0] },
		];

		setWeeklyActivity(monToSun);

		// Find best day
		let maxCount = 0;
		let bestDayIndex = -1;

		dayCounter.forEach((count, index) => {
			if (count > maxCount) {
				maxCount = count;
				bestDayIndex = index;
			}
		});

		const dayNames = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		return bestDayIndex >= 0 ? dayNames[bestDayIndex] : "N/A";
	};

	// Calculate body part distribution
	const calculateBodyPartDistribution = () => {
		if (!workoutHistory || workoutHistory.length === 0) return;

		const bodyPartMap = {
			"Barbell Bench Press": "Chest",
			"Dumbbell Bench Press": "Chest",
			"Incline Bench Press": "Chest",
			"Push Up": "Chest",
			"Dumbbell Fly": "Chest",

			"Barbell Deadlift": "Back",
			"Pull Up": "Back",
			"Lat Pulldown": "Back",
			"Seated Row": "Back",
			"Bent Over Row": "Back",

			"Smith Machine Squat": "Legs",
			"Barbell Squat": "Legs",
			"Leg Press": "Legs",
			"Leg Extension": "Legs",
			"Leg Curl": "Legs",
			"Calf Raise": "Legs",

			"Barbell Shoulder Press": "Shoulders",
			"Dumbbell Shoulder Press": "Shoulders",
			"Lateral Raise": "Shoulders",
			"Front Raise": "Shoulders",
			"Face Pull": "Shoulders",

			"Bicep Curl": "Arms",
			"Hammer Curl": "Arms",
			"Tricep Extension": "Arms",
			"Tricep Pushdown": "Arms",
			"Skull Crusher": "Arms",

			"Sit Up": "Core",
			Crunch: "Core",
			Plank: "Core",
			"Russian Twist": "Core",
			"Leg Raise": "Core",
		};

		const bodyPartFrequency = {
			Chest: 0,
			Back: 0,
			Legs: 0,
			Shoulders: 0,
			Arms: 0,
			Core: 0,
			Other: 0,
		};

		// Count exercises by body part
		workoutHistory.forEach((workout) => {
			if (workout.exercises && Array.isArray(workout.exercises)) {
				workout.exercises.forEach((exercise) => {
					const bodyPart = bodyPartMap[exercise.name] || "Other";
					bodyPartFrequency[bodyPart] =
						(bodyPartFrequency[bodyPart] || 0) + 1;
				});
			}
		});

		// Convert to format for pie chart
		const pieData = Object.entries(bodyPartFrequency)
			.filter(([_, count]) => count > 0)
			.map(([name, count], index) => {
				const colors = [
					"#FF6384", // Red
					"#36A2EB", // Blue
					"#FFCE56", // Yellow
					"#4BC0C0", // Teal
					"#9966FF", // Purple
					"#FF9F40", // Orange
					"#C9CBCF", // Grey
				];

				return {
					name,
					count,
					color: colors[index % colors.length],
					legendFontColor: themeStyle.textColor,
					legendFontSize: 12,
				};
			});

		setBodyPartData(pieData);

		// Find most frequent body part
		let maxFreq = 0;
		let maxBodyPart = "Other";

		Object.entries(bodyPartFrequency).forEach(([part, freq]) => {
			if (freq > maxFreq) {
				maxFreq = freq;
				maxBodyPart = part;
			}
		});

		return maxBodyPart;
	};

	// Calculate monthly workout data
	const calculateMonthlyProgress = () => {
		if (!workoutHistory || workoutHistory.length < 2) return;

		// Group workouts by month
		const monthlyWorkouts = {};

		workoutHistory.forEach((workout) => {
			const date = safeToDate(workout.completedAt);
			const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

			if (!monthlyWorkouts[monthKey]) {
				monthlyWorkouts[monthKey] = [];
			}

			monthlyWorkouts[monthKey].push(workout);
		});

		// Sort months chronologically
		const sortedMonths = Object.keys(monthlyWorkouts).sort();

		// Only keep up to last 6 months
		const recentMonths = sortedMonths.slice(-6);

		// Format labels and calculate data
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		const labels = recentMonths.map((monthKey) => {
			const [year, month] = monthKey.split("-");
			return `${monthNames[parseInt(month) - 1]}`;
		});

		const data = recentMonths.map(
			(monthKey) => monthlyWorkouts[monthKey].length
		);

		setMonthlyData({
			labels,
			datasets: [{ data }],
		});
	};

	const calculateStatsSummary = () => {
		if (!workoutHistory || workoutHistory.length === 0) {
			return;
		}

		// Calculate total workouts
		const totalWorkouts = workoutHistory.length;

		// Calculate total volume, sets, reps, and weight lifted
		let totalVolume = 0;
		let totalSets = 0;
		let totalReps = 0;
		let totalWeight = 0;
		let exerciseFrequency = {};
		let totalDuration = 0;
		let longestDuration = 0;

		// Calculate workouts per week
		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);

		let workoutsLastWeek = 0;

		// Placeholder for progress rate calculation
		let avgProgress = 0;
		let progressPoints = 0;

		workoutHistory.forEach((workout) => {
			// Check if workout is from last week
			const workoutDate = safeToDate(workout.completedAt);
			if (workoutDate >= oneWeekAgo) {
				workoutsLastWeek++;
			}

			// Parse duration (assuming format like "1:30:45")
			const durationParts = workout.duration?.split(":").map(Number) || [
				0, 0,
			];
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
			longestDuration = Math.max(longestDuration, durationInSeconds);

			if (workout.exercises && Array.isArray(workout.exercises)) {
				workout.exercises.forEach((exercise) => {
					// Track exercise frequency
					exerciseFrequency[exercise.name] =
						(exerciseFrequency[exercise.name] || 0) + 1;

					if (exercise.sets && Array.isArray(exercise.sets)) {
						totalSets += exercise.sets.length;

						exercise.sets.forEach((set) => {
							// Calculate volume (weight * reps)
							if (set.weight && set.reps) {
								const weight = Number(set.weight);
								const reps = Number(set.reps);
								totalVolume += weight * reps;
								totalReps += reps;
								totalWeight += weight;
							}
						});
					}
				});
			}
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
		const avgDurationInSeconds =
			totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
		const avgHours = Math.floor(avgDurationInSeconds / 3600);
		const avgMinutes = Math.floor((avgDurationInSeconds % 3600) / 60);
		const avgSeconds = avgDurationInSeconds % 60;

		const avgDuration =
			avgHours > 0
				? `${avgHours}:${avgMinutes
						.toString()
						.padStart(2, "0")}:${avgSeconds
						.toString()
						.padStart(2, "0")}`
				: `${avgMinutes}:${avgSeconds.toString().padStart(2, "0")}`;

		// Format longest workout duration
		const longHours = Math.floor(longestDuration / 3600);
		const longMinutes = Math.floor((longestDuration % 3600) / 60);
		const longSeconds = longestDuration % 60;

		const longestWorkout =
			longHours > 0
				? `${longHours}:${longMinutes
						.toString()
						.padStart(2, "0")}:${longSeconds
						.toString()
						.padStart(2, "0")}`
				: `${longMinutes}:${longSeconds.toString().padStart(2, "0")}`;

		// Calculate workout streak
		const workoutStreak = calculateWorkoutStreak();

		// Get best workout day
		const bestDay = calculateWeeklyActivity();

		// Get most focused body part
		const bodyPartFocus = calculateBodyPartDistribution();

		setStatsSummary({
			totalWorkouts,
			totalVolume: Math.round(totalVolume),
			avgDuration,
			mostFrequentExercise,
			totalSets,
			totalReps,
			weightLifted: Math.round(totalWeight),
			longestWorkout,
			workoutStreak,
			workoutsPerWeek: workoutsLastWeek,
			bodyPartFocus,
			progressRate:
				avgProgress > 0 ? `+${avgProgress.toFixed(1)}%` : "N/A",
			bestDay,
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
			const workoutDate = safeToDate(workout.completedAt);
			return workoutDate >= cutoffDate;
		});
	};

	// Filter workout history by exercise name
	const filterWorkoutData = (targetName, workouts) => {
		const filteredWorkouts = filterWorkoutsByTime(workouts);
		let filteredExercises = [];

		filteredWorkouts.forEach((workout) => {
			if (workout.exercises && Array.isArray(workout.exercises)) {
				workout.exercises.forEach((exercise) => {
					if (exercise.name === targetName) {
						// Add workout date for progress tracking
						filteredExercises.push({
							...exercise,
							date: safeToDate(workout.completedAt),
						});
					}
				});
			}
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
		if (viewMode === "best") {
			setViewMode("progress");
		} else if (viewMode === "progress") {
			setViewMode("activity");
		} else if (viewMode === "activity") {
			setViewMode("body");
		} else {
			setViewMode("best");
		}
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

	const renderTabIndicator = (tabName) => {
		const isActive = activeTab === tabName;
		return (
			<View
				style={[
					styles.tabIndicator,
					isActive && styles.activeTabIndicator,
				]}
			/>
		);
	};

	const renderOverviewTab = () => {
		return (
			<View style={styles.tabContent}>
				{/* Stats Summary */}
				<View style={styles.summaryContainer}>
					<Text style={styles.sectionTitle}>Summary</Text>
					<View style={styles.summaryGrid}>
						<View style={styles.summaryItem}>
							<Ionicons
								name="calendar-outline"
								size={24}
								color={themeStyle.textColor}
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
								color={themeStyle.textColor}
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
								color={themeStyle.textColor}
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
								name="trophy-outline"
								size={24}
								color={themeStyle.textColor}
								style={styles.summaryIcon}
							/>
							<Text style={styles.summaryValue}>
								{statsSummary.workoutStreak}
							</Text>
							<Text style={styles.summaryLabel}>
								Current Streak
							</Text>
						</View>
					</View>
				</View>

				{/* Additional Stats */}
				<View style={styles.additionalStatsContainer}>
					<Text style={styles.sectionTitle}>Detailed Stats</Text>
					<View style={styles.detailedStatsBox}>
						<View style={styles.statRow}>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>Total Sets</Text>
								<Text style={styles.statValue}>
									{statsSummary.totalSets.toLocaleString()}
								</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>Total Reps</Text>
								<Text style={styles.statValue}>
									{statsSummary.totalReps.toLocaleString()}
								</Text>
							</View>
						</View>
						<View style={styles.statRow}>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>
									Weight Lifted
								</Text>
								<Text style={styles.statValue}>
									{statsSummary.weightLifted.toLocaleString()}{" "}
									lbs
								</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>
									Longest Workout
								</Text>
								<Text style={styles.statValue}>
									{statsSummary.longestWorkout}
								</Text>
							</View>
						</View>
						<View style={styles.statRow}>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>
									Workouts/Week
								</Text>
								<Text style={styles.statValue}>
									{statsSummary.workoutsPerWeek}
								</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>
									Most Active Day
								</Text>
								<Text style={styles.statValue}>
									{statsSummary.bestDay}
								</Text>
							</View>
						</View>
						<View style={styles.statRow}>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>
									Favorite Exercise
								</Text>
								<Text
									style={styles.statValue}
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{statsSummary.mostFrequentExercise}
								</Text>
							</View>
							<View style={styles.statItem}>
								<Text style={styles.statLabel}>Body Focus</Text>
								<Text style={styles.statValue}>
									{typeof statsSummary.bodyPartFocus ===
									"string"
										? statsSummary.bodyPartFocus
										: Object.keys(
												statsSummary.bodyPartFocus
										  )[0] || "N/A"}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Monthly Activity */}
				{monthlyData.labels.length > 1 && (
					<View style={styles.chartContainer}>
						<Text style={styles.sectionTitle}>
							Monthly Activity
						</Text>
						<View style={styles.chartBox}>
							<BarChart
								data={monthlyData}
								width={SCREEN_WIDTH - 40}
								height={200}
								yAxisSuffix=""
								chartConfig={{
									backgroundColor: themeStyle.card,
									backgroundGradientFrom: themeStyle.card,
									backgroundGradientTo: themeStyle.card,
									decimalPlaces: 0,
									color: (opacity = 1) =>
										`rgba(${themeStyle.primary
											.replace("#", "")
											.match(/.{2}/g)
											.map((x) => parseInt(x, 16))
											.join(", ")}, ${opacity})`,
									labelColor: (opacity = 1) =>
										`rgba(${themeStyle.textColor
											.replace("#", "")
											.match(/.{2}/g)
											.map((x) => parseInt(x, 16))
											.join(", ")}, ${opacity})`,
									style: {
										borderRadius: 16,
									},
									barPercentage: 0.7,
								}}
								style={{
									marginVertical: 8,
									borderRadius: 16,
								}}
							/>
						</View>
					</View>
				)}

				{/* Weekly Activity Heatmap */}
				<View style={styles.weeklyContainer}>
					<Text style={styles.sectionTitle}>Weekly Activity</Text>
					<View style={styles.weeklyHeatmap}>
						{weeklyActivity.map((day, index) => (
							<View key={index} style={styles.dayColumn}>
								<View
									style={[
										styles.activityIndicator,
										{
											backgroundColor:
												day.count === 0
													? `${themeStyle.primary}20` // Very light tint
													: day.count === 1
													? `${themeStyle.primary}50` // Medium tint
													: day.count >= 2
													? themeStyle.primary // Full color
													: `${themeStyle.primary}20`,
										},
									]}
								>
									<Text style={styles.activityCount}>
										{day.count > 0 ? day.count : ""}
									</Text>
								</View>
								<Text style={styles.dayLabel}>{day.day}</Text>
							</View>
						))}
					</View>
				</View>
			</View>
		);
	};

	const renderLiftsTab = () => {
		return (
			<View style={styles.tabContent}>
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
									color={themeStyle.textColorSecondary}
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
								color={themeStyle.textColorSecondary}
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
								color={themeStyle.textColorSecondary}
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
			</View>
		);
	};

	const renderTrendsTab = () => {
		return (
			<View style={styles.tabContent}>
				{/* Monthly workouts */}
				{monthlyData.labels.length > 1 && (
					<View style={styles.chartContainer}>
						<Text style={styles.sectionTitle}>
							Workout Frequency
						</Text>
						<View style={styles.chartBox}>
							<BarChart
								data={monthlyData}
								width={SCREEN_WIDTH - 40}
								height={200}
								yAxisSuffix=""
								chartConfig={{
									backgroundColor: themeStyle.card,
									backgroundGradientFrom: themeStyle.card,
									backgroundGradientTo: themeStyle.card,
									decimalPlaces: 0,
									color: (opacity = 1) =>
										`rgba(${themeStyle.primary
											.replace("#", "")
											.match(/.{2}/g)
											.map((x) => parseInt(x, 16))
											.join(", ")}, ${opacity})`,
									labelColor: (opacity = 1) =>
										`rgba(${themeStyle.textColor
											.replace("#", "")
											.match(/.{2}/g)
											.map((x) => parseInt(x, 16))
											.join(", ")}, ${opacity})`,
									style: {
										borderRadius: 16,
									},
									barPercentage: 0.7,
								}}
								style={{
									marginVertical: 8,
									borderRadius: 16,
								}}
								fromZero
							/>
							<Text style={styles.chartLabel}>
								Monthly Workout Count
							</Text>
						</View>
					</View>
				)}

				{/* Workout Duration Trend */}
				<View style={styles.chartContainer}>
					<Text style={styles.sectionTitle}>Workout Duration</Text>
					<View style={styles.chartBox}>
						<View style={styles.trendRow}>
							<View style={styles.trendItem}>
								<Text style={styles.trendLabel}>Longest</Text>
								<Text style={styles.trendValue}>
									{statsSummary.longestWorkout}
								</Text>
							</View>
							<View style={styles.trendItem}>
								<Text style={styles.trendLabel}>Average</Text>
								<Text style={styles.trendValue}>
									{statsSummary.avgDuration}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Weekly Activity Heatmap */}
				<View style={styles.weeklyContainer}>
					<Text style={styles.sectionTitle}>
						Weekly Activity Pattern
					</Text>
					<View style={styles.weeklyHeatmap}>
						{weeklyActivity.map((day, index) => (
							<View key={index} style={styles.dayColumn}>
								<View
									style={[
										styles.activityIndicator,
										{
											backgroundColor:
												day.count === 0
													? `${themeStyle.primary}20`
													: day.count === 1
													? `${themeStyle.primary}50`
													: day.count >= 2
													? themeStyle.primary
													: `${themeStyle.primary}20`,
										},
									]}
								>
									<Text style={styles.activityCount}>
										{day.count > 0 ? day.count : ""}
									</Text>
								</View>
								<Text style={styles.dayLabel}>{day.day}</Text>
							</View>
						))}
					</View>
					<Text style={styles.chartLabel}>
						Most active day: {statsSummary.bestDay}
					</Text>
				</View>

				{/* Workout Consistency */}
				<View style={styles.chartContainer}>
					<Text style={styles.sectionTitle}>Consistency</Text>
					<View style={styles.chartBox}>
						<View style={styles.trendRow}>
							<View style={styles.trendItem}>
								<Text style={styles.trendLabel}>
									Current Streak
								</Text>
								<Text style={styles.trendValue}>
									{statsSummary.workoutStreak} days
								</Text>
							</View>
							<View style={styles.trendItem}>
								<Text style={styles.trendLabel}>
									Weekly Average
								</Text>
								<Text style={styles.trendValue}>
									{statsSummary.workoutsPerWeek} workouts
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		);
	};

	const renderBodyFocusTab = () => {
		return (
			<View style={styles.tabContent}>
				{/* Body Part Distribution */}
				<View style={styles.chartContainer}>
					<Text style={styles.sectionTitle}>
						Body Focus Distribution
					</Text>
					{bodyPartData.length > 0 ? (
						<View style={styles.chartBox}>
							<PieChart
								data={bodyPartData}
								width={SCREEN_WIDTH - 40}
								height={220}
								chartConfig={{
									color: (opacity = 1) =>
										`rgba(${themeStyle.textColor
											.replace("#", "")
											.match(/.{2}/g)
											.map((x) => parseInt(x, 16))
											.join(", ")}, ${opacity})`,
								}}
								accessor="count"
								backgroundColor="transparent"
								paddingLeft="15"
								center={[5, 0]}
								absolute
							/>
						</View>
					) : (
						<View style={styles.noDataContainer}>
							<Text style={styles.noDataText}>
								Not enough data to show body focus distribution
							</Text>
						</View>
					)}
				</View>

				{/* Major Muscle Group Stats */}
				<View style={styles.chartContainer}>
					<Text style={styles.sectionTitle}>Muscle Group Focus</Text>
					<View style={styles.muscleGroupsContainer}>
						{Object.entries(bodyPartData).length > 0 ? (
							Object.entries(bodyPartData).map(
								([_, item], index) => (
									<View
										key={index}
										style={styles.muscleGroupItem}
									>
										<View
											style={[
												styles.muscleGroupIndicator,
												{ backgroundColor: item.color },
											]}
										/>
										<Text style={styles.muscleGroupName}>
											{item.name}
										</Text>
										<Text style={styles.muscleGroupCount}>
											{item.count} exercises
										</Text>
									</View>
								)
							)
						) : (
							<View style={styles.noDataContainer}>
								<Text style={styles.noDataText}>
									Not enough data to show muscle group focus
								</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<Text style={styles.title}>Stats & Analytics</Text>
			</View>

			{/* Tab Navigation */}
			<View style={styles.tabBar}>
				<TouchableOpacity
					style={styles.tab}
					onPress={() => setActiveTab("overview")}
				>
					<Ionicons
						name="stats-chart"
						size={20}
						color={
							activeTab === "overview"
								? themeStyle.primary
								: themeStyle.textColorSecondary
						}
					/>
					<Text
						style={[
							styles.tabText,
							activeTab === "overview" && styles.activeTabText,
						]}
					>
						Overview
					</Text>
					{renderTabIndicator("overview")}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.tab}
					onPress={() => setActiveTab("lifts")}
				>
					<Ionicons
						name="barbell"
						size={20}
						color={
							activeTab === "lifts"
								? themeStyle.primary
								: themeStyle.textColorSecondary
						}
					/>
					<Text
						style={[
							styles.tabText,
							activeTab === "lifts" && styles.activeTabText,
						]}
					>
						Lifts
					</Text>
					{renderTabIndicator("lifts")}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.tab}
					onPress={() => setActiveTab("trends")}
				>
					<Ionicons
						name="trending-up"
						size={20}
						color={
							activeTab === "trends"
								? themeStyle.primary
								: themeStyle.textColorSecondary
						}
					/>
					<Text
						style={[
							styles.tabText,
							activeTab === "trends" && styles.activeTabText,
						]}
					>
						Trends
					</Text>
					{renderTabIndicator("trends")}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.tab}
					onPress={() => setActiveTab("body")}
				>
					<Ionicons
						name="body"
						size={20}
						color={
							activeTab === "body"
								? themeStyle.primary
								: themeStyle.textColorSecondary
						}
					/>
					<Text
						style={[
							styles.tabText,
							activeTab === "body" && styles.activeTabText,
						]}
					>
						Body
					</Text>
					{renderTabIndicator("body")}
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollContainer}
				showsVerticalScrollIndicator={false}
			>
				{activeTab === "overview" && renderOverviewTab()}
				{activeTab === "lifts" && renderLiftsTab()}
				{activeTab === "trends" && renderTrendsTab()}
				{activeTab === "body" && renderBodyFocusTab()}
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
