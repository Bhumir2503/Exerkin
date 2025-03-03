import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext";
import firestore from "@react-native-firebase/firestore";
import { updateUsernameCache } from "../../cache/userCache";

export default function SetUsername() {
	const {
		user,
		setUsername: setContextUsername,
		onSetupComplete,
	} = useUser();
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		if (!username.trim()) {
			setError("Username cannot be empty");
			return;
		}

		setLoading(true);
		setError("");

		try {
			// Even if there's a permissions error with Firestore, we'll at least save locally
			// and let the user proceed with the app

			try {
				// Try to check if username is taken
				const usernameCheck = await firestore()
					.collection("usernames")
					.doc(username.toLowerCase())
					.get();

				if (usernameCheck.exists) {
					setError("Username is already taken");
					setLoading(false);
					return;
				}

				// Try to create user document in Firestore
				await firestore()
					.collection("users")
					.doc(user.uid)
					.set({
						username: username,
						email: user.email || "",
						uid: user.uid,
						createdAt: firestore.FieldValue.serverTimestamp(),
						updatedAt: firestore.FieldValue.serverTimestamp(),
						bio: "",
						height: "",
						weight: "",
						age: "",
						followers: 0,
						following: 0,
						postCount: 0,
					});

				// Try to reserve the username
				await firestore()
					.collection("usernames")
					.doc(username.toLowerCase())
					.set({
						uid: user.uid,
					});
			} catch (firestoreError) {
				console.log(
					"Firestore operations failed, proceeding with local storage only:",
					firestoreError.message
				);
				// We'll continue with local storage even if Firestore fails
			}

			// Always update the local cache, even if Firestore operations fail
			await updateUsernameCache(username);

			// Update the context
			setContextUsername(username);

			// Complete setup
			onSetupComplete();
		} catch (error) {
			console.error("Error saving user data:", error);
			setError("Failed to save username. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.contentContainer}
			>
				<Text style={styles.title}>Almost there!</Text>
				<Text style={styles.subtitle}>Pick a username</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Username</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your username"
						value={username}
						onChangeText={setUsername}
						autoCapitalize="none"
						autoCorrect={false}
						autoFocus
					/>
					{error ? (
						<Text style={styles.errorText}>{error}</Text>
					) : null}
				</View>

				<TouchableOpacity
					style={styles.button}
					onPress={handleSubmit}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#ffffff" size="small" />
					) : (
						<Text style={styles.buttonText}>Continue</Text>
					)}
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
	},
	contentContainer: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#407BFF",
		textAlign: "center",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 18,
		color: "#FFFFFF",
		textAlign: "center",
		marginBottom: 30,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 30,
	},
	label: {
		color: "#FFFFFF",
		marginBottom: 8,
		marginLeft: 4,
	},
	input: {
		backgroundColor: "#f0f0f0",
		borderRadius: 5,
		padding: 15,
		fontSize: 16,
	},
	errorText: {
		color: "#FF6B6B",
		marginTop: 8,
		marginLeft: 4,
	},
	button: {
		backgroundColor: "#407BFF",
		padding: 15,
		borderRadius: 5,
		alignItems: "center",
	},
	buttonText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		fontSize: 16,
	},
});
