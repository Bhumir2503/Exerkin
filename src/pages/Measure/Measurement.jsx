import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";

export default function Measurement({ navigation }) {
	const { themeStyle } = useTheme();
	const { user } = useUser();
	const styles = createStyles(themeStyle);

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
			};

			setMeasurements(savedData);
		};

		loadSavedMeasurements();
	}, []);

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
		Alert.alert("Success", "Your measurements have been saved!", [
			{ text: "OK" },
		]);
	};

	// Generate measurement input fields
	const renderMeasurementInput = (label, key, unit, maxLength = 5) => {
		return (
			<View style={styles.inputRow}>
				<Text style={styles.inputLabel}>{label}</Text>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						value={measurements[key]}
						onChangeText={(text) => handleInputChange(key, text)}
						keyboardType="decimal-pad"
						maxLength={maxLength}
						placeholder="0"
						placeholderTextColor={themeStyle.textColorSecondary}
					/>
					<Text style={styles.unitText}>{unit}</Text>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
	
				<Text style={styles.headerTitle}>Body Measurements</Text>


			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Intro section */}
				<View style={styles.infoCard}>
					<View style={styles.infoIconContainer}>
						<Ionicons
							name="fitness-outline"
							size={24}
							color={themeStyle.primary}
						/>
					</View>
					<Text style={styles.infoText}>
						Track your body measurements to visualize your progress
						over time.
					</Text>
				</View>

				{/* Basic Measurements Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Basic Measurements</Text>

					{renderMeasurementInput("Weight", "weight", "lbs")}
					{renderMeasurementInput("Height", "height", "in")}
					{renderMeasurementInput(
						"Body Fat",
						"bodyFatPercentage",
						"%"
					)}
				</View>

				{/* Body Measurements Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Body Measurements</Text>

					{renderMeasurementInput("Chest", "chest", "in")}
					{renderMeasurementInput("Waist", "waist", "in")}
					{renderMeasurementInput("Hips", "hips", "in")}
					{renderMeasurementInput("Neck", "neckSize", "in")}
				</View>

				{/* Arm and Leg Measurements Card */}
				<View style={styles.card}>
					<Text style={styles.cardTitle}>Arm & Leg Measurements</Text>

					<View style={styles.doubleInputRow}>
						<View style={styles.halfInput}>
							{renderMeasurementInput(
								"Left Bicep",
								"bicepsLeft",
								"in"
							)}
						</View>
						<View style={styles.halfInput}>
							{renderMeasurementInput(
								"Right Bicep",
								"bicepsRight",
								"in"
							)}
						</View>
					</View>

					<View style={styles.doubleInputRow}>
						<View style={styles.halfInput}>
							{renderMeasurementInput(
								"Left Thigh",
								"thighLeft",
								"in"
							)}
						</View>
						<View style={styles.halfInput}>
							{renderMeasurementInput(
								"Right Thigh",
								"thighRight",
								"in"
							)}
						</View>
					</View>
				</View>

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
		</SafeAreaView>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			backgroundColor: themeStyle.backgroundColor,
		},
		backButton: {
			padding: 4,
		},
		headerTitle: {
			fontSize: 22,
			fontWeight: "bold",
			color: themeStyle.textColor,
			marginLeft: 12,
			textAlign: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
		},
		scrollContent: {
			paddingHorizontal: 16,
			paddingBottom: 30,
		},
		infoCard: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: `${themeStyle.primary}15`,
			borderRadius: 10,
			padding: 15,
			marginTop: 16,
			marginBottom: 16,
		},
		infoIconContainer: {
			marginRight: 12,
		},
		infoText: {
			flex: 1,
			fontSize: 14,
			color: themeStyle.textColor,
			lineHeight: 20,
		},
		card: {
			backgroundColor: themeStyle.card,
			borderRadius: 10,
			padding: 16,
			marginBottom: 16,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.1,
			shadowRadius: 3,
			elevation: 3,
		},
		cardTitle: {
			fontSize: 18,
			fontWeight: "600",
			color: themeStyle.primary,
			marginBottom: 16,
		},
		inputRow: {
			marginBottom: 16,
		},
		doubleInputRow: {
			flexDirection: "row",
			justifyContent: "space-between",
		},
		halfInput: {
			width: "48%",
		},
		inputLabel: {
			fontSize: 14,
			color: themeStyle.textColor,
			marginBottom: 8,
			fontWeight: "500",
		},
		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: themeStyle.inputBackground,
			borderRadius: 8,
			borderWidth: 1,
			borderColor: themeStyle.inputBorder,
			height: 50,
		},
		input: {
			flex: 1,
			height: 50,
			color: themeStyle.textColor,
			fontSize: 16,
			paddingHorizontal: 16,
		},
		unitText: {
			width: 40,
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			textAlign: "center",
		},
		saveButton: {
			backgroundColor: themeStyle.primary,
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 10,
			padding: 16,
			marginTop: 16,
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
			color: themeStyle.textColorSecondary,
			marginBottom: 20,
		},
	});
