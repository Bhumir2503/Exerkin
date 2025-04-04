import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { Ionicons } from "@expo/vector-icons";
import { ReorderableList } from "react-native-reorderable-list";

export const ExerciseForm = () => {

	const { workoutExercises, setWorkoutData } = useWorkout();

	// Check if workoutExercises is empty
	const isEmpty = workoutExercises.length === 0;
	if (isEmpty) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				</View>
		);
	}
	// renderItem function for ReorderableList
	const renderExerciseItem = ({ item }) => {
		console.log("ExerciseForm renderItem", item);
		return <Exercise exercise={item}/>;
	};

	const handleReorder = (reorderedList) => {
		setWorkoutData(reorderedList);
	};

	return (

			<ReorderableList
				data={workoutExercises}
				renderItem={renderExerciseItem}
				keyExtractor={(item) => item.id.toString()}
				onReorder={handleReorder}
			/>
	);
};

const Exercise = ({ exercise }) => {
	switch (exercise.type) {
		case "bodyweight":
			return (
				<BodyWeightExercises
					key={exercise.id}
					exercise={exercise}
				/>
			);
		case "weightlifting":
			return (
				<WeightLiftingExercises
					key={exercise.id}
					exercise={exercise}
				/>
			);
		case "assisted-weight":
			return (
				<AssistedWeightExercises
					key={exercise.id}
					exercise={exercise}
				/>
			);
		case "cardio-distance":
			return (
				<CardioDistanceExercises
					key={exercise.id}
					exercise={exercise}
				/>
			);
		case "cardio-time":
			return (
				<CardioTimeExercises
					key={exercise.id}
					exercise={exercise}
				/>
			);
		default:
			return <View key={exercise.id}></View>;
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
				<View style={{ width: 50 }} />
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
	values,
	exerciseId,
	isFinished, //used to maintain state of completed checkbox
	onToggle, //used to toggle completed checkbox
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
							keyboardType={
								inputType === "decimal"
									? "decimal-pad"
									: "number-pad"
							}
							placeholder={placeholders[inputIndex]}
							placeholderTextColor={"gray"}
							maxLength={lengths[inputIndex]}
							value={values && values[inputIndex]}
							onChangeText={(text) =>
								functions[inputIndex](text, index)
							}
						/>
					))}

					{/* Checkbox Button */}
					<TouchableOpacity
						onPress={onToggle}
						style={{
							flexDirection: "row",
							alignItems: "center",
							width: 50,
							justifyContent: "center",
						}}
					>
						<Ionicons
							name="checkbox-outline"
							size={22}
							color={
								isFinished
									? themeStyle.success
									: themeStyle.textColorSecondary
							}
						/>
					</TouchableOpacity>
				</View>
			</View>
	);
};

const BodyWeightExercises = ({ exercise, dragEnabled }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({});

	const addSet = () => {
		// Add a new set with null values for reps
		addSetToExercise(exercise.id, { reps: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length]: false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
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
					index={index}
					inputTypes={["numeric"]}
					placeholders={["12"]}
					functions={[handleRepsChange]}
					lengths={[3]}
					values={[set.reps]}
					exerciseId={exercise.id}
					isFinished={!!finishedSet[index]}
					onToggle={() => toggleSetFinished(index)}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const WeightLiftingExercises = ({ exercise, dragEnabled }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({});

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.id, { weight: null, reps: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length]: false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const handleWeightChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the weight for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			weight: number !== "" ? number : null,
		});
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: number !== "" ? number : null,
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
					inputTypes={["decimal", "numeric"]}
					placeholders={["135", "12"]}
					functions={[handleWeightChange, handleRepsChange]}
					lengths={[4, 3]}
					values={[set.weight, set.reps]}
					exerciseId={exercise.id}
					isFinished={!!finishedSet[index]}
					onToggle={() => toggleSetFinished(index)}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const AssistedWeightExercises = ({ exercise, dragEnabled }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({});

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.id, { weight: null, reps: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length]: false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const handleWeightChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the weight for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			weight: number !== "" ? number : null,
		});
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: number !== "" ? number : null,
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
					inputTypes={["decimal", "numeric"]}
					placeholders={["135", "12"]}
					functions={[handleWeightChange, handleRepsChange]}
					lengths={[4, 3]}
					values={[set.weight, set.reps]}
					exerciseId={exercise.id}
					isFinished={!!finishedSet[index]}
					onToggle={() => toggleSetFinished(index)}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const CardioDistanceExercises = ({ exercise, dragEnabled }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({});

	const addSet = () => {
		// Add a new set with null values for time and distance
		addSetToExercise(exercise.id, { time: null, distance: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length]: false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const handleTimeChange = (text, index) => {
		// Store the previous value to compare
		const prevValue = exercise.sets[index]?.time || "";

		// If user is trying to delete and the text is shorter
		if (text.length < prevValue.length) {
			// Handle backspace - we'll remove the last character
			// But we need to handle cases where the last character is a colon
			if (prevValue.endsWith(":")) {
				// If deleting a colon, also remove the digit before it
				const newValue = prevValue.slice(0, -2);
				updateSetInExercise(exercise.id, index, {
					...exercise.sets[index],
					time: newValue !== "" ? newValue : null,
				});
				return;
			} else {
				// Normal backspace - just remove the last character
				const newValue = prevValue.slice(0, -1);
				updateSetInExercise(exercise.id, index, {
					...exercise.sets[index],
					time: newValue !== "" ? newValue : null,
				});
				return;
			}
		}

		// For adding characters, keep only numbers and colons
		let number = text.replace(/[^0-9:]/g, "");

		// Format time as MM:SS or HH:MM:SS
		if (number) {
			// Remove any existing colons
			const digits = number.replace(/:/g, "");

			if (digits.length <= 2) {
				// If 1-2 digits, treat as seconds only
				number = digits;
			} else if (digits.length <= 4) {
				// Format as MM:SS
				const minutes = digits.slice(0, digits.length - 2);
				const seconds = digits.slice(digits.length - 2);
				number = `${minutes}:${seconds}`;
			} else {
				// Format as HH:MM:SS for longer inputs
				const seconds = digits.slice(digits.length - 2);
				const minutes = digits.slice(
					digits.length - 4,
					digits.length - 2
				);
				const hours = digits.slice(0, digits.length - 4);
				number = `${hours}:${minutes}:${seconds}`;
			}
		}

		// Update the time for the specific set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			time: number !== "" ? number : null,
		});
	};

	const handleDistanceChange = (text, index) => {
		// Allow decimal points for distance
		const number = text.replace(/[^0-9.]/g, "");

		// Update the distance for the specific set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			distance: number !== "" ? number : null,
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
					placeholders={["30:00", "1.5"]}
					functions={[handleTimeChange, handleDistanceChange]}
					lengths={[7, 5]}
					values={[set.time, set.distance]}
					inputAlert={
						exercise.inputAlert &&
						index === exercise.sets.length - 1
					}
					exerciseId={exercise.id}
					isFinished={!!finishedSet[index]}
					onToggle={() => toggleSetFinished(index)}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const CardioTimeExercises = ({ exercise, dragEnabled }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({});

	const addSet = () => {
		// Add a new set with null values for time
		addSetToExercise(exercise.id, { time: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length]: false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const handleTimeChange = (text, index) => {
		// Store the previous value to compare
		const prevValue = exercise.sets[index]?.time || "";

		// If user is trying to delete and the text is shorter
		if (text.length < prevValue.length) {
			// Handle backspace - we'll remove the last character
			// But we need to handle cases where the last character is a colon
			if (prevValue.endsWith(":")) {
				// If deleting a colon, also remove the digit before it
				const newValue = prevValue.slice(0, -2);
				updateSetInExercise(exercise.id, index, {
					...exercise.sets[index],
					time: newValue !== "" ? newValue : null,
				});
				return;
			} else {
				// Normal backspace - just remove the last character
				const newValue = prevValue.slice(0, -1);
				updateSetInExercise(exercise.id, index, {
					...exercise.sets[index],
					time: newValue !== "" ? newValue : null,
				});
				return;
			}
		}

		// For adding characters, keep only numbers and colons
		let number = text.replace(/[^0-9:]/g, "");

		// Format time as MM:SS or HH:MM:SS
		if (number) {
			// Remove any existing colons
			const digits = number.replace(/:/g, "");

			if (digits.length <= 2) {
				// If 1-2 digits, treat as seconds only
				number = digits;
			} else if (digits.length <= 4) {
				// Format as MM:SS
				const minutes = digits.slice(0, digits.length - 2);
				const seconds = digits.slice(digits.length - 2);
				number = `${minutes}:${seconds}`;
			} else {
				// Format as HH:MM:SS for longer inputs
				const seconds = digits.slice(digits.length - 2);
				const minutes = digits.slice(
					digits.length - 4,
					digits.length - 2
				);
				const hours = digits.slice(0, digits.length - 4);
				number = `${hours}:${minutes}:${seconds}`;
			}
		}

		// Update the time for the specific set
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			time: number !== "" ? number : null,
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
					inputTypes={["numeric"]}
					placeholders={["10:00"]}
					functions={[handleTimeChange]}
					lengths={[7]}
					values={[set.time]}
					inputAlert={
						exercise.inputAlert &&
						index === exercise.sets.length - 1
					}
					exerciseId={exercise.id}
					isFinished={!!finishedSet[index]}
					onToggle={() => toggleSetFinished(index)}
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
			borderRadius: 6,
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
			borderRadius: 6,
			marginLeft: 7,
		},
		inputFieldAlert: {
			borderColor: themeStyle.error,
			borderWidth: 2,
		},
});
