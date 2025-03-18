import React from "react";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	TextInput,
	Modal,
	Pressable,
} from "react-native";
import FinishModal from "./FinishModal";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import RestTimer from "./RestTimer";

const WorkoutHeaderButtons = ({
	onFinishedPressed,
	setTitleError,
	titleError,
	workoutTitle,
	setWorkoutTitle,
	type,
}) => {
	const { themeStyle } = useTheme();
	const { activeExercise, activeTemplateExercises } = useWorkout();
	const styles = createStyles(themeStyle);

	const [modalVisible, setModalVisible] = useState(false);
	const [finished, setFinished] = useState(false);
	console.log("test");
	useEffect(() => {
		if (finished) {
			onFinishedPressed();
			setFinished(false);
		}
	}, [finished]);

	return (
		<>
			<View style={{ ...styles.container }}>
				{/* Left section */}
				<View style={styles.leftSection}>
					{type === "workout" && <RestTimer />}
				</View>

				{/* Center section - always centered */}
				<View style={styles.centerSection}>
					<TextInput
						style={{
							...styles.titleInput,
							borderColor: titleError
								? "red"
								: themeStyle.textColor,
							borderBottomWidth: titleError ? 2 : 0,
						}}
						value={workoutTitle}
						placeholder={
							type === "workout"
								? "Add Title..."
								: "Template Title"
						}
						onChangeText={(text) => setWorkoutTitle(text)}
						onFocus={() => setTitleError(false)}
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
