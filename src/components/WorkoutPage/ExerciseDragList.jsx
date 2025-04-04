import React from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import { useTheme } from "../../contexts/ThemeContext";
import { StyleSheet, View, Pressable } from "react-native";
import ReorderableList, {
	reorderItems,
	useReorderableDrag,
} from "react-native-reorderable-list";

import BodyWeightExercise from "./ExerciseCard/BodyWeightExercise";
import WeightLiftingExercise from "./ExerciseCard/WeightLiftingExercise";
import AssistedWeightExercise from "./ExerciseCard/AssistedWeightExercise";
import CardioDistanceExercise from "./ExerciseCard/CardioDistanceExercise";
import CardioTimeExercise from "./ExerciseCard/CardioTimeExercise";


export const ExerciseDragList = () => {
	const { workoutExercises, setWorkoutExercises } = useWorkout();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	if(!workoutExercises || workoutExercises.length === 0) {
		return (
			null)
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
					keyExtractor={(item) => item.id}
					bounces={false}
				/>
			</View>
		</View>
	);
};

const Card = ({ id, name, sets, type }) => {
	const drag = useReorderableDrag();

	const exercise = {
		id,
		name,
		sets,
	};

	const renderExercise = () => {
		switch (type) {
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
				return null;
		}
	};

	return <Pressable onLongPress={drag}>{renderExercise()}</Pressable>;
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			backgroundColor: theme.background,
            maxHeight: "78%",
		},
	});
};

export default ExerciseDragList;
