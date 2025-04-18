import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const InfoCard = ({ icon, title, message, width }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<View style={{ ...styles.container, width: width ? width : "90%" }}>
			<View style={styles.content}>
				<View style={styles.IconContainer}>
					<Ionicons
						name={icon}
						size={40}
						color={themeStyle.primary}
					/>
				</View>

				<Text style={styles.title}>{title}</Text>
				<Text style={styles.description}>{message}</Text>
			</View>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			margin: "auto",
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 16,
			marginVertical: 15,
			alignItems: "center",
			display: "flex",
		},
		content: {
			alignItems: "center",
			width: "100%",
			marginBottom: 12,
		},
		IconContainer: {
			backgroundColor: `${themeStyle.primary}20`, // 20% opacity of primary color
			width: 80,
			height: 80,
			borderRadius: 40,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 15,
		},

		textContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		title: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 6,
		},
		description: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			lineHeight: 20,
			textAlign: "center",
		},
	});
};

export default InfoCard;
