import React from "react";
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

import WorkoutHeaderButtons from "./WorkoutHeaderButtons";
import WorkoutTimer from "./WorkoutTimer";
import WorkoutNotes from "./WorkoutNotes";
import RestTimer from "./RestTimer";
import ExerciseForm from "./ExerciseForm";
import ExerciseSelector from "./ExerciseSelector";
import CancelButton from "./CancelButton";
import AddFirstExerciseCard from "./AddFirstExerciseCard";
import ActiveWorkoutBar from "./ActiveWorkoutBar";

const WorkoutModal = ({ visible, setModalVisible }) => {
	console.log("Workout Modal Rendered");
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

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
				<WorkoutHeaderButtons setMainModalVisible={setModalVisible} />

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
							{/* Display exercises */}

							<ExerciseForm />

							{/* Show help card only when there are no exercises */}
							<AddFirstExerciseCard />

							{/* Always show the exercise selector */}
							<ExerciseSelector />

							<CancelButton
								setMainModalVisible={setModalVisible}
							/>
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

export default WorkoutModal;
