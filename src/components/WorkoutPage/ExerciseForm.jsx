import React, { useRef, useState, useCallback, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Pressable
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
	SharedValue,
	useAnimatedStyle,
  } from 'react-native-reanimated';
import { Ionicons } from "@expo/vector-icons";

const ExerciseForm = ({ exercise, onFocus, type }) => {
	// Checks exercise type and renders the appropriate component
	switch (exercise.type) {
		case "bodyweight":
			return (
				<BodyWeightExercises
					exercise={exercise}
					onFocus={onFocus}
					type={type}
				/>
			);
		case "weightlifting":
			return (
				<WeightLiftingExercises
					exercise={exercise}
					onFocus={onFocus}
					type={type}
				/>
			);
		case "assisted-weight":
			return (
				<AssistedWeightExercises
					exercise={exercise}
					onFocus={onFocus}
					type={type}
				/>
			);
		case "cardio-distance":
			return (
				<CardioDistanceExercises
					exercise={exercise}
					onFocus={onFocus}
					type={type}
				/>
			);
		case "cardio-time":
			return (
				<CardioTimeExercises
					exercise={exercise}
					onFocus={onFocus}
					type={type}
				/>
			);
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

//this is what renders the item that comes from the right when sliding.
function DeleteIcon(progress, drag){
	const { themeStyle } = useTheme();
	const styleAnimation = useAnimatedStyle(() => {
		return {
		  width: Math.max(drag.value * -1, 80), //so that the red box extends dynamically
		  opacity: progress.value,
		};
	  });
	  return (
		<Reanimated.View 
			style={[
				{
					backgroundColor: themeStyle.error,
					justifyContent: "center",
					alignItems: "center",
					height: "90%",
					borderRadius: 5,
					marginVertical: 5,
					elevation: 5,
				},
				styleAnimation,

			]}
		>
		  <View style={{alignItems: "center", justifyContent: "center"}}>
			<Ionicons name="trash" size={20} color="white" />
			<Text style={{ color: "white", fontWeight: "bold", fontSize: 10 }}>
				Delete Set
			</Text>
		  </View>
		</Reanimated.View>
	  );
};

const UserInputSection = ({
	index,
	inputTypes,
	placeholders,
	functions,
	lengths,
	onFocus,
	values,
	exerciseId,
	type,
}) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { removeSetFromExercise } = useWorkout();
	const swipeableRef = useRef(null);

	//This function makes the set
	const handleRemoveSet = () => {
		// if(swipeableRef.current){
		// 	swipeableRef.current.close();
		// }
		removeSetFromExercise(exerciseId, index, type);
	};

	//this is to make sure the set that moves up gets set to a closed swipe state, previously was slightly open
	useEffect(() => {
		if(swipeableRef.current) {
			swipeableRef.current.close();
		}
	}, [values]);

	return (
		<ReanimatedSwipeable
			ref={swipeableRef}
			rightThreshold={120}
			onSwipeableOpen={handleRemoveSet}
			renderRightActions={DeleteIcon}
			overshootLeft={false}
		>
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
						onFocus={(e) => onFocus && onFocus(e, index)}
					/>
				))}
			</View>
		</View>
		</ReanimatedSwipeable>
	);
};

const BodyWeightExercises = ({ exercise, onFocus, type }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for reps
		addSetToExercise(exercise.id, { reps: null }, type);
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				reps: number !== "" ? number : null,
			},
			type
		);
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
					onFocus={onFocus}
					exerciseId={exercise.id}
					type={type}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const WeightLiftingExercises = ({ exercise, onFocus, type }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.id, { weight: null, reps: null }, type);
	};

	const handleWeightChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the weight for the specific set by using the index of the set
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				weight: number !== "" ? number : null,
			},
			type
		);
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				reps: number !== "" ? number : null,
			},
			type
		);
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
					onFocus={onFocus}
					exerciseId={exercise.id}
					type={type}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const AssistedWeightExercises = ({ exercise, onFocus, type }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.id, { weight: null, reps: null }, type);
	};

	const handleWeightChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the weight for the specific set by using the index of the set
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				weight: number !== "" ? number : null,
			},
			type
		);
	};

	const handleRepsChange = (text, index) => {
		// make sure only number are accepted
		const number = text.replace(/[^0-9]/g, "");

		// Update the reps for the specific set by using the index of the set
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				reps: number !== "" ? number : null,
			},
			type
		);
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
					onFocus={onFocus}
					exerciseId={exercise.id}
					type={type}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const CardioDistanceExercises = ({ exercise, onFocus, type }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for time and distance
		addSetToExercise(exercise.id, { time: null, distance: null }, type);
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
				updateSetInExercise(
					exercise.id,
					index,
					{
						...exercise.sets[index],
						time: newValue !== "" ? newValue : null,
					},
					type
				);
				return;
			} else {
				// Normal backspace - just remove the last character
				const newValue = prevValue.slice(0, -1);
				updateSetInExercise(
					exercise.id,
					index,
					{
						...exercise.sets[index],
						time: newValue !== "" ? newValue : null,
					},
					type
				);
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
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				time: number !== "" ? number : null,
			},
			type
		);
	};

	const handleDistanceChange = (text, index) => {
		// Allow decimal points for distance
		const number = text.replace(/[^0-9.]/g, "");

		// Update the distance for the specific set
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				distance: number !== "" ? number : null,
			},
			type
		);
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
					onFocus={onFocus}
					exerciseId={exercise.id}
					type={type}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</View>
	);
};

const CardioTimeExercises = ({ exercise, onFocus, type }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();

	const addSet = () => {
		// Add a new set with null values for time
		addSetToExercise(exercise.id, { time: null }, type);
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
				updateSetInExercise(
					exercise.id,
					index,
					{
						...exercise.sets[index],
						time: newValue !== "" ? newValue : null,
					},
					type
				);
				return;
			} else {
				// Normal backspace - just remove the last character
				const newValue = prevValue.slice(0, -1);
				updateSetInExercise(
					exercise.id,
					index,
					{
						...exercise.sets[index],
						time: newValue !== "" ? newValue : null,
					},
					type
				);
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
		updateSetInExercise(
			exercise.id,
			index,
			{
				...exercise.sets[index],
				time: number !== "" ? number : null,
			},
			type
		);
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
					onFocus={onFocus}
					exerciseId={exercise.id}
					type={type}
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
