import { View, StyleSheet, Text, Platform } from "react-native";

import { useTheme } from "../../../contexts/ThemeContext";

import TwoActionModal from "../../../components/TwoActionModal";
import ExerciseSelector from "../../../components/ExerciseSelector";

const BlueprintFooter = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const handleConfirm = () => {
		console.log("blueprint Cancelled");
		navigation.goBack();
	};

	const handleCancel = () => {
		console.log("Not Cancelling blueprint");
	};

	return (
		<View style={styles.footerContainer}>
			<ExerciseSelector type={"blueprint"} />
			<TwoActionModal
				title={"Discard Blueprint?"}
				subText={
					"Your progress will not be saved. Blueprint creation will be lost."
				}
				actionOne={handleCancel}
				actionTwo={handleConfirm}
				actionOneText={"Nah"}
				actionTwoText={"Confirm"}
			>
				<Text style={styles.CancelButton}>Discard Blueprint</Text>
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

export default BlueprintFooter;
