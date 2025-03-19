import React, { useMemo } from "react";
import {
	Modal,
	View,
	Platform,
	StyleSheet,
	StatusBar,
	SafeAreaView,
	KeyboardAvoidingView,
	ScrollView,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

import WorkoutHeaderButtons from "./WorkoutHeaderButtons";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutNotes from "./WorkoutNotes";
import RestTimer from "./RestTimer";
import ExerciseForm from "./ExerciseForm"; // Import your optimized component
import ExerciseSelector from "./ExerciseSelector";
import CancelButton from "./CancelButton";
import AddFirstExerciseCard from "./AddFirstExerciseCard";
import ActiveWorkoutBar from "./ActiveWorkoutBar";

const WorkoutModal = ({ visible, setModalVisible }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const { workoutExercises, workoutCompleted, workoutCancelled } =
		useWorkout();

	const onCancel = () => {
		setModalVisible(false);
		workoutCancelled();
	};

	const onFinish = () => {
		setModalVisible(false);
		workoutCompleted();
	};

	// Use useMemo to only calculate this when workoutExercises changes
	const hasExercises = useMemo(
		() => workoutExercises.length > 0,
		[workoutExercises.length]
	);

	// Memoize the exercise forms to prevent unnecessary re-renders
	// Only the IDs are needed since the actual data will be retrieved by each component
	const exerciseForms = useMemo(() => {
		return workoutExercises.map((exercise, index) => (
			<ExerciseForm key={exercise.id} exercise={exercise} />
		));
	}, [workoutExercises]);

	return (
		<Modal
			presentationStyle="fullScreen"
			animationType="slide"
			visible={visible}
			statusBarTranslucent={true}
		>
			<SafeAreaView
				style={styles.modal}
				edges={["top", "right", "left", "bottom"]}
			>
				<WorkoutHeaderButtons
					setMainModalVisible={setModalVisible}
					onFinish={onFinish}
				/>

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalContent}
					keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
				>
					<View>
						<View style={styles.timerStyle}>
							<WorkoutTimer visible={visible} />
							<View style={{ flexDirection: "row" }}>
								<WorkoutNotes />
								<RestTimer />
							</View>
						</View>

						<ScrollView
							contentContainerStyle={styles.scrollView}
							style={[{ width: "100%" }]}
							keyboardShouldPersistTaps="handled"
							bounces={false}
						>
							{/* Display exercise forms - now using memoized list */}
							{exerciseForms}

							{/* Show help card only when there are no exercises */}
							{!hasExercises && <AddFirstExerciseCard />}

							{/* Always show the exercise selector */}
							<ExerciseSelector />

							<CancelButton onPress={onCancel} />
						</ScrollView>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</Modal>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		modal: {
			flex: 1,
			backgroundColor: theme.backgroundColor,
			paddingTop:
				Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
		},
		contentContainer: {
			flex: 1,
			// Manually apply padding if SafeAreaView still isn't working
			// paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
		},
		modalContent: {
			flex: 1,
			width: "100%",
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

export default React.memo(WorkoutModal);
