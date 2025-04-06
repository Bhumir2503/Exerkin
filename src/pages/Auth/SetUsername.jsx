import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext";
import firestore from "@react-native-firebase/firestore";

import {
	saveUserProfile,
	isUsernameAvailable,
} from "../../services/firestore/firestoreUserServices";

import { updateUserCache } from "../../cache/userCache";
import { Ionicons } from "@expo/vector-icons";

export default function SetUsername() {
	const {
		user,
		setUsername: setContextUsername,
		onSetupComplete,
	} = useUser();
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [age, setAge] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [step, setStep] = useState(1); // Step 1: Username, Step 2: Optional info

	const validateUsername = () => {
		if (!username.trim()) {
			setError("Username cannot be empty");
			return false;
		}

		if (username.length < 3) {
			setError("Username must be at least 3 characters");
			return false;
		}

		// Check for special characters except underscore
		const specialCharsRegex = /[^a-zA-Z0-9_]/;
		if (specialCharsRegex.test(username)) {
			setError(
				"Username can only contain letters, numbers, and underscores"
			);
			return false;
		}

		return true;
	};

	const handleNextStep = () => {
		if (validateUsername()) {
			setError("");
			setStep(2);
		}
	};

	const handlePrevStep = () => {
		setStep(1);
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
					uid: user.uid,
					createdAt: firestore.FieldValue.serverTimestamp(),
					updatedAt: firestore.FieldValue.serverTimestamp(),
					bio: bio || "",
					height: height || "",
					weight: weight || "",
					age: age || "",
					followers: 0,
					following: 0,
					postCount: 0,
				};

				// Save the user profile to Firestore
				await saveUserProfile(user.uid, userData);

				updateUserCache(userData);
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
				>
					<View style={styles.header}>
						<Text style={styles.title}>
							{step === 1
								? "Create Your Profile"
								: "Complete Your Profile"}
						</Text>
						<Text style={styles.subtitle}>
							{step === 1
								? "Choose a unique username to get started"
								: "Tell us a bit more about yourself (optional)"}
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
									step === 2 && styles.activeStep,
								]}
							/>
							<Text
								style={[
									styles.progressText,
									step === 2 && styles.activeStepText,
								]}
							>
								Bio & Stats
							</Text>
						</View>
					</View>

					{step === 1 ? (
						// Step 1: Username
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
										onSubmitEditing={handleNextStep}
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
							</View>

							<TouchableOpacity
								style={styles.button}
								onPress={handleNextStep}
							>
								<Text style={styles.buttonText}>Continue</Text>
								<Ionicons
									name="arrow-forward"
									size={20}
									color="#fffffe"
								/>
							</TouchableOpacity>
						</View>
					) : (
						// Step 2: Optional Info
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

							<Text style={styles.sectionTitle}>
								Physical Stats
							</Text>

							<View style={styles.statsContainer}>
								<View style={styles.statInputContainer}>
									<Text style={styles.label}>Weight</Text>
									<View style={styles.statInputWrapper}>
										<TextInput
											style={styles.statInput}
											placeholder="0"
											placeholderTextColor="#72757e"
											value={weight}
											onChangeText={(text) =>
												setWeight(
													text.replace(/[^0-9]/g, "")
												)
											}
											keyboardType="numeric"
											maxLength={3}
										/>
										<Text style={styles.statUnit}>lbs</Text>
									</View>
								</View>

								<View style={styles.statInputContainer}>
									<Text style={styles.label}>Height</Text>
									<View style={styles.statInputWrapper}>
										<TextInput
											style={styles.statInput}
											placeholder="0"
											placeholderTextColor="#72757e"
											value={height}
											onChangeText={(text) =>
												setHeight(
													text.replace(/[^0-9]/g, "")
												)
											}
											keyboardType="numeric"
											maxLength={2}
										/>
										<Text style={styles.statUnit}>in</Text>
									</View>
								</View>

								<View style={styles.statInputContainer}>
									<Text style={styles.label}>Age</Text>
									<View style={styles.statInputWrapper}>
										<TextInput
											style={styles.statInput}
											placeholder="0"
											placeholderTextColor="#72757e"
											value={age}
											onChangeText={(text) =>
												setAge(
													text.replace(/[^0-9]/g, "")
												)
											}
											keyboardType="numeric"
											maxLength={2}
										/>
										<Text style={styles.statUnit}>yrs</Text>
									</View>
								</View>
							</View>

							<Text style={styles.privacyNote}>
								Your stats are private by default and only
								shared when you choose to
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
		fontSize: 18,
		fontWeight: "600",
		color: "#fffffe", // midnightPurple.textColor
		marginBottom: 16,
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 16,
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
		marginBottom: 24,
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
