// hooks/useStatsCalculations.js
import { useMemo } from "react";

const useStatsCalculations = (workoutHistory) => {
	const safeToDate = (timestamp) => {
		if (!timestamp) return new Date();
		if (timestamp instanceof Date) return timestamp;
		if (timestamp.toDate) return timestamp.toDate();
		if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
		return new Date(timestamp);
	};

	const stats = useMemo(() => {
		const statsSummary = {
			totalWorkouts: 0,
			totalVolume: 0,
			avgDuration: "0:00",
			longestWorkout: "0:00",
			bestDay: "N/A",
			workoutStreak: 0,
			workoutsPerWeek: 0,
		};

		const dayCounter = [0, 0, 0, 0, 0, 0, 0];
		const monthlyMap = {};
		let totalDuration = 0;

		workoutHistory?.forEach((workout) => {
			const date = safeToDate(workout.completedAt);
			const day = date.getDay();
			dayCounter[day]++;

			const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
			monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + 1;

			const parts = workout.duration?.split(":")?.map(Number);
			const seconds = parts?.[0] * 60 + parts?.[1] || 0;
			totalDuration += seconds;
		});

		statsSummary.totalWorkouts = workoutHistory?.length || 0;
		const avg = totalDuration / statsSummary.totalWorkouts;
		statsSummary.avgDuration = `${Math.floor(avg / 60)}:${(avg % 60)
			.toFixed(0)
			.padStart(2, "0")}`;
		statsSummary.longestWorkout = "1:30";

		const bestDayIndex = dayCounter.indexOf(Math.max(...dayCounter));
		statsSummary.bestDay = [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
		][bestDayIndex];

		const monthlyData = {
			labels: Object.keys(monthlyMap).slice(-6),
			datasets: [{ data: Object.values(monthlyMap).slice(-6) }],
		};

		const weeklyActivity = [
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat",
			"Sun",
		].map((day, i) => ({
			day,
			count: dayCounter[(i + 1) % 7],
		}));

		const bodyPartData = [
			{
				name: "Chest",
				count: 5,
				color: "#FF6384",
				legendFontColor: "#000",
				legendFontSize: 12,
			},
		];

		return { statsSummary, weeklyActivity, monthlyData, bodyPartData };
	}, [workoutHistory]);

	const popularExercises = ["Barbell Bench Press", "Barbell Deadlift"];
	const exerciseIcons = {
		"Barbell Bench Press": "barbell-outline",
		"Barbell Deadlift": "barbell-outline",
	};

	const filterWorkoutData = (name) => {
		return (
			workoutHistory?.flatMap((w) =>
				w.exercises
					?.filter((e) => e.name === name)
					.map((e) => ({ ...e, date: safeToDate(w.completedAt) }))
			) || []
		);
	};

	const getBestLift = (exercises, type) => {
		return { text: "100lbs x 5 reps", isEstimated: false };
	};

	const getProgressData = (name, type) => {
		return {
			labels: ["1/1", "1/2"],
			datasets: [{ data: [100, 120] }],
		};
	};

	return {
		statsSummary: stats.statsSummary,
		weeklyActivity: stats.weeklyActivity,
		monthlyData: stats.monthlyData,
		bodyPartData: stats.bodyPartData,
		popularExercises,
		exerciseIcons,
		filterWorkoutData,
		getBestLift,
		getProgressData,
	};
};

export default useStatsCalculations;
