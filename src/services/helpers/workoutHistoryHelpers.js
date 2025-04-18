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

	const today = new Date();
	
	// Set to Monday as start of week
	// Adjust for the current day (0 = Sunday, 1 = Monday, etc.)
	// For Monday as first day: today.getDay() || 7 (converts Sunday from 0 to 7)
	const dayOfWeek = today.getDay() || 7;
	const startOfWeek = new Date(today);
	startOfWeek.setDate(today.getDate() - (dayOfWeek - 1)); // Start of week (Monday)
	startOfWeek.setHours(0, 0, 0, 0);

	// Get end of week (Sunday) for better filtering
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	endOfWeek.setHours(23, 59, 59, 999);

	let count = 0;

	workoutHistory.forEach((workout) => {
		// Use completedAt as the date field
		let workoutDate;
		
		try {
			if (!workout.completedAt) {
				return; // Skip this workout if completedAt is missing
			}
			
			// Handle different date formats
			if (workout.completedAt instanceof Date) {
				workoutDate = workout.completedAt;
			} else if (typeof workout.completedAt === 'string') {
				workoutDate = new Date(workout.completedAt);
			} else if (typeof workout.completedAt === 'number') {
				workoutDate = new Date(workout.completedAt);
			} else if (workout.completedAt?.seconds) {
				// Handle Firestore timestamp
				workoutDate = new Date(workout.completedAt.seconds * 1000);
			} else if (workout.completedAt?.toDate && typeof workout.completedAt.toDate === 'function') {
				// Handle Firestore Timestamp that has toDate() method
				workoutDate = workout.completedAt.toDate();
			}
			
			// Check if workoutDate is valid before comparing
			if (workoutDate && !isNaN(workoutDate.getTime()) && 
				workoutDate >= startOfWeek && workoutDate <= endOfWeek) {
				count++;
			}
		} catch (error) {
			console.error("Error processing workout date:", error);
			// Continue with the next workout
		}
	});

	return count;
};