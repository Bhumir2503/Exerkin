import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../contexts/ThemeContext";
import TextInputIcon from "../../../components/TextInputIcon";
import { Ionicons } from "@expo/vector-icons";

import { isUsernameAvailable } from "../../../services/firestore/firestoreUserServices";

export default function UsernameForm({ onSubmit, username, setUsername }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [error, setError] = useState("");

	const rules = [
		{
			text: "At least 8 characters long",
			isValid: username.length >= 8,
		},
		{
			text: "Maximum 32 characters",
			isValid: username.length <= 32,
		},
		{
			text: "Only letters, numbers, underscores, and hyphens",
			isValid: !/[^a-zA-Z0-9_-]/.test(username),
		},
	];

	const isUsernameValid = () => {
		return /^[a-zA-Z0-9_-]{8,32}$/.test(username);
	};

	const onButtonPress = async () => {
		setError("");
		const usernameCheck = await isUsernameAvailable(username);
		if (usernameCheck) {
			onSubmit();
		} else {
			setError(
				"Username already taken or Network error. Please try again."
			);
		}
	};

	return (
		<View style={styles.formContainer}>
			<Text style={styles.label}>Username</Text>
			<TextInputIcon
				value={username}
				onChangeText={setUsername}
				placeholder="Enter your username"
				icon="id-card"
				keyboardType="default"
				maxLength={32}
				autoCorrect={false}
				error={!!error}
			/>
			{error ? <Text style={styles.errorText}>{error}</Text> : null}
			<ValidateUsernameRules rules={rules} />
			<TouchableOpacity
				style={[styles.button, !isUsernameValid() && { opacity: 0.5 }]}
				onPress={onButtonPress}
				disabled={!isUsernameValid()}
			>
				<Text style={styles.buttonText}>Continue</Text>
				<Ionicons
					name="chevron-forward"
					size={20}
					color={themeStyle.textColor}
				/>
			</TouchableOpacity>
		</View>
	);
}

function ValidateUsernameRules({ rules }) {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	return (
		<View style={styles.validationRulesContainer}>
			<Text style={styles.validationTitle}>Username requirements:</Text>
			{rules.map((rule, index) => (
				<View key={index} style={styles.validationRule}>
					<Ionicons
						name={
							rule.isValid
								? "checkmark-circle"
								: "ellipse-outline"
						}
						size={16}
						color={
							rule.isValid
								? themeStyle.success
								: themeStyle.textColorSecondary
						}
					/>
					<Text
						style={[
							styles.validationText,
							rule.isValid && styles.validationTextSuccess,
						]}
					>
						{rule.text}
					</Text>
				</View>
			))}
		</View>
	);
}

const createStyles = (themeStyles) =>
	StyleSheet.create({
		formContainer: {
			backgroundColor: themeStyles.backgroundColor,
			borderRadius: 8,
			marginBottom: 20,
		},
		label: {
			fontSize: 16,
			color: themeStyles.textColor,
			marginBottom: 6,
			marginLeft: 6,
		},
		errorText: {
			color: themeStyles.error,
			marginTop: 12,
			fontSize: 14,
			fontWeight: "500",
			textAlign: "center",
		},
		validationRulesContainer: {
			marginTop: 18,
			backgroundColor: themeStyles.inputBackground,
			borderRadius: 8,
			padding: 16,
		},
		validationTitle: {
			fontSize: 14,
			fontWeight: "600",
			color: themeStyles.textColor,
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
			color: themeStyles.textColorSecondary,
		},
		validationTextSuccess: {
			color: themeStyles.success,
		},
		button: {
			backgroundColor: themeStyles.primary, // midnightPurple.primary
			borderRadius: 8,
			height: 56,
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "row",
			paddingHorizontal: 24,
			marginTop: 24,
		},
		buttonText: {
			color: themeStyles.textColor,
			fontSize: 16,
			fontWeight: "500",
			marginRight: 8,
		},
	});
