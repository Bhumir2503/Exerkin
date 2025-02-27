import React, { useState } from "react";
import {
	View,
	Button,
	StyleSheet,
	Text,
	Modal,
	ScrollView,
	TouchableOpacity,
    StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import WorkoutButton from "../../components/WorkoutPage/WorkoutButtons";
import WorkoutForm from "../../components/WorkoutPage/WorkoutForm";
import ExerciseSelector from "../../components/WorkoutPage/ExerciseSelector";
import { useNavigation } from "@react-navigation/native";
import storage from "../../utils/storage";
import WorkoutTimer, {formatTime} from "../../components/WorkoutPage/WorkoutTimer";
import WorkoutDashboard  from "../../components/WorkoutPage/WorkoutDashboard";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";

export default function Profile() {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const navigation = useNavigation();

	const [modalIsVisible, setModalVisible] = useState(false);
	const [selectedExercises, setSelectedExercises] = useState([]);
	const [time, setTime] = useState(0);

	const addExercise = (exercise) => {
		if (exercise) {
			setSelectedExercises((prevExercises) => [
				...prevExercises,
				{ name: exercise, sets: [] },
			]);
		}
	};

	const updateExercise = (exerciseName, newSets) => {
		setSelectedExercises((prevExercises) => {
			const updatedExercises = prevExercises.map((exercise) => {
				if (exercise.name === exerciseName) {
					return { ...exercise, sets: newSets };
				}
				return exercise;
			});
			return updatedExercises;
		});
	};

	const saveWorkout = async () => {
		// Wait for all exercises to finalize their last sets
		const updatedExercises = await Promise.all(
			selectedExercises.map(async (exercise) => {
				if (exercise.finalizeLastSet) {
					const lastSet = await exercise.finalizeLastSet(); // Wait for the last set
					if (lastSet) {
						return {
							...exercise,
							sets: [...exercise.sets, lastSet], // Add the last set
						};
					}
				}
				return exercise;
			})
		);

		setTimeout(() => {
			try {
				const storedWorkouts = storage.getString("workouts");
				const workouts = storedWorkouts
					? JSON.parse(storedWorkouts)
					: [];

				const newWorkout = {
					id: Date.now(),
					timestamp: new Date().toISOString(),
					exercises: updatedExercises.map((exercise) => ({
						name: exercise.name,
						sets: [...exercise.sets],
					})),
					time: formatTime(time),
				};

				workouts.push(newWorkout);
				storage.set("workouts", JSON.stringify(workouts));

				setModalVisible(false);
				setSelectedExercises([]);
				navigation.navigate("Profile");
			} catch (error) {
				console.error("Error saving workout:", error);
			}
		}, 100);
	};

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
						{selectedExercises.map((exercise, index) => (
							<WorkoutForm
								key={index}
								theme={themeStyle}
								title={exercise.name}
								updateExercise={updateExercise}
								onFinalize={(finalizeLastSet) => {
									exercise.finalizeLastSet = finalizeLastSet;
								}}
							/>
						))}

						<ExerciseSelector onSelect={addExercise} />
						<WorkoutButton
							type="saveWorkout"
							title="Save Workout"
							onPress={saveWorkout}
						/>
						<WorkoutButton
							type="cancelWorkout"
							title="Cancel Workout"
							onPress={() => {
								setModalVisible(false);
								setSelectedExercises([]);
							}}
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
