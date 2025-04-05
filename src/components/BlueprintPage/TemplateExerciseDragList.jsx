import React from "react";
import { useTemplate } from "../../contexts/TemplateContext";
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

export const TemplateExerciseDragList = () => {
    const {templateExercises, setTemplateExercises} = useTemplate();
	const styles = createStyles();

	if (!templateExercises || templateExercises.length === 0) {
		return null;
	}

	const handleReorder = ({ from, to }) => {
		setTemplateExercises((value) => reorderItems(value, from, to));
	};

	const renderItem = ({ item }) => <Card {...item} />;

	return (
		<View style={styles.container}>
			<View style={styles.listWrapper}>
				<ReorderableList
					data={templateExercises}
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

const createStyles = () => {
	return StyleSheet.create({
		container: {
			flex: 1,
		},
	});
};

export default TemplateExerciseDragList;
