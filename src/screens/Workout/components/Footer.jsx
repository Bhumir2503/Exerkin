import { View, StyleSheet, Text, Platform } from "react-native";
import { useState } from "react";

import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";

import TwoButtonModal from "../../../components/Modals/TwoButtonModal";
import ExerciseManager from "../../../components/ExerciseSelector/ExerciseManager";

const Footer = ({ navigation, screen }) => {
	const { cancelWorkout, formTypeRef } = useWorkoutSession();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [showModal, setShowModal] = useState(false);

	const handleConfirm = () => {
		setShowModal(false);
		if (screen === "workout") {
			cancelWorkout();
		}
		navigation.goBack();
	};

	const handleCancel = () => {
		setShowModal(false);
	};

	return (
		<View style={styles.footerContainer}>
			<ExerciseManager type={"workout"} />
			{/* <TwoActionModal
				title={
					formTypeRef.current === "workout"
						? "Cancel Workout?"
						: "Discard Changes?"
				}
				subText={
					formTypeRef.current === "workout"
						? "Your progress will not be saved. Workout session will be lost."
						: "Your changes will not be saved. Workout session will be lost."
				}
				actionOne={handleCancel}
				actionTwo={handleConfirm}
				actionOneText={"Nah"}
				actionTwoText={"Confirm"}
			>
				{formTypeRef.current === "workout" ? (
					<Text style={styles.CancelButton}>Cancel Workout</Text>
				) : (
					<Text style={styles.CancelButton}>Discard Changes</Text>
				)}
			</TwoActionModal> */}
			{screen === "workout" && (
				<Text
					style={styles.CancelButton}
					onPress={() => setShowModal(true)}
				>
					{formTypeRef.current === "workout"
						? "Cancel Workout"
						: "Discard Changes"}
				</Text>
			)}
			{screen === "blueprint" && (
				<Text
					style={styles.CancelButton}
					onPress={() => setShowModal(true)}
				>
					Discard Blueprint
				</Text>
			)}
			<TwoButtonModal
				visible={showModal}
				animationType={"fade"}
				title={
					screen === "workout"
						? formTypeRef.current === "workout"
							? "Cancel Workout?"
							: "Discard Changes?"
						: "Discard Blueprint?"
				}
				description={
					screen === "workout"
						? formTypeRef.current === "workout"
							? "Your progress will not be saved. Workout session will be lost."
							: "Your changes will not be saved. Workout session will be lost."
						: "Your progress will not be saved. Blueprint creation will be lost."
				}
				b1OnPress={handleCancel}
				b2OnPress={handleConfirm}
				b1Text={"Nah"}
				b2Text={"Confirm"}
			/>
		</View>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		footerContainer: {
			backgroundColor: theme.backgroundColor,
			padding: Platform.OS === "ios" ? 0 : 15,
		},
		CancelButton: {
			color: theme.error,
			fontSize: 18,
			fontWeight: "bold",
			textAlign: "center",
			marginVertical: 10,
		},
	});
};

export default Footer;
