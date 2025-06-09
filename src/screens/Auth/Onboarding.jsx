import React from "react";
import { StyleSheet, Text, View, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmailAuthButton from "../../components/SignInButtons/EmailAuthButton";
import GoogleAuthButton from "../../components/SignInButtons/GoogleAuthButton";
import AppleAuthButton from "../../components/SignInButtons/AppleAuthButton";

export default function Onboarding({ navigation }) {
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Exerkin</Text>
				<Text style={styles.subtitle}>Track, Share, Progress</Text>
			</View>

			<Image
				source={require("../../../assets/Onboarding.png")}
				style={styles.image}
				resizeMode="contain"
			/>

			<View style={styles.authContainer}>
				<GoogleAuthButton />
				{Platform.OS === "ios" && <AppleAuthButton />}

				<View style={styles.dividerContainer}>
					<View style={styles.divider} />
					<Text style={styles.orText}>OR</Text>
					<View style={styles.divider} />
				</View>

				<EmailAuthButton />

				<Text style={styles.termsText}>
					By continuing you agree to Exerkin's{" "}
					<Text
						style={styles.termsLink}
						onPress={() => navigation.navigate("TermsOfService")}
					>
						Terms of Service
					</Text>{" "}
					and{" "}
					<Text
						style={styles.termsLink}
						onPress={() => navigation.navigate("PrivacyPolicy")}
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
		backgroundColor: "#16161a", // midnightPurple.backgroundColor
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 20,
	},
	headerContainer: {
		alignItems: "center",
		marginTop: 10,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#7f2af0", // midnightPurple.primary
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#94a1b2", // midnightPurple.textColorSecondary
		marginBottom: 20,
	},
	image: {
		width: "90%",
		height: "40%",
		marginBottom: 20,
	},
	authContainer: {
		width: "90%",
		alignItems: "center",
		marginBottom: 20,
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		marginVertical: 20,
	},
	divider: {
		flex: 1,
		height: 1,
		backgroundColor: "#383844", // midnightPurple.inputBorder
	},
	orText: {
		fontWeight: "bold",
		color: "#94a1b2", // midnightPurple.textColorSecondary
		marginHorizontal: 15,
	},
	loginContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 20,
	},
	accountText: {
		color: "#fffffe", // midnightPurple.textColor
	},
	loginButton: {
		marginLeft: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	loginText: {
		color: "#7f2af0", // midnightPurple.primary
		fontWeight: "bold",
	},
	termsText: {
		color: "#94a1b2", // midnightPurple.textColorSecondary
		textAlign: "center",
		marginTop: 25,
		paddingHorizontal: 20,
		fontSize: 12,
	},
	termsLink: {
		color: "#7f2af0", // midnightPurple.primary
		textDecorationLine: "underline",
	},
});
