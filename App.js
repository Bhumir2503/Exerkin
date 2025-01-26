import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider, useUser } from "./src/contexts/UserContext";

import auth from "@react-native-firebase/auth";

import AppleAuthButton from "./src/components/SignInButtons/AppleAuthButton";
import GoogleAuthButton from "./src/components/SignInButtons/GoogleAuthButton";
import EmailAuthButton from "./src/components/SignInButtons/EmailAuthButton";

export default function App() {
	return (
		<SafeAreaProvider>
			<MenuProvider>
				<UserProvider>
					<AppContent />
				</UserProvider>
			</MenuProvider>
		</SafeAreaProvider>
	);
}

function AppContent() {
	const { user, init } = useUser();

	if (init) {
		return null;
	}

	if (user) {
		return (
			<View style={styles.container}>
				<Text>Welcome {user.displayName}</Text>
				<StatusBar style="auto" />
				<Text onPress={() => auth().signOut()}>Signout</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<AppleAuthButton />
			<GoogleAuthButton />
			<EmailAuthButton />
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
