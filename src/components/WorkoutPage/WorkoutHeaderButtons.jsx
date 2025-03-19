import React from "react";
import {
	StyleSheet,
	TouchableOpacity,
	View,
	TextInput,
	Modal,
} from "react-native";
import FinishModal from "./FinishModal";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

const WorkoutHeaderButtons = ({ setMainModalVisible, onFinish }) => {
	const { themeStyle } = useTheme();
	const {
		workoutExercises,
		WorkoutTitle: WorkoutTitleRef,
	} = useWorkout();
	const styles = createStyles(themeStyle);

	const [subModalVisible, setSubModalVisible] = useState(false);
	const [finished, setFinished] = useState(false);
	const [workoutTitle, setWorkoutTitle] = useState("");

	useEffect(() => {
		if (finished) {
			setFinished(false);
		}
	}, [finished]);

	const handleTitleChange = (text) => {
		setWorkoutTitle(text);
		WorkoutTitleRef.current = text;
	};

	const handleDownArrowPress = () => {
		setMainModalVisible(false);
	};

	const handleFinishPress = () => {
		setSubModalVisible(true);
		onFinish();
	}


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
						style={styles.titleInput}
						value={workoutTitle}
						placeholder={"Workout Title..."}
						onChangeText={(text) => handleTitleChange(text)}
						maxLength={32}
						placeholderTextColor={themeStyle.textColorSecondary}
					/>
				</View>

				{/* Right section */}
				<View style={styles.rightSection}>
					{workoutExercises.length > 0 && (
						<TouchableOpacity onPress={() => handleFinishPress()}>
							<Ionicons
								name="checkmark-sharp"
								size={32}
								color={themeStyle.primary}
							/>
						</TouchableOpacity>
					)}
				</View>
				<FinishModal
					visible={subModalVisible}
					setVisible={setSubModalVisible}
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
