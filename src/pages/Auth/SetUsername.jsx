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
	const [bio, setBio] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [age, setAge] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async () => {
		if (!username.trim()) {
			setError("Username cannot be empty");
			return;
		}

		if(username.length < 3) {
			setError("Username must be at least 3 characters");
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
						bio: bio || "",
						height: height || "",
						weight: weight || "",
						age: age || "",
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
					<Text style={styles.label}>Username (Required)</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter your username"
						value={username}
						onChangeText={setUsername}
						autoCapitalize="none"
						autoCorrect={false}
						maxLength={20}
					/>
					{error ? (
						<Text style={styles.errorText}>{error}</Text>
					) : null}
				</View>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Bio</Text>
					<TextInput
						style={styles.input}
						placeholder="Biography"
						value={bio}
						onChangeText={setBio}
						autoCapitalize="none"
						multiline
						maxLength={512}
					/>
				</View>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						marginBottom: 20,
					}}
				>
					<View style={{ ...styles.inputContainer, width: "30%" }}>
						<Text style={styles.label}>Weight</Text>
						<View
							style={{
								flexDirection: "row",
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
								alignItems: "center",
							}}
						>
							<TextInput
								style={styles.input}
								placeholder="Weight"
								value={weight}
								onChangeText={setWeight}
								autoCapitalize="none"
								maxLength={3}
								inputMode="numeric"
							/>
							<Text
								style={{
									textAlign: "right",
									color: "gray",
									fontSize: 16,
									flex: 1,
									paddingRight: 15,
								}}
							>
								lbs
							</Text>
						</View>
					</View>
					<View style={{ ...styles.inputContainer, width: "30%" }}>
						<Text style={styles.label}>Height</Text>
						<View
							style={{
								flexDirection: "row",
	
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
								alignItems: "center",
							}}
						>
							<TextInput
								style={styles.input}
								placeholder="Height"
								value={height}
								onChangeText={setHeight}
								autoCapitalize="none"
								maxLength={2}
								inputMode="numeric"
							/>
							<Text
								style={{
									textAlign: "right",
									color: "gray",
									fontSize: 16,
									flex: 1,
									paddingRight: 15,
								}}
							>
								in.
							</Text>
						</View>
					</View>
					<View style={{ ...styles.inputContainer, width: "30%" }}>
						<Text style={styles.label}>Age</Text>
						<View
							style={{
								flexDirection: "row",
								backgroundColor: "#f0f0f0",
								borderRadius: 5,
								alignItems: "center",
							}}
						>
							<TextInput
								style={styles.input}
								placeholder="Age"
								value={age}
								onChangeText={setAge}
								autoCapitalize="none"
								maxLength={2}
								inputMode="numeric"
							/>
							<Text
								style={{
									textAlign: "right",
									color: "gray",
									fontSize: 16,
									flex: 1,
									paddingRight: 15,
								}}
							>
								yrs
							</Text>
						</View>
					</View>
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
		marginBottom: 10,
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
