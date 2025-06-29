import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
	Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { useMeasurement } from "../../contexts/MeasurementContext";

import HeightModal from "./HeightModal";

import ActiveWorkoutBar from "../Workout/components/ActiveWorkoutBar";

const MeasurementScreen = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const { user } = useUser();
	const styles = createStyles(themeStyle);
	const { handleMeasurementSubmit } = useMeasurement();

	// State for measurements
	const [measurements, setMeasurements] = useState({
		weight: "",
		height: "",
		chest: "",
		waist: "",
		hips: "",
		bicepsLeft: "",
		bicepsRight: "",
		thighLeft: "",
		thighRight: "",
		neckSize: "",
		bodyFatPercentage: "",
		age: "",
		shoulder: "",
		forearmLeft: "",
		forearmRight: "",
		calfLeft: "",
		calfRight: "",
	});

	// Modal for measurement help
	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState({
		title: "",
		description: "",
		image: null,
	});

	// Mock function to load saved measurements
	useEffect(() => {
		// In a real app, you would fetch this data from your database
		const loadSavedMeasurements = async () => {
			// Mock data - replace with actual data fetching in your app
			const savedData = {
				weight: "180",
				height: "70",
				chest: "42",
				waist: "34",
				hips: "38",
				bicepsLeft: "15",
				bicepsRight: "15.5",
				thighLeft: "24",
				thighRight: "24",
				neckSize: "16",
				bodyFatPercentage: "18",
				age: "32",
				shoulder: "48",
				forearmLeft: "11",
				forearmRight: "11.5",
				calfLeft: "16",
				calfRight: "16.5",
			};

			setMeasurements(savedData);
		};

		loadSavedMeasurements();
	}, []);

	// Calculate body fat percentage using Navy method
	useEffect(() => {
		if (
			measurements.neckSize &&
			measurements.waist &&
			measurements.height &&
			(measurements.hips || !isFemale())
		) {
			const bodyFat = calculateBodyFat();
			setMeasurements((prev) => ({
				...prev,
				bodyFatPercentage: bodyFat.toFixed(1),
			}));
		}
	}, [
		measurements.neckSize,
		measurements.waist,
		measurements.hips,
		measurements.height,
	]);

	// Helper function to determine if user is female
	const isFemale = () => {
		// This would be replaced with actual gender from user context
		return false;
	};

	// Navy method body fat calculation
	const calculateBodyFat = () => {
		// Convert measurements from string to number
		const neckCm = parseFloat(measurements.neckSize) * 2.54;
		const waistCm = parseFloat(measurements.waist) * 2.54;
		const heightCm = parseFloat(measurements.height) * 2.54;

		if (isFemale()) {
			// Female formula (requires hips)
			const hipsCm = parseFloat(measurements.hips) * 2.54;
			return (
				495 /
					(1.29579 -
						0.35004 * Math.log10(waistCm + hipsCm - neckCm) +
						0.221 * Math.log10(heightCm)) -
				450
			);
		} else {
			// Male formula
			return (
				495 /
					(1.0324 -
						0.19077 * Math.log10(waistCm - neckCm) +
						0.15456 * Math.log10(heightCm)) -
				450
			);
		}
	};

	const handleInputChange = (key, value) => {
		// Only allow numeric input and decimal point
		if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
			setMeasurements({
				...measurements,
				[key]: value,
			});
		}
	};

	const handleSave = () => {
		// In a real app, you would save this data to your database
		// For now, we'll just show an alert
		handleMeasurementSubmit()
	};

	// Show measurement guidance modal
	const showMeasurementHelp = (measurement) => {
		const helpContent = {
			neckSize: {
				title: "Neck Measurement",
				description:
					"Measure around the middle of your neck, below your Adam's apple, keeping the tape measure level.",
			},
			chest: {
				title: "Chest Measurement",
				description:
					"Measure around the chest at the widest part, typically at the nipple line, keeping the tape measure level.",
			},
			waist: {
				title: "Waist Measurement",
				description:
					"Measure around your natural waistline, located above your belly button and below your rib cage.",
			},
			hips: {
				title: "Hips Measurement",
				description:
					"Measure around the widest part of your hips/buttocks, keeping the tape measure level.",
			},
			shoulder: {
				title: "Shoulder Measurement",
				description:
					"Measure from the tip of one shoulder across to the tip of the other shoulder.",
			},
			bicep: {
				title: "Bicep Measurement",
				description:
					"Measure around the widest part of your bicep with your arm relaxed at your side.",
			},
			forearm: {
				title: "Forearm Measurement",
				description:
					"Measure around the widest part of your forearm with your arm relaxed.",
			},
			thigh: {
				title: "Thigh Measurement",
				description:
					"Measure around the widest part of your thigh, typically right below where your thigh meets your buttocks.",
			},
			calf: {
				title: "Calf Measurement",
				description:
					"Measure around the widest part of your calf with your leg relaxed.",
			},
		};

		let content = helpContent[measurement] || {
			title: "Measurement Help",
			description:
				"Take this measurement at the widest point, keeping the tape measure level.",
		};

		setModalContent(content);
		setModalVisible(true);
	};

	// Render a single measurement input field
	const renderMeasurementInput = (
		label,
		key,
		unit = "in",
		helpType = key
	) => {
		return (
			<View style={styles.measurementInputContainer}>
				<View style={styles.labelContainer}>
					<Text style={styles.label}>{label}</Text>
					<TouchableOpacity
						onPress={() => showMeasurementHelp(helpType)}
					>
						<Ionicons
							name="information-circle-outline"
							size={16}
							color={themeStyle.textColorSecondary}
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={measurements[key]}
						onChangeText={(text) => handleInputChange(key, text)}
						keyboardType="decimal-pad"
						maxLength={5}
						placeholder="0"
						placeholderTextColor={themeStyle.textColorSecondary}
					/>
					<Text style={styles.unitText}>{unit}</Text>
				</View>
			</View>
		);
	};

	const [showModal, setShowModal] = useState(false);

	return (
		<SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
			{showModal && (
				<HeightModal
					setShowModal={setShowModal}
					handleInputChange={handleInputChange}
				/>
			)}
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.topBar}>
					<Text style={styles.title}>Body Measurements</Text>
				</View>

				{/* Info card */}
				<View style={styles.infoCard}>
					<View style={styles.infoIconContainer}>
						<Ionicons
							name="fitness-outline"
							size={24}
							color={themeStyle.primary}
						/>
					</View>
					<Text style={styles.infoText}>
						Tracking your measurements helps visualize progress and
						keep you motivated.
					</Text>
				</View>

				{/* Basic stats */}
				<View style={styles.statsContainer}>
					<View style={styles.statInputContainer}>
						<Text style={styles.label}>Weight</Text>
						<View style={styles.statInputWrapper}>
							<TextInput
								style={styles.statInput}
								placeholder="0"
								placeholderTextColor={
									themeStyle.textColorSecondary
								}
								value={measurements.weight}
								onChangeText={(text) =>
									handleInputChange("weight", text)
								}
								keyboardType="decimal-pad"
								maxLength={5}
							/>
							<Text style={styles.statUnit}>lbs</Text>
						</View>
					</View>

					<View style={styles.statInputContainer}>
						<Text style={styles.label}>Height</Text>
						<View style={styles.statInputWrapper}>
							<TouchableOpacity
								style={[
									styles.statInput,
									{
										display: "flex",
										justifyContent: "flex-end",
										flexDirection: "row",
									},
								]}
								placeholderTextColor={
									themeStyle.textColorSecondary
								}
								onPress={() => {
									setShowModal(true);
								}}
							>
								<Text style={styles.statUnit}>
									{measurements.height}
								</Text>
								<Text style={styles.statUnit}>in</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.statInputContainer}>
						<Text style={styles.label}>Age</Text>
						<View style={styles.statInputWrapper}>
							<TextInput
								style={styles.statInput}
								placeholder="0"
								placeholderTextColor={
									themeStyle.textColorSecondary
								}
								value={measurements.age}
								onChangeText={(text) =>
									handleInputChange(
										"age",
										text.replace(/[^0-9]/g, "")
									)
								}
								keyboardType="numeric"
								maxLength={3}
							/>
							<Text style={styles.statUnit}>yrs</Text>
						</View>
					</View>
				</View>

				{/* Body fat calculator section */}
				<View style={styles.sectionTitle}>
					<Text style={styles.sectionTitleText}>
						Primary Measurements
					</Text>
					<Text style={styles.sectionSubtitle}>
						Required for body fat calculation
					</Text>
				</View>

				<View style={styles.measurementsRow}>
					{renderMeasurementInput(
						"Neck",
						"neckSize",
						"in",
						"neckSize"
					)}
					{renderMeasurementInput("Waist", "waist")}
				</View>

				<View style={styles.measurementsRow}>
					{renderMeasurementInput("Hips", "hips")}
					{renderMeasurementInput("Shoulder", "shoulder")}
				</View>

				{/* Auto-calculated body fat */}
				<View style={styles.bodyFatContainer}>
					<Text style={styles.bodyFatLabel}>Estimated Body Fat</Text>
					<View style={styles.bodyFatResult}>
						<Text style={styles.bodyFatValue}>
							{measurements.bodyFatPercentage
								? `${measurements.bodyFatPercentage}%`
								: "N/A"}
						</Text>
						<Text style={styles.bodyFatNote}>
							{measurements.bodyFatPercentage
								? "Calculated using Navy method"
								: "Enter neck, waist, and height to calculate"}
						</Text>
					</View>
				</View>

				{/* Upper body section */}
				<Text style={styles.sectionTitleText}>Upper Body</Text>
				<View style={styles.measurementsRow}>
					{renderMeasurementInput("Chest", "chest")}
					{renderMeasurementInput(
						"Left Bicep",
						"bicepsLeft",
						"in",
						"bicep"
					)}
				</View>

				<View style={styles.measurementsRow}>
					{renderMeasurementInput(
						"Right Bicep",
						"bicepsRight",
						"in",
						"bicep"
					)}
					{renderMeasurementInput(
						"Left Forearm",
						"forearmLeft",
						"in",
						"forearm"
					)}
				</View>

				<View style={styles.measurementsRow}>
					{renderMeasurementInput(
						"Right Forearm",
						"forearmRight",
						"in",
						"forearm"
					)}
					<View style={styles.emptyMeasurement} />
				</View>

				{/* Lower body section */}
				<Text style={styles.sectionTitleText}>Lower Body</Text>
				<View style={styles.measurementsRow}>
					{renderMeasurementInput(
						"Left Thigh",
						"thighLeft",
						"in",
						"thigh"
					)}
					{renderMeasurementInput(
						"Right Thigh",
						"thighRight",
						"in",
						"thigh"
					)}
				</View>

				<View style={styles.measurementsRow}>
					{renderMeasurementInput(
						"Left Calf",
						"calfLeft",
						"in",
						"calf"
					)}
					{renderMeasurementInput(
						"Right Calf",
						"calfRight",
						"in",
						"calf"
					)}
				</View>

				<Text style={styles.privacyNote}>
					Your measurements are private by default and only shared
					when you choose to
				</Text>

				{/* Save Button */}
				<TouchableOpacity
					style={styles.saveButton}
					onPress={handleSave}
				>
					<Ionicons
						name="save-outline"
						size={20}
						color="#FFFFFF"
						style={styles.saveIcon}
					/>
					<Text style={styles.saveButtonText}>Save Measurements</Text>
				</TouchableOpacity>

				{/* Last updated info */}
				<Text style={styles.lastUpdatedText}>
					Last updated: {new Date().toLocaleDateString()}
				</Text>
			</ScrollView>

			{/* Measurement help modal */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								{modalContent.title}
							</Text>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
							>
								<Ionicons
									name="close"
									size={24}
									color="#fffffe"
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.modalBody}>
							<Text style={styles.modalDescription}>
								{modalContent.description}
							</Text>
							{modalContent.image && (
								<View style={styles.modalImageContainer}>
									{/* Placeholder for measurement images if you have them */}
								</View>
							)}
						</View>
						<TouchableOpacity
							style={styles.modalButton}
							onPress={() => setModalVisible(false)}
						>
							<Text style={styles.modalButtonText}>Got it</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<ActiveWorkoutBar navigate={navigation.navigate} />
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			backgroundColor: themeStyle.backgroundColor || "#16161a",
		},
		header: {
			paddingHorizontal: 24,
			paddingTop: 16,
			paddingBottom: 8,
		},
		topBar: {
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
		},
		title: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor,

			textAlign: "center",
			marginLeft: 10,
			textAlign: "center",
		},
		subtitle: {
			fontSize: 16,
			color: themeStyle.textColorSecondary || "#94a1b2",
			lineHeight: 22,
		},
		scrollContent: {
			paddingHorizontal: 24,
			paddingBottom: 75,
		},
		infoCard: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: `${themeStyle.primary || "#7f2af0"}15`,
			borderRadius: 8,
			padding: 16,
			marginTop: 16,
			marginBottom: 24,
		},
		infoIconContainer: {
			marginRight: 12,
		},
		infoText: {
			flex: 1,
			fontSize: 14,
			color: themeStyle.textColor || "#fffffe",
			lineHeight: 20,
		},
		statsContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 24,
		},
		statInputContainer: {
			width: "30%",
		},
		statInputWrapper: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.inputBackground || "#1e1e24",
			borderRadius: 8,
			borderWidth: 1,
			borderColor: themeStyle.inputBorder || "#383844",
			height: 56,
			paddingHorizontal: 12,
		},
		statInput: {
			flex: 1,
			color: themeStyle.textColor || "#fffffe",
			fontSize: 16,
			textAlign: "center",
		},
		statUnit: {
			color: themeStyle.textColorSecondary || "#94a1b2",
			fontSize: 14,
			width: 30,
			textAlign: "center",
		},
		sectionTitle: {
			marginBottom: 16,
		},
		sectionTitleText: {
			fontSize: 18,
			fontWeight: "600",
			color: themeStyle.textColor || "#fffffe",
			marginBottom: 8,
			marginTop: 8,
		},
		sectionSubtitle: {
			fontSize: 14,
			color: themeStyle.textColorSecondary || "#94a1b2",
			marginBottom: 8,
		},
		measurementsRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 16,
		},
		measurementInputContainer: {
			width: "48%",
		},
		emptyMeasurement: {
			width: "48%",
		},
		labelContainer: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 8,
		},
		label: {
			fontSize: 14,
			fontWeight: "500",
			color: themeStyle.textColor || "#fffffe",
		},
		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.inputBackground || "#1e1e24",
			borderRadius: 8,
			borderWidth: 1,
			borderColor: themeStyle.inputBorder || "#383844",
			height: 56,
			paddingHorizontal: 12,
		},
		input: {
			flex: 1,
			height: 56,
			color: themeStyle.textColor || "#fffffe",
			fontSize: 16,
			textAlign: "center",
		},
		unitText: {
			color: themeStyle.textColorSecondary || "#94a1b2",
			fontSize: 14,
			width: 30,
			textAlign: "center",
		},
		bodyFatContainer: {
			backgroundColor: themeStyle.card || "#2d2d3a",
			borderRadius: 8,
			padding: 16,
			marginVertical: 24,
			borderLeftWidth: 4,
			borderLeftColor: themeStyle.primary || "#7f2af0",
		},
		bodyFatLabel: {
			fontSize: 16,
			fontWeight: "600",
			color: themeStyle.textColor || "#fffffe",
			marginBottom: 8,
		},
		bodyFatResult: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
		},
		bodyFatValue: {
			fontSize: 24,
			fontWeight: "bold",
			color: themeStyle.primary || "#7f2af0",
		},
		bodyFatNote: {
			fontSize: 12,
			color: themeStyle.textColorSecondary || "#94a1b2",
			flex: 1,
			marginLeft: 12,
			fontStyle: "italic",
		},
		privacyNote: {
			color: themeStyle.textColorSecondary || "#94a1b2",
			fontSize: 13,
			fontStyle: "italic",
			textAlign: "center",
			marginVertical: 24,
		},
		saveButton: {
			backgroundColor: themeStyle.primary || "#7f2af0",
			borderRadius: 8,
			height: 56,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 16,
		},
		saveIcon: {
			marginRight: 10,
		},
		saveButtonText: {
			color: "#FFFFFF",
			fontSize: 16,
			fontWeight: "600",
		},
		lastUpdatedText: {
			textAlign: "center",
			fontSize: 12,
			color: themeStyle.textColorSecondary || "#94a1b2",
			marginBottom: 20,
		},
		// Modal styles
		modalOverlay: {
			flex: 1,
			backgroundColor: "rgba(0, 0, 0, 0.7)",
			justifyContent: "center",
			alignItems: "center",
			padding: 24,
		},
		modalContent: {
			backgroundColor: themeStyle.inputBackground || "#1e1e24",
			borderRadius: 8,
			width: "100%",
			maxWidth: 500,
			padding: 24,
			borderWidth: 1,
			borderColor: themeStyle.inputBorder || "#383844",
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
			color: themeStyle.primary || "#7f2af0",
		},
		modalBody: {
			marginBottom: 24,
		},
		modalDescription: {
			fontSize: 16,
			color: themeStyle.textColor || "#fffffe",
			lineHeight: 24,
		},
		modalImageContainer: {
			marginTop: 16,
			alignItems: "center",
		},
		modalButton: {
			backgroundColor: themeStyle.primary || "#7f2af0",
			borderRadius: 6,
			height: 48,
			alignItems: "center",
			justifyContent: "center",
		},
		modalButtonText: {
			color: "#fffffe",
			fontSize: 16,
			fontWeight: "600",
		},
	});

export default MeasurementScreen;
