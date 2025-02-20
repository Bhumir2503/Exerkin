import React, { useState, useCallback } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	Image,
	FlatList,
	Button
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../contexts/UserContext";
import storage from "../../utils/storage";

export default function Profile({ navigation }) {
	const { themeStyle } = useTheme();
	const { user } = useUser();
	const styles = createStyles(themeStyle);
	const [workouts, setWorkouts] = useState([]);

	//fetches all workouts from storage
	useFocusEffect(
		useCallback(() => {
			const fetchWorkouts = () => {
				const storedWorkouts = storage.getString("workouts");
				const workouts = storedWorkouts ? JSON.parse(storedWorkouts) : [];
				setWorkouts(workouts);
			};
			fetchWorkouts();
		}, [])
	);

	const clearWorkoutHistory = () => {
		try{
			storage.delete("workouts");
			setWorkouts([]);
		}
		catch(error){
			console.log("Error clearing workout history: ", error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.topBar}>
				<TouchableWithoutFeedback onPress={() => navigation.navigate("Stats")}>
					<Ionicons name="stats-chart" size={24} color={themeStyle.textColor} />
				</TouchableWithoutFeedback>
				<Text style={{ fontSize: 24, fontWeight: "bold" }}>TestUser111</Text>
				<TouchableWithoutFeedback onPress={() => navigation.navigate("Settings")}>
					<Ionicons name="settings" size={24} color={themeStyle.textColor} />
				</TouchableWithoutFeedback>
			</View>

			<View style={styles.profileSection}>
				<TouchableWithoutFeedback onPress={() => console.log("Change profile image")}>
					<Image source={{ uri: "http://www.gravatar.com/avatar/?d=mp" }} style={styles.profileImage} />
				</TouchableWithoutFeedback>
				<View style={styles.profileStats}>
					<Text style={styles.statsText}>Follower: 1000</Text>
					<Text style={styles.statsText}>Following: 0</Text>
					<Text style={styles.statsText}>Post: 50</Text>
				</View>
			</View>

			<Text style={styles.sectionTitle}>Workout History</Text>
			<Button title="Clear Workout History" onPress={clearWorkoutHistory} color="red" />


			{workouts.length === 0 ? (
				<Text style={styles.noWorkoutsText}>No Workouts logged yet.</Text>
			) : (
				<FlatList
					data={workouts}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<View style={styles.workoutCard}>
							<Text style={styles.workoutTitle}>
								Workout on {new Date(item.timestamp).toLocaleDateString()}
							</Text>
							<Text style={styles.exerciseCount}>
								{item.exercises.length} exercise/s
							</Text>

							{item.exercises.map((exercise, index) => (
								<View key={index} style={styles.exerciseContainer}>
									<Text style={styles.exerciseText}>
										{exercise.name}
									</Text>

									{Array.isArray(exercise.sets) && exercise.sets.length > 0 ? (
										exercise.sets.map((set, setIndex) => (
											<Text key={setIndex} style={styles.setText}>
												Set {setIndex + 1}: {set.weight} lbs x {set.reps}
											</Text>
										))
									) : (
										<Text style={styles.noSetText}>No set data available</Text>
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
		sectionTitle: {
			fontSize: 22,
			fontWeight: "bold",
			marginTop: 20,
			marginBottom: 10,
			color: themeStyle.textColor,
		},
		noWorkoutsText: {
			fontSize: 16,
			color: "#777",
			textAlign: "center",
			marginTop: 10,
		},
		workoutCard: {
			backgroundColor: themeStyle.card,
			padding: 20,
			borderRadius: 20,
			marginBottom: 15,
			width: "100%",
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
		exerciseContainer: {
			marginTop: 10,
			paddingLeft: 10,
		},
		noSetText: {
			fontSize: 14,
			color: "#999",
			marginLeft: 15,
		},
	});


