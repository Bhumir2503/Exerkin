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

	useEffect(() => {
		if (finished) {
			onFinishedPressed();
			setFinished(false);
		}
	}, [finished]);

	return (
		<>
			<View style={{...styles.container, }}>
				{type === "workout" && (
					<TouchableOpacity onPress={() => console.log("Timer")}>
						<Ionicons
							name="stopwatch-outline"
							size={32}
							color={themeStyle.textColor}
						/>
					</TouchableOpacity>
				)}
				<TextInput
					style={{
						...styles.titleInput,
						borderColor: titleError ? "red" : themeStyle.textColor,
						borderBottomWidth: titleError ? 2 : 0,
						textAlign: type === "workout" ? "center": "left",
					}}
					value={workoutTitle}
					placeholder={
						type === "workout" ? "Add Title..." : "Template Title"
					}
					onChangeText={(text) => setWorkoutTitle(text)}
					onFocus={() => setTitleError(false)}
					maxLength={32}
				/>
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
			justifyContent: "space-between",
			paddingHorizontal: 20,
			paddingTop: 15,
			paddingBottom: 20,
		},
		text: {
			color: themeStyle.accent,
			fontSize: 24,
		},
		titleInput: {
			color: themeStyle.textColor,
			fontSize: 24,
			flex: 1,
			marginHorizontal: 20,
			textAlign: "center",
			fontWeight: "bold",
		},
	});
};

export default WorkoutHeaderButtons;
