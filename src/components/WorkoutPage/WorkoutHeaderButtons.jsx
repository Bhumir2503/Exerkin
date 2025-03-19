import React from "react";
import { StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import FinishModal from "./FinishModal";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

const WorkoutHeaderButtons = ({ onFinishedPressed, workoutTitleRef, type, setMainModalVisible, }) => {
	const { themeStyle } = useTheme();
	const { activeExercise, activeTemplateExercises } = useWorkout();
	const styles = createStyles(themeStyle);

	const [modalVisible, setModalVisible] = useState(false);
	const [finished, setFinished] = useState(false);
	const [workoutTitle, setWorkoutTitle] = useState("");

	useEffect(() => {
		if (finished) {
			onFinishedPressed();
			setFinished(false);
		}
	}, [finished]);

	const handleTitleChange = (text) => {
		setWorkoutTitle(text);
		workoutTitleRef.current = text;
	};

	const handleDownArrowPress = () => {
		setMainModalVisible(false);
	};

	return (
		<>
			<View style={{ ...styles.container }}>
				{/* Left section */}
				<View style={styles.leftSection}>
					<Ionicons
						name="chevron-down"
						size={32}
						color={themeStyle.primary}
						onPress={handleDownArrowPress}
					/>
				</View>

				{/* Center section - always centered */}
				<View style={styles.centerSection}>
					<TextInput
						style={{
							...styles.titleInput,
						}}
						value={workoutTitle}
						placeholder={
							type === "workout"
								? "Workout Title..."
								: "Template Title..."
						}
						onChangeText={(text) => handleTitleChange(text)}
						maxLength={32}
						placeholderTextColor={themeStyle.textColorSecondary}
					/>
				</View>

				{/* Right section */}
				<View style={styles.rightSection}>
					{(activeExercise.length > 0 ||
						activeTemplateExercises.length > 0) && (
						<TouchableOpacity onPress={() => setModalVisible(true)}>
							<Ionicons
								name="checkmark-sharp"
								size={32}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>
					)}
				</View>
				<FinishModal
					type={type}
					visible={modalVisible}
					setVisible={setModalVisible}
					setFinished={setFinished}
				/>
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
