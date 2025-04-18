import React, { useState } from "react";
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

const UpdateEmail = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [currentEmail, setCurrentEmail] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdateEmail = async () => {
		// Validate input fields
		if (!currentEmail.trim() || !newEmail.trim() || !password.trim()) {
			Alert.alert("Error", "All fields are required");
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newEmail)) {
			Alert.alert("Error", "Please enter a valid email address");
			return;
		}

		try {
			setIsLoading(true);

			// Example API call - replace with your actual authentication logic
			// await updateUserEmail(currentEmail, newEmail, password);

			// Simulate API call with timeout
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setIsLoading(false);
			Alert.alert("Success", "Your email has been updated successfully", [
				{ text: "OK", onPress: () => navigation.goBack() },
			]);
		} catch (error) {
			setIsLoading(false);
			Alert.alert("Error", error.message || "Failed to update email");
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
				<Text style={styles.headerTitle}>Update Email</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.subtitle}>
					Enter your current email and password, along with your new
					email address
				</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Current Email</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your current email"
						placeholderTextColor={themeStyle.textColorSecondary}
						value={currentEmail}
						onChangeText={setCurrentEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>New Email</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your new email"
						placeholderTextColor={themeStyle.textColorSecondary}
						value={newEmail}
						onChangeText={setNewEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Password</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your password"
						placeholderTextColor={themeStyle.textColorSecondary}
						value={password}
						onChangeText={setPassword}
						secureTextEntry
						autoCapitalize="none"
					/>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.updateButton}
						onPress={handleUpdateEmail}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.updateButtonText}>
								Update Email
							</Text>
						)}
					</TouchableOpacity>
				</View>

				<View style={styles.infoContainer}>
					<Ionicons
						name="information-circle-outline"
						size={20}
						color={themeStyle.textColorSecondary}
					/>
					<Text style={styles.infoText}>
						You'll need to verify your new email address before the
						change takes effect. A verification link will be sent to
						your new email.
					</Text>
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
		inputContainer: {
			marginBottom: 20,
		},
		inputLabel: {
			fontSize: 16,
			fontWeight: "500",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		input: {
			backgroundColor:
				themeStyle.inputBackground ||
				themeStyle.backgroundColorSecondary ||
				"#1C1C1E",
			color: themeStyle.textColor,
			borderRadius: 8,
			padding: 12,
			fontSize: 16,
			borderWidth: 1,
			borderColor: themeStyle.borderColor,
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
	});

export default UpdateEmail;
