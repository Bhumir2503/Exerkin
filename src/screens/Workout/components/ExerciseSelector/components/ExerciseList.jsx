import React, { useState, useEffect } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	Text,
	Modal,
	TouchableOpacity,
	ScrollView,
	FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../../contexts/ThemeContext";

function ExerciseList({
	filteredExercises,
	selectedExercise,
	setSelectedExercise,
	setCreatingExercise,
}) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	// Handle exercise selection AKA marks the exercise as selec

	return (
		<FlatList
			showsVerticalScrollIndicator={false}
			data={filteredExercises}
			keyExtractor={(item) => item.id}
			style={styles.exerciseList}
			renderItem={({ item }) => (
				<ExerciseItem
					item={item}
					selectedExercise={selectedExercise}
					setSelectedExercise={setSelectedExercise}
				/>
			)}
			ListEmptyComponent={
				<View style={{ padding: 20, alignItems: "center" }}>
					<Text
						style={{
							color: themeStyle.textColorSecondary,
							fontSize: 16,
							textAlign: "center",
							fontWeight: "500",
						}}
					>
						No exercises found. Create a new one or try a different
						search.
					</Text>

					<TouchableOpacity
						onPress={() => setCreatingExercise(true)}
						style={styles.createButton}
					>
						<Ionicons
							name="add-circle-outline"
							size={24}
							color={themeStyle.textColor}
						/>
						<Text style={styles.createText}>Create Custom</Text>
					</TouchableOpacity>
				</View>
			}
		/>
	);
}

function ExerciseItem({ item, selectedExercise, setSelectedExercise }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const handleSelectExercise = (exercise) => {
		setSelectedExercise(exercise);
	};

	return (
		<TouchableOpacity
			style={[
				styles.exerciseItem,
				selectedExercise?.id === item.id && styles.selectedExerciseItem,
			]}
			onPress={() => handleSelectExercise(item)}
		>
			<View style={styles.exerciseItemMain}>
				{/* Display if the item is checked or not */}
				<View style={styles.exerciseCheck}>
					{selectedExercise.id === item.id ? (
						<Ionicons
							name="checkmark-circle"
							size={24}
							color={themeStyle.primary}
						/>
					) : (
						<Ionicons
							name="ellipse-outline"
							size={24}
							color={themeStyle.textColorSecondary}
						/>
					)}
				</View>

				{/* Display the exercise information*/}
				<View style={styles.exerciseInfo}>
					{/* Show the exercise name */}
					<View style={styles.exerciseNameContainer}>
						<Text style={styles.exerciseName}>{item.name}</Text>
						{item.custom && (
							<Text style={styles.custom}>Custom</Text>
						)}
					</View>

					{/* Show the details of the exerice */}
					<View style={styles.exerciseDetails}>
						{/* Show which category the exercise belongs to */}
						<View style={styles.exerciseCategory}>
							<Text style={styles.categoryLabel}>
								{item.categoryId}
							</Text>
						</View>

						{/* Show what equipment the exercise uses */}
						<View style={styles.equipmentContainer}>
							{item.equipment.map((eq, index) => (
								<Text key={index} style={styles.equipmentLabel}>
									{eq}{" "}
									{index < item.equipment.length - 1
										? ", "
										: ""}
								</Text>
							))}
						</View>
					</View>

					<View style={styles.musclesContainer}>
						<Text style={styles.muscleLabel}>
							Primary: {item.primaryMuscles.join(", ")}
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		exerciseList: {
			flex: 1,
		},
		exerciseItem: {
			backgroundColor: themeStyle.card,
			borderRadius: 6,
			padding: 12,
			marginBottom: 8,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			borderWidth: 2,
			borderColor: themeStyle.card,
		},
		selectedExerciseItem: {
			borderColor: themeStyle.primary,
		},
		exerciseItemMain: {
			flex: 1,
			flexDirection: "row",
		},
		exerciseCheck: {
			marginRight: 8,
			justifyContent: "center",
		},
		exerciseInfo: {
			flex: 1,
		},
		exerciseName: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		exerciseDetails: {
			flexDirection: "row",
			marginBottom: 4,
			alignItems: "center",
		},
		exerciseCategory: {
			backgroundColor: themeStyle.accent,
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 4,
			marginRight: 8,
		},
		categoryLabel: {
			color: themeStyle.textColor,
			fontSize: 12,
			fontWeight: "500",
		},
		equipmentContainer: {
			flexDirection: "row",
			flexWrap: "wrap",
			flex: 1,
		},
		equipmentLabel: {
			color: themeStyle.textColorSecondary,
			fontSize: 12,
		},
		musclesContainer: {
			flexDirection: "row",
		},
		muscleLabel: {
			color: themeStyle.textColorSecondary,
			fontSize: 12,
		},
		difficultyContainer: {
			marginLeft: 8,
		},
		difficultyLabel: {
			fontSize: 12,
			fontWeight: "500",
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 4,
			overflow: "hidden",
			textAlign: "center",
		},
		beginnerLabel: {
			backgroundColor: "#4CAF50",
			color: "white",
		},
		intermediateLabel: {
			backgroundColor: "#FFC107",
			color: "black",
		},
		advancedLabel: {
			backgroundColor: "#F44336",
			color: "white",
		},
		scalableLabel: {
			backgroundColor: "#2196F3",
			color: "white",
		},
		createButton: {
			backgroundColor: themeStyle.primary,
			padding: 12,
			borderRadius: 6,
			marginTop: 26,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
		},
		createText: {
			color: themeStyle.textColor,
			fontSize: 16,
			textAlign: "center",
			fontWeight: "600",
			marginLeft: 8,
		},
		exerciseNameContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		custom: {
			fontSize: 12,
			color: themeStyle.textColorSecondary,
			marginLeft: 8,
			fontStyle: "italic",
		},
	});

export default ExerciseList;
