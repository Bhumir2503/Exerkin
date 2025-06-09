import {
	Modal,
	View,
	TouchableWithoutFeedback,
	StyleSheet,
} from "react-native";

export default function PopUp({ visible, onClose, animationType, children }) {
	return (
		<Modal
			animationType={animationType || "fade"}
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<TouchableWithoutFeedback onPress={onClose}>
					<View style={styles.backgroundOverlay} />
				</TouchableWithoutFeedback>
				{children}
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
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
});
