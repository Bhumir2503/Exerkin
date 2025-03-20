import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { Ionicons } from "@expo/vector-icons";
import { useState} from "react";

import ActiveWorkoutBar from "./ActiveWorkoutBar";


const WorkoutDashboard = ({ onStartWorkout,}) => {
	const { themeStyle } = useTheme();
	const { workoutStarted , WorkoutId} = useWorkout();
	const styles = createStyles(themeStyle);

	const startButtonPressed = () => {
		workoutStarted();
		onStartWorkout();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Get Started</Text>
			<Text style={styles.description}>Ready to start your workout?</Text>
			<StartWorkoutButton
				title="Start Workout"
				onPress={startButtonPressed}
			/>
			<ScrollView
				bounces={false}
				showsVerticalScrollIndicator={false}
				style={{
					marginTop: 20,
					height: "100%",
					padding: 10,
					paddingHorizontal: 0,
				}}
			>
				<View
					style={{
						backgroundColor: themeStyle.card,
						padding: 10,
						borderRadius: 10,
					}}
				>
					<Text style={styles.DailyGoalTitle}>Daily Challenge</Text>
					<DailyGoal goalName="10km Run" />
					<DailyGoal goalName="100 Push-Ups" />
					<DailyGoal goalName="100 Sit-Ups" />
					<DailyGoal goalName="100 Squats" />
				</View>
			</ScrollView>

			{WorkoutId && <ActiveWorkoutBar onPress={onStartWorkout} />}
		</View>
	);
};

const StartWorkoutButton = ({ title, onPress }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<TouchableOpacity
			style={{
				...styles.button,
			}}
			onPress={onPress}
		>
			<Ionicons name="fitness-sharp" size={24} color={"#fff"} />
			<Text style={styles.buttonText}>{title}</Text>
		</TouchableOpacity>
	);
};

const DailyGoal = ({ goalName }) => {
	const [completed, setCompleted] = useState(false);
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<Ionicons
				style={{ marginBottom: 10 }}
				name={completed ? "checkbox" : "square"}
				size={24}
				color={completed ? themeStyle.primary : themeStyle.textColor}
				onPress={() => setCompleted(!completed)}
			/>
			<Text style={styles.DailyGoalText}>{goalName}</Text>
		</View>
	);
};

const createStyles = (theme) => {
	return StyleSheet.create({
		container: {
			flex: 1,
			margin: 20,
			marginTop: 10,
			marginBottom: 0,
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
			color: "#fff",
			fontSize: 18,
			fontWeight: "bold",
			textAlign: "center",
			marginLeft: 10,
		},
		DailyGoalTitle: {
			color: theme.textColor,
			fontSize: 18,
			fontWeight: "bold",
			marginBottom: 10,
		},
		DailyGoalText: {
			color: theme.textColor,
			fontSize: 16,
			marginBottom: 10,
			marginLeft: 10,
		},
		TemplateTitle: {
			color: theme.textColor,
			fontSize: 24,
			fontWeight: "bold",
			marginBottom: 10,
		},
		templatesContainer: {
			marginTop: 10,
			marginBottom: 20,
		},
		templatesList: {
			justifyContent: "space-between",
		},
		templateItem: {
			height: 120,
			backgroundColor: theme.card,
			borderRadius: 10,
			justifyContent: "center",
			alignItems: "center",
			margin: 5,
			padding: 10,
			borderWidth: 1,
			borderColor: theme.textColorSecondary,
		},
		templateItemText: {
			color: theme.textColor,
			fontSize: 18,
			fontWeight: "bold",
			marginBottom: 5,
			textAlign: "center",
		},
		templateItemSubtext: {
			color: theme.textColorSecondary,
			fontSize: 14,
		},
		emptyContainer: {
			backgroundColor: theme.card,
			borderRadius: 10,
			padding: 20,
			marginTop: 10,
			alignItems: "center",
			justifyContent: "center",
			height: 120,
		},
		emptyText: {
			color: theme.textColor,
			fontSize: 16,
			fontWeight: "bold",
		},
		emptySubtext: {
			color: theme.textColorSecondary,
			fontSize: 14,
			marginTop: 5,
		},
		activeWorkoutBarContainer: {
			position: "absolute",
			bottom: 10,
			left: 0,
			right: 0,
		},
	});
};

export default WorkoutDashboard;
