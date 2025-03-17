import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Pressable,
	Dimensions,
	FlatList,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useWorkout } from "../../contexts/WorkoutContext";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { DraggableGrid } from "react-native-draggable-grid";

const WorkoutDashboard = ({ onStartWorkout, setOnType }) => {
	const { themeStyle } = useTheme();
	const { newWorkoutStarted, workoutTemplate } = useWorkout();
	const styles = createStyles(themeStyle);

	const screenWidth = Dimensions.get("window").width;

	const [items, setItems] = useState([]);

	const buttonPress = () => {
		newWorkoutStarted();
		onStartWorkout();
	};

	useEffect(() => {
		if (workoutTemplate && workoutTemplate.length > 0) {
			const templateItems = workoutTemplate.map((template) => ({
				key: template.id,
				name: template.name,
				exercises: template.exercises,
				date: template.date,
			}));
			setItems(templateItems);
		}
	}, [workoutTemplate]);

	const renderTemplateItem = ({ item }) => (
		<View style={[styles.templateItem, { width: (screenWidth - 60) / 2 }]}>
			<Text style={styles.templateItemText}>{item.name}</Text>
			<Text style={styles.templateItemSubtext}>
				{item.exercises
					? `${item.exercises.length} exercises`
					: "0 exercises"}
			</Text>
		</View>
	);

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
							New
						</Text>
					</Pressable>
				</View>

				{items.length > 0 ? (
					<View style={styles.templatesContainer}>
						<FlatList
							data={items}
							renderItem={renderTemplateItem}
							keyExtractor={(item) => item.id}
							numColumns={2}
							scrollEnabled={false}
							contentContainerStyle={styles.templatesList}
						/>
					</View>
				) : (
					<View style={styles.emptyContainer}>
						<Text style={styles.emptyText}>
							No workout templates yet
						</Text>
						<Text style={styles.emptySubtext}>
							Create a new template to get started
						</Text>
					</View>
				)}
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
			borderColor: theme.primary,
		},
		templateItemText: {
			color: theme.textColor,
			fontSize: 18,
			fontWeight: "bold",
			marginBottom: 5,
			textAlign: "center",
		},
		templateItemSubtext: {
			color: theme.textColor,
			fontSize: 14,
			opacity: 0.7,
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
			color: theme.textColor,
			fontSize: 14,
			opacity: 0.7,
			marginTop: 5,
		},
	});
};

export default WorkoutDashboard;
