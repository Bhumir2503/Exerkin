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
	isValidConfirmPassword,
} from "../../../services/helpers/textInputFunctions";

import {
	getAuth,
	createUserWithEmailAndPassword,
} from "@react-native-firebase/auth";

export default function SignUpForm({ setType }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const isDisabled = isLoading || !email || !password || !confirmPassword;

	const handleButtonPress = () => {
		console.log("Sign Up button pressed");
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
		if (!isValidConfirmPassword(password, confirmPassword)) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		const auth = getAuth();
		createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
				console.log("User account created & signed in!");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleSwitchToLogIn = () => {
		setType("Log In");
	};

	return (
		<Pressable style={styles.formContainer} onPress={Keyboard.dismiss}>
			<Text style={styles.title}>Sign Up</Text>
			<Text style={styles.subText}>Join the Exerkin community</Text>

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

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Password</Text>
				<TextInputIcon
					icon="lock-closed"
					placeholder="Enter your password"
					secureTextEntry
					setText={setPassword}
					initalText={password}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputLabel}>Confirm Password</Text>
				<TextInputIcon
					icon="repeat"
					placeholder="Confirm your password"
					secureTextEntry
					setText={setConfirmPassword}
					initalText={confirmPassword}
				/>
			</View>

			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			<Pressable
				style={[styles.button, isDisabled && styles.buttonDisabled]}
				disabled={isDisabled}
				onPress={handleButtonPress}
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
