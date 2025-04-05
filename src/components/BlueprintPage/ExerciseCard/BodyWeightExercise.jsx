import { View, Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { useTemplate } from "../../../contexts/TemplateContext";
import Header from "./Header";
import UserInputSection from "./UserInputSection";

const BodyWeightExercise = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToTemplateExercise, updateSetInTemplateExercise } =
		useTemplate();

	const addSet = () => {
		// Add a new set with null values for reps
		addSetToTemplateExercise(exercise.id, { reps: null });
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInTemplateExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: number !== "" ? number : null,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.workoutName}>{exercise.name}</Text>
			<Header repetitionType={"Set"} metrics={["reps"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					id={exercise.id}
					index={index}
					inputTypes={["numeric"]}
					placeholders={[""]}
					functions={[handleRepsChange]}
					lengths={[3]}
					values={[set.reps]}
				/>
			))}
			<Pressable style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</Pressable>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			backgroundColor: themeStyle.card,
			margin: "auto",
			padding: "3%",
			width: "90%",
			marginBottom: "5%",
			borderRadius: 8,
		},
		workoutName: {
			color: themeStyle.primary,
			fontWeight: "bold",
			fontSize: 18,
			marginBottom: 5,
		},
		setButton: {
			backgroundColor: themeStyle.inputBackground,
			width: "100%",
			padding: "2%",
			borderRadius: 6,
			marginTop: "5%",
			alignItems: "center",
		},
		setButtonText: {
			color: themeStyle.textColor,
			fontWeight: "700",
			fontSize: 16,
		},
	});
};

export default BodyWeightExercise;