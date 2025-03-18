import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

const AddFirstExerciseCard = () => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
                <Ionicons
                    name="add-circle"
                    size={48}
                    color={themeStyle.primary}
                    style={styles.icon}
                />
				<View style={styles.textContainer}>
					<Text style={styles.title}>
						Get Started With Your Workout
					</Text>
					<Text style={styles.description}>
						Click the button below to select your first exercise.
						You can add multiple sets for each exercise and track
						your progress.
					</Text>
				</View>
			</View>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			width: "90%",
			backgroundColor:
				themeStyle.cardBackground ||
				themeStyle.card ||
				themeStyle.backgroundSecondary ||
				"#2A2A2A",
			borderRadius: 12,
			padding: 16,
			marginVertical: 15,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.15,
			shadowRadius: 3,
			elevation: 3,
		},
		content: {
			alignItems: "center",
			width: "100%",
			marginBottom: 12,
		},
		icon: {
			marginBottom: 10,
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

export default AddFirstExerciseCard;
