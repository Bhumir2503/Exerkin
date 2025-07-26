import { View, Pressable, StyleSheet } from "react-native";
import ReorderableList, {
	reorderItems,
	useReorderableDrag,
} from "react-native-reorderable-list";

import InfoCard from "../../../components/InfoCard";
import BodyWeightExercise from "./BlueprintExerciseCard/BodyWeightExercise";
import WeightLiftingExercise from "./BlueprintExerciseCard/WeightLiftingExercise";
import AssistedWeightExercise from "./BlueprintExerciseCard/AssistedWeightExercise";
import CardioDistanceExercise from "./BlueprintExerciseCard/CardioDistanceExercise";
import CardioTimeExercise from "./BlueprintExerciseCard/CardioTimeExercise";

import { useBlueprintExercises } from "../../../contexts/blueprint/BlueprintExercisesContext";

const BlueprintDragList = () => {
	const { blueprintExercises, setBlueprintExercises } =
		useBlueprintExercises();
	const styles = createStyles();

	if (!blueprintExercises || blueprintExercises.length === 0) {
		return (
			<InfoCard
				icon={"barbell-outline"}
				title={"Get Started With Your Blueprint"}
				message={
					"Click the button below to select your first exercise. You can add multiple sets for each exercise and track your progress."
				}
				width={"100%"}
			/>
		);
	}

	const handleReorder = ({ from, to }) => {
		setBlueprintExercises((value) => reorderItems(value, from, to));
	};

	const renderItem = ({ item }) => <Card {...item} />;

	return (
		<View style={styles.container}>
			<View style={styles.listWrapper}>
				<ReorderableList
					data={blueprintExercises}
					onReorder={handleReorder}
					renderItem={renderItem}
					keyExtractor={(item) => item.exerciseId}
					bounces={false}
				/>
			</View>
		</View>
	);
};

const Card = ({ exerciseId, name, sets, notes, exerciseType, unitSystem }) => {
	const drag = useReorderableDrag();
	const exercise = {
		exerciseId,
		name,
		sets,
		notes,
		unitSystem,
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

export default BlueprintDragList;
