import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../pages/Auth/Onboarding";
import SetUsername from "../pages/Auth/SetUsername";

const Stack = createStackNavigator();

export default function AuthNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Onboarding" component={Onboarding} />
			<Stack.Screen name="SetUsername" component={SetUsername} />
		</Stack.Navigator>
	);
}
