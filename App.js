import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";
import React, { use, useEffect, useState } from "react";

import { RealmProvider } from "./src/contexts/RealmProvider";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import BlueprintProvider from "./src/contexts/blueprint/BlueprintProvider";
import WorkoutProvider from "./src/contexts/workout/WorkoutProvider";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";

import { enableScreens } from "react-native-screens";
import * as NavigationBar from "expo-navigation-bar";
import { useTheme } from "./src/contexts/ThemeContext";

import AuthNavigator from "./src/navigations/AuthNavigator";
import AppNavigator from "./src/navigations/AppNavigator";
import SetUsername from "./src/screens/Auth/SetUsername";
import SplashScreen from "./src/screens/Auth/SplashScreen"; // Create this component for better UX

enableScreens();

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Define the theme object that will be used consistently throughout the app
export const midnightPurpleTheme = {
	backgroundColor: "#16161a",
	primary: "#7f2af0",
	secondary: "#72757e",
	textColor: "#fffffe",
	textColorSecondary: "#94a1b2",
	card: "#2d2d3a", // Darker card background
	cardAlt: "#2d2d3a", // Alternative card background for variety
	inputBackground: "#1e1e24", // Text input field background
	inputBorder: "#383844", // Text input border
	accent: "#e53170",
	success: "#72B01D",
	error: "#F87060",
	warning: "#F7B32B",
	info: "#3DA9FC",
};

export default function App() {
	const [init, setInit] = useState(true);
	console.log("App.js: Starting app..."); // For debugging purposes
	if (Platform.OS === "android") {
		NavigationBar.setBackgroundColorAsync(
			midnightPurpleTheme.backgroundColor
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: "#16161a" }}>

				<ThemeProvider>
					<SafeAreaProvider>
						<MenuProvider>
							<GestureHandlerRootView style={{ flex: 1 }}>
								<RealmProvider>
									<UserProvider>

											<WorkoutProvider>
												<BlueprintProvider>
													<AppContent />
												</BlueprintProvider>
											</WorkoutProvider>

									</UserProvider>
								</RealmProvider>
							</GestureHandlerRootView>
						</MenuProvider>
					</SafeAreaProvider>
				</ThemeProvider>

		</View>
	);
}

function AppContent() {
	const { user, init, isNewUser, setupComplete } = useUser();
	const [splashFinished, setSplashFinished] = useState(false);
	const { theme } = useTheme();
	const lightTheme = [
		"sunnyDaisy",
		"mintFresh",
		"rosePetal",
		"lavenderMist",
		"peachCream",
		"skyBlossom",
	];

	// Show splash screen if we're initializing or if splash animation isn't finished
	if (init || !splashFinished) {
		return (
			<SplashScreen onAnimationComplete={() => setSplashFinished(true)} />
		);
	}

	// No user - show auth flow
	if (!user) {
		return (
			<NavigationContainer
				theme={{
					colors: {
						background: midnightPurpleTheme.backgroundColor,
					},
				}}
			>
				<StatusBar
					style="light"
					backgroundColor={midnightPurpleTheme.backgroundColor}
				/>
				<AuthNavigator />
			</NavigationContainer>
		);
	}

	// User is logged in but hasn't completed setup
	if (isNewUser && !setupComplete) {
		return (
			<NavigationContainer>
				<StatusBar
					style="light"
					backgroundColor={midnightPurpleTheme.backgroundColor}
				/>
				<SetUsername />
			</NavigationContainer>
		);
	}

	// User is logged in and has completed setup
	return (
		<NavigationContainer>
			<StatusBar style={lightTheme.includes(theme) ? "dark" : "light"} />
			<AppNavigator />
		</NavigationContainer>
	);
}
