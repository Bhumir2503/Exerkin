import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserProvider, useUser } from "./src/contexts/UserContext";
import {ThemeProvider } from "./src/contexts/ThemeContext";
import { enableScreens } from "react-native-screens";

import Onboarding from "./src/pages/Onboarding";
import AppNavigator from "./src/navigations/AppNavigator";
import Home from "./src/pages/Home";

enableScreens();

export default function App() {
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

	if (init) {
		return null;
	}

	return (
		<NavigationContainer>
			<StatusBar style="light" />
			{user ? <AppNavigator/> : <Onboarding />}
		</NavigationContainer>
	);
}
