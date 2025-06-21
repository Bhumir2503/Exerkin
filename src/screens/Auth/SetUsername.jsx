import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext";

import { useRealm } from "../../contexts/RealmProvider";
import {
	saveUserInRealm,
	updateLastUserSyncTime,
} from "../../services/database/realmUserFunctions";

import { saveUserInFirestore } from "../../services/firestore/firestoreUserServices";

import { Ionicons } from "@expo/vector-icons";

import UsernameForm from "./components/UsernameForm";
import UserInfoForm from "./components/UserInfoForm";
import MeasurementForm from "./components/MeasurementForm";

import { calculateBodyFat } from "../../services/helpers/measurementFunctions";

import { Timestamp } from "@react-native-firebase/firestore";

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

	// Add gender and unit system
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(1); // Step 1: Username, Step 2: Basic Info, Step 3: Measurements

	// New measurements
	const [measurements, setMeasurements] = useState({
		age: "",
		weight: "",
		height: "",
		chest: "",
		abdomen: "",
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
		if (!measurements.height || !measurements.neck || !measurements.waist)
			return;

		const isFemale = gender === "Female";
		if (isFemale && !measurements.hips) {
			setMeasurements((prev) => ({
				...prev,
				bodyFat: "", // Cannot calculate without hips measurement
			}));
			return;
		}

		const bodyFat = calculateBodyFat(measurements, isFemale, unitSystem);
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

	const handleUserData = () => {
		const timestamp = Timestamp.now();

		return {
			userId: user.uid,
			username: username,
			email: user.email,
			motivation: motivation,
			preferences: {
				theme: "midnightPurple", // Default
				gender: gender.toLowerCase(),
				unitSystem: unitSystem.toLowerCase(),
				notificationsEnabled: false, // Default
			},
			createdAt: timestamp,
			updatedAt: timestamp,
		};
	};

	const handleSubmit = async () => {
		setLoading(true);
		let userData = handleUserData();
		try {
			await saveUserInFirestore(userData); // Save to Firestore
			await saveUserInRealm(realm, userData); // Save to Realm
		} catch (error) {
			console.error("Error saving user data:", error);
		}
		setLoading(false);
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
});
