import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Alert,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import firestore from "@react-native-firebase/firestore";

import {
	isUsernameAvailable,
	updateUsernameInFirestore,
} from "../../services/firestore/firestoreUserServices";

const EditUsername = ({ navigation, route }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	let userObject = useUser();

	// You can pass the current username as a parameter from the previous screen
	const currentUsername = route.params?.username || "";
	const [username, setUsername] = useState(currentUsername);
	const [loading, setLoading] = useState(false);
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

	const handleUpdateUsername = async () => {
		if (!rules.every((rule) => rule.isValid)) {
			setError("Please fix the errors above.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			if (await isUsernameAvailable(username)) {
				await updateUsernameInFirestore(
					userObject.userId,
					username,
					userObject.username
				);
				setLoading(false);
				navigation.goBack();
			} else {
				setError("Username is already taken. Please choose another.");
				setLoading(false);
			}
		} catch (error) {
			console.error("Error checking username availability:", error);
			setError("An error occurred while updating the username.");
			setLoading(false);
			return;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons
						name="chevron-back-outline"
						size={24}
						color={themeStyle.textColor}
					/>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Edit Username</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.subtitle}>
					Your username is visible to other users and is used for
					tagging and sharing workouts. (Future Update)
				</Text>
				<Text style={styles.subtitle}>
					Your current username is: {userObject.username}
				</Text>
				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Username</Text>
					<View style={styles.usernameInputContainer}>
						<TextInput
							style={styles.input}
							placeholder="Enter your username"
							placeholderTextColor={themeStyle.textColorSecondary}
							value={username}
							onChangeText={setUsername}
							autoCapitalize="none"
							autoCorrect={false}
							maxLength={32}
						/>
					</View>
					{error ? (
						<Text style={styles.errorText}>{error}</Text>
					) : null}
				</View>

				<View style={styles.validationRulesContainer}>
					<Text style={styles.validationTitle}>
						Username requirements:
					</Text>
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
									rule.isValid &&
										styles.validationTextSuccess,
								]}
							>
								{rule.text}
							</Text>
						</View>
					))}
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[
							styles.updateButton,
							!rules.every((rule) => rule.isValid) &&
								styles.disabledButton,
						]}
						onPress={() => {
							handleUpdateUsername();
						}}
						disabled={
							!rules.every((rule) => rule.isValid) || loading
						}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#FFFFFF" />
						) : (
							<Text style={styles.updateButtonText}>
								Update Username
							</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

const createStyles = (themeStyle) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: themeStyle.backgroundColor,
		},
		header: {
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: themeStyle.borderColor,
		},
		backButton: {
			padding: 4,
		},
		headerTitle: {
			fontSize: 20,
			fontWeight: "600",
			color: themeStyle.textColor,
			marginLeft: 12,
		},
		content: {
			flex: 1,
			padding: 16,
		},
		subtitle: {
			fontSize: 16,
			color: themeStyle.textColor,
			marginBottom: 24,
			lineHeight: 22,
		},
		inputContainer: {},
		inputLabel: {
			fontSize: 16,
			fontWeight: "500",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		usernameInputContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor:
				themeStyle.inputBackground ||
				themeStyle.backgroundColorSecondary ||
				"#1C1C1E",
			borderRadius: 8,
			borderWidth: 1,
			borderColor: themeStyle.borderColor,
		},
		input: {
			flex: 1,
			color: themeStyle.textColor,
			padding: 12,
			fontSize: 16,
		},
		inputIcon: {
			padding: 12,
		},
		errorText: {
			fontSize: 14,
			color: themeStyle.error,
			marginTop: 8,
		},
		buttonContainer: {
			marginTop: 12,
		},
		updateButton: {
			backgroundColor: themeStyle.primary,
			borderRadius: 8,
			paddingVertical: 14,
			alignItems: "center",
			justifyContent: "center",
		},
		disabledButton: {
			backgroundColor: themeStyle.disabled || "#666666",
			opacity: 0.7,
		},
		updateButtonText: {
			color: "#FFFFFF",
			fontSize: 16,
			fontWeight: "600",
		},
		infoContainer: {
			flexDirection: "row",
			alignItems: "flex-start",
			marginTop: 24,
			backgroundColor:
				themeStyle.backgroundColorSecondary ||
				"rgba(128, 128, 128, 0.1)",
			padding: 12,
			borderRadius: 8,
		},
		infoText: {
			flex: 1,
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginLeft: 8,
			lineHeight: 20,
		},
		validationRulesContainer: {
			marginTop: 18,
			backgroundColor: themeStyle.inputBackground,
			borderRadius: 8,
			padding: 16,
		},
		validationTitle: {
			fontSize: 14,
			fontWeight: "600",
			color: themeStyle.textColor,
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
			color: themeStyle.textColorSecondary,
		},
		validationTextSuccess: {
			color: themeStyle.success,
		},
	});

export default EditUsername;
