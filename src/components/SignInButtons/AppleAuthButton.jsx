import { useEffect, useState } from "react";
import { Platform, Text, ActivityIndicator, View } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {
	AppleButton,
	appleAuth,
} from "@invertase/react-native-apple-authentication";

export default function AppleAuthButton() {
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
			const isNewUser = userCredential.additionalUserInfo?.isNewUser;

			if (isNewUser) {
				// For new users, we'll let the SetUsername component handle user creation
				// The UserContext will detect they're new and route accordingly
				console.log("New user created with Apple Auth");
			} else {
				// For existing users, check if they have a document in Firestore
				const userDoc = await firestore()
					.collection("users")
					.doc(userCredential.user.uid)
					.get();

				// If they don't have a document, they still need to set up their profile
				if (!userDoc.exists) {
					console.log(
						"Existing user missing profile data - will prompt for username"
					);
				}
			}

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
		<View style={{ marginBottom: 10 }}>
			{loading ? (
				<View
					style={{
						width: 250,
						height: 40,
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#000",
						borderRadius: 5,
					}}
				>
					<ActivityIndicator color="#fff" />
				</View>
			) : (
				<AppleButton
					buttonStyle={AppleButton.Style.WHITE}
					buttonType={AppleButton.Type.SIGN_IN}
					style={{
						width: 250,
						height: 40,
					}}
					onPress={onAppleButtonPress}
				/>
			)}
		</View>
	);
}
