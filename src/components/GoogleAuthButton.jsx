import auth from "@react-native-firebase/auth";
import {
	GoogleSignin,
	GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

export default function GoogleAuthButton() {
	GoogleSignin.configure({
		webClientId:
			"708843610331-7qiliqg56itfq53apdt3rm7lltsd52sn.apps.googleusercontent.com",
	});

	const signIn = async () => {
		try {
			// Check if your device supports Google Play
			await GoogleSignin.hasPlayServices({
				showPlayServicesUpdateDialog: true,
			});
			// Get the users ID token
			const signInResult = await GoogleSignin.signIn();

			// Try the new style of google-sign in result, from v13+ of that module
			idToken = signInResult.data?.idToken;
			if (!idToken) {
				// if you are using older versions of google-signin, try old style result
				idToken = signInResult.idToken;
			}
			if (!idToken) {
				throw new Error("No ID token found");
			}

			// Create a Google credential with the token
			const googleCredential = auth.GoogleAuthProvider.credential(
				signInResult.data.idToken
			);

			// Sign-in the user with the credential
			auth().signInWithCredential(googleCredential);
		} catch (e) {
			console.warn(e);
		}
	};

	return (
		<GoogleSigninButton
			style={{ width: 256, height: 48, marginBottom: 10 }}
			size={GoogleSigninButton.Size.Wide}
			color={GoogleSigninButton.Color.Dark}
			onPress={signIn}
		/>
	);
}
