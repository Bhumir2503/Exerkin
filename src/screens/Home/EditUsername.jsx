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
import firestore from '@react-native-firebase/firestore';



const EditUsername = ({ navigation, route }) => {
	const { themeStyle } = useTheme();
	const styles = createStyles(themeStyle);

	let userObject = useUser();


	// You can pass the current username as a parameter from the previous screen
	const currentUsername = route.params?.username || "";
	console.log("current username is:", userObject.username)
	const [username, setUsername] = useState(currentUsername);
	const [isAvailable, setIsAvailable] = useState(true);
	const [isChecking, setIsChecking] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Simple validation for username
	const isValidUsername = (username) => {
		// Username should be 3-20 characters and contain only letters, numbers, underscores, and hyphens
		const regex = /^[a-zA-Z0-9_-]{3,20}$/;
		return regex.test(username);
	};

	// Check username availability with debounce
	useEffect(() => {
		if (username === currentUsername) {
			setIsAvailable(true);
			return;
		}

		if (!isValidUsername(username)) {
			setIsAvailable(false);
			return;
		}

		const timer = setTimeout(async () => {
			if (username.trim() !== "") {
				setIsChecking(true);
				try {
					async function checkUsernameAvalibility(username) {
						const documentSnapshot = await firestore().collection('usernames').doc(username).get();

						if (documentSnapshot.exists) {
							return false;
						} else {
							return true;
						}
					}

					const check = await checkUsernameAvalibility(username);
					setIsAvailable(check);
				} catch (error) {
					console.error(
						"Error checking username availability",
						error
					);
				} finally {
					setIsChecking(false);
				}
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(timer);
	}, [username, currentUsername]);

	const handleUpdateUsername = async () => {
		if (!username.trim()) {
			Alert.alert("Error", "Username cannot be empty");
			return;
		}

		if (!isValidUsername(username)) {
			Alert.alert(
				"Error",
				"Username must be 3-20 characters and may only contain letters, numbers, underscores, and hyphens"
			);
			return;
		}

		if (!isAvailable) {
			Alert.alert("Error", "This username is not available");
			return;
		}

		if (username === currentUsername) {
			Alert.alert(
				"No Changes",
				"The username is the same as your current one"
			);
			return;
		}

		try {
			setIsLoading(true);

			// Example API call - replace with your actual authentication logic
			// await updateUsername(username);

			// Simulate API call with timeout
			await firestore().collection('usernames').doc(userObject.username).delete();
			await firestore().collection('usernames').doc(username).set({"uid": userObject.user.uid});
			await firestore().collection('users').doc(userObject.user.uid).update({username: username});
			userObject.updateUsername(username);

			setIsLoading(false);
			Alert.alert(
				"Success",
				"Your username has been updated successfully",
				[{ text: "OK", onPress: () => navigation.goBack() }]
			);
		} catch (error) {
			setIsLoading(false);
			Alert.alert("Error", error.message || "Failed to update username");
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
					tagging and sharing workouts
				</Text>
				<Text style={styles.subtitle}>Your current username is: {userObject.username}</Text>
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
							maxLength={20}
						/>
						{isChecking ? (
							<ActivityIndicator
								size="small"
								color={themeStyle.textColorSecondary}
								style={styles.inputIcon}
							/>
						) : (
							username.trim() !== "" && (
								<View style={styles.inputIcon}>
									{isValidUsername(username) &&
									isAvailable ? (
										<Ionicons
											name="checkmark-circle"
											size={20}
											color={
												themeStyle.success || "#4CAF50"
											}
										/>
									) : (
										<Ionicons
											name="close-circle"
											size={20}
											color={themeStyle.error}
										/>
									)}
								</View>
							)
						)}
					</View>

					{username.trim() !== "" && !isValidUsername(username) && (
						<Text style={styles.errorText}>
							Username must be 3-20 characters and may only
							contain letters, numbers, underscores, and hyphens
						</Text>
					)}

					{username.trim() !== "" &&
						isValidUsername(username) &&
						!isAvailable &&
						!isChecking && (
							<Text style={styles.errorText}>
								This username is already taken
							</Text>
						)}
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[
							styles.updateButton,
							(!isValidUsername(username) ||
								!isAvailable ||
								username === currentUsername ||
								isChecking) &&
								styles.disabledButton,
						]}
						onPress={handleUpdateUsername}
						disabled={
							!isValidUsername(username) ||
							!isAvailable ||
							username === currentUsername ||
							isLoading ||
							isChecking
						}
					>
						{isLoading ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.updateButtonText}>
								Update Username
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
						Changing your username will not affect your account
						data, workout history, or friends list. Other users will
						see your new username in their connections and shared
						workouts.
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
	});

export default EditUsername;
