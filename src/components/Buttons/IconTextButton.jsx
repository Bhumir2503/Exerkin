import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const IconTextButton = ({
	icon,
	text,
	onPress,
	disable,
	buttonStyle,
	iconColor,
	iconStyle,
	textStyle,
}) => {
	const { themeStyle } = useTheme();
	const styles = {
		button: {
			backgroundColor: themeStyle.primary,
			padding: 10,
			borderRadius: 8,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
		},
		text: {
			color: themeStyle.textColor,
			fontSize: 18,
			fontWeight: "bold",
			textAlign: "center",
			marginLeft: 10,
		},
	};
	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				buttonStyle,
				pressed && { opacity: 0.7 },
				disable && { opacity: 0.5 },
			]}
			onPress={onPress}
			disabled={disable}
		>
			<Ionicons
				name={icon}
				size={24}
				color={iconColor || themeStyle.textColor}
				style={{...iconStyle }}
			/>
			<Text style={[styles.text, textStyle]}>{text}</Text>
		</Pressable>
	);
};

export default IconTextButton;
