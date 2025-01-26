import { useState, useEffect } from "react";
import {
	Text,
	TouchableOpacity,
	StyleSheet,
	View,
	Modal,
	TextInput,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from "react-native-popup-menu"; // Popup menu components
import ForgotPassword from "./ForgotPassword";

import auth from "@react-native-firebase/auth";

export default function EmailAuthButton() {

	const styles = createStyles();
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
		//check if email is valid
		if (!email.includes("@") || !email.includes(".")) {
			setError("Invalid email");
			setErrorType("email");
			console.log("Invalid email");
			setSubmitting(false);
			return;
		}
		//check if password is valid
		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setErrorType("password");
			console.log("Password must be at least 6 characters long");
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
					setError(error.message);
					if (
						error.message ===
						"[auth/invalid-credential] The supplied auth credential is malformed or has expired."
					) {
						setError(
							"Invalid email or password or account sign in with a different method"
						);
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

	// Handle sign in and sign up actions
	const handleSignIn = () => {
		// Implement sign in logic here
		setType("Log In");
		setModalVisible(true);
		console.log("Log In clicked");
	};

	const handleSignUp = () => {
		// Implement sign up logic here
		setType("Sign Up");
		setModalVisible(true);
		console.log("Sign Up clicked");
	};

	return (
		<Menu>
			<MenuTrigger>
				<View style={styles.email}>
					<Ionicons name="mail" size={24} color="#fff" />
					<Text style={{ textAlign: "center", marginLeft: 10, color: "#fff" }}>
						Continue with Email
					</Text>
				</View>
			</MenuTrigger>

			<MenuOptions
				customStyles={{
					optionsContainer: {
						backgroundColor: "rgba(255, 255, 255, 0.5)",
						width: 200,
						borderRadius: 7,
						marginTop: 35,
						marginLeft: -20,
						opacity: 0,
					},
				}}
			>
				<MenuOption onSelect={handleSignIn}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
						}}
					>
						<Text style={styles.menuOption}>Log in with Email</Text>
						<Ionicons
							name="mail"
							size={20}
							color="#fff"
						/>
					</View>
				</MenuOption>
				<MenuOption onSelect={handleSignUp}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
						}}
					>
						<Text style={styles.menuOption}>
							Sign Up with Email
						</Text>
						<Ionicons
							name="pencil-sharp"
							size={20}
							color="#fff"
						/>
					</View>
				</MenuOption>
			</MenuOptions>

			<Modal
				visible={modalVisible}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => handleClose()}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-start",
						
					}}
				>
					<Text style={styles.close} onPress={() => handleClose()}>
						Close
					</Text>
				</View>
				<Text style={styles.title}>{type}</Text>
				{type === "Log In" && (
					<Text style={styles.subtext}>
						Sign in with your email and password.
					</Text>
				)}
				{type === "Sign Up" && (
					<Text style={styles.subtext}>
						Create an account with an email and password.
					</Text>
				)}

				<Text style={styles.inputTextChoice}>Your Email</Text>
				<View
					style={{
						alignContent: "center",
						alignItems: "center",
						marginBottom: 10,
					}}
				>
					<TextInput
						style={{
							...styles.inputText,
							borderWidth:
								errorType === "email" || errorType === "both"
									? 1
									: 0,
							borderColor: "red",
						}}
						placeholder="Email"
						autoFocus
						onChangeText={(text) => setEmail(text)}
						value={email}
					/>
				</View>
				<Text style={styles.inputTextChoice}>Your Password</Text>
				<View
					style={{
						alignContent: "center",
						alignItems: "center",
						marginBottom: 20,
					}}
				>
					<TextInput
						style={{
							...styles.inputText,
							borderWidth:
								errorType === "password" || errorType === "both"
									? 1
									: 0,
							borderColor: "red",
						}}
						placeholder="Password"
						secureTextEntry={true}
						onChangeText={(text) => setPassword(text)}
						value={password}
					/>
				</View>

				{error !== "" && (
					<Text
						style={{
							textAlign: "center",
							paddingHorizontal: 20,
							color: "red",
							marginBottom: 10,
						}}
					>
						{error}
					</Text>
				)}

				<View
					style={{
						alignContent: "center",
						alignItems: "center",
						marginBottom: 20,
					}}
				>
					<TouchableOpacity
						style={styles.button}
						onPress={handleSubmit}
						disabled={submitting}
					>
						{submitting === false && (
							<Text style={{ fontWeight: "bold", fontSize: 15 }}>
								{type}
							</Text>
						)}
						{submitting === true && (
							<ActivityIndicator
								size="small"
								color="#000"
							/>
						)}
					</TouchableOpacity>
				</View>

				{type === "Log In" && (
					<Text
						style={{
							textAlign: "center",
							textDecorationLine: "underline",
						}}
						onPress={() => forgotPass()}
					>
						Forgot your password?
					</Text>
				)}
			</Modal>

			<ForgotPassword
				visible={forgotPasswordVisible}
				setVisible={setForgotPasswordVisible}
				setModalVisible={setModalVisible}
			/>
		</Menu>
	);
}

const createStyles = () =>
	StyleSheet.create({
		email: {
			justifyContent: "center",
			alignItems: "center",
			height: 40,
			borderRadius: 5,
			flexDirection: "row",
			backgroundColor: "#121212", // Adjust as needed
		},
		menuOption: {
			paddingHorizontal: 10,
			fontSize: 16,
			color: "#fff", // Option text color matching theme
		},
		close: {
			padding: 10,
			borderRadius: 5,
			marginTop: 10,
			color: "#407BFF",
			fontWeight: "bold",
		},
		title: {
			fontSize: 20,
			fontWeight: "bold",
			padding: 10,
			paddingBottom: 0,
			color: "#fff",
		},
		subtext: {
			fontSize: 14,
			padding: 10,
			color: "gray",
		},
		inputTextChoice: {
			fontSize: 14,
			padding: 10,
			paddingLeft: "7%",
			paddingBottom: 0,
			borderColor: "gray",
		},
		inputText: {
			justifyContent: "center",
			alignContent: "center",
			alignItems: "center",
			width: "90%",
			fontSize: 14,
			padding: 10,
			paddingLeft: 20,
			borderRadius: 5,
			backgroundColor: "#f0f0f0",
		},
		button: {
			justifyContent: "center",
			alignContent: "center",
			alignItems: "center",
			width: "90%",
			fontSize: 14,
			padding: 10,
			paddingLeft: 20,
			borderRadius: 5,
			backgroundColor: "#407BFF",
			color: "#fff",
		},
	});
