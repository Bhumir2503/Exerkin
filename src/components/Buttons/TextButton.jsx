import { Pressable, Text } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const TextButton = ({ text, onPress, disable, buttonStyle, textStyle }) => {
	const { themeStyle } = useTheme();
	const styles = {
		button: {
			backgroundColor: themeStyle.primary,
			padding: 10,
			borderRadius: 6,
			justifyContent: "center",
			alignItems: "center",
		},
		text: {
			color: themeStyle.textColor,
			fontSize: 14,
			fontWeight: "bold",
			textAlign: "center",
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
			<Text style={[styles.text, textStyle]}>{text}</Text>
		</Pressable>
	);
};

export default TextButton;
