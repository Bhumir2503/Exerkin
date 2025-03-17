import {useState} from "react";
import { View, ScrollView, KeyboardAvoidingView, StyleSheet } from "react-native";
import { useWorkout } from "../../contexts/WorkoutContext";
import ExerciseForm from "./ExerciseForm";
import ExerciseSelector from "./ExerciseSelector";
import WorkoutHeaderButtons from "./WorkoutHeaderButtons";
import WorkoutModal from "./WorkoutModal";
import { useTheme } from "../../contexts/ThemeContext";




const TemplateWorkout = ({ workout }) => {
    const [modalIsVisible, setModalVisible] = useState(true);
    const [workoutTitle, setWorkoutTitle] = useState(workout.title);
    const [titleError, setTitleError] = useState(false);
    const [templateExercises, setTemplateExercises] = useState([]);

    const { addTemplate } = useWorkout();
    const { themeStyle } = useTheme();
    const styles = createStyles(themeStyle);

	return (
		<WorkoutModal visible={modalIsVisible} title="Workout">
			<WorkoutHeaderButtons
				onFinishedPressed={saveTemplate}
				setWorkoutTitle={setWorkoutTitle}
				workoutTitle={workoutTitle}
				titleError={titleError}
				setTitleError={setTitleError}
			/>

			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.modalContent}
				keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
			>
				<View>
					<ScrollView
						contentContainerStyle={styles.scrollView}
						style={[{ width: "100%" }]}
						keyboardShouldPersistTaps="handled"
						bounces={false}
					>
						{templateExercises.map((exercise, index) => (
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
	);
};


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
