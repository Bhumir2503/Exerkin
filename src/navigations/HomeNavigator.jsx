import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";

import HomeScreen from "../screens/Home/HomeScreen";
import WorkoutModalScreen from "../screens/Workout/WorkoutModalScreen";

import UpdateEmail from "../screens/Home/UpdateEmail";
import ChangePassword from "../screens/Home/ChangePassword";
import EditUsername from "../screens/Home/EditUsername";

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
				gestureEnabled: false,
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
		>
			<Stack.Screen name="HomeScreen" component={HomeScreen} />
			<Stack.Screen
				name="WorkoutModalScreen"
				component={WorkoutModalScreen}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forVerticalIOS,
				}}
			/>

			<Stack.Screen
				name="SettingScreen"
				component={SettingScreen}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forHorizontalIOS,
				}}
			/>
			<Stack.Screen name={"ThemeScreen"} component={ThemeScreen} />
			<Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
			<Stack.Screen name="TermsOfService" component={TermsOfService} />
			<Stack.Screen name="UpdateEmail" component={UpdateEmail} />
			<Stack.Screen name="ChangePassword" component={ChangePassword} />
			<Stack.Screen name="EditUsername" component={EditUsername} />
		</Stack.Navigator>
	);
}
