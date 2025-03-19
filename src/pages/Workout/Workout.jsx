import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";
import WorkoutDashboard from "../../components/WorkoutPage/WorkoutDashboard";
import ActiveWorkoutBar from "../../components/WorkoutPage/ActiveWorkoutBar";

export default function Workout() {
	const { themeStyle } = useTheme();
	const {
		activeExercise,
		workoutCompleted,
		templateCompleted,
		workoutCancelled,
		workoutHistory,
		activeTemplateExercises,
		setActiveTemplateExercises,
	} = useWorkout();
	const [modalIsVisible, setModalVisible] = useState(false);
	const [startTimeStamp, setStartTimeStamp] = useState(null);
	const [type, setType] = useState("workout");

	console.log("Workout Page Rendered");

	const styles = createStyles(themeStyle);
	const workoutTitleRef = useRef("");
	const timeRef = useRef(0);
	const workoutNotesRef = useRef("");

	// Updated saveWorkout function to handle minimizing
	const saveWorkout = async () => {
		// Original save functionality
		if (workoutTitleRef.current === "") {
			workoutTitleRef.current = "Untitled Workout";
			return;
		}

		// Step 1: Capture necessary values and close modal first
		const capturedTitle = workoutTitleRef.current;
		const capturedTime = timeRef.current;
		const capturedNotes = workoutNotesRef.current;
		setStartTimeStamp(null);
		setModalVisible(false);

		// Step 2: Use setTimeout to push the state changes to the next event loop cycle
		setTimeout(() => {
			workoutCompleted(capturedTitle, capturedTime, capturedNotes);
			timeRef.current = 0;
			workoutNotesRef.current = "";
		}, 0);
	};

	// Updated saveTemplate function to handle minimizing
	const saveTemplate = async () => {
		// Original save functionality
		if (workoutTitleRef.current === "") {
			workoutTitleRef.current = "Untitled Template";
			return;
		}

		// Step 1: Capture necessary values and close modal first
		const capturedTitle = workoutTitleRef.current;
		setModalVisible(false);

		// Step 2: Push the remaining operations to the next event loop cycle
		setTimeout(() => {
			templateCompleted(capturedTitle);
			setType("workout");
		}, 0);
	};

	// Updated cancelWorkout function
	const cancelWorkout = () => {
		// Step 1: Close modal first
		setStartTimeStamp(null);
		setModalVisible(false);

		// Step 2: Push the remaining operations to the next event loop cycle
		setTimeout(() => {
			timeRef.current = 0;
			workoutNotesRef.current = "";
			setType("workout");
			workoutCancelled();
		}, 0);
	};

	// Updated cancelTemplate function
	const cancelTemplate = () => {
		// Step 1: Close modal first
		setModalVisible(false);

		// Step 2: Push the remaining operations to the next event loop cycle
		setTimeout(() => {
			setType("workout");
			setActiveTemplateExercises([]);
		}, 0);
	};

	// Check if we should show the empty state card
	const hasExercises =
		type === "workout"
			? activeExercise.length > 0
			: activeTemplateExercises.length > 0;

	return (
		<SafeAreaView style={styles.primaryContent}>
			<WorkoutDashboard
				onStartWorkout={() => {
					setModalVisible(true);
					setStartTimeStamp(firestore.Timestamp.now());
				}}
				setOnType={setType}
				startTimestamp={startTimeStamp}
			/>
			<ActiveWorkoutBar
				timeRef={timeRef}
				visible={!modalIsVisible && startTimeStamp}
				exerciseCount={activeExercise.length}
				title={workoutTitleRef.current}
				startTimeStamp={startTimeStamp}
				onPress={() => setModalVisible(true)}
			/>
			<WorkoutModal
				visible={modalIsVisible}
				type={type}
				onFinish={type === "workout" ? saveWorkout : saveTemplate}
				onCancel={type === "workout" ? cancelWorkout : cancelTemplate}
				workoutTitleRef={workoutTitleRef}
				timeRef={timeRef}
				workoutNotesRef={workoutNotesRef}
				startTimeStamp={startTimeStamp}
				activeExercises={
					type === "workout"
						? activeExercise
						: activeTemplateExercises
				}
				setModalVisible={setModalVisible}
				hasExercises={hasExercises}
			/>
		</SafeAreaView>
	);
}

const createStyles = (theme) => {
	return StyleSheet.create({
		primaryContent: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
		},
	});
};
