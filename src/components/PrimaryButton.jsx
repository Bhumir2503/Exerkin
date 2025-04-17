import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const PrimaryButton = ({ title, onPress, icon, disable }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle, disable);

	return (
		<Pressable style={styles.button} onPress={onPress} disabled={disable}>
			<Ionicons name={icon} size={24} color={"#fff"} />
			<Text style={styles.buttonText}>{title}</Text>
		</Pressable>
	);
};

const createStyles = (theme, disable) => {
	return StyleSheet.create({
		button: {
			backgroundColor:  theme.primary,
			padding: 10,
			borderRadius: 8,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			opacity: disable ? 0.5 : 1,
		},
		buttonText: {
			color: "#fff",
			fontSize: 18,
			fontWeight: "bold",
			textAlign: "center",
			marginLeft: 10,
		},
	});
};
export default PrimaryButton;
