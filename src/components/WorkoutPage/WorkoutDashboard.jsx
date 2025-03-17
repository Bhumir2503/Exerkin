import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Pressable,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { DraggableGrid } from "react-native-draggable-grid";

const WorkoutDashboard = ({ onStartWorkout, setOnType }) => {
	const { themeStyle } = useTheme();
	const { newWorkoutStarted } = useWorkout();
	const styles = createStyles(themeStyle);

	const buttonPress = () => {
		newWorkoutStarted();
		onStartWorkout();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Get Started</Text>
			<Text style={styles.description}>Ready to start your workout?</Text>
			<StartWorkoutButton title="Start Workout" onPress={buttonPress} />
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
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						marginTop: 20,
					}}
				>
					<Text style={styles.TemplateTitle}>Blueprints </Text>

					<Pressable
						onPress={() => {
							setOnType("template");
							onStartWorkout();
						}}
						style={{
							flexDirection: "row",
							alignItems: "center",
							padding: 5,
							paddingHorizontal: 15,
							backgroundColor: themeStyle.primary,
							borderRadius: 5,
						}}
					>
						<Text
							style={{
								color: themeStyle.textColor,
								fontSize: 16,
								fontWeight: "bold",
							}}
						>
							create
						</Text>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
};

const StartWorkoutButton = ({ title, onPress }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	return (
		<TouchableOpacity style={styles.button} onPress={onPress}>
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
		gridContainer: {
			marginTop: 20,
			padding: 10,
			borderRadius: 10,
		},
		gridItem: {
			width: 80,
			height: 80,
			backgroundColor: theme.primary,
			borderRadius: 8,
			justifyContent: "center",
			alignItems: "center",
			margin: 4,
		},
		gridItemText: {
			color: "#fff",
			fontSize: 20,
			fontWeight: "bold",
		},
	});
};

export default WorkoutDashboard;
