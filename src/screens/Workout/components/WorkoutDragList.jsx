import { View, Pressable, StyleSheet, Text, Image } from "react-native";
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
import { useWorkoutImage } from "../../../contexts/workout/WorkoutImageContext";

const WorkoutDragList = () => {
	const { workoutExercises, setWorkoutExercises } = useWorkoutExercises();
	const { workoutImageURL } = useWorkoutImage();
	const styles = createStyles();

	if (!workoutExercises || workoutExercises.length === 0) {
		if (!workoutImageURL) {
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
		return (
			<View style={styles.imageConfirmation}>
				<Image
					source={{ uri: workoutImageURL }}
					style={{
						width: "100%",
						height: 200,
						borderRadius: 8,
					}}
				/>
			</View>
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
					ListHeaderComponent={
						workoutImageURL ? (
							<View style={styles.imageConfirmation}>
								<Image
									source={{ uri: workoutImageURL }}
									style={{
										width: "100%",
										height: 200,
										borderRadius: 8,
									}}
								/>
							</View>
						) : (
							<View></View>
						)
					}
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
				console.log("error rendering exercise");
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
		imageConfirmation: {
			margin: "auto",

			borderRadius: 8,

			marginBottom: 10,
			marginTop: 10,
			width: "90%",
			alignItems: "center",
			display: "flex",
		},
	});
};

export default WorkoutDragList;
