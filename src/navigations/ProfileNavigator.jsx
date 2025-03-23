import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Profile/Settings";
import Stats from "../pages/Profile/Stats";
import EditTheme from "../pages/Profile/EditTheme";
import EditProfile from "../pages/Profile/EditProfile";
import TermsOfService from "../components/Profile/TermsOfService";
import PrivacyPolicy from "../components/Profile/PrivacyPolicy";
import { CardStyleInterpolators } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function ProfileNavigator() {
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
			<Stack.Screen name="ProfileStart" component={Profile} />

			<Stack.Screen
				name="Settings"
				component={Settings}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forHorizontalIOS, 
					gestureDirection: "horizontal",
				}}
			/>

			<Stack.Screen
				name="Stats"
				component={Stats}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forHorizontalIOS,
				}}
			/>

			<Stack.Screen name="EditTheme" component={EditTheme} />
			<Stack.Screen name="EditProfile" component={EditProfile} />
			<Stack.Screen name="TermsOfService" component={TermsOfService} />
			<Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
		</Stack.Navigator>
	);
}
