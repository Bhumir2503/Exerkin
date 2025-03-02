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
import { useTheme } from "./src/contexts/ThemeContext";

import AuthNavigator from "./src/navigations/AuthNavigator";
import AppNavigator from "./src/navigations/AppNavigator";
import SetUsername from "./src/pages/Auth/SetUsername";

enableScreens();

export default function App() {
	if (Platform.OS === "android") {
		NavigationBar.setVisibilityAsync("hidden");
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
	const { theme } = useTheme();

	if (init) {
		return null;
	}

	return (
		<NavigationContainer>
			<StatusBar style={theme.includes("light") ? "dark" : "light"} />
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
