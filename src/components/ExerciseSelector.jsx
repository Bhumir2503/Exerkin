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
import { useTheme } from "../contexts/ThemeContext";
import { useWorkoutExercises } from "../contexts/workout/WorkoutExercisesContext";
import { useBlueprintExercises } from "../contexts/blueprint/BlueprintExercisesContext";
import {
	exercises,
	exerciseCategories,
	getExercisesByCategory,
} from "../services/constants/exerciseLibrary";

import { buildExerciseObject } from "../services/helpers/objectBuilder";

const ExerciseSelector = ({ type }) => {
	const { themeStyle } = useTheme();
	const { workoutExercises, addExercise } = useWorkoutExercises();
	const { blueprintExercises, addExerciseToBlueprint } =
		useBlueprintExercises();

	const styles = createStyles(themeStyle);

	// Choose Modal Popup
	const [modalVisible, setModalVisible] = useState(false);
	// State for selected exercise
	const [selectedExercise, setSelectedExercise] = useState(null);
	// State for search query
	const [searchQuery, setSearchQuery] = useState("");
	// State for selected category
	const [selectedCategory, setSelectedCategory] = useState(null);
	// State for filtered exercises
	const [filteredExercises, setFilteredExercises] = useState(exercises);
	// Get array of already added exercise IDs

	const getAddedExerciseIds = () => {
		if (type === "workout") {
			return workoutExercises.map((exercise) => exercise.exerciseId);
		} else if (type === "blueprint") {
			return blueprintExercises.map((exercise) => exercise.exerciseId);
		}
		return [];
	};

	// Filter exercises based on search, category, and already added exercises
	useEffect(() => {
		let result = exercises;
		const addedExerciseIds = getAddedExerciseIds();

		// Remove already added exercises from the list
		result = result.filter(
			(exercise) => !addedExerciseIds.includes(exercise.id)
		);

		// Apply category filter
		if (selectedCategory) {
			result = getExercisesByCategory(selectedCategory).filter(
				(exercise) => !addedExerciseIds.includes(exercise.id)
			);
		}

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(exercise) =>
					exercise.name.toLowerCase().includes(query) ||
					exercise.categoryId.toLowerCase().includes(query) ||
					exercise.equipment.some((eq) =>
						eq.toLowerCase().includes(query)
					)
			);
		}

		setFilteredExercises(result);
	}, [searchQuery, selectedCategory, workoutExercises, blueprintExercises]);

	// Close modal and reset state
	const closeModal = () => {
		setSelectedExercise(null);
		setSearchQuery("");
		setSelectedCategory(null);
		setModalVisible(false);
	};

	// Handle exercise selection AKA marks the exercise as selec
	const handleSelectExercise = (exercise) => {
		setSelectedExercise(exercise);
	};

	const handleAddExercise = () => {
		if (selectedExercise) {
			if (type === "workout") {
				const exercise = buildExerciseObject(selectedExercise);
				addExercise(exercise);
			} else if (type === "blueprint") {
				const exercise = buildExerciseObject(selectedExercise);
				addExerciseToBlueprint(exercise);
			}
			closeModal();
		}
	};

	const renderCategoryChips = () => {
		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.categoryContainer}
				contentContainerStyle={styles.categoryContentContainer}
			>
				<TouchableOpacity
					style={[
						styles.categoryChip,
						!selectedCategory && styles.selectedCategoryChip,
					]}
					onPress={() => setSelectedCategory(null)}
				>
					<Text
						style={[
							styles.categoryText,
							!selectedCategory && styles.selectedCategoryText,
						]}
					>
						All
					</Text>
				</TouchableOpacity>

				{exerciseCategories.map((category) => (
					<TouchableOpacity
						key={category.id}
						style={[
							styles.categoryChip,
							selectedCategory === category.id &&
								styles.selectedCategoryChip,
						]}
						onPress={() => setSelectedCategory(category.id)}
					>
						<Text
							key={category.id}
							style={[
								selectedCategory === category.id
									? styles.selectedCategoryText
									: styles.categoryText,
							]}
						>
							{category.name}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		);
	};

	return (
		<>
			<TouchableOpacity
				onPress={() => setModalVisible(true)}
				style={styles.button}
			>
				<Ionicons name="add-circle-outline" size={24} color={"white"} />
				<Text style={styles.buttonText}>Add Exercise</Text>
			</TouchableOpacity>

			<Modal
				animationType="none"
				transparent={true}
				visible={modalVisible}
				onRequestClose={closeModal}
				statusBarTranslucent={true}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						{/* Header */}
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								Select Exercise
							</Text>
							<TouchableOpacity onPress={closeModal}>
								<Ionicons
									name="close"
									size={24}
									color={themeStyle.textColor}
								/>
							</TouchableOpacity>
						</View>

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
								placeholderTextColor={
									themeStyle.textColorSecondary
								}
								value={searchQuery}
								onChangeText={setSearchQuery}
							/>
							{searchQuery.length > 0 && (
								<TouchableOpacity
									onPress={() => setSearchQuery("")}
								>
									<Ionicons
										name="close-circle"
										size={20}
										color={themeStyle.textColor}
									/>
								</TouchableOpacity>
							)}
						</View>

						{/* Category filters */}
						{renderCategoryChips()}

						{/* Exercise list */}
						<FlatList
							showsVerticalScrollIndicator={false}
							data={filteredExercises}
							keyExtractor={(item) => item.id}
							style={styles.exerciseList}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={[
										styles.exerciseItem,
										selectedExercise?.id === item.id &&
											styles.selectedExerciseItem,
									]}
									onPress={() => handleSelectExercise(item)}
								>
									<View style={styles.exerciseItemMain}>
										<View style={styles.exerciseCheck}>
											{selectedExercise?.id ===
											item.id ? (
												<Ionicons
													name="checkmark-circle"
													size={24}
													color={themeStyle.primary}
												/>
											) : (
												<Ionicons
													name="ellipse-outline"
													size={24}
													color={
														themeStyle.textColorSecondary
													}
												/>
											)}
										</View>

										<View style={styles.exerciseInfo}>
											<Text style={styles.exerciseName}>
												{item.name}
											</Text>

											<View
												style={styles.exerciseDetails}
											>
												<View
													style={
														styles.exerciseCategory
													}
												>
													<Text
														style={
															styles.categoryLabel
														}
													>
														{item.categoryId}
													</Text>
												</View>

												<View
													style={
														styles.equipmentContainer
													}
												>
													{item.equipment.map(
														(eq, index) => (
															<Text
																key={index}
																style={
																	styles.equipmentLabel
																}
															>
																{eq}
																{index <
																item.equipment
																	.length -
																	1
																	? ", "
																	: ""}
															</Text>
														)
													)}
												</View>
											</View>

											<View
												style={styles.musclesContainer}
											>
												<Text
													style={styles.muscleLabel}
												>
													Primary:{" "}
													{item.primaryMuscles.join(
														", "
													)}
												</Text>
											</View>
										</View>
									</View>

									{/* <View style={styles.difficultyContainer}>
										<Text
											style={[
												styles.difficultyLabel,
												item.difficulty ===
													"beginner" &&
													styles.beginnerLabel,
												item.difficulty ===
													"intermediate" &&
													styles.intermediateLabel,
												item.difficulty ===
													"advanced" &&
													styles.advancedLabel,
												item.difficulty ===
													"scalable" &&
													styles.scalableLabel,
											]}
										>
											{item.difficulty}
										</Text>
									</View> */}
								</TouchableOpacity>
							)}
							ListEmptyComponent={
								<View style={styles.emptyContainer}>
									<Ionicons
										name="fitness-outline"
										size={48}
										color={themeStyle.textColorSecondary}
									/>
									<Text style={styles.emptyText}>
										No exercises found
									</Text>
								</View>
							}
						/>

						{/* Action buttons */}
						<View style={styles.actionContainer}>
							<TouchableOpacity
								style={[
									styles.actionButton,
									styles.cancelButton,
								]}
								onPress={closeModal}
							>
								<Text style={styles.cancelButtonText}>
									Cancel
								</Text>
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
								<Text style={styles.addButtonText}>
									Add to Workout
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		button: {
			margin: "auto",
			backgroundColor: themeStyle.primary,
			padding: 12,
			borderRadius: 8,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			marginVertical: 10,
			width: "90%",
		},
		buttonText: {
			color: "white",
			fontSize: 16,
			fontWeight: "bold",
			marginLeft: 8,
		},

		// Modal container
		modalContainer: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			justifyContent: "center",
			alignItems: "center",
		},
		modalContent: {
			width: "95%",
			height: "85%",
			backgroundColor: themeStyle.backgroundColor,
			borderRadius: 8,
			padding: 16,
			paddingBottom: 8,
		},
		modalHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 16,
		},
		modalTitle: {
			fontSize: 20,
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

		// Category filters
		categoryContainer: {
			marginBottom: 12,
			flexGrow: 0,
		},
		categoryContentContainer: {
			paddingHorizontal: 4,
		},
		categoryChip: {
			backgroundColor: themeStyle.card,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 10,
			marginRight: 8,
		},
		selectedCategoryChip: {
			backgroundColor: themeStyle.primary,
		},
		categoryText: {
			color: themeStyle.textColor,
			fontWeight: "500",
		},
		selectedCategoryText: {
			color: "white",
		},

		// Exercise list
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

		// Empty state
		emptyContainer: {
			alignItems: "center",
			justifyContent: "center",
			padding: 32,
		},
		emptyText: {
			color: themeStyle.textColorSecondary,
			marginTop: 8,
			fontSize: 16,
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
