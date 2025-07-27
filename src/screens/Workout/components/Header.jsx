import { StyleSheet, View, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useWorkoutTitle } from "../../../contexts/workout/WorkoutTitleContext";
import { useWorkoutExercises } from "../../../contexts/workout/WorkoutExercisesContext";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";
import { useBlueprintTitle } from "../../../contexts/blueprint/BlueprintTitleContext";
import { useBlueprintSession } from "../../../hooks/useBlueprintSession";
import { useBlueprintExercises } from "../../../contexts/blueprint/BlueprintExercisesContext";

import { useTheme } from "../../../contexts/ThemeContext";

import TwoButtonModal from "../../../components/Modals/TwoButtonModal";

const Header = ({ navigation, screen }) => {
	const { workoutTitle, setWorkoutTitle } = useWorkoutTitle();
	const { workoutExercises } = useWorkoutExercises();
	const { formTypeRef, finishWorkout, finishEditWorkout } =
		useWorkoutSession();

	const { blueprintTitle, setBlueprintTitle } = useBlueprintTitle();
	const { blueprintExercises } = useBlueprintExercises();
	const { finishBlueprint } = useBlueprintSession();

	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [showModal, setShowModal] = useState(false);

	const workoutLength =
		screen === "workout"
			? workoutExercises.length
			: blueprintExercises.length;

	const handleDownArrowPress = () => {
		navigation.goBack(); // This will close the modal and return to the previous screen in the stack navigator
	};

	const handleTitleChange = (text) => {
		if (screen === "workout") {
			setWorkoutTitle(text);
		} else if (screen === "blueprint") {
			setBlueprintTitle(text);
		}
	};

	const handleModalClose = () => {
		setShowModal(false);
	};

	const handleFinishPress = () => {
		navigation.goBack();
		handleModalClose();
		if (screen === "workout") {
			if (formTypeRef.current === "workout") {
				finishWorkout();
			} else if (formTypeRef.current === "edit") {
				finishEditWorkout();
			}
		} else if (screen === "blueprint") {
			finishBlueprint();
		}
	};

	return (
		<>
			<View style={{ ...styles.container }}>
				{/* Left section */}
				<View style={styles.leftSection}>
					{screen === "workout" && (
						<Ionicons
							name="chevron-down"
							size={32}
							color={
								formTypeRef.current === "workout"
									? themeStyle.primary
									: "transparent"
							}
							onPress={
								formTypeRef.current === "workout"
									? handleDownArrowPress
									: null
							}
						/>
					)}
				</View>
				{/* Center section - always centered */}
				<View style={styles.centerSection}>
					<TextInput
						style={styles.titleInput}
						value={
							screen === "workout" ? workoutTitle : blueprintTitle
						}
						placeholder={
							screen === "workout"
								? "Untitled Workout"
								: "Untitled Blueprint"
						}
						onChangeText={(text) => handleTitleChange(text)}
						maxLength={30}
						placeholderTextColor={themeStyle.textColorSecondary}
					/>
				</View>
				<View style={styles.rightSection}>
					{workoutLength !== 0 && (
						<Ionicons
							name="checkmark"
							size={32}
							color={themeStyle.primary}
							onPress={() => {
								setShowModal(true);
							}}
						/>
					)}
				</View>
			</View>
			<TwoButtonModal
				visible={showModal}
				animationType={"fade"}
				title={
					screen === "workout"
						? formTypeRef.current === "workout"
							? "Log Workout?"
							: "Save Changes?"
						: "Create Blueprint?"
				}
				description={
					screen === "workout"
						? formTypeRef.current === "workout"
							? "Track this workout and review your training history. Remember to mark your completed sets."
							: "Save changes to this workout?"
						: `You have ${workoutLength} exercises in this blueprint. Do you want to create it?`
				}
				b1Text={"Cancel"}
				b2Text={
					screen === "workout"
						? formTypeRef.current === "workout"
							? "Log It!"
							: "Save Changes"
						: "Create"
				}
				b1OnPress={() => {
					handleModalClose();
				}}
				b2OnPress={handleFinishPress}
			/>
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
