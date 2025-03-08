import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import uuid from "react-native-uuid";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

const ExerciseForm = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const styles = createStyles(themeStyle);

	const [showInvalidInput, updateShowInvalidInput] = useState(false);

	const addSet = () => {

		// make sure the last set has values before creating another set
		if (exercise.sets[exercise.sets.length - 1].weight !== ""
				&& exercise.sets[exercise.sets.length - 1].reps !== ""
				&& exercise.sets[exercise.sets.length - 1].weight !== null
				&& exercise.sets[exercise.sets.length - 1].reps !== null) {

			addSetToExercise(exercise.id, { weight: null, reps: null });
			updateShowInvalidInput(false);
		}
		else {
			updateShowInvalidInput(true);
		}
	};

	const handleWeightChange = (text, setIndex) => {

		// filter out non-number values
		const numericValue = text.replace(/[^0-9]/g, "");

		updateSetInExercise(exercise.id, setIndex, {
			...exercise.sets[setIndex],
			weight: numericValue,
		});
	};

	const handleRepsChange = (text, setIndex) => {

		// filter out non-number values
		const numericValue = text.replace(/[^0-9]/g, "");

		updateSetInExercise(exercise.id, setIndex, {
			...exercise.sets[setIndex],
			reps: numericValue,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.workoutName}>{exercise.name}</Text>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					width: "100%",
				}}
			>
				<Text
					style={{
						fontSize: 16,
						color: themeStyle.textColor,
						marginLeft: 5,
						fontWeight: "bold",
					}}
				>
					Sets
				</Text>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 75,
							textAlign: "center",
							fontWeight: "bold",
						}}
					>
						lbs
					</Text>
					<Text
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 75,
							textAlign: "center",
							fontWeight: "bold",
							marginLeft: 5,
						}}
					>
						Reps
					</Text>
				</View>
			</View>

			{exercise.sets.map((set, index) => (
				<View key={index} style={styles.setRows}>
					<Text
						style={{
							fontSize: 16,
							fontWeight: "bold",
							color: themeStyle.textColor,
							marginLeft: 5,
						}}
					>
						{index + 1}
					</Text>
					<View style={{ flexDirection: "row" }}>
						<TextInput
							style={[
								styles.inputStyle, 
								(index === exercise.sets.length - 1 
									&& showInvalidInput) 
								&& styles.invalidInputStyle
							]}
							inputMode="numeric"
							keyboardType="numeric"
							placeholder="100"
							value={set.weight}
							onChangeText={(text) =>
								handleWeightChange(text, index)
							}
							placeholderTextColor={"gray"}
							maxLength={3}
						/>
						<TextInput
							style={[
								styles.inputStyle, 
								(index === exercise.sets.length - 1 
									&& showInvalidInput) 
									&& styles.invalidInputStyle,
								{marginLeft: 5}
							]}
							inputMode="numeric"
							placeholder="8"
							value={set.reps}
							onChangeText={(text) =>
								handleRepsChange(text, index)
							}
							placeholderTextColor={"gray"}
							maxLength={2}
						/>
					</View>
				</View>
			))}

			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const createStyles = (theme) =>
	StyleSheet.create({
		container: {
			backgroundColor: theme.card,
			padding: "3%",
			width: "90%",
			marginBottom: "5%",
			borderRadius: 7,

			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
		workoutName: {
			color: theme.primary,
			fontWeight: "bold",
			fontSize: 18,
			marginBottom: 5,
		},
		setRows: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
			marginTop: 10,
		},
		setButton: {
			backgroundColor: theme.primary,
			width: "100%",
			padding: "2%",
			borderRadius: 5,
			marginTop: "5%",
			alignItems: "center",
		},
		setButtonText: {
			color: "white",
			fontWeight: "700",
			fontSize: 16,
		},
		inputStyle: {
			fontSize: 16,
			color: theme.textColor,
			width: 75,
			textAlign: "center",
			fontWeight: "bold",
			backgroundColor: theme.backgroundColor,
			padding: 5,
			paddingHorizontal: 10,
			borderRadius: 5,
		},
		invalidInputStyle: {
			borderColor: "red",
			borderWidth: 2,
		}
	});

export default ExerciseForm;
