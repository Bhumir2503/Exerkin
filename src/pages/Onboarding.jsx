import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmailAuthButton from "../components/SignInButtons/EmailAuthButton";
import GoogleAuthButton from "../components/SignInButtons/GoogleAuthButton";
import AppleAuthButton from "../components/SignInButtons/AppleAuthButton";

export default function Onboarding() {
    const { width, height } = Dimensions.get("window");

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Exerkin</Text>
            <Image
                source={require("../../assets/Onboarding.png")}
                style={{ width: width, height: width, marginBottom: 50 }}
            />
			<GoogleAuthButton />
			{Platform.OS === "ios" && <AppleAuthButton />}
			<Text style={styles.or}>OR</Text>
			<EmailAuthButton />
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
    or: {
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 5,
    },
});
