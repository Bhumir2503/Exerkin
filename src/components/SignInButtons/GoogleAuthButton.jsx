import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {
	GoogleSignin,
	GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
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
		<GoogleSigninButton
			style={{ width: 256, height: 48, marginBottom: 10 }}
			size={GoogleSigninButton.Size.Wide}
			color={GoogleSigninButton.Color.Dark}
			onPress={signIn}
			disabled={loading}
		/>
	);
}
