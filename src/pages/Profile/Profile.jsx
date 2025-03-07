import React, { useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	FlatList,
	Button,
	Modal,
	Pressable,
	ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../contexts/UserContext";
import { useWorkout } from "../../contexts/WorkoutContext";

export default function Profile({ navigation }) {
	const { themeStyle } = useTheme();
	const { username } = useUser();
	const { workoutHistory, clearWorkoutHistory } = useWorkout();
	const [selectedWorkout, setSelectedWorkout] = useState(null);
	const styles = createStyles(themeStyle);

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
				<Text style={styles.username}>{username}</Text>
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
				{/* <View style={{ flex: 1, marginLeft: 25 }}>
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
				</View> */}
			</View>


			<View style={styles.clearButtonContainer}>
				<Button
					title="Clear Workout History"
					onPress={clearWorkoutHistory}
					color="red"
				/>
			</View>

			{workoutHistory.length > 0 ? (
				<FlatList
					bounces={false}
					showsVerticalScrollIndicator={false}
					style={{ width: "100%", padding: 20 }}
					data={workoutHistory}
					renderItem={({ item }) => (
						<TouchableWithoutFeedback onPress={() => setSelectedWorkout(item)}>
							<View style={styles.workoutCard}>
								<Text style={styles.workoutTitle}>
									{item.name ? item.name : "Workout"}
								</Text>
								<Text style={styles.workoutTime}>{item.time}</Text>
								<Text style={styles.workoutNote}>{item.note || "No notes"}</Text>
								<Text style={styles.workoutTime}>{item.exercises.length} workouts</Text>
							</View>
						</TouchableWithoutFeedback>
					)}
					keyExtractor={(item) => item.id}
				/>
			) : (
				<Text style={styles.noWorkoutsText}>No workouts to display</Text>
			)}

			<Modal
				visible={!!selectedWorkout}
				animationType="fade"
				transparent={true}
			>
				<TouchableWithoutFeedback onPress={() => setSelectedWorkout(null)}>
				<View style={styles.modalOverlay}>
					<TouchableWithoutFeedback>
					<View style={styles.modalContainer}>
						<ScrollView style={styles.modalScrollView}>
							{selectedWorkout && (
								<View>
									<Text style={styles.workoutTitle}>{selectedWorkout.name}</Text>
									<Text>Time: {selectedWorkout.time}</Text>
									<Text>Note: {selectedWorkout.note || "No notes"}</Text>

									{/* Display exercises */}
									{selectedWorkout.exercises && selectedWorkout.exercises.length > 0 ? (
										<View>
											<Text style={styles.sectionTitle}>Exercises:</Text>
											{selectedWorkout.exercises.map((exercise, index) => (
												<View key={index} style={styles.exerciseItem}>
													<Text style={styles.exerciseName}>{exercise.name}</Text>
													
													{exercise.sets.map((set, setIndex) => (
														<View key={setIndex} style={styles.setItem}>
															<Text>Set {setIndex + 1}:</Text>
															<Text>{set.weight} lbs</Text>
															
															<Text><Text style={{fontStyle:'italic'}}>reps:</Text> {set.reps}</Text>
														</View>
													))}
												</View>
											))}
										</View>
									) : (
										<Text style={styles.noWorkoutsText}>No exercises recorded</Text>
									)}
								</View>
							)}
							{/* <Button title="Close" onPress={() => setSelectedWorkout(null)} /> */}
						</ScrollView>
						<View style={styles.closeButtonContainer}>
						<Pressable onPress={() => setSelectedWorkout(null)} style={styles.closeButton}>
							<Text style={styles.closeButtonText}>Close</Text>
						</Pressable>
						</View>
					</View>
					
					</TouchableWithoutFeedback>
				</View>
				</TouchableWithoutFeedback>
			</Modal>
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
		profileSection: {
			padding: 20,
			paddingBottom: 20,
			flexDirection: "row",
			alignItems: "center",
			marginTop: 20,
			paddingHorizontal: 25,
			width: "100%",
		},
		username: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		clearButtonContainer: {
			marginTop: 20,
		},
		workoutCard: {
			backgroundColor: themeStyle.card,
			padding: 20,
			borderRadius: 10,
			marginBottom: 20,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
		workoutTime: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginTop: 5,
		},
		workoutNote: {
			fontSize: 14,
			fontStyle: "italic",
			color: themeStyle.textColorSecondary,
			marginTop: 5,
		},
		modalOverlay: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "rgba(0, 0, 0, 0.5)",
		},
		modalContainer: {
			width: "80%",
			height: "70%",
			backgroundColor: "white",
			borderRadius: 10,
			padding: 20,

			justifyContent: "space-between"
		},
		modalScrollView: {
			flex: 1,
		},
		sectionTitle: {
			fontSize: 18,
			fontWeight: "bold",
			marginTop: 15,
			color: themeStyle.textColor,
		},
		exerciseItem: {
			backgroundColor: themeStyle.card,
			padding: 10,
			marginVertical: 5,
			borderRadius: 8,
		},
		exerciseName: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 5,
		},
		setItem: {
			backgroundColor: themeStyle.cardSecondary,
			padding: 8,
			marginVertical: 4,
			borderRadius: 6,
			flexDirection: "row",
			justifyContent: "space-evenly",
		},
		closeButtonContainer: {
			alignItems: "center",
			justifyContent: "center",
			paddingVertical: 15,
			borderTopWidth: 1,
			borderColor: "#ccc",
		},
		closeButton: {
			backgroundColor: "#B22222",
			paddingVertical: 12,
			paddingHorizontal: 40,
			borderRadius: 8,
		},
		closeButtonText: {
			color: "white",
			fontSize: 18,
			fontWeight: "bold",
		},
	});
