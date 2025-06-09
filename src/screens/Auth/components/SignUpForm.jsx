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

export default function SignUpForm({ setType }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleButtonPress = () => {
		setIsLoading(true);

		try {
			console.log("Email:", email);
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
	};

	// Function to handle the switch to Sign Up form
	const handleSwitchToLogIn = () => {
		setType("Log In");
	};

	return (
		<Pressable
			style={styles.formContainer}
			onPress={() => Keyboard.dismiss()}
		>
			{/* Title and Subtext */}
			<Text style={styles.title}>Sign Up</Text>
			<Text style={styles.subText}>Join the Exerkin community</Text>

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

			{/* Confirm Password Fields */}
			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Confirm Password</Text>
				<TextInputIcon
					icon="repeat"
					placeholder="Confirm your password"
					secureTextEntry={true}
					setText={setConfirmPassword}
					initalText={confirmPassword}
				/>
			</View>

			{/* Error Message */}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			{/* Login Button */}
			<Pressable
				style={[
					styles.button,
					(isLoading || !email || !password || !confirmPassword) &&
						styles.buttonDisabled,
				]}
				onPress={() => handleButtonPress()}
				disabled={isLoading || !email || !password || !confirmPassword}
			>
				{isLoading ? (
					<ActivityIndicator
						size="small"
						color={themeStyle.textColor}
					/>
				) : (
					<Text style={styles.buttonText}>Sign Up</Text>
				)}
			</Pressable>

			{/* Sign Up Link */}
			<View style={styles.switchContainer}>
				<Text style={styles.switchText}>Already have an account?</Text>
				<Pressable
					onPress={handleSwitchToLogIn}
					style={styles.switchButton}
				>
					<Text style={styles.switchButtonText}>Log In</Text>
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
