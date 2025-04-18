import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../screens/Auth/Onboarding";
import SetUsername from "../screens/Auth/SetUsername";

const Stack = createStackNavigator();

export default function AuthNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				cardStyle: { backgroundColor: "#16161a" },
				cardStyleInterpolator: ({ current: { progress } }) => ({
					cardStyle: {
						opacity: progress,
					},
				}),
			}}
		>
			<Stack.Screen name="Onboarding" component={Onboarding} />
			<Stack.Screen name="SetUsername" component={SetUsername} />
		</Stack.Navigator>
	);
}
