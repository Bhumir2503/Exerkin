import { useState } from "react";
import {
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	StyleSheet,
	View,
	Modal,
	TextInput,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";

export default function EmailAuthButton() {
	const [modalVisible, setModalVisible] = useState(false);
	const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
	const [type, setType] = useState("Log In");

	const [submitting, setSubmitting] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [errorType, setErrorType] = useState("");

	const handleSubmit = () => {
		setSubmitting(true);
		setError("");
		setErrorType("");

		if (!email.includes("@") || !email.includes(".")) {
			setError("Invalid email");
			setErrorType("email");
			setSubmitting(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setErrorType("password");
			setSubmitting(false);
			return;
		}

		if (type === "Log In") {
			auth()
				.signInWithEmailAndPassword(email, password)
				.then(() => {
					console.log("User signed in!");
					setSubmitting(false);
					handleClose();
				})
				.catch((error) => {
					console.error(error);
					if (
						error.message ===
						"[auth/invalid-credential] The supplied auth credential is malformed or has expired."
					) {
						setError("Invalid email or password");
					} else {
						setError(error.message);
					}
					setErrorType("both");
					setSubmitting(false);
				});
		} else {
			auth()
				.createUserWithEmailAndPassword(email, password)
				.then(() => {
					console.log("User account created & signed in!");
					setSubmitting(false);
					handleClose();
				})
				.catch((error) => {
					console.error(error);
					setError(error.message);
					setErrorType("both");
					setSubmitting(false);
				});
		}
	};

	const handleClose = () => {
		setSubmitting(false);
		setEmail("");
		setPassword("");
		setError("");
		setErrorType("");
		setModalVisible(false);
	};

	const forgotPass = () => {
		setModalVisible(false);
		setForgotPasswordVisible(true);
	};

	const handleSignIn = () => {
		setType("Log In");
		setModalVisible(true);
	};

	const handleSignUp = () => {
		setType("Sign Up");
		setModalVisible(true);
	};

	const toggleAuthType = () => {
		setType(type === "Log In" ? "Sign Up" : "Log In");
		setEmail("");
		setPassword("");
		setError("");
		setErrorType("");
	};

	return (
		<>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.emailButton}
					onPress={handleSignIn}
				>
					<Ionicons
						name="mail"
						size={20}
						color="#fffffe"
						style={styles.buttonIcon}
					/>
					<Text style={styles.buttonText}>Continue with Email</Text>
				</TouchableOpacity>
			</View>

			<Modal
				visible={modalVisible}
				animationType="fade"
				transparent={true}
				onRequestClose={handleClose}
			>
				<View style={styles.modalOverlay}>
					<TouchableWithoutFeedback onPress={handleClose}>
						<View style={styles.backgroundOverlay} />
					</TouchableWithoutFeedback>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.modalContainer}
					>
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>{type}</Text>
							</View>

							<Text style={styles.modalSubtitle}>
								{type === "Log In"
									? "Welcome back to Exerkin"
									: "Join the Exerkin community"}
							</Text>

							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Email</Text>
								<View
									style={[
										styles.inputWrapper,
										errorType === "email" ||
										errorType === "both"
											? styles.inputError
											: null,
									]}
								>
									<Ionicons
										name="mail-outline"
										size={20}
										color="#94a1b2"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Enter your email"
										placeholderTextColor="#72757e"
										autoCapitalize="none"
										keyboardType="email-address"
										onChangeText={(text) => setEmail(text)}
										value={email}
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.inputLabel}>Password</Text>
								<View
									style={[
										styles.inputWrapper,
										errorType === "password" ||
										errorType === "both"
											? styles.inputError
											: null,
									]}
								>
									<Ionicons
										name="lock-closed-outline"
										size={20}
										color="#94a1b2"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="Enter your password"
										placeholderTextColor="#72757e"
										secureTextEntry={true}
										onChangeText={(text) =>
											setPassword(text)
										}
										value={password}
									/>
								</View>
							</View>

							{error !== "" && (
								<Text style={styles.errorText}>{error}</Text>
							)}

							<TouchableOpacity
								style={styles.submitButton}
								onPress={handleSubmit}
								disabled={submitting}
							>
								{submitting ? (
									<ActivityIndicator
										color="#fffffe"
										size="small"
									/>
								) : (
									<Text style={styles.submitButtonText}>
										{type}
									</Text>
								)}
							</TouchableOpacity>

							{type === "Log In" && (
								<TouchableOpacity
									onPress={forgotPass}
									style={styles.forgotPasswordButton}
								>
									<Text style={styles.forgotPasswordText}>
										Forgot your password?
									</Text>
								</TouchableOpacity>
							)}

							<View style={styles.switchContainer}>
								<Text style={styles.switchText}>
									{type === "Log In"
										? "Don't have an account?"
										: "Already have an account?"}
								</Text>
								<TouchableOpacity
									onPress={toggleAuthType}
									style={styles.switchButton}
								>
									<Text style={styles.switchButtonText}>
										{type === "Log In"
											? "Sign Up"
											: "Log In"}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</KeyboardAvoidingView>
				</View>
			</Modal>

			<ForgotPassword
				visible={forgotPasswordVisible}
				setVisible={setForgotPasswordVisible}
				setModalVisible={setModalVisible}
			/>
		</>
	);
}

function ForgotPassword({ visible, setVisible, setModalVisible }) {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const handleClose = () => {
		setModalVisible(true);
		setVisible(false);
		setEmail("");
		setError("");
		setSuccess(false);
	};

	const handleSubmit = () => {
		setError("");
		setSubmitting(true);

		if (!email.includes("@") || !email.includes(".")) {
			setError("Please enter a valid email address");
			setSubmitting(false);
			return;
		}

		auth()
			.sendPasswordResetEmail(email)
			.then(() => {
				setSuccess(true);
				setSubmitting(false);
			})
			.catch((error) => {
				console.error(error);
				setError("Error sending reset email. Please try again.");
				setSubmitting(false);
			});
	};

	return (
		<Modal
			visible={visible}
			animationType="fade"
			transparent={true}
			onRequestClose={handleClose}
		>
			<View style={styles.modalOverlay}>
				<TouchableWithoutFeedback onPress={handleClose}>
					<View style={styles.backgroundOverlay} />
				</TouchableWithoutFeedback>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.modalContainer}
				>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								Reset Password
							</Text>
						</View>

						{!success ? (
							<>
								<Text style={styles.modalSubtitle}>
									Enter your email address and we'll send you
									a link to reset your password
								</Text>

								<View style={styles.inputContainer}>
									<Text style={styles.inputLabel}>Email</Text>
									<View
										style={[
											styles.inputWrapper,
											error ? styles.inputError : null,
										]}
									>
										<Ionicons
											name="mail-outline"
											size={20}
											color="#94a1b2"
											style={styles.inputIcon}
										/>
										<TextInput
											style={styles.input}
											placeholder="Enter your email"
											placeholderTextColor="#72757e"
											autoCapitalize="none"
											keyboardType="email-address"
											onChangeText={setEmail}
											value={email}
										/>
									</View>
								</View>

								{error ? (
									<Text style={styles.errorText}>
										{error}
									</Text>
								) : null}

								<TouchableOpacity
									style={styles.submitButton}
									onPress={handleSubmit}
									disabled={submitting}
								>
									{submitting ? (
										<ActivityIndicator
											color="#fffffe"
											size="small"
										/>
									) : (
										<Text style={styles.submitButtonText}>
											Send Reset Link
										</Text>
									)}
								</TouchableOpacity>
							</>
						) : (
							<>
								<View style={styles.successContainer}>
									<Ionicons
										name="checkmark-circle"
										size={60}
										color="#7f2af0"
										style={styles.successIcon}
									/>
									<Text style={styles.successTitle}>
										Reset Email Sent
									</Text>
									<Text style={styles.successText}>
										Check your email for a link to reset
										your password
									</Text>
									<TouchableOpacity
										style={styles.submitButton}
										onPress={handleClose}
									>
										<Text style={styles.submitButtonText}>
											Back to Login
										</Text>
									</TouchableOpacity>
								</View>
							</>
						)}
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		width: "100%",
		marginVertical: 5,
	},
	emailButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1e1e24",
		borderRadius: 8,
		height: 50,
		width: "100%",
		borderWidth: 1,
		borderColor: "#383844",
	},
	buttonIcon: {
		marginRight: 12,
	},
	buttonText: {
		color: "#fffffe",
		fontSize: 16,
		fontWeight: "500",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backgroundOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.75)",
	},
	modalContainer: {
		width: "90%",
		alignSelf: "center",
		justifyContent: "center",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 100,
	},
	scrollContainer: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	modalContent: {
		backgroundColor: "#2d2d3a",
		borderRadius: 16,
		width: "100%",
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 10,
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	closeButton: {
		padding: 4,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fffffe",
	},
	modalSubtitle: {
		fontSize: 16,
		color: "#94a1b2",
		marginBottom: 24,
	},
	inputContainer: {
		marginBottom: 16,
	},
	inputLabel: {
		fontSize: 14,
		fontWeight: "500",
		color: "#fffffe",
		marginBottom: 8,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1e1e24",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#383844",
		paddingHorizontal: 16,
	},
	inputError: {
		borderColor: "#F87060",
	},
	inputIcon: {
		marginRight: 12,
	},
	input: {
		flex: 1,
		height: 48,
		color: "#fffffe",
		fontSize: 16,
	},
	errorText: {
		color: "#F87060",
		fontSize: 14,
		marginBottom: 16,
	},
	submitButton: {
		backgroundColor: "#7f2af0",
		borderRadius: 8,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 8,
		paddingHorizontal: 16,
	},
	submitButtonText: {
		color: "#fffffe",
		fontSize: 16,
		fontWeight: "600",
	},
	forgotPasswordButton: {
		alignSelf: "center",
		padding: 8,
		marginTop: 8,
	},
	forgotPasswordText: {
		color: "#7f2af0",
		fontSize: 14,
	},
	switchContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 16,
	},
	switchText: {
		color: "#94a1b2",
		fontSize: 14,
	},
	switchButton: {
		marginLeft: 8,
		padding: 4,
	},
	switchButtonText: {
		color: "#7f2af0",
		fontSize: 14,
		fontWeight: "600",
	},
	successContainer: {
		alignItems: "center",
		padding: 16,
	},
	successIcon: {
		marginBottom: 16,
	},
	successTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fffffe",
		marginBottom: 8,
	},
	successText: {
		fontSize: 16,
		color: "#94a1b2",
		textAlign: "center",
		marginBottom: 24,
	},
});
