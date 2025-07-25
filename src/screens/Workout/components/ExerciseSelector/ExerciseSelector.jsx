import React, { useState, useEffect, useRef } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useWorkoutExercises } from "../../../../contexts/workout/WorkoutExercisesContext";
import { useBlueprintExercises } from "../../../../contexts/blueprint/BlueprintExercisesContext";
import {
	exercises,
	exerciseCategories,
	getExercisesByCategory,
} from "../../../../services/constants/exerciseLibrary";
import SelectionChips from "./components/SelectionChips";

import { buildExerciseObject } from "../../../../services/helpers/objectBuilder";
import ExerciseList from "./components/ExerciseList";

import { useCustomExercises } from "../../../../contexts/CustomExerciseContext";
import { useWorkoutMeta } from "../../../../contexts/workout/WorkoutMetaContext";

const ExerciseSelector = ({ type, setCreatingExercise, closeModal }) => {
	console.log("rerendered");
	const { themeStyle } = useTheme();
	const { workoutExercises, addExercise } = useWorkoutExercises();
	const { blueprintExercises, addExerciseToBlueprint } =
		useBlueprintExercises();

	const { isBlueprintRef, blueprintIdRef } = useWorkoutMeta();

	const styles = createStyles(themeStyle);

	const { customExercises } = useCustomExercises();

	// State for search query
	const [searchQuery, setSearchQuery] = useState("");
	// State for selected category
	const [selectedCategory, setSelectedCategory] = useState([]);
	// State for filtered exercises
	//const [filteredExercises, setFilteredExercises] = useState(exercises);
	filteredExercises = [];
	// Get array of already added exercise IDs

	// State for selected exercise
	const [selectedExercise, setSelectedExercise] = useState([null]);

	const getAddedExerciseIds = () => {
		if (type === "workout") {
			return workoutExercises.map((exercise) => exercise.exerciseId);
		} else if (type === "blueprint") {
			return blueprintExercises.map((exercise) => exercise.exerciseId);
		}
		return [];
	};

	// Filter exercises based on search, category, and already added exercises

	let result = [...exercises, ...customExercises];
	const addedExerciseIds = getAddedExerciseIds();

	// Remove already added exercises from the list
	result = result.filter(
		(exercise) => !addedExerciseIds.includes(exercise.id)
	);

	// Apply category filter
	if (selectedCategory.length > 0) {
		result = [
			...getExercisesByCategory(selectedCategory[0]).filter(
				(exercise) => !addedExerciseIds.includes(exercise.id)
			),
			...customExercises.filter(
				(exercise) =>
					!addedExerciseIds.includes(exercise.id) &&
					selectedCategory.includes(exercise.categoryId)
			),
		];
	}

	// Apply search filter
	if (searchQuery.trim()) {
		const query = searchQuery.toLowerCase();
		console.log(result[0].categoryId.toLowerCase());
		result = result.filter(
			(exercise) =>
				exercise.name.toLowerCase().includes(query) ||
				exercise.categoryId.toLowerCase().includes(query) ||
				exercise.equipment.some((eq) =>
					eq.toLowerCase().includes(query)
				)
		);
	}

	//setFilteredExercises(result);
	filteredExercises = result;

	const handleAddExercise = () => {
		if (selectedExercise) {
			if (type === "workout") {
				isBlueprintRef.current = false;
				blueprintIdRef.current = null;
				const exercise = buildExerciseObject(selectedExercise);
				console.log("exercise selector:", exercise);
				addExercise(exercise);
			} else if (type === "blueprint") {
				const exercise = buildExerciseObject(selectedExercise);
				addExerciseToBlueprint(exercise);
			}
			closeModal();
		}
	};

	return (
		<View style={styles.modalContent}>
			{/* Header */}
			<View style={styles.modalHeader}>
				<Text style={styles.modalTitle}>Select Exercise</Text>

				{/* Back button */}
				<TouchableOpacity onPress={closeModal}>
					<Ionicons
						name="close"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableOpacity>
			</View>

			{/* <View style={styles.modalCustomWorkout}>
				<TouchableOpacity
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
					onPress={() => setCreatingExercise(true)}
				>
					<Ionicons name="create-outline" size={24} color={"blue"} />
					<Text style={styles.customWorkoutTitle}>
						Create a custom exercise
					</Text>
				</TouchableOpacity>
			</View> */}

			{/* Search bar */}
			<View style={styles.searchContainer}>
				<Ionicons
					name="search"
					size={20}
					color={themeStyle.textColor}
				/>
				<TextInput
					style={styles.searchInput}
					placeholder="Search exercises..."
					placeholderTextColor={themeStyle.textColorSecondary}
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>

				{searchQuery.length > 0 && (
					<TouchableOpacity onPress={() => setSearchQuery("")}>
						<Ionicons
							name="close-circle"
							size={20}
							color={themeStyle.textColor}
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* Category filters */}
			<SelectionChips
				values={exerciseCategories}
				selectedHook={selectedCategory}
				setSelectedHook={setSelectedCategory}
			/>

			{/* List of exercises */}
			<ExerciseList
				filteredExercises={filteredExercises}
				selectedExercise={selectedExercise}
				setSelectedExercise={setSelectedExercise}
				setCreatingExercise={setCreatingExercise}
			/>

			{/* Action buttons */}
			<View style={styles.actionContainer}>
				<TouchableOpacity
					style={[styles.actionButton, styles.cancelButton]}
					onPress={closeModal}
				>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.actionButton,
						styles.addButton,
						!selectedExercise && styles.disabledButton,
					]}
					onPress={handleAddExercise}
					disabled={!selectedExercise}
				>
					<Text style={styles.addButtonText}>Add to Workout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		modalContent: {
			width: "95%",
			height: "85%",
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 8,
			padding: "3%",
			paddingBottom: 8,
			overflow: "hidden",
		},
		modalHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 16,
		},
		modalCustomWorkout: {
			flexDirection: "row",
			justifyContent: "left",
			alignItems: "center",
			marginBottom: 16,
		},
		modalTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		customWorkoutTitle: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},

		// Search
		searchContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.card,
			borderRadius: 6,
			paddingHorizontal: 12,
			marginBottom: 12,
		},
		searchInput: {
			flex: 1,
			height: 40,
			color: themeStyle.textColor,
			marginLeft: 8,
		},

		// Action buttons
		actionContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginTop: 12,
			paddingVertical: 8,
		},
		actionButton: {
			flex: 1,
			padding: 12,
			borderRadius: 6,
			alignItems: "center",
			justifyContent: "center",
		},
		cancelButton: {
			marginRight: 8,
			backgroundColor: themeStyle.card,
		},
		addButton: {
			backgroundColor: themeStyle.primary,
		},
		disabledButton: {
			opacity: 0.5,
		},
		cancelButtonText: {
			color: themeStyle.textColor,
			fontWeight: "600",
		},
		addButtonText: {
			color: "white",
			fontWeight: "600",
		},
	});

export default ExerciseSelector;
