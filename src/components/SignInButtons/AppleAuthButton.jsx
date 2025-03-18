import { useEffect, useState } from "react";
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	Platform,
	ActivityIndicator,
	View,
	Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { useUser } from "../../contexts/UserContext";

export default function AppleAuthButton() {
	const { setIsNewUser } = useUser();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
		if (Platform.OS === "ios") {
			return appleAuth.onCredentialRevoked(async () => {
				console.warn(
					"If this function executes, User Credentials have been Revoked"
				);
			});
		}
	}, []);

	async function onAppleButtonPress() {
		try {
			setLoading(true);

			// Start the sign-in request
			const appleAuthRequestResponse = await appleAuth.performRequest({
				requestedOperation: appleAuth.Operation.LOGIN,
				// As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
				// See: https://github.com/invertase/react-native-apple-authentication#faqs
				requestedScopes: [
					appleAuth.Scope.FULL_NAME,
					appleAuth.Scope.EMAIL,
				],
			});

			// Ensure Apple returned a user identityToken
			if (!appleAuthRequestResponse.identityToken) {
				throw new Error(
					"Apple Sign-In failed - no identify token returned"
				);
			}

			// Create a Firebase credential from the response
			const { identityToken, nonce } = appleAuthRequestResponse;
			const appleCredential = auth.AppleAuthProvider.credential(
				identityToken,
				nonce
			);

			// Sign the user in with the credential
			const userCredential = await auth().signInWithCredential(
				appleCredential
			);

			// Check if this is a new user
			setIsNewUser(userCredential.additionalUserInfo?.isNewUser);

			return userCredential;
		} catch (error) {
			console.error("Apple auth error:", error);
		} finally {
			setLoading(false);
		}
	}

	if (Platform.OS !== "ios") {
		return null;
	}

	return (
		<TouchableOpacity
			style={styles.appleButton}
			onPress={onAppleButtonPress}
			disabled={loading}
			activeOpacity={0.8}
		>
			{loading ? (
				<ActivityIndicator color="#ffffff" size="small" />
			) : (
				<>
					<View style={styles.appleIconContainer}>
						<Image
							source={require("../../../assets/apple-icon.png")}
							style={styles.appleIcon}
							resizeMode="contain"
						/>
					</View>
					<Text style={styles.buttonText}>Continue with Apple</Text>
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
