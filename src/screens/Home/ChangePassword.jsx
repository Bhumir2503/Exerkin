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
import { useUser } from "../../contexts/UserContext";
import auth from '@react-native-firebase/auth';

const ChangePassword = ({ navigation }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const { user, onLogout } = useUser();


	const validatePassword = (password) => {
		// Password must be at least 8 characters with at least one number and one letter
		const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
		return regex.test(password);
	};

	const handleChangePassword = async () => {
		// Validate input fields
		if (!currentPassword || !newPassword || !confirmPassword) {
			Alert.alert("Error", "All fields are required");
			return;
		}

		// Validate password format
		if (!validatePassword(newPassword)) {
			Alert.alert(
				"Error",
				"Password must be at least 8 characters and contain at least one letter and one number"
			);
			return;
		}

		// Check if passwords match
		if (newPassword !== confirmPassword) {
			Alert.alert("Error", "New passwords do not match");
			return;
		}

		try {
			setIsLoading(true);
			const user = auth().currentUser;
			

			async function reauthenticateUserAndUpdate(email, currentPassword, newPassword) {
				const credential = auth.EmailAuthProvider.credential(email, currentPassword);
				console.log("logging in with:",email, currentPassword);
				try {
					await user.reauthenticateWithCredential(credential);
				} catch (error) {
					console.log("Error reauthenticating:", error);
				}

				try {
					console.log("updating password to:", newPassword)
					await user.updatePassword(newPassword);
				} catch (error) {
					console.log("Error updating password:", error);
				}
			}


			await reauthenticateUserAndUpdate(user.email, currentPassword, newPassword);

			setIsLoading(false);
			Alert.alert(
				"Success",
				"Your password has been updated successfully",
				[{ text: "OK", onPress: () => navigation.goBack() }]
			);
			onLogout();
		} catch (error) {
			setIsLoading(false);
			Alert.alert("Error", error.message || "Failed to change password");
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
				<Text style={styles.headerTitle}>Change Password</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.subtitle}>
					Update your password to keep your account secure
				</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Current Password</Text>
					<View style={styles.passwordInputContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder="Enter your current password"
							placeholderTextColor={themeStyle.textColorSecondary}
							value={currentPassword}
							onChangeText={setCurrentPassword}
							secureTextEntry={!showCurrentPassword}
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={styles.eyeButton}
							onPress={() =>
								setShowCurrentPassword(!showCurrentPassword)
							}
						>
							<Ionicons
								name={
									showCurrentPassword
										? "eye-off-outline"
										: "eye-outline"
								}
								size={22}
								color={themeStyle.textColorSecondary}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>New Password</Text>
					<View style={styles.passwordInputContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder="Enter your new password"
							placeholderTextColor={themeStyle.textColorSecondary}
							value={newPassword}
							onChangeText={setNewPassword}
							secureTextEntry={!showNewPassword}
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={styles.eyeButton}
							onPress={() => setShowNewPassword(!showNewPassword)}
						>
							<Ionicons
								name={
									showNewPassword
										? "eye-off-outline"
										: "eye-outline"
								}
								size={22}
								color={themeStyle.textColorSecondary}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Confirm New Password</Text>
					<View style={styles.passwordInputContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder="Confirm your new password"
							placeholderTextColor={themeStyle.textColorSecondary}
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={!showConfirmPassword}
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={styles.eyeButton}
							onPress={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
						>
							<Ionicons
								name={
									showConfirmPassword
										? "eye-off-outline"
										: "eye-outline"
								}
								size={22}
								color={themeStyle.textColorSecondary}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.passwordRequirements}>
					<Text style={styles.requirementsTitle}>Password must:</Text>
					<View style={styles.requirementItem}>
						<Ionicons
							name={
								newPassword.length >= 8
									? "checkmark-circle"
									: "ellipse-outline"
							}
							size={16}
							color={
								newPassword.length >= 8
									? themeStyle.success || "#4CAF50"
									: themeStyle.textColorSecondary
							}
						/>
						<Text style={styles.requirementText}>
							Be at least 8 characters long
						</Text>
					</View>
					<View style={styles.requirementItem}>
						<Ionicons
							name={
								/[A-Za-z]/.test(newPassword)
									? "checkmark-circle"
									: "ellipse-outline"
							}
							size={16}
							color={
								/[A-Za-z]/.test(newPassword)
									? themeStyle.success || "#4CAF50"
									: themeStyle.textColorSecondary
							}
						/>
						<Text style={styles.requirementText}>
							Include at least one letter
						</Text>
					</View>
					<View style={styles.requirementItem}>
						<Ionicons
							name={
								/\d/.test(newPassword)
									? "checkmark-circle"
									: "ellipse-outline"
							}
							size={16}
							color={
								/\d/.test(newPassword)
									? themeStyle.success || "#4CAF50"
									: themeStyle.textColorSecondary
							}
						/>
						<Text style={styles.requirementText}>
							Include at least one number
						</Text>
					</View>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.updateButton}
						onPress={handleChangePassword}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.updateButtonText}>
								Update Password
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
						For security reasons, you'll be logged out after
						changing your password and will need to sign in again
						with your new password.
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
		passwordInputContainer: {
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
		passwordInput: {
			flex: 1,
			color: themeStyle.textColor,
			padding: 12,
			fontSize: 16,
		},
		eyeButton: {
			padding: 12,
		},
		passwordRequirements: {
			marginTop: 4,
			marginBottom: 20,
		},
		requirementsTitle: {
			fontSize: 14,
			fontWeight: "500",
			color: themeStyle.textColor,
			marginBottom: 8,
		},
		requirementItem: {
			flexDirection: "row",
			alignItems: "center",
			marginVertical: 4,
		},
		requirementText: {
			fontSize: 14,
			color: themeStyle.textColorSecondary,
			marginLeft: 8,
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

export default ChangePassword;
