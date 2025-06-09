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

export default function ForgotPasswordForm({ setType }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	return (
		<Pressable
			style={styles.formContainer}
			onPress={() => Keyboard.dismiss()}
		>
			{/* Title and Subtext */}
			<Text style={styles.title}>Reset Password</Text>
			<Text style={styles.subText}>
				Enter your email address and we'll send you a link to reset your
				password
			</Text>

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

			{/* Error Message */}
			{error ? <Text style={styles.errorText}>{error}</Text> : null}

			{/* Submit Button */}
			<Pressable
				style={[
					styles.button,
					(isLoading || !email) && styles.buttonDisabled,
				]}
				disabled={isLoading || !email}
				onPress={() => {
					console.log("Reset link sent to:", email);
				}}
			>
				{isLoading ? (
					<ActivityIndicator
						size="small"
						color={themeStyle.primaryColor}
					/>
				) : (
					<Text style={styles.buttonText}>Send Reset Link</Text>
				)}
			</Pressable>

			{/* Back to Login Link */}
			<View style={styles.switchContainer}>
				<Text style={styles.switchText}>Remember your password?</Text>
				<Pressable
					onPress={() => setType("Log In")}
					style={styles.switchButton}
				>
					<Text style={styles.switchButtonText}>Go Back</Text>
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
