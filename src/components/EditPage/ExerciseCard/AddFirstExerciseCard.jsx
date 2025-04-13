import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useWorkout } from "../../../contexts/WorkoutContext";

const AddFirstExerciseCard = () => {
	const { themeStyle } = useTheme();
	const { workoutExercises } = useWorkout();
	const styles = createStyles(themeStyle);

	const hasExercises = workoutExercises.length > 0;

	return (
		<View
			style={{
				...styles.container,
				display: hasExercises ? "none" : "flex",
			}}
		>
			<View style={styles.content}>
				<View style={styles.IconContainer}>
					<Ionicons
						name="barbell-outline"
						size={40}
						color={themeStyle.primary}
					/>
				</View>

				<Text style={styles.title}>Get Started With Your Workout</Text>
				<Text style={styles.description}>
					Click the button below to select your first exercise. You
					can add multiple sets for each exercise and track your
					progress.
				</Text>
			</View>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			margin: "auto",
			width: "90%",
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 16,
			marginVertical: 15,
			alignItems: "center",
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

export default AddFirstExerciseCard;
