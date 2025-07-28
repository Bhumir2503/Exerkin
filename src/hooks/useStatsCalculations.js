// hooks/useStatsCalculations.js
import { useMemo } from "react";

const useStatsCalculations = (workoutHistory) => {
	const calculations = useMemo(() => {
		if (!workoutHistory || workoutHistory.length === 0) {
			return {
				statsSummary: {
					totalWorkouts: 0,
					totalVolume: "0 lbs",
					totalDuration: "0h 0m",
					workoutStreak: 0,
					totalSets: 0,
					totalReps: 0,
					avgDuration: "0m",
					longestWorkout: "0m",
					bestDay: "Monday",
					workoutsPerWeek: 0,
					avgVolume: "0 lbs",
					totalDistance: "0 mi",
				},
				monthlyData: {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
					datasets: [{ data: [0, 0, 0, 0, 0, 0] }],
				},
				weeklyActivity: [],
				bodyPartData: [],
				popularExercises: [],
				exerciseIcons: {},
				filterWorkoutData: () => [],
				getBestLift: () => ({ text: "No data", value: 0 }),
				getProgressData: () => null,
			};
		}

		// Calculate basic stats
		const totalWorkouts = workoutHistory.length;
		let totalVolume = 0;
		let totalSets = 0;
		let totalReps = 0;
		let totalDuration = 0;
		let totalDistance = 0;
		let totalExercises = 0;
		const exerciseFrequency = {};
		const bodyPartFrequency = {};
		const exerciseMaxes = {};
		const dailyWorkouts = {};

		// Body part mapping
		const bodyPartMapping = {
			chest: ["bench press", "push up", "chest fly", "dips"],
			back: ["pull up", "row", "lat pulldown", "deadlift"],
			shoulders: ["shoulder press", "lateral raise", "overhead press"],
			biceps: ["bicep curl", "hammer curl", "chin up"],
			triceps: ["tricep extension", "dips", "close grip"],
			legs: ["squat", "lunge", "leg press", "calf raise"],
			core: ["plank", "crunch", "sit up", "russian twist"],
		};

		const convertToImperial = (value, unit) => {
			if (unit === "metric") {
				// Assume conversion logic here from metric to imperial
				// For example, 1 kg = 2.20462 lbs for weight
				// Adjust according to your specific conversion requirements
				return value * 2.20462; // Example conversion, adjust as needed
			}
			return value; // No conversion needed if already imperial
		};

		// Helper function to convert metric to imperial for distance
		const convertToImperialDistance = (value, unit) => {
			if (typeof value === "string") {
				const numericValue = parseFloat(value); // Extract numeric value from string
				if (isNaN(numericValue)) {
					return 0; // Handle invalid or non-numeric strings gracefully
				}
				value = numericValue; // Update value to numeric for further conversion
			}

			if (unit === "km") {
				// Conversion: 1 km = 0.621371 mi
				return value * 0.621371;
			}
			return value; // No conversion needed if already in miles
		};

		workoutHistory.forEach((workout) => {
			// Duration calculation
			if (workout.startedAt && workout.completedAt) {
				const duration =
					workout.completedAt.toMillis() -
					workout.startedAt.toMillis();
				totalDuration += duration;
			}

			// Daily workout tracking
			const date = workout.completedAt?.toDate().toDateString();
			if (date) {
				dailyWorkouts[date] = (dailyWorkouts[date] || 0) + 1;
			}

			workout.exercises?.forEach((exercise) => {
				totalExercises++;
				// Exercise frequency
				exerciseFrequency[exercise.name] =
					(exerciseFrequency[exercise.name] || 0) + 1;

				// Body part classification
				const exerciseName = exercise.name.toLowerCase();
				for (const [bodyPart, keywords] of Object.entries(
					bodyPartMapping
				)) {
					if (
						keywords.some((keyword) =>
							exerciseName.includes(keyword)
						)
					) {
						bodyPartFrequency[bodyPart] =
							(bodyPartFrequency[bodyPart] || 0) + 1;
						break;
					}
				}

				exercise.sets?.forEach((set) => {
					if (set.completed) {
						totalSets++;
						if (set.reps) totalReps += set.reps;
						if (set.weight && set.reps) {
							set.weight = convertToImperial(
								set.weight,
								exercise.unitSystem
							);
							const volume = set.weight * set.reps;
							totalVolume += volume;

							// Track exercise maxes
							const oneRepMax = set.weight * (1 + set.reps / 30); // Brzycki formula
							if (
								!exerciseMaxes[exercise.name] ||
								oneRepMax > exerciseMaxes[exercise.name].oneRM
							) {
								exerciseMaxes[exercise.name] = {
									oneRM: oneRepMax,
									maxWeight: set.weight,
									maxReps: set.reps,
									maxVolume: volume,
								};
							}
						}
						if (set.distance) {
							set.distance = convertToImperialDistance(
								set.distance,
								exercise.unitSystem
							);
							totalDistance += set.distance; // Accumulate total distance
						}
					}
				});
			});
		});

		// Calculate averages and streaks
		const avgDuration =
			totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
		const longestWorkout = Math.max(
			...Object.values(dailyWorkouts).map(
				() => totalDuration / totalWorkouts
			)
		);

		// Current streak calculation
		const sortedDates = Object.keys(dailyWorkouts).sort(
			(a, b) => new Date(b) - new Date(a)
		);
		let currentStreak = 0;
		let currentDate = new Date();

		for (const dateStr of sortedDates) {
			const workoutDate = new Date(dateStr);
			const daysDiff = Math.floor(
				(currentDate - workoutDate) / (1000 * 60 * 60 * 24)
			);

			if (daysDiff <= currentStreak + 1) {
				currentStreak++;
				currentDate = workoutDate;
			} else {
				break;
			}
		}

		// Weekly activity pattern
		const dayNames = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		const weeklyPattern = new Array(7).fill(0);

		Object.keys(dailyWorkouts).forEach((dateStr) => {
			const dayOfWeek = new Date(dateStr).getDay();
			weeklyPattern[dayOfWeek] += dailyWorkouts[dateStr];
		});

		const bestDayIndex = weeklyPattern.indexOf(Math.max(...weeklyPattern));
		const bestDay = dayNames[bestDayIndex];

		// Monthly data for charts
		const monthlyData = {
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
			datasets: [
				{
					data: [0, 0, 0, 0, 0, 0], // This should be calculated from actual monthly data
				},
			],
		};

		// Popular exercises (top 10)
		const popularExercises = Object.entries(exerciseFrequency)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([name]) => name);

		// Body part data for pie chart
		const bodyPartData = Object.entries(bodyPartFrequency).map(
			([name, count]) => ({
				name: name.charAt(0).toUpperCase() + name.slice(1),
				count,
				color: getBodyPartColor(name),
				legendFontColor: "#7F7F7F",
				legendFontSize: 15,
			})
		);

		// Helper functions
		const filterWorkoutData = (exerciseName) => {
			return workoutHistory.filter((workout) =>
				workout.exercises?.some((ex) => ex.name === exerciseName)
			);
		};

		const getBestLift = (workouts, metric = "1RM") => {
			let best = { text: "No data", value: 0 };

			workouts.forEach((workout) => {
				workout.exercises?.forEach((exercise) => {
					exercise.sets?.forEach((set) => {
						if (set.completed && set.weight && set.reps) {
							let value = 0;
							let text = "";

							switch (metric) {
								case "1RM":
									value = set.weight * (1 + set.reps / 30);
									text = `${Math.round(value)} lbs (est.)`;
									break;
								case "Reps":
									if (set.reps > best.value) {
										value = set.reps;
										text = `${value} reps @ ${set.weight} lbs`;
									}
									break;
								case "Volume":
									value = set.weight * set.reps;
									text = `${value} lbs total`;
									break;
							}

							if (value > best.value) {
								best = { text, value };
							}
						}
					});
				});
			});

			return best;
		};

		const getProgressData = (exerciseName, metric = "1RM") => {
			const exerciseWorkouts = workoutHistory
				.filter((workout) =>
					workout.exercises?.some((ex) => ex.name === exerciseName)
				)
				.sort(
					(a, b) =>
						a.completedAt?.toMillis() - b.completedAt?.toMillis()
				)
				.slice(-10); // Last 10 workouts

			if (exerciseWorkouts.length < 2) return null;

			const data = exerciseWorkouts.map((workout) => {
				let bestValue = 0;
				workout.exercises?.forEach((exercise) => {
					if (exercise.name === exerciseName) {
						exercise.sets?.forEach((set) => {
							if (set.completed && set.weight && set.reps) {
								let value = 0;
								switch (metric) {
									case "1RM":
										value =
											set.weight * (1 + set.reps / 30);
										break;
									case "Reps":
										value = set.reps;
										break;
									case "Volume":
										value = set.weight * set.reps;
										break;
								}
								bestValue = Math.max(bestValue, value);
							}
						});
					}
				});
				return Math.round(bestValue);
			});

			return {
				labels: exerciseWorkouts.map((_, index) => `W${index + 1}`),
				datasets: [
					{
						data,
						strokeWidth: 2,
					},
				],
			};
		};

		// Format duration helper
		const formatDuration = (milliseconds) => {
			const minutes = Math.floor(milliseconds / (1000 * 60));
			const hours = Math.floor(minutes / 60);
			const remainingMinutes = minutes % 60;

			if (hours > 0) {
				return `${hours}h ${remainingMinutes}m`;
			}
			return `${remainingMinutes}m`;
		};

		return {
			statsSummary: {
				totalWorkouts,
				totalExercises,
				totalVolume: `${Math.round(totalVolume).toLocaleString()} lbs`,
				totalDuration: formatDuration(totalDuration),
				workoutStreak: currentStreak,
				totalSets,
				totalReps: totalReps.toLocaleString(),
				avgDuration: formatDuration(avgDuration),
				longestWorkout: formatDuration(longestWorkout),
				bestDay,
				workoutsPerWeek: Math.round(
					totalWorkouts /
						Math.max(1, Math.ceil(workoutHistory.length / 7))
				),
				avgVolume: `${Math.round(
					totalVolume / Math.max(1, totalWorkouts)
				).toLocaleString()} lbs`,
				totalDistance: `${Math.round(totalDistance)} mi`,
			},
			monthlyData,
			weeklyActivity: weeklyPattern,
			bodyPartData,
			popularExercises,
			exerciseIcons: {}, // You can add exercise icons mapping here
			filterWorkoutData,
			getBestLift,
			getProgressData,
		};
	}, [workoutHistory]);

	return calculations;
};

// Helper function for body part colors
const getBodyPartColor = (bodyPart) => {
	const colors = {
		chest: "#FF6B6B",
		back: "#4ECDC4",
		shoulders: "#45B7D1",
		biceps: "#96CEB4",
		triceps: "#FECA57",
		legs: "#FF9FF3",
		core: "#54A0FF",
	};
	return colors[bodyPart] || "#95A5A6";
};

export default useStatsCalculations;
