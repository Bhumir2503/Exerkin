import { View, StyleSheet, Text, Platform } from "react-native";

import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkoutSession } from "../../../hooks/useWorkoutSession";

import TwoActionModal from "../../../components/TwoActionModal";
import ExerciseSelector from "../../../components/ExerciseSelector";

const Footer = ({navigation}) => {
	const { workoutCancel } = useWorkoutSession();
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const handleConfirm = () => {
		console.log("Workout Cancelled");
		workoutCancel();
		navigation.goBack();
	};

	const handleCancel = () => {
		console.log("Not Cancelling Workout");
	};

	return (
		<View style={styles.footerContainer}>
			<ExerciseSelector type={"workout"} />
			<TwoActionModal
				title={"Cancel Workout?"}
				subText={
					"Your progress will not be saved. Workout session will be lost."
				}
				actionOne={handleCancel}
				actionTwo={handleConfirm}
				actionOneText={"Nah"}
				actionTwoText={"Confirm"}
			>
				<Text style={styles.CancelButton}>Cancel Workout</Text>
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
