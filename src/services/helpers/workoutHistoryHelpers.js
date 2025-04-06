export const workoutStreak = (workoutHistory) => {
	if (!workoutHistory || workoutHistory.length === 0) return 0;

	// Sort workouts by date (newest first)
	const sortedWorkouts = [...workoutHistory].sort((a, b) => {
		const dateA = a.date?.seconds
			? new Date(a.date.seconds * 1000)
			: new Date(a.date);
		const dateB = b.date?.seconds
			? new Date(b.date.seconds * 1000)
			: new Date(b.date);
		return dateB - dateA; // Descending order (newest first)
	});

	let currentStreak = 1; // Start with the first workout
	const todayDate = new Date();
	todayDate.setHours(0, 0, 0, 0); // Set to start of today

	// Get date of most recent workout
	const mostRecentWorkout = sortedWorkouts[0];
	const mostRecentDate = mostRecentWorkout.date?.seconds
		? new Date(mostRecentWorkout.date.seconds * 1000)
		: new Date(mostRecentWorkout.date);
	mostRecentDate.setHours(0, 0, 0, 0); // Set to start of day

	// If most recent workout is not today or yesterday, streak breaks
	const dayDiff = Math.floor(
		(todayDate - mostRecentDate) / (1000 * 60 * 60 * 24)
	);
	if (dayDiff > 1) {
		return 0; // Streak is broken
	}

	// Calculate current streak
	for (let i = 0; i < sortedWorkouts.length - 1; i++) {
		const currentDate = sortedWorkouts[i].date?.seconds
			? new Date(sortedWorkouts[i].date.seconds * 1000)
			: new Date(sortedWorkouts[i].date);

		const nextDate = sortedWorkouts[i + 1].date?.seconds
			? new Date(sortedWorkouts[i + 1].date.seconds * 1000)
			: new Date(sortedWorkouts[i + 1].date);

		// Set to start of day for comparison
		currentDate.setHours(0, 0, 0, 0);
		nextDate.setHours(0, 0, 0, 0);

		// Calculate difference in days
		const diffDays = Math.floor(
			(currentDate - nextDate) / (1000 * 60 * 60 * 24)
		);

		if (diffDays === 1) {
			// Next workout was exactly 1 day before this one - streak continues
			currentStreak++;
		} else if (diffDays === 0) {
			// Same day workout - don't increase streak
			continue;
		} else {
			// Gap in days - streak is broken
			break;
		}
	}

	return currentStreak;
};

// Helper function to get workouts from current week
export const getWorkoutsThisWeek = (workoutHistory) => {
	if (!workoutHistory || workoutHistory.length === 0) return 0;

	const today = new Date();
	const startOfWeek = new Date(today);
	startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
	startOfWeek.setHours(0, 0, 0, 0);

	let count = 0;

	workoutHistory.forEach((workout) => {
		const workoutDate = workout.date?.seconds
			? new Date(workout.date.seconds * 1000)
			: new Date(workout.date);

		if (workoutDate >= startOfWeek) {
			count++;
		}
	});

	return count;
};
