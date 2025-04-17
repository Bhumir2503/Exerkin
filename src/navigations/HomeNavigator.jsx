import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "../contexts/ThemeContext";

import HomeScreen from "../screens/Home/HomeScreen";
import Settings from "../pages/Profile/Settings";

// import WorkoutModal from "../components/WorkoutPage/WorkoutModal";
// import EditModal from "../components/EditPage/EditModal";
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
				name="Settings"
				component={Settings}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forHorizontalIOS,
					gestureDirection: "horizontal",
				}}
			/>
			{/* <Stack.Screen
                name="WorkoutModal"
                component={WorkoutModal}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forVerticalIOS, // Use forModalPresentationIOS for iOS style modal slide
                }}
            />

            <Stack.Screen
                name="EditModal"
                component={EditModal}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forVerticalIOS, // Use forModalPresentationIOS for iOS style modal slide
                }}
            /> */}

			{/* <Stack.Screen name="EditTheme" component={EditTheme} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="TermsOfService" component={TermsOfService} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} /> */}
		</Stack.Navigator>
	);
}
