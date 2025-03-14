import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

const ExerciseForm = ({ exercise }) => {
	// Checks exercise type and renders the appropriate component
	switch (exercise.type) {
		case "bodyweight":
			return <BodyWeightExercises exercise={exercise} />;
		case "weightlifting":
			return <WeightLiftingExercises exercise={exercise} />;
		case "assisted-weight":
			return <AssistedWeightExercises exercise={exercise} />;
		case "cardio-distance":
			return <CardioDistanceExercises exercise={exercise} />;
		case "cardio-time":
			return <CardioTimeExercises exercise={exercise} />;
		default:
			return <View></View>;
	}
};

const Header = ({ repetitionType, metrics }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={styles.header}>
			<Text style={styles.repetitionType}>{repetitionType}</Text>
			<View style={{ flexDirection: "row" }}>
				{metrics.map((metric, index) => (
					<Text
						key={index}
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 85,
							textAlign: "center",
							fontWeight: "bold",
							marginLeft: 7,
						}}
					>
						{metric}
					</Text>
				))}
			</View>
		</View>
	);
};

const UserInputSection = ({
	index,
	inputTypes,
	placeholders,
	functions,
	lengths,
}) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={styles.setRows}>
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
				{inputTypes.map((inputType, inputIndex) => (
					<TextInput
						key={inputIndex}
						style={[styles.inputField]}
						inputMode={inputType}
						keyboardType="number-pad"
						placeholder={placeholders[inputIndex]}
						placeholderTextColor={"gray"}
						maxLength={lengths[inputIndex]}
						onChangeText={(text) =>
							functions[inputIndex](text, index)
						}
					/>
				))}
			</View>
		</View>
	);
};

const BodyWeightExercises = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for reps
		addSetToExercise(exercise.id, { reps: null });
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: number,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.workoutName}>{exercise.name}</Text>
			<Header repetitionType={"Set"} metrics={["reps"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					index={index}
					inputTypes={["decimal"]}
					placeholders={["12"]}
					functions={[handleRepsChange]}
					lengths={[2]}
					inputAlert={
						exercise.inputAlert &&
						index === exercise.sets.length - 1
					}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const WeightLiftingExercises = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.id, { weight: null, reps: null });
	};

	const handleWeightChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the weight for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			weight: number,
		});
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: number,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.workoutName}>{exercise.name}</Text>
			<Header repetitionType={"Set"} metrics={["lbs", "reps"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					index={index}
					inputTypes={["decimal", "decimal"]}
					placeholders={["135", "12"]}
					functions={[handleWeightChange, handleRepsChange]}
					lengths={[3, 2]}
					inputAlert={
						exercise.inputAlert &&
						index === exercise.sets.length - 1
					}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const AssistedWeightExercises = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.id, { weight: null, reps: null });
	};

	const handleWeightChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the weight for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			weight: number,
		});
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: number,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.workoutName}>{exercise.name}</Text>
			<Header repetitionType={"Set"} metrics={["-lbs", "reps"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					index={index}
					inputTypes={["decimal", "decimal"]}
					placeholders={["50", "12"]}
					functions={[handleWeightChange, handleRepsChange]}
					lengths={[3, 2]}
					inputAlert={
						exercise.inputAlert &&
						index === exercise.sets.length - 1
					}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const CardioDistanceExercises = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for time and distance
		addSetToExercise(exercise.id, { time: null, miles: null });
	};

	const handleTimeChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the time for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			time: number,
		});
	};

	const handleDistanceChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the distance for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			distance: number,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.workoutName}>{exercise.name}</Text>
			<Header repetitionType={"Round"} metrics={["time", "miles"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					index={index}
					inputTypes={["numeric", "decimal"]}
					placeholders={["1:00:00", "1.5"]}
					functions={[handleTimeChange, handleDistanceChange]}
					lengths={[3, 5]}
					inputAlert={
						exercise.inputAlert &&
						index === exercise.sets.length - 1
					}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const CardioTimeExercises = ({ exercise }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for time
		addSetToExercise(exercise.id, { time: null });
	};

	const handleTimeChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the time for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			time: text,
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.workoutName}>{exercise.name}</Text>
			<Header repetitionType={"Round"} metrics={["time"]} />
			{exercise.sets.map((set, index) => (
				<UserInputSection
					key={index}
					index={index}
					inputTypes={["decimal"]}
					placeholders={["00:00"]}
					functions={[handleTimeChange]}
					lengths={[3, 2]}
					inputAlert={
						exercise.inputAlert &&
						index === exercise.sets.length - 1
					}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			backgroundColor: themeStyle.card,
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
			color: themeStyle.primary,
			fontWeight: "bold",
			fontSize: 18,
			marginBottom: 5,
		},

		header: {
			flexDirection: "row",
			justifyContent: "space-between",
			width: "100%",
		},
		repetitionType: {
			fontSize: 16,
			color: themeStyle.textColor,
			marginLeft: 5,
			fontWeight: "bold",
		},

		setRows: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
			marginTop: 10,
		},
		setButton: {
			backgroundColor: themeStyle.inputBackground,
			width: "100%",
			padding: "2%",
			borderRadius: 5,
			marginTop: "5%",
			alignItems: "center",
		},
		setButtonText: {
			color: themeStyle.textColor,
			fontWeight: "700",
			fontSize: 16,
		},
		inputField: {
			fontSize: 16,
			color: themeStyle.textColor,
			width: 85,
			textAlign: "center",
			fontWeight: "bold",
			backgroundColor: themeStyle.inputBackground,
			padding: 5,
			paddingHorizontal: 10,
			borderRadius: 5,
			marginLeft: 7,
		},
		inputFieldAlert: {
			borderColor: themeStyle.error,
			borderWidth: 2,
		},
	});

export default ExerciseForm;
