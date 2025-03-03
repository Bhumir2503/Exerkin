// Categories as a separate collection
export const exerciseCategories = [
	{ id: "Chest", name: "Chest" },
	{ id: "Back", name: "Back" },
	{ id: "Arms", name: "Arms" },
	{ id: "Legs", name: "Legs" },
	{ id: "Shoulders", name: "Shoulders" },
	{ id: "Core", name: "Core" },
	{ id: "Cardio", name: "Cardio" },
];

// Equipment types for better filtering
export const equipmentTypes = [
	{ id: "Barbell", name: "Barbell" },
	{ id: "Dumbbell", name: "Dumbbell" },
	{ id: "Machine", name: "Machine" },
	{ id: "Cable", name: "Cable" },
	{ id: "Bodyweight", name: "Bodyweight" },
	{ id: "Cardio Equipment", name: "Cardio Equipment" },
	{ id: "Assisted", name: "Assisted" },
	{ id: "Other", name: "Other" },
];

// Exercises with more detailed information
export const exercises = [
	// Cardio exercises
	{
		id: "treadmill_run",
		name: "Treadmill Running",
		categoryId: "Cardio",
		equipment: ["Cardio Equipment"],
		primaryMuscles: ["Quadriceps", "Hamstrings", "Calves"],
		secondaryMuscles: ["Core", "Glutes"],
		difficulty: "scalable",
		type: "cardio",
		instructions:
			"Start with a warm-up walk, then increase speed to a comfortable running pace. Maintain upright posture with natural arm swing.",
		videoUrl: "/videos/treadmill_run.mp4",
		imageUrl: "/images/treadmill_run.jpg",
		metrics: ["distance", "time", "calories", "heart_rate"],
	},
	{
		id: "stationary_bike",
		name: "Stationary Bike",
		categoryId: "Cardio",
		equipment: ["Cardio Equipment"],
		primaryMuscles: ["Quadriceps", "Hamstrings", "Calves"],
		secondaryMuscles: ["Glutes"],
		difficulty: "scalable",
		type: "cardio",
		instructions:
			"Adjust the seat height so your knee is slightly bent at the bottom of the pedal stroke. Maintain a steady rhythm at your target resistance level.",
		videoUrl: "/videos/stationary_bike.mp4",
		imageUrl: "/images/stationary_bike.jpg",
		metrics: [
			"distance",
			"time",
			"calories",
			"heart_rate",
			"resistance_level",
		],
	},
	{
		id: "elliptical",
		name: "Elliptical Trainer",
		categoryId: "Cardio",
		equipment: ["Cardio Equipment"],
		primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"],
		secondaryMuscles: ["Core", "Arms", "Shoulders"],
		difficulty: "scalable",
		type: "cardio",
		instructions:
			"Stand upright with good posture on the machine, engage core muscles, and use both the leg and arm components for a full-body workout.",
		videoUrl: "/videos/elliptical.mp4",
		imageUrl: "/images/elliptical.jpg",
		metrics: [
			"distance",
			"time",
			"calories",
			"heart_rate",
			"resistance_level",
		],
	},

	// Assisted exercises
	{
		id: "assisted_pull_up",
		name: "Assisted Pull-Up",
		categoryId: "Back",
		equipment: ["Assisted", "Machine"],
		primaryMuscles: ["Back", "Lats"],
		secondaryMuscles: ["Biceps", "Shoulders"],
		difficulty: "beginner",
		type: "strength",
		instructions:
			"Adjust the assistance weight to your needs. Grip the bar with hands wider than shoulder-width, then pull yourself up until your chin is over the bar. Lower back down with control.",
		videoUrl: "/videos/assisted_pull_up.mp4",
		imageUrl: "/images/assisted_pull_up.jpg",
		assistanceType: "machine counterweight",
	},
	{
		id: "assisted_dip",
		name: "Assisted Dip",
		categoryId: "Chest",
		equipment: ["Assisted", "Machine"],
		primaryMuscles: ["Chest", "Triceps"],
		secondaryMuscles: ["Shoulders"],
		difficulty: "beginner",
		type: "strength",
		instructions:
			"Set the assistance weight. Grip the parallel bars, lower your body by bending your elbows until your upper arms are parallel to the ground, then push back up.",
		videoUrl: "/videos/assisted_dip.mp4",
		imageUrl: "/images/assisted_dip.jpg",
		assistanceType: "machine counterweight",
	},
	{
		id: "smith_machine_squat",
		name: "Smith Machine Squat",
		categoryId: "Legs",
		equipment: ["Assisted", "Machine"],
		primaryMuscles: ["Quadriceps", "Glutes"],
		secondaryMuscles: ["hamstrings", "calves", "core"],
		difficulty: "beginner",
		type: "strength",
		instructions:
			"Position yourself under the bar with feet shoulder-width apart. Unrack the bar, lower into a squat position until thighs are parallel to the ground, then push back up.",
		videoUrl: "/videos/smith_machine_squat.mp4",
		imageUrl: "/images/smith_machine_squat.jpg",
		assistanceType: "guided barbell path",
	},

	// Original strength exercises
	{
		id: "db_bench_press",
		name: "Dumbbell Bench Press",
		categoryId: "Chest",
		equipment: ["Dumbbell"],
		primaryMuscles: ["Chest"],
		secondaryMuscles: ["triceps", "shoulders"],
		difficulty: "intermediate",
		instructions:
			"Lie on a bench with a dumbbell in each hand. Push the dumbbells up until your arms are fully extended, then lower them back to chest level.",
		videoUrl: "/videos/db_bench_press.mp4",
		imageUrl: "/images/db_bench_press.jpg",
	},
	{
		id: "bb_bench_press",
		name: "Barbell Bench Press",
		categoryId: "Chest",
		equipment: ["Barbell", "Bench"],
		primaryMuscles: ["Chest"],
		secondaryMuscles: ["triceps", "shoulders"],
		difficulty: "intermediate",
		instructions:
			"Lie on a bench with a barbell gripped slightly wider than shoulder width. Lower the bar to your chest, then push it back up to full arm extension.",
		videoUrl: "/videos/bb_bench_press.mp4",
		imageUrl: "/images/bb_bench_press.jpg",
	},
	{
		id: "db_row",
		name: "Dumbbell Row",
		categoryId: "Back",
		equipment: ["Dumbbell"],
		primaryMuscles: ["Back"],
		secondaryMuscles: ["biceps", "shoulders"],
		difficulty: "beginner",
		instructions:
			"Place one knee and hand on a bench, with the other foot on the floor. Hold a dumbbell in your free hand, pull it up to your hip, then lower it back down with control.",
		videoUrl: "/videos/db_row.mp4",
		imageUrl: "/images/db_row.jpg",
	},
	{
		id: "bb_deadlift",
		name: "Barbell Deadlift",
		categoryId: "Back",
		equipment: ["Barbell"],
		primaryMuscles: ["Back", "Hamstrings"],
		secondaryMuscles: ["glutes", "forearms", "core"],
		difficulty: "advanced",
		instructions:
			"Stand with feet hip-width apart, bend at the hips and knees to grip the barbell. Keeping your back straight, stand up while holding the barbell, then lower it back to the ground with control.",
		videoUrl: "/videos/bb_deadlift.mp4",
		imageUrl: "/images/bb_deadlift.jpg",
	},
	{
		id: "db_curl",
		name: "Dumbbell Curl",
		categoryId: "Arms",
		equipment: ["Dumbbell"],
		primaryMuscles: ["Biceps"],
		secondaryMuscles: ["forearms"],
		difficulty: "beginner",
		instructions:
			"Stand holding dumbbells at your sides with palms facing forward. Curl the weights up toward your shoulders, then lower them back down with control.",
		videoUrl: "/videos/db_curl.mp4",
		imageUrl: "/images/db_curl.jpg",
	},
	{
		id: "bb_curl",
		name: "Barbell Curl",
		categoryId: "Arms",
		equipment: ["Barbell"],
		primaryMuscles: ["Biceps"],
		secondaryMuscles: ["forearms"],
		difficulty: "beginner",
		instructions:
			"Stand holding a barbell at your thighs with palms facing forward. Curl the barbell up toward your shoulders, then lower it back down with control.",
		videoUrl: "/videos/bb_curl.mp4",
		imageUrl: "/images/bb_curl.jpg",
	},
];

// Helper function to get exercises by category
export function getExercisesByCategory(categoryId) {
	return exercises.filter((exercise) => exercise.categoryId === categoryId);
}

// Helper function to get exercises by equipment
export function getExercisesByEquipment(equipmentId) {
	return exercises.filter((exercise) =>
		exercise.equipment.includes(equipmentId)
	);
}

// Helper function to get exercises by difficulty
export function getExercisesByDifficulty(difficultyLevel) {
	return exercises.filter(
		(exercise) => exercise.difficulty === difficultyLevel
	);
}

// Example usage:
// const chestExercises = getExercisesByCategory("chest");
// const dumbbellExercises = getExercisesByEquipment("dumbbell");
// const beginnerExercises = getExercisesByDifficulty("beginner");
