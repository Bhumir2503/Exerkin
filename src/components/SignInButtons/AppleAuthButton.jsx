import { useEffect, useState } from "react";
import { Platform, Text, ActivityIndicator, View } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {
	AppleButton,
	appleAuth,
} from "@invertase/react-native-apple-authentication";

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
