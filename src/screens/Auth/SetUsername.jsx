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

import {
	saveUserProfile,
	isUsernameAvailable,
} from "../../services/firestore/firestoreUserServices";

import { useRealm } from "../../contexts/RealmProvider";
import { setRealmUser } from "../../services/database/realmUserFunctions";

import { Ionicons } from "@expo/vector-icons";

import UsernameForm from "./components/UsernameForm";
import UserInfoForm from "./components/UserInfoForm";
import MeasurementForm from "./components/MeasurementForm";

export default function SetUsername() {
	const {
		user,
		setUsername: setContextUsername,
		onSetupComplete,
	} = useUser();
	const realm = useRealm();
	// Step 1
	const [username, setUsername] = useState("");

	// Step 2
	const [motivation, setMotivation] = useState("");
	const [gender, setGender] = useState("Male");
	const [unitSystem, setUnitSystem] = useState("Imperial");

	const [bio, setBio] = useState("");
	// Add gender and unit system
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

	// Calculate body fat percentage using Navy method
	useEffect(() => {
		if (
			!gender ||
			!measurements.height ||
			!measurements.neck ||
			!measurements.waist
		)
			return;

		const isFemale = gender === "Female";
		if (isFemale && !measurements.hips) return;

		const bodyFat = calculateBodyFat();
		setMeasurements((prev) => ({
			...prev,
			bodyFat: bodyFat.toFixed(1),
		}));
	}, [
		gender,
		measurements.height,
		measurements.neck,
		measurements.waist,
		measurements.hips,
		unitSystem,
	]);

	// Navy method body fat calculation
	const calculateBodyFat = () => {
		let { height, neck, waist, hips } = measurements;
		console.log("Calculating body fat with measurements:");

		// Convert from metric to inches if needed
		if (unitSystem === "Metric") {
			height *= 0.393701;
			neck *= 0.393701;
			waist *= 0.393701;
			hips = hips ? hips * 0.393701 : undefined;
		}

		let bodyFatPercentage;

		if (gender === "Female") {
			// Female formula
			bodyFatPercentage =
				163.205 * Math.log10(waist + hips - neck) -
				97.684 * Math.log10(height) -
				78.387;
		} else {
			// Male formula
			bodyFatPercentage =
				86.01 * Math.log10(waist - neck) -
				70.041 * Math.log10(height) +
				36.76;
		}

		return bodyFatPercentage;
	};

	const handleNextStep = () => {
		if (step === 1) {
			setStep(2);
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
					bounces={false}
				>
					<KeyboardAvoidingView>
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
									style={[
										styles.progressDot,
										styles.activeStep,
									]}
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
							<UsernameForm
								onSubmit={handleNextStep}
								username={username}
								setUsername={setUsername}
							/>
						) : step === 2 ? (
							// Step 2: Basic Info
							<>
								<UserInfoForm
									motivation={motivation}
									setMotivation={setMotivation}
									measurements={measurements}
									setMeasurements={setMeasurements}
									gender={gender}
									setGender={setGender}
									unitSystem={unitSystem}
									setUnitSystem={setUnitSystem}
									handleNextPress={handleNextStep}
									handlePrevPress={handlePrevStep}
								/>
							</>
						) : (
							// Step 3: Measurements
							<>
								<MeasurementForm
									unitSystem={unitSystem}
									gender={gender}
									measurements={measurements}
									setMeasurements={setMeasurements}
								/>
								<View style={styles.formContainer}>
									{/* Primary measurements used for body fat calculation */}
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
													<Text
														style={
															styles.buttonText
														}
													>
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
							</>
						)}
					</KeyboardAvoidingView>
				</ScrollView>
			</KeyboardAvoidingView>
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
		paddingVertical: 0,
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
		marginBottom: 24,
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
		gap: 16,
		marginBottom: 16,
	},
	measurementInputContainer: {
		flex: 1,
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
});
