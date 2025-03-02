import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Image,
	Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmailAuthButton from "../../components/SignInButtons/EmailAuthButton";
import GoogleAuthButton from "../../components/SignInButtons/GoogleAuthButton";
import AppleAuthButton from "../../components/SignInButtons/AppleAuthButton";

export default function Onboarding() {
	const { width, height } = Dimensions.get("window");

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Exerkin</Text>
			<Image
				source={require("../../../assets/Onboarding.png")}
				style={{ width: width, height: width, marginBottom: 50 }}
			/>
			<View style={styles.authContainer}>
				<GoogleAuthButton />
				{Platform.OS === "ios" && <AppleAuthButton />}
				<Text style={styles.or}>OR</Text>
				<EmailAuthButton />
				<Text style={styles.subText}>
					By continuing you agree to Exerkin's{" "}
					<Text
						style={{ textDecorationLine: "underline" }}
						onPress={() => console.log("Terms of Service")}
					>
						Terms of Service
					</Text>{" "}
					and{" "}
					<Text
						style={{ textDecorationLine: "underline" }}
						onPress={() => console.log("Privacy Policy")}
					>
						Privacy Policy
					</Text>
					.
				</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#121212",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 20,
		color: "#407BFF",
	},
	authContainer: {
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 25,
		width: "100%",
	},
	or: {
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 5,
	},
	subText: {
		color: "#FFFFFF",
		textAlign: "center",
		marginTop: 10,
		paddingHorizontal: 20,
	},
});
