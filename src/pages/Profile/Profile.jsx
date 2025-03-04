import React, { useState, useCallback } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	FlatList,
	Button,
	Image,
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

			{workoutHistory.length > 0 ? (
				<FlatList
					bounces={false}
					showsVerticalScrollIndicator={false}
					style={{ width: "100%", padding: 20 }}
					data={workoutHistory}
					renderItem={({ item }) => (
						<TouchableWithoutFeedback>
							<View style={styles.workoutCard}>
								<Text style={styles.workoutTitle}>
									{item.name ? item.name : "Workout"}
								</Text>
								<Text style={styles.exerciseCount}>
									{item.exercises.length} {item.exercises.length > 1 ? "Exercises" : "Exercise"}
								</Text>
								<View style={styles.exerciseContainer}>
									{item.exercises.map((exercise, index) => (
										<Text key={index} style={styles.exerciseText}>
											{exercise.name} -{" "} 
											{exercise.sets.length > 0 ? (
												<Text style={styles.setText}>
													{exercise.sets.length} Sets
												</Text>
											) : (
												<Text style={styles.noSetText}>
													No Sets
												</Text>
											)}
										</Text>
									))}
								</View>
							</View>
						</TouchableWithoutFeedback>
					)}
					keyExtractor={(item) => item.id}
				/>
			) : (
				<Text style={styles.noWorkoutsText}>
					No workouts to display
				</Text>
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
			borderRadius: 10,
			marginBottom: 20,
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
