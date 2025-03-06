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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import ExerciseForm from "../../components/WorkoutPage/ExerciseForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";
import WorkoutTimer, {
	formatTime,
} from "../../components/WorkoutPage/WorkoutTimer";
import WorkoutHeaderButtons from "../../components/WorkoutPage/WorkoutHeaderButtons";
import WorkoutDashboard from "../../components/WorkoutPage/WorkoutDashboard";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";

export default function Workout() {
	const { themeStyle } = useTheme();
	const { activeExercise, workoutCompleted, workoutCancelled } = useWorkout();
	const styles = createStyles(themeStyle);
	const [modalIsVisible, setModalVisible] = useState(false);
	const timeRef = useRef(0);
	const scrollViewRef = useRef(null);

	// Add keyboard listeners when component mounts


	const saveWorkout = async () => {
		workoutCompleted("Workout Title", timeRef.current);
		setModalVisible(false);
	};

	const cancelWorkout = () => {
		workoutCancelled();
		setModalVisible(false);
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
			const scrollToY = Math.max(
				0,
				py - scrollViewHeight / 2 + height / 2
			);

			scrollViewRef.current?.scrollTo({
				y: scrollToY,
				animated: true,
			});
		});
	};
	return (
		<SafeAreaView style={styles.primaryContent}>
			<WorkoutDashboard onStartWorkout={() => setModalVisible(true)} />
			<WorkoutModal visible={modalIsVisible} title="Workout">
				<WorkoutHeaderButtons
					onClosePressed={cancelWorkout}
					onFinishedPressed={saveWorkout}
				/>

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalContent}
					keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
				>
					<View style={styles.innerContainer}>
						<Text style={styles.workoutTitle}>Workout Title</Text>

						<View style={styles.timerStyle}>
							<WorkoutTimer
								visible={modalIsVisible}
								timeRef={timeRef}
							/>
						</View>

						<ScrollView
							ref={scrollViewRef}
							contentContainerStyle={styles.scrollView}
							style={[
								{ width: "100%" },							]}
							keyboardShouldPersistTaps="handled"
							bounces={false}
						>
							{activeExercise.map((exercise, index) => (
								<ExerciseForm
									key={index}
									exercise={exercise}
									onFocus={(e) => handleInputFocus(e, index)}
								/>
							))}
							<ExerciseSelector />
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
		innerContainer: {
			flex: 1,
			alignItems: "center",
			width: "100%",
		},
		workoutTitle: {
			padding: 15,
			paddingHorizontal: 20,
			color: theme.textColor,
			fontSize: 32,
		},
		scrollView: {
			width: "100%",
			alignItems: "center",
		},
		timerStyle: {
			position: "absolute",
			top: "1%",
			right: 20,
			padding: "2%",
		},
	});
};
