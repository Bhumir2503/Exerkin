import React from "react";
import {
	StyleSheet,
	View,
	TextInput,
} from "react-native";
import FinishModal from "./Modals/FinishModal";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

const WorkoutHeaderButtons = ({ setMainModalVisible, navigation }) => {
	const { themeStyle } = useTheme();
	const { workoutExercises, WorkoutTitle: WorkoutTitleRef } = useWorkout();
	const styles = createStyles(themeStyle);

	// Use useEffect to update the local state when the ref changes
	// This ensures our component reacts to external changes to the workout title
	const [workoutTitle, setWorkoutTitle] = useState(WorkoutTitleRef.current);

	useEffect(() => {
		setWorkoutTitle(WorkoutTitleRef.current);
	}, [WorkoutTitleRef.current]);

	const handleTitleChange = (text) => {
		setWorkoutTitle(text);
		WorkoutTitleRef.current = text;
	};

	return (
		<>
			<View style={{ ...styles.container }}>
				{/* Left section */}
				<View style={styles.leftSection}>
					<Ionicons
						name="chevron-down"
						size={32}
						color={"transparent"}
					/>
				</View>

				{/* Center section - always centered */}
				<View style={styles.centerSection}>
					<TextInput
						style={styles.titleInput}
						value={workoutTitle}
						placeholder={"Untitled Workout"}
						onChangeText={(text) => handleTitleChange(text)}
						maxLength={30}
						placeholderTextColor={themeStyle.textColorSecondary}
						cursorColor={themeStyle.primary} // Add primary color to cursor
						autoCapitalize="none"
						caretHidden={false}
						showSoftInputOnFocus={true}
					/>
				</View>

				{/* Right section */}
				<View style={styles.rightSection}>
					{workoutExercises.length > 0 && (
						<FinishModal
							setMainModalVisible={setMainModalVisible}
							navigation={navigation}
						/>
					)}
				</View>
			</View>
		</>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			paddingHorizontal: 20,
			paddingTop: 15,
			paddingBottom: 0,
			alignItems: "center",
		},
		leftSection: {
			flex: 1,
			alignItems: "flex-start",
		},
		centerSection: {
			flex: 4,
			alignItems: "center",
		},
		rightSection: {
			flex: 1,
			alignItems: "flex-end",
		},
		text: {
			color: themeStyle.accent,
			fontSize: 24,
		},
		titleInput: {
			color: themeStyle.textColor,
			fontSize: 24,
			textAlign: "center",
			fontWeight: "bold",
		},
	});
};

export default WorkoutHeaderButtons;
