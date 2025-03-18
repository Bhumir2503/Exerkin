import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import React, { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WorkoutProvider } from "./src/contexts/WorkoutContext";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { enableScreens } from "react-native-screens";
import * as NavigationBar from "expo-navigation-bar";

import AuthNavigator from "./src/navigations/AuthNavigator";
import AppNavigator from "./src/navigations/AppNavigator";
import SetUsername from "./src/pages/Auth/SetUsername";
import SplashScreen from "./src/pages/Auth/SplashScreen"; // Create this component for better UX

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
	if (Platform.OS === "android") {
		NavigationBar.setVisibilityAsync("hidden");
		NavigationBar.setBackgroundColorAsync(
			midnightPurpleTheme.backgroundColor
		);
	}

	useEffect(() => {
		if (Platform.OS === "android") {
			const intervalId = setInterval(() => {
				NavigationBar.setVisibilityAsync("hidden");
			}, 5000);

			return () => clearInterval(intervalId); // Cleanup on unmount
		}
	}, []);

	return (
		<ThemeProvider>
			<SafeAreaProvider>
				<MenuProvider>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<UserProvider>
							<WorkoutProvider>
								<AppContent />
							</WorkoutProvider>
						</UserProvider>
					</GestureHandlerRootView>
				</MenuProvider>
			</SafeAreaProvider>
		</ThemeProvider>
	);
}

function AppContent() {
	const { user, init, isNewUser, setupComplete } = useUser();

	if (init) {
		// Show a splash screen while loading auth state
		return <SplashScreen />;
	}

	return (
		<NavigationContainer>
			<StatusBar
				style="light"
				backgroundColor={midnightPurpleTheme.backgroundColor}
			/>
			{!user ? (
				<AuthNavigator />
			) : isNewUser && !setupComplete ? (
				<SetUsername />
			) : (
				<AppNavigator />
			)}
		</NavigationContainer>
	);
}
