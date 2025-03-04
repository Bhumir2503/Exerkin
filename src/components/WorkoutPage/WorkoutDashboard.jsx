import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { Ionicons } from "@expo/vector-icons";

const WorkoutDashboard = ({ onStartWorkout }) => {
	const { themeStyle } = useTheme();
	const { newWorkoutStarted } = useWorkout();
	const styles = createStyles(themeStyle);

	const buttonPress = () => {
		newWorkoutStarted();
		onStartWorkout();
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Get Started</Text>
			<Text style={styles.description}>Ready to start your workout?</Text>
			<StartWorkoutButton
				title="Start Workout"
				onPress={buttonPress}
			/>
		</View>
	);
};

const StartWorkoutButton = ({ title, onPress }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name="fitness-sharp" size={24} color={themeStyle.textColor} />
			<Text style={styles.buttonText}>{title}</Text>
		</TouchableOpacity>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			margin: 20,
			marginTop: 10,
		},
		title: {
			color: theme.textColor,
			fontSize: 32,
            fontWeight: "bold",
			marginBottom: 10,
		},
		description: {
			color: theme.textColor,
			fontSize: 18,
            marginBottom: 20,
		},
		button: {
			backgroundColor: theme.primary,
			padding: 10,
			borderRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
		},
		buttonText: {
			color: theme.textColor,
            fontSize: 18,
            fontWeight: "bold",
			textAlign: "center",
            marginLeft: 10,
		},
	});
};

export default WorkoutDashboard;
