import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useWorkoutTitle } from "../../../contexts/workout/WorkoutTitleContext";
import { useWorkoutExercises } from "../../../contexts/workout/WorkoutExercisesContext";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";
import { useTheme } from "../../../contexts/ThemeContext";

import TwoActionModal from "../../../components/TwoActionModal";

const Header = ({ navigation }) => {
	const { workoutTitle, setWorkoutTitle } = useWorkoutTitle();
	const { workoutExercises } = useWorkoutExercises();
	const { formTypeRef, workoutFinish, editFinish  } = useWorkoutSession();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const workoutLength = workoutExercises.length;

	const handleDownArrowPress = () => {
		navigation.goBack(); // This will close the modal and return to the previous screen in the stack navigator
	};

	const handleTitleChange = (text) => {
		setWorkoutTitle(text);
	};

	const handleFinishPress = () => {
		// Handle finish action here
		navigation.goBack();
		console.log("Workout Completed");
		if (formTypeRef.current === "workout") {
			workoutFinish();
		}else if(formTypeRef.current === "edit"){
			editFinish();
		}
	};

	return (
		<>
			<View style={{ ...styles.container }}>
				{/* Left section */}
				<View style={styles.leftSection}>
					<Ionicons
						name="chevron-down"
						size={32}
						color={formTypeRef.current === "workout" ? themeStyle.primary: "transparent"}
						onPress={formTypeRef.current === "workout" ? handleDownArrowPress: null}
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
						autoCapitalize="words"
						caretHidden={false}
						showSoftInputOnFocus={true}
					/>
				</View>
				<View style={styles.rightSection}>
					{workoutLength !== 0 && (
						<TwoActionModal
							actionOne={() => {
								console.log("Modal closed");
							}}
							actionTwo={() => {
								handleFinishPress();
							}}
							title={formTypeRef.current === "workout" ? "Log Workout as Complete?": "Save Changes?"}
							subText={
								formTypeRef.current === "workout" ? "Log this workout and view your progress in your training history.": "Save changes to this workout?"
							}
							actionOneText={"Cancel"}
							actionTwoText={formTypeRef.current === "workout" ?"Log It!": "Save Changes"}
						>
							<Ionicons
								name="checkmark"
								size={32}
								color={themeStyle.primary}
							/>
						</TwoActionModal>
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

export default Header;
