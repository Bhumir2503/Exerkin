import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, Modal } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { useTheme } from "../../contexts/ThemeContext";
import WorkoutModal from "../../components/WorkoutPage/WorkoutModal";
import WorkoutDashboard from "../../components/WorkoutPage/WorkoutDashboard";

export default function Workout() {
	console.log("Workout Page Rendered");

	const { themeStyle } = useTheme();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const styles = createStyles(themeStyle);

	const WorkoutButtonPressed = () => {
		setIsModalOpen(true);
	};

	return (
		<SafeAreaView style={styles.primaryContent}>
			<WorkoutDashboard onStartWorkout={() => WorkoutButtonPressed()}  />
			<WorkoutModal
				visible={isModalOpen}
				setModalVisible={setIsModalOpen}
			/>
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
