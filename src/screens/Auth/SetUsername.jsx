import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
	Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext";
import firestore from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";
import {
	saveUserProfile,
	isUsernameAvailable,
} from "../../services/firestore/firestoreUserServices";

import { addMeasurement } from "../../services/firestore/firestoreMeasurementServices";

import { useRealm } from "../../contexts/RealmProvider";
import { setRealmUser } from "../../services/database/realmUserFunctions";

import { Ionicons } from "@expo/vector-icons";

export default function SetUsername() {
	const {
		user,
		setUsername: setContextUsername,
		onSetupComplete,
	} = useUser();
	const realm = useRealm();
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	// Add gender and unit system
	const [gender, setGender] = useState("male"); // default to male
	const [unitSystem, setUnitSystem] = useState("imperial"); // default to imperial
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [step, setStep] = useState(1); // Step 1: Username, Step 2: Basic Info, Step 3: Measurements

	// New measurements
	const [measurements, setMeasurements] = useState({
		age: "",
		weight: "",
		height: "",
		chest: "",
		waist: "",
		hips: "",
		rightBicep: "",
		leftBicep: "",
		rightForearm: "",
		leftForearm: "",
		rightThigh: "",
		leftThigh: "",
		rightCalf: "",
		leftCalf: "",
		neck: "",
		shoulder: "",
		bodyFat: "", // Will be calculated
	});

	// Modal for measurement help
	const [modalVisible, setModalVisible] = useState(false);
	const [modalContent, setModalContent] = useState({
		title: "",
		description: "",
		image: null,
	});

	// Calculate body fat percentage using Navy method
	useEffect(() => {
		if (
			measurements.neck &&
			measurements.waist &&
			measurements.height &&
			(measurements.hips || !isFemale())
		) {
			const bodyFat = calculateBodyFat();
			setMeasurements((prev) => ({
				...prev,
				bodyFat: bodyFat.toFixed(1),
			}));
		}
	}, [
		measurements.neck,
		measurements.waist,
		measurements.hips,
		measurements.height,
	]);

	// Helper function to determine if user is female based on selected gender
	const isFemale = () => {
		return gender === "female";
	};

	// Navy method body fat calculation
	const calculateBodyFat = () => {
		// Convert measurements from string to number
		const neckCm = parseFloat(measurements.neck) * 2.54;
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

	// Check if username meets all requirements
	const isUsernameValid = () => {
		return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
	};

	// Show measurement guidance modal
	const showMeasurementHelp = (measurement) => {
		const helpContent = {
			neck: {
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

	// Update a specific measurement
	const handleMeasurementChange = (name, value) => {
		setMeasurements((prevState) => ({
			...prevState,
			[name]: value.replace(/[^0-9.]/g, ""),
		}));
	};

	const validateUsername = () => {
		if (!username.trim()) {
			setError("Username cannot be empty");
			return false;
		}

		if (username.length < 3) {
			setError("Username must be at least 3 characters");
			return false;
		}

		if (username.length > 20) {
			setError("Username must be no more than 20 characters");
			return false;
		}

		// Check for special characters except underscore and hyphen
		const specialCharsRegex = /[^a-zA-Z0-9_-]/;
		if (specialCharsRegex.test(username)) {
			setError(
				"Username can only contain letters, numbers, underscores, and hyphens"
			);
			return false;
		}

		// Combined regex to check the entire pattern in one go
		// Username should be 3-20 characters and contain only letters, numbers, underscores, and hyphens
		const fullRegex = /^[a-zA-Z0-9_-]{3,20}$/;
		if (!fullRegex.test(username)) {
			setError(
				"Username must be 3-20 characters and may only contain letters, numbers, underscores, and hyphens"
			);
			return false;
		}

		return true;
	};

	const handleNextStep = () => {
		if (step === 1) {
			if (validateUsername()) {
				setError("");
				setStep(2);
			}
		} else if (step === 2) {
			setStep(3);
		}
	};

	const handlePrevStep = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const handleSubmit = async () => {
		if (!validateUsername()) {
			setStep(1);
			return;
		}

		setLoading(true);
		setError("");

		try {
			// Even if there's a permissions error with Firestore, we'll at least save locally
			// and let the user proceed with the app
			try {
				// Try to check if username is taken
				const usernameCheck = await isUsernameAvailable(username);

				if (!usernameCheck) {
					setError("Username is already taken");
					setLoading(false);
					setStep(1);
					return;
				}

				// data structure for user profile
				const userData = {
					username: username,
					email: user.email || "",
					userId: user.uid,
					createdAt: new Date(),
					updatedAt: new Date(),
					bio: bio || "",
					unitSystem: unitSystem,
					gender: gender,
				};

				// Save the user profile to Realm
				await setRealmUser(realm, userData);
				// Save the user profile to Firestore
				await saveUserProfile(user.uid, userData);
			} catch (firestoreError) {
				console.log("Error saving user profile:", firestoreError);
				setError("Failed to save username. Please try again.");
				setLoading(false);
				setStep(1);
				return;
			}

			console.log("User setup complete!");
			// Save the username to local cache

			// Update the context
			setContextUsername(username);

			// Complete setup
			onSetupComplete();
		} catch (error) {
			console.log("Error saving user data:", error);
			setError("Failed to save username. Please try again.");
			setLoading(false);
			setStep(1);
		}
	};

	// Render a single measurement input field
	const renderMeasurementInput = (label, name, helpType = name) => {
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
							color="#94a1b2"
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.statInputWrapper}>
					<TextInput
						style={styles.statInput}
						placeholder="0"
						placeholderTextColor="#72757e"
						value={measurements[name]}
						onChangeText={(text) =>
							handleMeasurementChange(name, text)
						}
						keyboardType="numeric"
						maxLength={5}
					/>
					<Text style={styles.statUnit}>
						{unitSystem === "imperial" ? "in" : "cm"}
					</Text>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#16161a" />
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.contentContainer}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.header}>
						<Text style={styles.title}>
							{step === 1
								? "Create Your Profile"
								: step === 2
								? "Basic Information"
								: "Body Measurements"}
						</Text>
						<Text style={styles.subtitle}>
							{step === 1
								? "Choose a unique username to get started"
								: step === 2
								? "Tell us a bit more about yourself"
								: "Track your fitness progress with body measurements"}
						</Text>
					</View>

					{/* Progress indicator */}
					<View style={styles.progressContainer}>
						<View style={styles.progressStep}>
							<View
								style={[styles.progressDot, styles.activeStep]}
							/>
							<Text
								style={[
									styles.progressText,
									styles.activeStepText,
								]}
							>
								Username
							</Text>
						</View>
						<View style={styles.progressLine} />
						<View style={styles.progressStep}>
							<View
								style={[
									styles.progressDot,
									step >= 2 && styles.activeStep,
								]}
							/>
							<Text
								style={[
									styles.progressText,
									step >= 2 && styles.activeStepText,
								]}
							>
								Basic Info
							</Text>
						</View>
						<View style={styles.progressLine} />
						<View style={styles.progressStep}>
							<View
								style={[
									styles.progressDot,
									step >= 3 && styles.activeStep,
								]}
							/>
							<Text
								style={[
									styles.progressText,
									step >= 3 && styles.activeStepText,
								]}
							>
								Advance Info
							</Text>
						</View>
					</View>

					{step === 1 ? (
						// Step 1: Username with visual validation indicators
						<View style={styles.formContainer}>
							<View style={styles.inputContainer}>
								<Text style={styles.label}>Username</Text>
								<View
									style={[
										styles.inputWrapper,
										error ? styles.inputError : null,
									]}
								>
									<Ionicons
										name="at"
										size={20}
										color="#94a1b2"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Enter your username"
										placeholderTextColor="#72757e"
										value={username}
										onChangeText={(text) => {
											setUsername(text.trim());
											setError("");
										}}
										autoCapitalize="none"
										autoCorrect={false}
										maxLength={20}
										returnKeyType="next"
										onSubmitEditing={() => {
											if (isUsernameValid()) {
												handleNextStep();
											}
										}}
									/>
								</View>
								{error ? (
									<Text style={styles.errorText}>
										{error}
									</Text>
								) : null}

								<Text style={styles.helperText}>
									This will be your public identity on Exerkin
								</Text>

								{/* Username validation rules with indicators */}
								<View style={styles.validationRulesContainer}>
									<Text style={styles.validationTitle}>
										Username requirements:
									</Text>

									<View style={styles.validationRule}>
										<Ionicons
											name={
												username.length >= 3
													? "checkmark-circle"
													: "ellipse-outline"
											}
											size={16}
											color={
												username.length >= 3
													? "#4CAF50"
													: "#94a1b2"
											}
										/>
										<Text
											style={[
												styles.validationText,
												username.length >= 3 &&
													styles.validationTextSuccess,
											]}
										>
											At least 3 characters long
										</Text>
									</View>

									<View style={styles.validationRule}>
										<Ionicons
											name={
												username.length <= 20
													? "checkmark-circle"
													: "ellipse-outline"
											}
											size={16}
											color={
												username.length <= 20
													? "#4CAF50"
													: "#94a1b2"
											}
										/>
										<Text
											style={[
												styles.validationText,
												username.length <= 20 &&
													styles.validationTextSuccess,
											]}
										>
											Maximum 20 characters
										</Text>
									</View>

									<View style={styles.validationRule}>
										<Ionicons
											name={
												!/[^a-zA-Z0-9_-]/.test(username)
													? "checkmark-circle"
													: "ellipse-outline"
											}
											size={16}
											color={
												!/[^a-zA-Z0-9_-]/.test(username)
													? "#4CAF50"
													: "#94a1b2"
											}
										/>
										<Text
											style={[
												styles.validationText,
												!/[^a-zA-Z0-9_-]/.test(
													username
												) &&
													styles.validationTextSuccess,
											]}
										>
											Only letters, numbers, underscores,
											and hyphens
										</Text>
									</View>

									<View style={styles.validationRule}>
										<Ionicons
											name={
												/^[a-zA-Z0-9_-]{3,20}$/.test(
													username
												)
													? "checkmark-circle"
													: "ellipse-outline"
											}
											size={18}
											color={
												/^[a-zA-Z0-9_-]{3,20}$/.test(
													username
												)
													? "#4CAF50"
													: "#94a1b2"
											}
										/>
										<Text
											style={[
												styles.validationText,
												/^[a-zA-Z0-9_-]{3,20}$/.test(
													username
												) &&
													styles.validationTextSuccess,
												{ fontWeight: "600" },
											]}
										>
											All requirements met
										</Text>
									</View>
								</View>
							</View>

							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={[
										styles.button,
										!isUsernameValid() &&
											styles.buttonDisabled,
									]}
									onPress={handleNextStep}
									disabled={!isUsernameValid()}
								>
									<Text style={styles.buttonText}>
										Continue
									</Text>
									<Ionicons
										name="arrow-forward"
										size={20}
										color="#fffffe"
									/>
								</TouchableOpacity>
							</View>
						</View>
					) : step === 2 ? (
						// Step 2: Basic Info
						<View style={styles.formContainer}>
							<View style={styles.inputContainer}>
								<Text style={styles.label}>Bio</Text>
								<View style={styles.inputWrapper}>
									<TextInput
										style={[
											styles.input,
											styles.multilineInput,
										]}
										placeholder="Tell others about yourself..."
										placeholderTextColor="#72757e"
										value={bio}
										onChangeText={setBio}
										multiline
										maxLength={512}
									/>
								</View>
								<Text style={styles.helperText}>
									Share a bit about yourself, your fitness
									goals, or what motivates you
								</Text>
							</View>

							<Text style={styles.sectionTitleText}>
								Basic Information
							</Text>

							{/* Gender Selection */}

							<Text style={styles.label}>Gender</Text>
							<View
								style={{
									...styles.radioContainer,
									marginBottom: 16,
								}}
							>
								<TouchableOpacity
									style={[
										styles.radioButton,
										gender === "male" &&
											styles.radioButtonSelected,
									]}
									onPress={() => setGender("male")}
								>
									<Text
										style={[
											styles.radioText,
											gender === "male" &&
												styles.radioTextSelected,
										]}
									>
										Male
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.radioButton,
										gender === "female" &&
											styles.radioButtonSelected,
									]}
									onPress={() => setGender("female")}
								>
									<Text
										style={[
											styles.radioText,
											gender === "female" &&
												styles.radioTextSelected,
										]}
									>
										Female
									</Text>
								</TouchableOpacity>
							</View>

							{/* Unit System Selection */}
							<View style={styles.unitSystemContainer}>
								<Text style={styles.label}>Unit System</Text>
								<View style={styles.radioContainer}>
									<TouchableOpacity
										style={[
											styles.radioButton,
											unitSystem === "imperial" &&
												styles.radioButtonSelected,
										]}
										onPress={() =>
											setUnitSystem("imperial")
										}
									>
										<Text
											style={[
												styles.radioText,
												unitSystem === "imperial" &&
													styles.radioTextSelected,
											]}
										>
											Imperial (in/lbs)
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.radioButton,
											unitSystem === "metric" &&
												styles.radioButtonSelected,
										]}
										onPress={() => setUnitSystem("metric")}
									>
										<Text
											style={[
												styles.radioText,
												unitSystem === "metric" &&
													styles.radioTextSelected,
											]}
										>
											Metric (cm/kg)
										</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.backButton}
									onPress={handlePrevStep}
								>
									<Ionicons
										name="arrow-back"
										size={20}
										color="#7f2af0"
									/>
									<Text style={styles.backButtonText}>
										Back
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.button}
									onPress={handleNextStep}
								>
									<Text style={styles.buttonText}>
										Continue
									</Text>
									<Ionicons
										name="arrow-forward"
										size={20}
										color="#fffffe"
									/>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						// Step 3: Measurements
						<View style={styles.formContainer}>
							<Text style={styles.measurementHeader}>
								Body Measurements
							</Text>
							<Text style={styles.measurementSubtitle}>
								All measurements are optional. These will help
								track your fitness progress.
							</Text>

							<View style={styles.statsContainer}>
								<View style={styles.statInputContainer}>
									<Text style={styles.label}>Weight</Text>
									<View style={styles.statInputWrapper}>
										<TextInput
											style={styles.statInput}
											placeholder="0"
											placeholderTextColor="#72757e"
											value={measurements.weight}
											onChangeText={(text) =>
												handleMeasurementChange(
													"weight",
													text.replace(/[^0-9.]/g, "")
												)
											}
											keyboardType="numeric"
											maxLength={5}
										/>
										<Text style={styles.statUnit}>
											{unitSystem === "imperial"
												? "lbs"
												: "kg"}
										</Text>
									</View>
								</View>

								<View style={styles.statInputContainer}>
									<Text style={styles.label}>Height</Text>
									<View style={styles.statInputWrapper}>
										<TextInput
											style={styles.statInput}
											placeholder="0"
											placeholderTextColor="#72757e"
											value={measurements.height}
											onChangeText={(text) =>
												handleMeasurementChange(
													"height",
													text.replace(/[^0-9.]/g, "")
												)
											}
											keyboardType="numeric"
											maxLength={5}
										/>
										<Text style={styles.statUnit}>
											{unitSystem === "imperial"
												? "in"
												: "cm"}
										</Text>
									</View>
								</View>

								<View style={styles.statInputContainer}>
									<Text style={styles.label}>Age</Text>
									<View style={styles.statInputWrapper}>
										<TextInput
											style={styles.statInput}
											placeholder="0"
											placeholderTextColor="#72757e"
											value={measurements.age}
											onChangeText={(text) =>
												handleMeasurementChange(
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

							{/* Primary measurements used for body fat calculation */}
							<View style={styles.sectionTitle}>
								<Text style={styles.sectionTitleText}>
									Primary Measurements
								</Text>
								<Text style={styles.sectionSubtitle}>
									Required for body fat calculation
								</Text>
							</View>

							<View style={styles.measurementsRow}>
								{renderMeasurementInput("Neck", "neck")}
								{renderMeasurementInput("Waist", "waist")}
							</View>

							<View style={styles.measurementsRow}>
								{renderMeasurementInput("Hips", "hips")}
								{renderMeasurementInput("Shoulder", "shoulder")}
							</View>

							{/* Auto-calculated body fat */}
							<View style={styles.bodyFatContainer}>
								<Text style={styles.bodyFatLabel}>
									Estimated Body Fat
								</Text>
								<View style={styles.bodyFatResult}>
									<Text style={styles.bodyFatValue}>
										{measurements.bodyFat
											? `${measurements.bodyFat}%`
											: "N/A"}
									</Text>
									<Text style={styles.bodyFatNote}>
										{measurements.bodyFat
											? "Calculated using Navy method"
											: "Enter neck, waist, and height to calculate"}
									</Text>
								</View>
							</View>

							<Text style={styles.sectionTitleText}>
								Upper Body
							</Text>
							<View style={styles.measurementsRow}>
								{renderMeasurementInput("Chest", "chest")}
								{renderMeasurementInput(
									"Left Bicep",
									"leftBicep",
									"bicep"
								)}
							</View>

							<View style={styles.measurementsRow}>
								{renderMeasurementInput(
									"Right Bicep",
									"rightBicep",
									"bicep"
								)}
								{renderMeasurementInput(
									"Left Forearm",
									"leftForearm",
									"forearm"
								)}
							</View>

							<View style={styles.measurementsRow}>
								{renderMeasurementInput(
									"Right Forearm",
									"rightForearm",
									"forearm"
								)}
								<View style={styles.emptyMeasurement} />
							</View>

							<Text style={styles.sectionTitleText}>
								Lower Body
							</Text>
							<View style={styles.measurementsRow}>
								{renderMeasurementInput(
									"Left Thigh",
									"leftThigh",
									"thigh"
								)}
								{renderMeasurementInput(
									"Right Thigh",
									"rightThigh",
									"thigh"
								)}
							</View>

							<View style={styles.measurementsRow}>
								{renderMeasurementInput(
									"Left Calf",
									"leftCalf",
									"calf"
								)}
								{renderMeasurementInput(
									"Right Calf",
									"rightCalf",
									"calf"
								)}
							</View>

							<Text style={styles.privacyNote}>
								Your measurements are private by default and
								only shared when you choose to
							</Text>

							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.backButton}
									onPress={handlePrevStep}
								>
									<Ionicons
										name="arrow-back"
										size={20}
										color="#7f2af0"
									/>
									<Text style={styles.backButtonText}>
										Back
									</Text>
								</TouchableOpacity>

								<TouchableOpacity
									style={styles.button}
									onPress={handleSubmit}
									disabled={loading}
								>
									{loading ? (
										<ActivityIndicator
											color="#fffffe"
											size="small"
										/>
									) : (
										<>
											<Text style={styles.buttonText}>
												Finish Setup
											</Text>
											<Ionicons
												name="checkmark"
												size={20}
												color="#fffffe"
											/>
										</>
									)}
								</TouchableOpacity>
							</View>
						</View>
					)}
				</ScrollView>
			</KeyboardAvoidingView>

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
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#16161a", // midnightPurple.backgroundColor
	},
	contentContainer: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
		padding: 24,
	},
	header: {
		marginBottom: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#7f2af0", // midnightPurple.primary
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#94a1b2", // midnightPurple.textColorSecondary
		lineHeight: 22,
	},
	progressContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 32,
		paddingHorizontal: 20,
	},
	progressStep: {
		alignItems: "center",
		width: 80,
	},
	progressDot: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "#2d2d3a", // midnightPurple.card
		borderWidth: 2,
		borderColor: "#383844", // midnightPurple.inputBorder
		marginBottom: 8,
	},
	activeStep: {
		backgroundColor: "#7f2af0", // midnightPurple.primary
		borderColor: "#7f2af0",
	},
	progressLine: {
		flex: 1,
		height: 2,
		backgroundColor: "#383844", // midnightPurple.inputBorder
		marginHorizontal: 8,
	},
	progressText: {
		fontSize: 12,
		color: "#94a1b2", // midnightPurple.textColorSecondary
	},
	activeStepText: {
		color: "#fffffe", // midnightPurple.textColor
		fontWeight: "500",
	},
	formContainer: {
		flex: 1,
	},
	inputContainer: {
		marginBottom: 24,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1e1e24", // midnightPurple.inputBackground
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#383844", // midnightPurple.inputBorder
		paddingHorizontal: 16,
		height: 56,
	},
	inputError: {
		borderColor: "#F87060", // midnightPurple.error
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		color: "#fffffe", // midnightPurple.textColor
		fontSize: 16,
	},
	multilineInput: {
		padding: 8,
		height: 35,
		textAlignVertical: "top",
	},
	errorText: {
		color: "#F87060", // midnightPurple.error
		fontSize: 14,
		marginTop: 8,
	},
	helperText: {
		color: "#94a1b2", // midnightPurple.textColorSecondary
		fontSize: 14,
		marginTop: 8,
	},
	sectionTitle: {
		marginBottom: 16,
	},
	sectionTitleText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#fffffe", // midnightPurple.textColor
		marginBottom: 8,
		marginTop: 16,
	},
	sectionSubtitle: {
		fontSize: 14,
		color: "#94a1b2",
		marginBottom: 8,
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
		backgroundColor: "#1e1e24", // midnightPurple.inputBackground
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#383844", // midnightPurple.inputBorder
		height: 56,
		paddingLeft: 16,
	},
	statInput: {
		flex: 1,
		color: "#fffffe", // midnightPurple.textColor
		fontSize: 16,
		textAlign: "center",
	},
	statUnit: {
		color: "#94a1b2", // midnightPurple.textColorSecondary
		fontSize: 16,
		paddingRight: 16,
		width: 40,
		textAlign: "center",
	},
	privacyNote: {
		color: "#94a1b2", // midnightPurple.textColorSecondary
		fontSize: 13,
		fontStyle: "italic",
		textAlign: "center",
		marginVertical: 24,
	},
	label: {
		fontSize: 14,
		fontWeight: "500",
		color: "#fffffe", // midnightPurple.textColor
		marginBottom: 8,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
	},
	button: {
		backgroundColor: "#7f2af0", // midnightPurple.primary
		borderRadius: 8,
		height: 56,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		paddingHorizontal: 24,
		flex: 1,
	},
	buttonDisabled: {
		backgroundColor: "rgba(127, 42, 240, 0.5)",
	},
	backButton: {
		backgroundColor: "transparent",
		borderWidth: 1,
		borderColor: "#7f2af0", // midnightPurple.primary
		borderRadius: 8,
		height: 56,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		paddingHorizontal: 16,
		marginRight: 12,
		flex: 0.5,
	},
	buttonText: {
		color: "#fffffe", // midnightPurple.textColor
		fontSize: 16,
		fontWeight: "600",
		marginRight: 8,
	},
	backButtonText: {
		color: "#7f2af0", // midnightPurple.primary
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	},
	// New styles for measurements
	measurementHeader: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fffffe",
		marginBottom: 8,
	},
	measurementSubtitle: {
		fontSize: 14,
		color: "#94a1b2",
		marginBottom: 24,
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
	// Body fat result display
	bodyFatContainer: {
		backgroundColor: "#2d2d3a",
		borderRadius: 8,
		padding: 16,
		marginVertical: 24,
		borderLeftWidth: 4,
		borderLeftColor: "#7f2af0",
	},
	bodyFatLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fffffe",
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
		color: "#7f2af0",
	},
	bodyFatNote: {
		fontSize: 12,
		color: "#94a1b2",
		flex: 1,
		marginLeft: 12,
		fontStyle: "italic",
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
		backgroundColor: "#1e1e24",
		borderRadius: 12,
		width: "100%",
		maxWidth: 500,
		padding: 24,
		borderWidth: 1,
		borderColor: "#383844",
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
		color: "#7f2af0",
	},
	modalBody: {
		marginBottom: 24,
	},
	modalDescription: {
		fontSize: 16,
		color: "#fffffe",
		lineHeight: 24,
	},
	modalImageContainer: {
		marginTop: 16,
		alignItems: "center",
	},
	modalButton: {
		backgroundColor: "#7f2af0",
		borderRadius: 8,
		height: 48,
		alignItems: "center",
		justifyContent: "center",
	},
	modalButtonText: {
		color: "#fffffe",
		fontSize: 16,
		fontWeight: "600",
	},
	radioContainer: {},
	radioButton: {
		backgroundColor: "#1e1e24",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#383844",
		paddingVertical: 12,
		paddingHorizontal: 16,
		flex: 1,
		marginRight: 8,
		alignItems: "center",
	},
	radioButtonSelected: {
		backgroundColor: "rgba(127, 42, 240, 0.1)",
		borderColor: "#7f2af0",
	},
	radioText: {
		color: "#94a1b2",
		fontSize: 14,
		fontWeight: "500",
	},
	radioTextSelected: {
		color: "#7f2af0",
		fontWeight: "600",
	},
	unitSystemContainer: {
		marginBottom: 24,
	},
	// New styles for validation rules
	validationRulesContainer: {
		marginTop: 16,
		backgroundColor: "#1e1e24",
		borderRadius: 8,
		padding: 16,
		borderLeftWidth: 3,
		borderLeftColor: "#7f2af0",
	},
	validationTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#fffffe",
		marginBottom: 10,
	},
	validationRule: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	validationText: {
		marginLeft: 8,
		fontSize: 14,
		color: "#94a1b2",
	},
	validationTextSuccess: {
		color: "#4CAF50",
	},
});
