// Description: A modal component with two buttons, customizable styles, and a dark overlay background.
import {
	Modal,
	View,
	Pressable,
	Text,
	TouchableNativeFeedback,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const TwoButtonModal = ({
	children,
	visible,
	animationType = "fade",
	title = "Default Title",
	description = "Default Description",
	b1Text = "Button 1",
	b2Text = "Button 2",
	b1OnPress = () => {},
	b2OnPress = () => {},
	titleStyle,
	descriptionStyle,
	b1ButtonStyle,
	b2ButtonStyle,
	b1TextStyle,
	b2TextStyle,
}) => {
	const { themeStyle } = useTheme();
	const styles = {
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
		modalContent: {
			backgroundColor: themeStyle.backgroundColor,
			width: "90%",
			maxHeight: "80%",
			borderRadius: 8,
			padding: 0,
			overflow: "hidden",
			zIndex: 1,
			paddingVertical: 20,
			paddingHorizontal: 10,
		},
		title: {
			color: themeStyle.textColor,
			fontSize: 24,
			textAlign: "center",
			fontWeight: "bold",
			...titleStyle,
		},
		description: {
			color: themeStyle.textColor,
			fontSize: 16,
			textAlign: "center",
			marginVertical: 10,
			...descriptionStyle,
		},
		buttonsContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			padding: 10,
			paddingVertical: 0,
		},
		b1Button: {
			padding: 10,
			paddingHorizontal: 20,
			margin: 10,
			borderRadius: 6,
			...b1ButtonStyle,
		},
		b1Text: {
			color: themeStyle.textColor,
			fontWeight: "bold",
			fontSize: 16,
			...b1TextStyle,
		},
		b2Button: {
			backgroundColor: themeStyle.primary,
			padding: 10,
			paddingHorizontal: 20,
			margin: 10,
			borderRadius: 6,
			...b2ButtonStyle,
		},
		b2Text: {
			color: "white",
			fontWeight: "bold",
			fontSize: 16,
			...b2TextStyle,
		},
	};

	return (
		<Modal
			visible={visible}
			animationType={animationType}
			transparent={true}
			statusBarTranslucent={true}
		>
			<View style={styles.modalOverlay}>
				<TouchableNativeFeedback onPress={b1OnPress}>
					<View style={styles.backgroundOverlay} />
				</TouchableNativeFeedback>
				<View style={styles.modalContent}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.description}>{description}</Text>
					{children}
					<View style={styles.buttonsContainer}>
						<Pressable style={styles.b1Button} onPress={b1OnPress}>
							<Text style={styles.b1Text}>{b1Text}</Text>
						</Pressable>
						<Pressable style={styles.b2Button} onPress={b2OnPress}>
							<Text style={styles.b2Text}>{b2Text}</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default TwoButtonModal;
