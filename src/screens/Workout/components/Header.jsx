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
    const { workoutFinish } = useWorkoutSession();
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
        workoutFinish();
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
				
						{workoutLength !== 0 && <TwoActionModal
							actionOne={() => {console.log("Modal closed")}}
							actionTwo={() => {handleFinishPress()}}
							title={"Log Workout as Complete?"}
							subText={
								"Log this workout and view your progress in your training history."
							}
							actionOneText={"Cancel"}
							actionTwoText={"Log It!"}
						>
							<Ionicons
								name="checkmark"
								size={32}
								color={themeStyle.primary}
							/>
                        </TwoActionModal>}
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
