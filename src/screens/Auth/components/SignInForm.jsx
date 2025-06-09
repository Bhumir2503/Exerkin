import { useState } from "react";

import {
	Pressable,
	View,
	Text,
	ActivityIndicator,
	Keyboard,
	StyleSheet,
} from "react-native";
import TextInputIcon from "../../../components/TextInputIcon";

import { useTheme } from "../../../contexts/ThemeContext";

import {
	isValidEmail,
	isValidPassword,
} from "../../../services/helpers/textInputChecker";
import {
	getAuth,
	signInWithEmailAndPassword,
} from "@react-native-firebase/auth";

export default function SignInForm({ setType }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleButtonPress = () => {
		console.log("Log In button pressed");
		setIsLoading(true);
		setError("");
		if (!isValidEmail(email)) {
			setError("Invalid email format");
			setIsLoading(false);
			return;
		}
		if (!isValidPassword(password)) {
			setError(
				"Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
			);
			setIsLoading(false);
			return;
		}

		const auth = getAuth();
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				console.log("User signed in successfully!");
				setIsLoading(false);
			})
			.catch((error) => {
				setError("Invalid email or password");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	// Function to handle the switch to Sign Up form
	const handleSwitchToSignUp = () => {
		setType("Sign Up");
	};

	return (
		<Pressable
			style={styles.formContainer}
			onPress={() => Keyboard.dismiss()}
		>
			{/* Title and Subtext */}
			<Text style={styles.title}>Log In</Text>
			<Text style={styles.subText}>Welcome back to Exerkin</Text>

			{/* Email Fields */}
			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Email</Text>
				<TextInputIcon
					icon="mail"
					placeholder="Enter your email"
					keyboardType="email-address"
					setText={setEmail}
					InitalText={email}
				/>
			</View>

			{/* Password Fields */}
			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Password</Text>
				<TextInputIcon
					icon="lock-closed"
					placeholder="Enter your password"
					secureTextEntry={true}
					setText={setPassword}
					initalText={password}
				/>
			</View>

			{/* Error Message */}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			{/* Login Button */}
			<Pressable
				style={[
					styles.button,
					(isLoading || !email || !password) && styles.buttonDisabled,
				]}
				onPress={() => handleButtonPress()}
				disabled={isLoading || !email || !password}
			>
				{isLoading ? (
					<ActivityIndicator
						size="small"
						color={themeStyle.textColor}
					/>
				) : (
					<Text style={styles.buttonText}>Log In</Text>
				)}
			</Pressable>

			{/* Forgot Password Link */}
			<Pressable
				onPress={() => setType("Forgot Password")}
				style={{ marginTop: 12, alignItems: "center" }}
			>
				<Text
					style={{
						color: themeStyle.primary,
						fontSize: 14,
						fontWeight: "500",
					}}
				>
					Forgot Password?
				</Text>
			</Pressable>

			{/* Sign Up Link */}
			<View style={styles.switchContainer}>
				<Text style={styles.switchText}>Don't have an account?</Text>
				<Pressable
					onPress={handleSwitchToSignUp}
					style={styles.switchButton}
				>
					<Text style={styles.switchButtonText}>Sign Up</Text>
				</Pressable>
			</View>
		</Pressable>
	);
}

const createStyles = (themeStyle) =>
	StyleSheet.create({
		formContainer: {
			backgroundColor: themeStyle.card,
			borderRadius: 12,
			width: "90%",
			padding: 24,
		},
		title: {
			fontSize: 24,
			fontWeight: "bold",
			marginBottom: 10,
			color: themeStyle.textColor,
		},
		subText: {
			fontSize: 16,
			color: themeStyle.textColorSecondary,
			marginBottom: 20,
		},
		inputContainer: {
			marginBottom: 16,
		},
		inputLabel: {
			fontSize: 14,
			fontWeight: "500",
			color: themeStyle.textColor,
			marginBottom: 6,
			marginLeft: 6,
		},
		errorText: {
			color: themeStyle.error,
			marginBottom: 10,
			fontSize: 14,
			fontWeight: "500",
			textAlign: "center",
		},
		button: {
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			height: 48,
			justifyContent: "center",
			alignItems: "center",
			marginVertical: 8,
			paddingHorizontal: 16,
		},
		buttonDisabled: {
			opacity: 0.5,
		},
		buttonText: {
			color: themeStyle.textColor,
			fontSize: 16,
			fontWeight: "600",
		},

		switchContainer: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			marginTop: 16,
		},
		switchText: {
			color: themeStyle.textColorSecondary,
			fontSize: 14,
		},
		switchButton: {
			padding: 4,
		},
		switchButtonText: {
			color: themeStyle.primary,
			fontSize: 14,
			fontWeight: "600",
			textDecorationLine: "underline",
		},
	});
