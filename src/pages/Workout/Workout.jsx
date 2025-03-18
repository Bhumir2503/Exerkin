import React, { useState, useRef, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	TextInput,
	SafeAreaView,
} from "react-native";

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
import { Ionicons } from "@expo/vector-icons";

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
	const [type, setType] = useState("workout");
	const [workoutTitle, setWorkoutTitle] = useState("");
	const [titleError, setTitleError] = useState(false);
	// Removed showExerciseSelector state since we always show the selector now

	const styles = createStyles(themeStyle);
	const timeRef = useRef(0);
	const scrollViewRef = useRef(null);

	useEffect(() => {
		if (type === "template") {
			setWorkoutTitle("");
		} else {
			setWorkoutTitle("Workout #" + (workoutHistory.length + 1));
		}
	}, [type]);

	// Updated saveWorkout function to close modal first
	const saveWorkout = async () => {
		if (workoutTitle === "") {
			setTitleError(true);
			return;
		}

		const workoutLength = workoutHistory.length;

		// Step 1: Capture necessary values and close modal first
		const capturedTitle = workoutTitle;
		const capturedTime = timeRef.current;
		setModalVisible(false);

		// Step 2: Use setTimeout to push the state changes to the next event loop cycle
		// This ensures the modal close animation can complete before other state changes
		setTimeout(() => {
			workoutCompleted(capturedTitle, capturedTime);
			timeRef.current = 0;
			setTitleError(false);
			setWorkoutTitle("Workout #" + (workoutLength + 2));
		}, 0);
	};

	// Updated saveTemplate function
	const saveTemplate = async () => {
		if (workoutTitle === "") {
			setTitleError(true);
			return;
		}

		const workoutLength = workoutHistory.length;

		// Step 1: Capture necessary values and close modal first
		const capturedTitle = workoutTitle;
		setModalVisible(false);

		// Step 2: Push the remaining operations to the next event loop cycle
		setTimeout(() => {
			templateCompleted(capturedTitle);
			setTitleError(false);
			setWorkoutTitle("Workout #" + (workoutLength + 2));
			setType("workout");
		}, 0);
	};

	// Updated cancelWorkout function
	const cancelWorkout = () => {
		// Step 1: Close modal first
		setModalVisible(false);

		// Step 2: Push the remaining operations to the next event loop cycle
		setTimeout(() => {
			timeRef.current = 0;
			setTitleError(false);
			setWorkoutTitle("Workout #" + (workoutHistory.length + 1));
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
			setTitleError(false);
			setWorkoutTitle("Workout #" + (workoutHistory.length + 1));
			setType("workout");
			setActiveTemplateExercises([]);
		}, 0);
	};

	// Function to handle input focus - scrolls to center the focused element
	const handleInputFocus = (event, index) => {
		// Get dimensions of the scroll view container and the input element
		const scrollViewHeight =
			scrollViewRef.current?.getInnerViewNode?.()?.clientHeight || 300;

		// Get the y position of the input
		event.target.measure((fx, fy, width, height, px, py) => {
			// Calculate position to center the input in the visible area
			// Subtract half the scroll view height to position input in the middle
			const scrollToY = Math.max(0, py - 600);

			scrollViewRef.current?.scrollTo({
				y: scrollToY,
				animated: true,
			});
		});
	};

	// Check if we should show the empty state card
	const hasExercises =
		type === "workout"
			? activeExercise.length > 0
			: activeTemplateExercises.length > 0;

	// We don't need the handleAddFirstExercise function anymore since
	// the card is now just informational

	return (
		<SafeAreaView style={styles.primaryContent}>
			<WorkoutDashboard
				onStartWorkout={() => setModalVisible(true)}
				setOnType={setType}
			/>
			<WorkoutModal visible={modalIsVisible}>
				<WorkoutHeaderButtons
					onFinishedPressed={
						type === "workout" ? saveWorkout : saveTemplate
					}
					setWorkoutTitle={setWorkoutTitle}
					workoutTitle={workoutTitle}
					titleError={titleError}
					setTitleError={setTitleError}
					type={type}
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
								/>
							</View>
						)}

						<ScrollView
							ref={scrollViewRef}
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
										onFocus={(e) =>
											handleInputFocus(e, index)
										}
										type={type}
									/>
								))}
							{type === "template" &&
								activeTemplateExercises.map(
									(exercise, index) => (
										<ExerciseForm
											key={index}
											exercise={exercise}
											onFocus={(e) =>
												handleInputFocus(e, index)
											}
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
		},
	});
};
