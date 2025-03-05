import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import WorkoutButton from "../../components/WorkoutPage/WorkoutButtons";
import ExerciseForm from "../../components/WorkoutPage/ExerciseForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";
import WorkoutTimer, {formatTime} from "../../components/WorkoutPage/WorkoutTimer";
import WorkoutDashboard  from "../../components/WorkoutPage/WorkoutDashboard";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";

export default function Workout() {
	const { themeStyle } = useTheme();
	const { activeExercise, workoutCompleted, workoutCancelled } = useWorkout();
	const styles = createStyles(themeStyle);

	const [modalIsVisible, setModalVisible] = useState(false);
	const [time, setTime] = useState(0);

	const saveWorkout = async () => {
		workoutCompleted("Workout Title", time);
		setModalVisible(false);
	}

	const cancelWorkout = () => {
		workoutCancelled();
		setModalVisible(false);
	}

	

	return (
		<SafeAreaView style={styles.primaryContent}>
            <WorkoutDashboard onStartWorkout={()=>setModalVisible(true)}/>
			<WorkoutModal visible={modalIsVisible} title="Workout">
				<View style={styles.modalContent}>
					<Text style={styles.workoutTitle}>Workout Title</Text>

					<View style = {styles.timerStyle}>
						<WorkoutTimer visible={modalIsVisible} time={time} setTime={setTime} />
					</View>

					<ScrollView
						contentContainerStyle={styles.scrollView}
						style={{ width: "100%", height: "100%" }}
					>
						{activeExercise.map((exercise, index) => (
							<ExerciseForm
								key={index}
								exercise={exercise}
							/>
						))}

						<ExerciseSelector />
						<WorkoutButton
							type="saveWorkout"
							title="Save Workout"
							onPress={saveWorkout}
						/>
						<WorkoutButton
							type="cancelWorkout"
							title="Cancel Workout"
							onPress={cancelWorkout}
						/>
                        

						<View style={{ width: "100%", height: 50 }}></View>
					</ScrollView>
				</View>
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
