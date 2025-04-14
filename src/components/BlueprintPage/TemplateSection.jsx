import {
	Text,
	View,
	StyleSheet,
	Pressable,
	Modal,
	ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useTemplate } from "../../contexts/TemplateContext";
import { useState } from "react";

const TemplateSection = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const { storedTemplate, templateStarted } = useTemplate();
	const hasTemplates = storedTemplate.length > 0;
	const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

	const startTemplateButton = () => {
		templateStarted();
		navigation.navigate("TemplateModal");
	};

	const templatePressed = (template) => {
		setSelectedTemplate(template);
		console.log("Selected template: ", template);
		console.log("Exercises: ", template.exercises);
		setModalVisible(true);
	};

	const startWorkout = () => {
		// You can add navigation to workout screen here with the selected template
		// For example: navigation.navigate("WorkoutScreen", { template: selectedTemplate });
		setModalVisible(false);
	};

	if (!hasTemplates) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Blueprints</Text>

				<View style={styles.emptyStateCard}>
					<View style={styles.emptyStateIconContainer}>
						<Ionicons
							name="bookmark-outline"
							size={40}
							color={themeStyle.primary}
						/>
					</View>

					<Text style={styles.emptyStateTitle}>
						Add Your First Blueprint
					</Text>

					<Text style={styles.emptyStateDescription}>
						Create your first blueprint to streamline your workflow
					</Text>

					<Pressable
						style={styles.createButton}
						onPress={() => startTemplateButton()}
					>
						<Text style={styles.buttonText}>Create Blueprint</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Blueprints</Text>
				<Pressable
					style={styles.addButton}
					onPress={() => startTemplateButton()}
				>
					<Ionicons name="add" size={24} color={themeStyle.primary} />
				</Pressable>
			</View>

			<View style={styles.templatesContainer}>
				{storedTemplate.map((template) => (
					<Pressable
						key={template.templateId}
						style={styles.templateCard}
						onPress={() => templatePressed(template)}
					>
						<View style={styles.templateIconContainer}>
							<Ionicons
								name="bookmark"
								size={32}
								color={themeStyle.primary}
							/>
						</View>
						<View style={styles.templateInfo}>
							<Text style={styles.templateTitle}>
								{template.name}
							</Text>
							<Text
								style={styles.templateDescription}
								numberOfLines={2}
							>
								{template.note || "No description"}
							</Text>
						</View>
						<Ionicons
							name="chevron-forward"
							size={20}
							color={themeStyle.textColorSecondary}
						/>
					</Pressable>
				))}
			</View>
			{/* Template Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
				style={{ backgroundColor: "green" }}
			>
				<Pressable
					style={styles.modalOverlay}
					onPress={() => setModalVisible(false)}
				>
					<View style={styles.modalContainer}>
						{selectedTemplate && (
							<>
								<View style={styles.modalHeader}>
									<View style={styles.modalTitleContainer}>
										<Text style={styles.modalTitle}>
											{selectedTemplate.name}
										</Text>
									</View>

									<Pressable
										style={styles.closeButton}
										onPress={() => setModalVisible(false)}
									>
										<Ionicons
											name="close"
											size={24}
											color={
												themeStyle.textColorSecondary
											}
										/>
									</Pressable>
								</View>

								<ScrollView
									style={styles.modalBody}
									showsVerticalScrollIndicator={false}
								>
									<View style={styles.detailSection}>
										<View style={styles.sectionTitleRow}>
											<Ionicons
												name="information-circle-outline"
												size={20}
												color={themeStyle.primary}
											/>
											<Text style={styles.sectionTitle}>
												Note
											</Text>
										</View>
										<Text style={styles.modalDescription}>
											{selectedTemplate.note ||
												"No note available for this blueprint."}
										</Text>
									</View>

									<View style={styles.divider} />

									<View style={styles.detailSection}>
										<View style={styles.sectionTitleRow}>
											<Ionicons
												name="fitness-outline"
												size={20}
												color={themeStyle.primary}
											/>
											<Text style={styles.sectionTitle}>
												Exercises
											</Text>
										</View>

										{selectedTemplate.exercises &&
										selectedTemplate.exercises.length >
											0 ? (
											<View style={styles.exercisesList}>
												{selectedTemplate.exercises.map(
													(exercise, index) => {
														const getIcon = () => {
															switch (
																exercise.exerciseType
															) {
																case "bodyweight":
																	return (
																		<Ionicons
																			name="body-outline"
																			size={
																				18
																			}
																			color={
																				themeStyle.textColor
																			}
																		/>
																	);
																case "weightlifting":
																	return (
																		<Ionicons
																			name="barbell-outline"
																			size={
																				18
																			}
																			color={
																				themeStyle.textColor
																			}
																		/>
																	);
																case "assisted-weight":
																	return (
																		<Ionicons
																			name="hand-left-outline"
																			size={
																				18
																			}
																			color={
																				themeStyle.textColor
																			}
																		/>
																	);
																case "cardio-distance":
																	return (
																		<Ionicons
																			name="walk-outline"
																			size={
																				18
																			}
																			color={
																				themeStyle.textColor
																			}
																		/>
																	);
																case "cardio-time":
																	return (
																		<Ionicons
																			name="stopwatch-outline"
																			size={
																				18
																			}
																			color={
																				themeStyle.textColor
																			}
																		/>
																	);
																default:
																	return null;
															}
														};

														return (
															<View
																key={index}
																style={
																	styles.exerciseItem
																}
															>
																<View
																	style={
																		styles.exerciseIconContainer
																	}
																>
																	{getIcon()}
																</View>
																<View
																	style={
																		styles.exerciseDetails
																	}
																>
																	<Text
																		style={
																			styles.exerciseName
																		}
																	>
																		{
																			exercise.name
																		}
																	</Text>
																</View>
															</View>
														);
													}
												)}
											</View>
										) : (
											<View
												style={
													styles.emptyExercisesContainer
												}
											>
												<Ionicons
													name="alert-circle-outline"
													size={24}
													color={
														themeStyle.textColorSecondary
													}
												/>
												<Text
													style={styles.noExercises}
												>
													No exercises added to this
													blueprint
												</Text>
											</View>
										)}
									</View>
								</ScrollView>

								<View style={styles.modalFooter}>
									<Pressable
										style={[
											styles.modalButton,
											styles.cancelButton,
										]}
										onPress={() => setModalVisible(false)}
									>
										<Text style={styles.cancelButtonText}>
											Cancel
										</Text>
									</Pressable>

									<Pressable
										style={[
											styles.modalButton,
											styles.startButton,
										]}
										onPress={startWorkout}
									>
										<Ionicons
											name="play"
											size={16}
											color={"#fff"}
											style={styles.buttonIcon}
										/>
										<Text style={styles.startButtonText}>
											Start Workout
										</Text>
									</Pressable>
								</View>
							</>
						)}
					</View>
				</Pressable>
			</Modal>
		</View>
	);
};

const createStyles = (themeStyle) => {
	return StyleSheet.create({
		container: {
			marginVertical: 16,
		},
		title: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 16,
		},
		emptyStateCard: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 24,
			alignItems: "center",
		},
		emptyStateIconContainer: {
			backgroundColor: `${themeStyle.primary}20`, // 20% opacity of primary color
			borderRadius: 50,
			width: 70,
			height: 70,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 16,
		},
		emptyStateTitle: {
			fontSize: 18,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		emptyStateDescription: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			textAlign: "center",
			marginBottom: 20,
		},
		createButton: {
			backgroundColor: themeStyle.primary,
			paddingVertical: 12,
			paddingHorizontal: 24,
			borderRadius: 8,
		},
		buttonText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 16,
		},
		headerContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 16,
		},
		addButton: {
			padding: 8,
		},
		templatesContainer: {
			gap: 12,
		},
		templateCard: {
			backgroundColor: themeStyle.card,
			borderRadius: 8,
			padding: 16,
			flexDirection: "row",
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 4,
			elevation: 2,
		},
		templateIconContainer: {
			marginRight: 12,
		},
		templateInfo: {
			flex: 1,
		},
		templateTitle: {
			fontSize: 16,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginBottom: 4,
		},
		templateDescription: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
		},
		// Modal styles
		modalOverlay: {
			backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent background
			flex: 1,
			zIndex: 10,
			justifyContent: "flex-end", // Slide up from bottom
		},
		modalContainer: {
			zIndex: 100,
			backgroundColor: themeStyle.backgroundColor,
			borderTopLeftRadius: 8,
			borderTopRightRadius: 8,
			minHeight: "70%",
			maxHeight: "90%",
			paddingTop: 20,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: -4 },
			shadowOpacity: 0.1,
			shadowRadius: 10,
			elevation: 5,
		},
		modalHeader: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: 20,
			paddingBottom: 15,
		},
		modalTitleContainer: {
			flex: 1,
		},
		modalTitle: {
			fontSize: 20,
			fontWeight: "bold",
			color: themeStyle.textColor,
		},
		closeButton: {
			padding: 6,
		},
		modalBody: {
			paddingHorizontal: 20,
			maxHeight: "70%",
		},
		detailSection: {
			marginBottom: 16,
		},
		sectionTitleRow: {
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 10,
		},
		sectionTitle: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginLeft: 8,
		},
		modalDescription: {
			fontSize: 15,
			color: themeStyle.textColor,
			lineHeight: 22,
			paddingLeft: 28,
		},
		divider: {
			height: 1,
			backgroundColor: themeStyle.borderColor,
			marginVertical: 8,
		},
		exercisesList: {
			marginTop: 6,
			paddingLeft: 28,
		},
		exerciseItem: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
		},
		exerciseIconContainer: {
			width: 32,
			height: 32,
			borderRadius: 16,
			backgroundColor: themeStyle.inputBackground,
			justifyContent: "center",
			alignItems: "center",
			marginRight: 12,
		},
		exerciseDetails: {
			flex: 1,
		},
		exerciseName: {
			fontSize: 15,
			fontWeight: "500",
			color: themeStyle.textColor,
			marginBottom: 2,
		},
		exerciseMetrics: {
			fontSize: 13,
			color: themeStyle.textColorSecondary,
		},
		emptyExercisesContainer: {
			padding: 16,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: themeStyle.inputBackground,
			borderRadius: 8,
			marginTop: 8,
			marginLeft: 28,
		},
		noExercises: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			fontStyle: "italic",
			textAlign: "center",
			marginTop: 8,
		},
		modalFooter: {
			flexDirection: "row",
			justifyContent: "space-between",
			padding: 20,
			paddingTop: 16,
			borderTopWidth: 1,
			borderTopColor: themeStyle.borderColor,
		},
		modalButton: {
			paddingVertical: 14,
			paddingHorizontal: 20,
			borderRadius: 6,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			flex: 1,
		},
		buttonIcon: {
			marginRight: 8,
		},
		cancelButton: {
			backgroundColor: themeStyle.card,
			marginRight: 10,
		},
		startButton: {
			backgroundColor: themeStyle.primary,
			marginLeft: 10,
		},
		cancelButtonText: {
			color: themeStyle.textColor,
			fontWeight: "600",
			fontSize: 16,
		},
		startButtonText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 16,
		},
	});
};

export default TemplateSection;
