import React, { useState, useRef } from "react";
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
import TemplateExerciseForm from "../../components/WorkoutPage/TemplateExerciseForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";
import CancelButton from "../../components/WorkoutPage/CancelButton";
import WorkoutTimer from "../../components/WorkoutPage/WorkoutTimer";
import WorkoutHeaderButtons from "../../components/WorkoutPage/WorkoutHeaderButtons";
import WorkoutDashboard from "../../components/WorkoutPage/WorkoutDashboard";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";
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
	const [workoutTitle, setWorkoutTitle] = useState(
		"Workout #" + (workoutHistory.length + 1)
	);
	const [titleError, setTitleError] = useState(false);

	const styles = createStyles(themeStyle);
	const timeRef = useRef(0);
	const scrollViewRef = useRef(null);

	// Add keyboard listeners when component mounts

	const saveWorkout = async () => {
		if (workoutTitle === "") {
			setTitleError(true);
			return;
		}
		const workoutLength = workoutHistory.length;
		setModalVisible(false);
		workoutCompleted(workoutTitle, timeRef.current);
		timeRef.current = 0;
		setTitleError(false);
		setWorkoutTitle("Workout #" + (workoutLength + 2));
	};

	const saveTemplate = async () => {
		if (workoutTitle === "") {
			setTitleError(true);
			return;
		}
		const workoutLength = workoutHistory.length;
		setModalVisible(false);
		templateCompleted(workoutTitle);	
		setTitleError(false);
		setWorkoutTitle("Workout #" + (workoutLength + 2));
		setType("workout");
	};

	const cancelWorkout = () => {
		setModalVisible(false);
		timeRef.current = 0;
		setTitleError(false);
		setWorkoutTitle("Workout #" + (workoutHistory.length + 1));
		setType("workout");
		workoutCancelled();
	};

	const cancelTemplate = () => {
		setModalVisible(false);
		setTitleError(false);
		setWorkoutTitle("Workout #" + (workoutHistory.length + 1));
		setType("workout");
		setActiveTemplateExercises([]);
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
							<ExerciseSelector type={type} />
							<CancelButton
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
