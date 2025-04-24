import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TwoActionModal from "../../../components/TwoActionModal";

import { useBlueprintTitle } from "../../../contexts/blueprint/BlueprintTitleContext";
import { useBlueprintSession } from "../../../hooks/useBlueprintSession";
import { useBlueprintExercises } from "../../../contexts/blueprint/BlueprintExercisesContext";

import { useTheme } from "../../../contexts/ThemeContext";

const BlueprintHeader = ({ navigation }) => {
	const { blueprintTitle, setBlueprintTitle } = useBlueprintTitle();
	const { blueprintExercises } = useBlueprintExercises();

	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const workoutLength = blueprintExercises.length;

	const handleDownArrowPress = () => {
		navigation.goBack(); // This will close the modal and return to the previous screen in the stack navigator
	};

	const handleTitleChange = (text) => {
		setBlueprintTitle(text);
	};

	const handleFinishPress = () => {
		// Handle finish action here
		navigation.goBack();
		console.log("Blueprint Completed");
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
						value={blueprintTitle}
						placeholder={"Untitled Blueprint"}
						onChangeText={(text) => handleTitleChange(text)}
						maxLength={30}
						placeholderTextColor={themeStyle.textColorSecondary}
					/>
				</View>
				{/* Right section */}
				<View style={styles.rightSection}>
					{workoutLength !== 0 && (
						<TwoActionModal
							title={"Finish Blueprint?"}
							message={`You have ${workoutLength} exercises in this blueprint. Do you want to finish it?`}
							actionText={"Finish"}
							cancelText={"Cancel"}
							onActionPress={handleFinishPress}
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

export default BlueprintHeader;
