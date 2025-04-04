import React, { useState } from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	View,
	ActivityIndicator,
	Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useUser } from "../../contexts/UserContext";

export default function GoogleAuthButton() {
	const { setIsNewUser } = useUser();
	const [loading, setLoading] = useState(false);

	GoogleSignin.configure({
		webClientId:
			"708843610331-7qiliqg56itfq53apdt3rm7lltsd52sn.apps.googleusercontent.com",
	});

	const signIn = async () => {
		try {
			setLoading(true);

			// Check if your device supports Google Play
			await GoogleSignin.hasPlayServices({
				showPlayServicesUpdateDialog: true,
			});

			// Get the users ID token
			const signInResult = await GoogleSignin.signIn();

			// Try the new style of google-sign in result, from v13+ of that module
			let idToken = signInResult.idToken;
			if (!idToken && signInResult.data) {
				// if you are using older versions of google-signin, try old style result
				idToken = signInResult.data.idToken;
			}

			if (!idToken) {
				throw new Error("No ID token found");
			}

			// Create a Google credential with the token
			const googleCredential =
				auth.GoogleAuthProvider.credential(idToken);

			// Sign-in the user with the credential
			const userCredential = await auth().signInWithCredential(
				googleCredential
			);

			// Check if this is a new user
			setIsNewUser(userCredential.additionalUserInfo?.isNewUser);

			return userCredential;
		} catch (e) {
			console.warn(e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<TouchableOpacity
			style={styles.googleButton}
			onPress={signIn}
			disabled={loading}
			activeOpacity={0.8}
		>
			{loading ? (
				<ActivityIndicator color="#ffffff" size="small" />
			) : (
				<>
					<View style={styles.googleIconContainer}>
						<Image
							source={require("../../../assets/google-icon.png")}
							style={styles.googleIcon}
							resizeMode="contain"
						/>
					</View>
					<Text style={styles.buttonText}>Continue with Google</Text>
				</>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	googleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1e1e24",
		borderRadius: 12, // Slightly more rounded corners
		height: 52, // Slightly taller
		width: "100%",
		marginVertical: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#383844",
	},
	appleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1e1e24",
		borderRadius: 12,
		height: 52,
		width: "100%",
		marginVertical: 6,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#383844",
	},
	googleIconContainer: {
		width: 22,
		height: 22,
		marginRight: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	appleIconContainer: {
		width: 22,
		height: 22,
		marginRight: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	googleIcon: {
		width: 22,
		height: 22,
	},
	appleIcon: {
		width: 22,
		height: 22,
	},
	buttonText: {
		color: "#fffffe",
		fontSize: 16,
		fontWeight: "500",
		letterSpacing: 0.25, // Slightly improved letter spacing for modern look
	},
});
