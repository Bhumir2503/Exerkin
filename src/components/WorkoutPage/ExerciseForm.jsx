import React, { useRef, useEffect, useSharedValue, useState } from "react";
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import Reanimated, { useAnimatedStyle, configureReanimatedLogger, ReanimatedLogLevel} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// setScrollEnabled can lock and unlock the scrolling in workout modal
const ExerciseForm = ({setScrollEnabled}) => {
	// !TODO: Fix this so that the whole exercise form doesn't re-render when a set is added or when a value is changed

	// Don't tell Bhumir about this please :)
	configureReanimatedLogger({
		level: ReanimatedLogLevel.warn,
		strict: false, // turn off the warnings
	});
	const { workoutExercises, setWorkoutData } = useWorkout();

	// If there are no exercises, return nothing
	if (!workoutExercises || workoutExercises.length === 0) {
		return null;
	}

	// DraggableFlatList uses this to draw each exercise form
	const renderExercise = ({item, drag, isActive}) => {
		if (isActive) {
			setScrollEnabled(false);
		}

		return (<ScaleDecorator><Exercise exercise={item} drag={drag} /></ ScaleDecorator>);
	};

	const onDragEndEvent = ({data}) => {
		setScrollEnabled(true);
		setWorkoutData(data);
	};

	return (<>{workoutExercises.map((exercise, index) => {return <Exercise exercise={exercise} key={index.toString()} /> })}</>);
	
	return (
		<GestureHandlerRootView>
			<DraggableFlatList
				data={workoutExercises}
				renderItem={renderExercise}
				keyExtractor={(item, index) => index.toString()}
				onDragEnd={onDragEndEvent}

				autoscrollThreshold={200} // Adjust this value as needed
				autoscrollSpeed={200}     // Adjust this value as needed
			/>
		</GestureHandlerRootView>
	);
};

const Exercise = ({exercise, drag}) => {
	switch (exercise.type) {
		case "bodyweight":
			return (
				<BodyWeightExercises
					key={exercise.id}
					exercise={exercise}
					drag={drag}
				/>
			);
		case "weightlifting":
			return (
				<WeightLiftingExercises
					key={exercise.id}
					exercise={exercise}
					drag={drag}
				/>
			);
		case "assisted-weight":
			return (
				<AssistedWeightExercises
					key={exercise.id}
					exercise={exercise}
					drag={drag}
				/>
			);
		case "cardio-distance":
			return (
				<CardioDistanceExercises
					key={exercise.id}
					exercise={exercise}
					drag={drag}
				/>
			);
		case "cardio-time":
			return (
				<CardioTimeExercises
					key={exercise.id}
					exercise={exercise}
					drag={drag}
				/>
			);
		default:
			return <View key={exercise.id}></View>;
	};
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

//this is what renders the item that comes from the right when sliding.
function DeleteIcon(progress, drag) {
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
				},
				styleAnimation,
			]}
		>
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<Ionicons name="trash" size={20} color="white" />
				<Text
					style={{ color: "white", fontWeight: "bold", fontSize: 10 }}
				>
					Delete Set
				</Text>
			</View>
		</Reanimated.View>
	);
}

const UserInputSection = ({
	index,
	inputTypes,
	placeholders,
	functions,
	lengths,
	values,
	exerciseId,
	isFinished,		//used to maintain state of completed checkbox
	onToggle,		//used to toggle completed checkbox
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
		removeSetFromExercise(exerciseId, index);
	};

	//this is to make sure the set that moves up gets set to a closed swipe state, previously was slightly open
	useEffect(() => {
		if (swipeableRef.current) {
			swipeableRef.current.close();
		}
	}, [values]);

	return (
		// <ReanimatedSwipeable
		// 	ref={swipeableRef}
		// 	rightThreshold={120}
		// 	onSwipeableOpen={handleRemoveSet}
		// 	renderRightActions={DeleteIcon}
		// 	overshootLeft={false}
		// >
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
                <TouchableOpacity onPress={onToggle} style={{ flexDirection: "row", alignItems: "center", width: 50, justifyContent: "center" }}>
                    <Ionicons
                        name="checkbox-outline"
                        size={22}
                        color={isFinished ? themeStyle.success : themeStyle.textColorSecondary}
                    />
                </TouchableOpacity>

			</View>
		</View>
		// </ReanimatedSwipeable>
	);
};

const BodyWeightExercises = ({ exercise, drag }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({})

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
		}))
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
		<TouchableOpacity activeOpacity={1} onLongPress={drag} style={styles.container}>
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
					isFinished = {!!finishedSet[index]}
					onToggle = {() => toggleSetFinished(index)}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

const WeightLiftingExercises = ({ exercise, drag }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({})

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
		}))
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
		<TouchableOpacity activeOpacity={1} onLongPress={drag} style={styles.container}>
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
					isFinished = {!!finishedSet[index]}
					onToggle = {() => toggleSetFinished(index)}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

const AssistedWeightExercises = ({ exercise, drag }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({})

	const addSet = () => {
		// Add a new set with null values for weight and reps
		addSetToExercise(exercise.id, { weight: null, reps: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length] : false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
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
		<TouchableOpacity activeOpacity={1} onLongPress={drag} style={styles.container}>
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
		</TouchableOpacity>
	);
};

const CardioDistanceExercises = ({ exercise, drag }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({})

	const addSet = () => {
		// Add a new set with null values for time and distance
		addSetToExercise(exercise.id, { time: null, distance: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length] : false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
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
		<TouchableOpacity activeOpacity={1} onLongPress={drag} style={styles.container}>
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
		</TouchableOpacity>
	);
};

const CardioTimeExercises = ({ exercise, drag }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { addSetToExercise, updateSetInExercise } = useWorkout();
	const [finishedSet, setFinishedSet] = useState({})

	const addSet = () => {
		// Add a new set with null values for time
		addSetToExercise(exercise.id, { time: null });
		setFinishedSet((prev) => ({
			...prev,
			[exercise.sets.length] : false,
		}));
	};

	const toggleSetFinished = (index) => {
		setFinishedSet((prev) => ({
			...prev,
			[index]: !prev[index],
		}))
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
		<TouchableOpacity activeOpacity={1} onLongPress={drag} style={styles.container}>
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
					onToggle={() => toggleSetFinished[index]}
				/>
			))}
			<TouchableOpacity style={styles.setButton} onPress={addSet}>
				<Text style={styles.setButtonText}>Add Set</Text>
			</TouchableOpacity>
		</TouchableOpacity>
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

export default ExerciseForm;
