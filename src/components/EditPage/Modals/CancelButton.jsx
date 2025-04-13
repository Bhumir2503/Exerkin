import {
	Text,
	View,
	StyleSheet,
	Pressable,
	Modal,
	TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkout } from "../../../contexts/WorkoutContext";
import { useState } from "react";

const CancelButton = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const { workoutCancelled } = useWorkout();
	const styles = createStyles(themeStyle);
	const [visible, setVisible] = useState(false);

	const closeModal = () => {
		setVisible(false);
	};

	const handleCancel = () => {
		workoutCancelled();
		navigation.goBack();
		setVisible(false);
	};

	return (
		<>
			<Pressable onPress={() => setVisible(true)} style={styles.button}>
				<Text style={styles.buttonText}>Cancel Edit</Text>
			</Pressable>

			<Modal
				visible={visible}
				animationType="fade"
				transparent={true}
				statusBarTranslucent={true}
			>
				<View style={styles.modalOverlay}>
					<TouchableWithoutFeedback onPress={closeModal}>
						<View style={styles.backgroundOverlay} />
					</TouchableWithoutFeedback>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								Cancel Edit?
							</Text>
							<Text style={styles.modalText}>
								Your progress will not be saved. Editted
								exercises data will be lost.
							</Text>
						</View>

						<View style={styles.buttonView}>
							<Pressable
								style={styles.closeButton}
								onPress={closeModal}
							>
								<Text style={styles.closeText}>Nah</Text>
							</Pressable>
							<Pressable
								style={styles.cancelButton}
								onPress={handleCancel}
							>
								<Text style={styles.cancelButtonText}>
									Continue
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		button: {
			marginVertical: 5,
			padding: 12,
			paddingVertical: 5,
			borderRadius: 8,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
		},
		buttonText: {
			color: themeStyle.error,
			fontSize: 16,
			fontWeight: "bold",
			marginLeft: 8,
		},

		modalOverlay: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		backgroundOverlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: "rgba(0, 0, 0, 0.75)",
		},
		modalContainer: {
			backgroundColor: themeStyle.backgroundColor,
			width: "90%",
			maxHeight: "80%",
			borderRadius: 8,
			padding: 0,
			overflow: "hidden",
			zIndex: 1,
		},
		modalContent: {
			alignItems: "center",
			marginTop: 20,
		},
		modalTitle: {
			color: themeStyle.textColor,
			fontSize: 24,
			fontWeight: "bold",
			margin: 5,
		},
		modalText: {
			textAlign: "center",
			color: themeStyle.textColor,
			fontSize: 16,
			margin: 5,
			marginHorizontal: 30,
		},
		buttonView: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			margin: 10,
			marginHorizontal: 25,
		},
		closeButton: {
			padding: 10,
			paddingHorizontal: 20,
			margin: 10,
			borderRadius: 6,
		},
		closeText: {
			color: themeStyle.textColor,
			fontWeight: "bold",
			fontSize: 16,
		},
		cancelButton: {
			backgroundColor: themeStyle.primary,
			padding: 10,
			paddingHorizontal: 20,
			margin: 10,
			borderRadius: 6,
		},
		cancelButtonText: {
			color: "white",
			fontWeight: "bold",
			fontSize: 16,
		},
	});
};

export default CancelButton;
