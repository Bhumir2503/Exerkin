import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Modal } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { useTheme } from "../../contexts/ThemeContext";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";
import WorkoutDashboard from "../../components/WorkoutPage/WorkoutDashboard";

export default function Workout({navigation}) {
	console.log("Workout Page Rendered");

	const { themeStyle } = useTheme();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const styles = createStyles(themeStyle);

	const WorkoutButtonPressed = () => {
		navigation.navigate("WorkoutModal");
	};

	return (
		<SafeAreaView style={styles.primaryContent}>
			<WorkoutDashboard onStartWorkout={() => WorkoutButtonPressed()}  />
		</SafeAreaView>
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
