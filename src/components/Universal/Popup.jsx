import {
	Modal,
	TouchableWithoutFeedback,
	View,
	StyleSheet,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export const Popup = ({
	visible,
	setVisible,
	animation,
	overlayPressed,
	children,
}) => {
	const { themeStyles } = useTheme();
	const styles = createStyle(themeStyles);
	return (
		<Modal
			animationType={animation}
			transparent={true}
			visible={visible}
			onRequestClose={() => setVisible(false)}
			statusBarTranslucent={true}
		>
			<TouchableWithoutFeedback onPress={overlayPressed}>
				<View style={styles.container}>
					<TouchableWithoutFeedback onPress={() => {}}>
						<View style={styles.popup}>{children}</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const createStyle = (themeStyles) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "rgba(0, 0, 0, 0.5)",
		},
		popup: {
			width: "90%",
			paddingVertical: 20,
			backgroundColor: themeStyles.background,
			borderRadius: 10,
			justifyContent: "center",
		},
	});
};
