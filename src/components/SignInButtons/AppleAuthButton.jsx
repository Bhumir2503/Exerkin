import { useEffect, useState } from "react";
import { Platform, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import {
	AppleButton,
	appleAuth,
} from "@invertase/react-native-apple-authentication";

export default function AppleAuthButton() {
	const [user, setUser] = useState(null);
	const [init, setInit] = useState(true);

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

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
		// Start the sign-in request
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			// As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
			// See: https://github.com/invertase/react-native-apple-authentication#faqs
			requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
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
		return auth().signInWithCredential(appleCredential);
	}

	function onAuthStateChanged(user) {
		setUser(user);
		if (init) {
			setInit(false);
		}
	}

	if (init) {
		return null;
	}

	if (user) {
		return <Text>Welcome {user.email}</Text>;
	}

	return (
		<AppleButton
			buttonStyle={AppleButton.Style.WHITE}
			buttonType={AppleButton.Type.SIGN_IN}
			style={{
				width: 250,
				height: 40,
				margin: 10,
				marginBottom: 20,
			}}
			onPress={onAppleButtonPress}
		/>
	);
}
