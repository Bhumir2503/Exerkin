import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MenuProvider } from "react-native-popup-menu";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { UserProvider, useUser } from "./src/contexts/UserContext";

import Onboarding from "./src/pages/Onboarding";
import AppNavigator from "./src/navigations/AppNavigator";
import Home from "./src/pages/Home";

export default function App() {
	return (
		<SafeAreaProvider>
			<MenuProvider>
				<GestureHandlerRootView>
					<UserProvider>
						<AppContent />
					</UserProvider>
				</GestureHandlerRootView>
			</MenuProvider>
		</SafeAreaProvider>
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
			{user ? <Home/> : <Onboarding />}
		</NavigationContainer>
	);
}
