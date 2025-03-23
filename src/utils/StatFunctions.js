export const calculateStatsSummary = (workoutHistory) => {
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

	return {
		totalWorkouts,
		totalVolume: Math.round(totalVolume),
		avgDuration,
		mostFrequentExercise,
	};
};
