import React, { useState, useRef, useEffect } from "react";
import {
	View,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
} from "react-native";
import firestore from "@react-native-firebase/firestore";

import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import ExerciseForm from "../../components/WorkoutPage/ExerciseForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";
import CancelButton from "../../components/WorkoutPage/CancelButton";
import WorkoutTimer from "../../components/WorkoutPage/WorkoutTimer";
import WorkoutHeaderButtons from "../../components/WorkoutPage/WorkoutHeaderButtons";
import WorkoutDashboard from "../../components/WorkoutPage/WorkoutDashboard";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";
import AddFirstExerciseCard from "../../components/WorkoutPage/AddFirstExerciseCard";
import WorkoutNotes from "../../components/WorkoutPage/WorkoutNotes";
import RestTimer from "../../components/WorkoutPage/RestTimer";
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
	const saveWorkout = async (shouldFinish = true) => {
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
	const saveTemplate = async (shouldFinish = true) => {
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
				onStartWorkout={() => {setModalVisible(true); setStartTimeStamp(firestore.Timestamp.now());}}
				setOnType={setType}
				startTimestamp={startTimeStamp}
			/>
			<ActiveWorkoutBar
				timeRef={timeRef}
				visible={!modalIsVisible && startTimeStamp}
				exerciseCount={activeExercise.length}
				title={workoutTitleRef.current }
				startTimeStamp={startTimeStamp}
				onPress={() => setModalVisible(true)}
			/>
			<WorkoutModal visible={modalIsVisible}>
				<WorkoutHeaderButtons
					onFinishedPressed={
						type === "workout" ? saveWorkout : saveTemplate
					}
					workoutTitleRef={workoutTitleRef}
					type={type}
					setMainModalVisible={setModalVisible}
				/>

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalContent}
					keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
				>
					<View>
						{type === "workout" && (
							<View style={styles.timerStyle}>
								<WorkoutTimer
									visible={modalIsVisible}
									timeRef={timeRef}
									startTimeStamp={startTimeStamp}
								/>
								<View style={{ flexDirection: "row" }}>
									<WorkoutNotes
										workoutNotesRef={workoutNotesRef}
									/>
									<RestTimer />
								</View>
							</View>
						)}

						<ScrollView
							contentContainerStyle={styles.scrollView}
							style={[{ width: "100%" }]}
							keyboardShouldPersistTaps="handled"
							bounces={false}
						>
							{/* Always show exercises if there are any */}
							{type === "workout" &&
								activeExercise.map((exercise, index) => (
									<ExerciseForm
										key={index}
										exercise={exercise}
										type={type}
									/>
								))}
							{type === "template" &&
								activeTemplateExercises.map(
									(exercise, index) => (
										<ExerciseForm
											key={index}
											exercise={exercise}
											type={type}
										/>
									)
								)}

							{/* Show help card only when there are no exercises */}
							{!hasExercises && <AddFirstExerciseCard />}

							{/* Always show the exercise selector */}
							<ExerciseSelector type={type} />

							<CancelButton
								type={type}
								onPress={
									type === "workout"
										? cancelWorkout
										: cancelTemplate
								}
							/>
						</ScrollView>
					</View>
				</KeyboardAvoidingView>
			</WorkoutModal>
		</SafeAreaView>
	);
}

const createStyles = (theme) => {
	return StyleSheet.create({
		primaryContent: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
		},
		modalContent: {
			flex: 1,
			width: "100%",
		},
		workoutTitle: {
			color: theme.textColor,
			fontSize: 32,
		},
		scrollView: {
			width: "100%",
			alignItems: "center",
		},
		timerStyle: {
			paddingVertical: 15,
			paddingHorizontal: 20,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
	});
};
