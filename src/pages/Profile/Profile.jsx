import React, { useState, useCallback } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	FlatList,
	Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../contexts/UserContext";
import storage from "../../utils/storage";


export default function Profile({ navigation }) {
	const { themeStyle } = useTheme();
	const { user, username } = useUser();
	const styles = createStyles(themeStyle);
	const [workouts, setWorkouts] = useState([]);

	// Fetch workouts from storage when the screen is focused
	useFocusEffect(
		useCallback(() => {
			const fetchWorkouts = () => {
				try {
					const storedWorkouts = storage.getString("workouts");
					const parsedWorkouts = storedWorkouts
						? JSON.parse(storedWorkouts)
						: [];
					setWorkouts(parsedWorkouts);
				} catch (error) {
					console.error("Error fetching workouts:", error);
				}
			};
			fetchWorkouts();
		}, [])
	);

	// Clear workout history
	const clearWorkoutHistory = () => {
		try {
			storage.delete("workouts");
			setWorkouts([]);
		} catch (error) {}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<TouchableWithoutFeedback
					onPress={() => navigation.navigate("Stats")}
				>
					<Ionicons
						name="stats-chart"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableWithoutFeedback>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "bold",
						color: themeStyle.textColor,
					}}
				>
					{username}
				</Text>
				<TouchableWithoutFeedback
					onPress={() => navigation.navigate("Settings")}
				>
					<Ionicons
						name="settings"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableWithoutFeedback>
			</View>

			<View style={styles.profileSection}>
				<View style={{ flex: 1, marginLeft: 25 }}>
					{/* <TouchableWithoutFeedback onPress={() => console.log("Change profile image")}>
					<Image source={{ uri: "http://www.gravatar.com/avatar/?d=mp" }} />
		</TouchableWithoutFeedback> */}
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
							color: themeStyle.textColor,
						}}
					>
						Followers: 1000
					</Text>
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
							color: themeStyle.textColor,
						}}
					>
						Following: 0
					</Text>
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
							color: themeStyle.textColor,
						}}
					>
						Posts: 50
					</Text>
				</View>
			</View>

			<Button
				title="Clear Workout History"
				onPress={clearWorkoutHistory}
				color="red"
			/>


			{workouts.length === 0 ? (
				<Text style={styles.noWorkoutsText}>
					No workouts logged yet.
				</Text>
			) : (
				<FlatList
					data={workouts}
					keyExtractor={(item, index) => index.toString()} // Use index as key if no unique ID
					renderItem={({ item }) => (
						<View style={styles.workoutCard}>
							<Text style={styles.workoutTitle}>
								Workout on{" "}
								{new Date(item.timestamp).toLocaleDateString()}
							</Text>
							<Text style={styles.exerciseCount}>
								{item.exercises.length} exercise/s
							</Text>

							{item.exercises.map((exercise, index) => (
								<View
									key={index}
									style={styles.exerciseContainer}
								>
									<Text style={styles.exerciseText}>
										{exercise.name}
									</Text>

									{Array.isArray(exercise.sets) &&
									exercise.sets.length > 0 ? (
										exercise.sets.map((set, setIndex) => (
											<Text
												key={setIndex}
												style={styles.setText}
											>
												Set {setIndex + 1}: {set.weight}{" "}
												lbs x {set.reps}
											</Text>
										))
									) : (
										<Text style={styles.noSetText}>
											No set data available
										</Text>
									)}
								</View>
							))}
						</View>
					)}
				/>
			)}
		</SafeAreaView>
	);
}

// Styles
const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			backgroundColor: themeStyle.backgroundColor,
		},
		topBar: {
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		profileSection: {
			padding: 20,
			paddingBottom: 20,
			flexDirection: "row",
			alignItems: "center",
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
		},
		noWorkoutsText: {
			fontSize: 16,
			color: themeStyle.textColorSecondary,
			textAlign: "center",
			marginTop: 20,
		},
		workoutCard: {
			backgroundColor: themeStyle.card,
			padding: 20,
			borderRadius: 20,
			marginBottom: 15,
			width: "90%",
			shadowOpacity: 0.1,
			elevation: 3,
		},
		workoutTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		exerciseCount: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginTop: 5,
		},
		exerciseContainer: {
			marginTop: 10,
			paddingLeft: 10,
		},
		exerciseText: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		setText: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginLeft: 15,
		},
		noSetText: {
			fontSize: 14,
			color: "#999",
			marginLeft: 15,
		},
	});
