import {
	Modal,
	View,
	Pressable,
	TouchableWithoutFeedback,
	TouchableOpacity,
	StyleSheet,
	Text,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";

const FinishModal = ({ setMainModalVisible }) => {
	const { themeStyle } = useTheme();
	const { workoutCompleted } = useWorkout();

	const styles = createStyles(themeStyle);

	const [visible, setVisible] = useState(false);

	const closeModal = () => {
		setVisible(false);
	};

	const handleLogIt = () => {
		// First, close all modals
		closeModal();
		setTimeout(() => {
		setMainModalVisible(false);
		}, 500); // 500ms should be enough for the modal animations to complete
		// Then execute workoutCompleted with a slight delay
		// This ensures the modals are closed before any state changes from workoutCompleted
		setTimeout(() => {
			workoutCompleted();
		}, 500); // 500ms should be enough for the modal animations to complete
	};

	return (
		<>
			<TouchableOpacity onPress={() => setVisible(true)}>
				<Ionicons
					name="checkmark-sharp"
					size={32}
					color={themeStyle.primary}
				/>
			</TouchableOpacity>
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
								Log Workout as Complete?
							</Text>
							<Text style={styles.modalText}>
								Log this workout and view your progress in your
								training history.
							</Text>
						</View>
						<View style={styles.buttonView}>
							<Pressable
								style={styles.closeButton}
								onPress={closeModal}
							>
								<Text style={styles.closeText}>Close</Text>
							</Pressable>
							<Pressable
								style={styles.submit}
								onPress={handleLogIt}
							>
								<Text style={styles.submitText}>Log It!</Text>
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
			borderRadius: 10,
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
			borderRadius: 5,
		},
		closeText: {
			color: themeStyle.textColor,
			fontWeight: "bold",
			fontSize: 16,
		},
		submit: {
			backgroundColor: themeStyle.primary,
			padding: 10,
			paddingHorizontal: 20,
			margin: 10,
			borderRadius: 5,
		},
		submitText: {
			color: "white",
			fontWeight: "bold",
			fontSize: 16,
		},
	});
};

export default FinishModal;