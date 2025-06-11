import { View, Pressable, StyleSheet } from "react-native";
import ReorderableList, {
	reorderItems,
	useReorderableDrag,
} from "react-native-reorderable-list";

import InfoCard from "../../../components/InfoCard";
import BodyWeightExercise from "./ExerciseCard/BodyWeightExercise";
import WeightLiftingExercise from "./ExerciseCard/WeightLiftingExercise";
import AssistedWeightExercise from "./ExerciseCard/AssistedWeightExercise";
import CardioDistanceExercise from "./ExerciseCard/CardioDistanceExercise";
import CardioTimeExercise from "./ExerciseCard/CardioTimeExercise";

import { useWorkoutExercises } from "../../../contexts/workout/WorkoutExercisesContext";

const WorkoutDragList = () => {
	const { workoutExercises, setWorkoutExercises } = useWorkoutExercises();
	const styles = createStyles();

	if (!workoutExercises || workoutExercises.length === 0) {
		return (
			<InfoCard
				icon={"barbell-outline"}
				title={"Get Started With Your Workout"}
				message={
					"Click the button below to select your first exercise. You can add multiple sets for each exercise and track your progress."
				}
			/>
		);
	}

	const handleReorder = ({ from, to }) => {
		setWorkoutExercises((value) => reorderItems(value, from, to));
	};

	const renderItem = ({ item }) => <Card {...item} />;

	return (
		<View style={styles.container}>
			<View style={styles.listWrapper}>
				<ReorderableList
					data={workoutExercises}
					onReorder={handleReorder}
					renderItem={renderItem}
					keyExtractor={(item) => item.exerciseId}
					bounces={false}
				/>
			</View>
		</View>
	);
};

const Card = ({ exerciseId, name, sets, notes, exerciseType }) => {
	const drag = useReorderableDrag();
	const exercise = {
		exerciseId,
		name,
		sets,
		notes,
	};

	const renderExercise = () => {
		switch (exerciseType) {
			case "bodyweight":
				return <BodyWeightExercise exercise={exercise} />;
			case "weightlifting":
				return <WeightLiftingExercise exercise={exercise} />;
			case "assisted-weight":
				return <AssistedWeightExercise exercise={exercise} />;
			case "cardio-distance":
				return <CardioDistanceExercise exercise={exercise} />;
			case "cardio-time":
				return <CardioTimeExercise exercise={exercise} />;
			default:
				console.log("error rendering exercise")
				return null;
		}
	};

	return <Pressable onLongPress={drag}>{renderExercise()}</Pressable>;
};

const createStyles = () => {
	return StyleSheet.create({
		container: {
			flex: 1,
		},
	});
};

export default WorkoutDragList;
