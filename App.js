import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import React, {useEffect} from "react";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import {ThemeProvider } from "./src/contexts/ThemeContext";
import { enableScreens } from "react-native-screens";
import * as NavigationBar from "expo-navigation-bar";
import { useTheme } from "./src/contexts/ThemeContext";

import Onboarding from "./src/pages/Auth/Onboarding";
import AppNavigator from "./src/navigations/AppNavigator";


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
					<GestureHandlerRootView>
						<UserProvider>
							<AppContent />
						</UserProvider>
					</GestureHandlerRootView>
				</MenuProvider>
			</SafeAreaProvider>
		</ThemeProvider>
	);
}

function AppContent() {
	const { user, init } = useUser();
	const { theme } = useTheme();

	if (init) {
		return null;
	}

	return (
		<NavigationContainer>
			<StatusBar style={theme.includes("light") ? "dark" : "light"} />
			{user ? <AppNavigator/> : <Onboarding />}
		</NavigationContainer>
	);
}
