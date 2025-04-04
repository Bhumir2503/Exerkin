import React, { useState, } from "react";
import { View, StyleSheet, } from "react-native";

import { useTheme } from "../../contexts/ThemeContext";
import WorkoutDashboard from "../../components/WorkoutPage/WorkoutDashboard";
import ActiveWorkoutBar from "../../components/WorkoutPage/ActiveWorkoutBar";

export default function Workout({ navigation }) {
	console.log("Workout Page Rendered");

	const { themeStyle } = useTheme();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const styles = createStyles(themeStyle);

	const WorkoutButtonPressed = () => {
		navigation.navigate("WorkoutModal");
	};

	return (
		<View style={styles.primaryContent}>
			<WorkoutDashboard onStartWorkout={() => WorkoutButtonPressed()} />

			{/* Active Workout Bar, if there is an active workout */}
			<ActiveWorkoutBar onPress={()=> navigation.navigate("WorkoutModal")} />
		</View>
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
