import { View, StyleSheet, Text, Platform } from "react-native";

import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";

import TwoActionModal from "../../../components/TwoActionModal";
import ExerciseManager from "../../../components/ExerciseSelector/ExerciseManager";

const Footer = ({ navigation }) => {
	const { cancelWorkout, formTypeRef } = useWorkoutSession();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const handleConfirm = () => {
		console.log("Workout Cancelled");
		cancelWorkout();
		navigation.goBack();
	};

	const handleCancel = () => {
		console.log("Not Cancelling Workout");
	};

	return (
		<View style={styles.footerContainer}>
			<ExerciseManager type={"workout"} />
			<TwoActionModal
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
			</TwoActionModal>
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
