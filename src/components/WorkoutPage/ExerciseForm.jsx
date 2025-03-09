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
	const { addSetToExercise, updateSetInExercise } = useWorkout();

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
						style={{
							fontSize: 16,
							color: themeStyle.textColor,
							width: 85,
							textAlign: "center",
							fontWeight: "bold",
							backgroundColor: themeStyle.backgroundColor,
							padding: 5,
							paddingHorizontal: 10,
							borderRadius: 5,
							marginLeft: 7,
						}}
						inputMode={inputType}
						placeholder={placeholders[inputIndex]}
						placeholderTextColor={"gray"}
						maxLength={lengths[inputIndex]}
						onChangeText={(text) => functions[inputIndex](text, index)}
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
		addSetToExercise(exercise.id, { reps: null });
	};

	const handleRepsChange = (text, index) => {
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: text,
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
		addSetToExercise(exercise.id, { weight: null, reps: null });
		console.log(exercise.sets);
	};

	const handleWeightChange = (text, index) => {
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			weight: text,
		});
	};

	const handleRepsChange = (text, index) => {
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: text,
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
		addSetToExercise(exercise.id, { weight: null, reps: null });
	};

	const handleWeightChange = (text, index) => {
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			weight: text,
		});
	};

	const handleRepsChange = (text, index) => {
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			reps: text,
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
		addSetToExercise(exercise.id, { time: null, miles: null });
	};

	const handleTimeChange = (text, index) => {
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			time: text,
		});
	};

	const handleDistanceChange = (text, index) => {
		updateSetInExercise(exercise.id, index, {
			...exercise.sets[index],
			distance: text,
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
		addSetToExercise(exercise.id, { time: null });
	};

	const handleTimeChange = (text, index) => {
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
					inputTypes={["decimal", "decimal"]}
					placeholders={["00:00"]}
					functions={[handleTimeChange]}
					lengths={[3, 2]}
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
			backgroundColor: themeStyle.primary,
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
