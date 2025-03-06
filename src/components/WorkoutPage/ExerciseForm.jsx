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

	const addSet = () => {
		addSetToExercise(exercise.id, { weight: null, reps: null });
	};

	const handleWeightChange = (text, setIndex) => {
		updateSetInExercise(exercise.id, setIndex, {
			...exercise.sets[setIndex],
			weight: text,
		});
	};

	const handleRepsChange = (text, setIndex) => {
		updateSetInExercise(exercise.id, setIndex, {
			...exercise.sets[setIndex],
			reps: text,
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
							style={{
								fontSize: 16,
								color: themeStyle.textColor,
								width: 75,
								textAlign: "center",
								fontWeight: "bold",
								backgroundColor: themeStyle.backgroundColor,
								padding: 5,
								paddingHorizontal: 10,
								borderRadius: 5,
							}}
							inputMode="numeric"
							placeholder="100"
							value={set.weight}
							onChangeText={(text) =>
								handleWeightChange(text, index)
							}
							placeholderTextColor={"gray"}
							maxLength={3}
						/>
						<TextInput
							style={{
								fontSize: 16,
								color: themeStyle.textColor,
								width: 75,
								textAlign: "center",
								fontWeight: "bold",
								backgroundColor: themeStyle.backgroundColor,
								padding: 5,
								paddingHorizontal: 10,
								borderRadius: 5,
								marginLeft: 5,
							}}
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
	});

export default ExerciseForm;
