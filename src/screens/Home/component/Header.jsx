import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../contexts/ThemeContext";

const Header = ({ navigation }) => {
	const { themeStyle } = useTheme();

	const styles = createStyles(themeStyle);

	return (
		<View style={styles.topBar}>
			<View style={styles.iconButton}>
				<Ionicons name="arrow-back" size={24} color={"transparent"} />
			</View>
			<Text style={styles.appTitle}>Exerkin</Text>
			<Pressable
				style={styles.iconButton}
				onPress={() => navigation.navigate("Settings")}
			>
				<Ionicons
					name="settings"
					size={24}
					color={themeStyle.textColor}
				/>
			</Pressable>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		topBar: {
			paddingHorizontal: 20,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		appTitle: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		iconButton: {
			padding: 8,
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 8,
		},
	});

export default Header;
