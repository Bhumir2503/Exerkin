import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";

import HomeScreen from "../screens/Home/HomeScreen";
import ThemeScreen from "../screens/Home/ThemeScreen";
import SettingScreen from "../screens/Home/SettingScreen";
import PrivacyPolicy from "../screens/Support/PrivacyPolicy";
import TermsOfService from "../screens/Support/TermsOfService";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function HomeNavigator() {
	const { themeStyle } = useTheme();

	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: themeStyle.backgroundColor,
					elevation: 0,
					shadowOpacity: 0,
				},
				headerTintColor: themeStyle.textColor,
				headerShown: false,
				gestureEnabled: true,
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
		>
			<Stack.Screen name="HomeScreen" component={HomeScreen} />

			<Stack.Screen
				name="SettingScreen"
				component={SettingScreen}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forHorizontalIOS,
					gestureDirection: "horizontal",
				}}
			/>
			<Stack.Screen name={"ThemeScreen"} component={ThemeScreen} />
			<Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
			<Stack.Screen name="TermsOfService" component={TermsOfService} />
		</Stack.Navigator>
	);
}
