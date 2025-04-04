import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationState } from "@react-navigation/native";
import { Platform } from "react-native";

import ProfileNavigator from "./ProfileNavigator"; // Ensure this is the correct path to your ProfileNavigator
import WorkoutNavigator from "./WorkoutNavigator";
import Friends from "../pages/Friends/Friends";
import StatsNavigator from "./StatsNavigator";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
	const { themeStyle } = useTheme();

	const state = useNavigationState((state) => state);

	const hideTab = state?.routes?.some((route) =>
		route?.state?.routes?.some(
			(subRoute) =>
				subRoute.name === "Settings" ||
				subRoute.name === "EditTheme" ||
				subRoute.name === "EditProfile" ||
				subRoute.name === "TermsOfService" ||
				subRoute.name === "PrivacyPolicy" ||
				subRoute.name == "WorkoutModal"
		)
	);

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Home") {
						iconName = focused ? "home" : "home-outline";
					} else if (route.name === "Feed") {
						iconName = focused ? "people" : "people-outline";
					} else if (route.name === "WorkoutNav") {
						iconName = focused ? "barbell" : "barbell-outline";
					} else if (route.name === "Profile") {
						iconName = focused ? "person" : "person-outline";
					} else if (route.name === "StatsNav") {
						iconName = focused
							? "stats-chart"
							: "stats-chart-outline";
					}

					// You can return any component that you like here!
					return (
						<Ionicons name={iconName} size={size} color={color} />
					);
				},
				headerShown: false,
				tabBarActiveTintColor: themeStyle.primary,
				tabBarInactiveTintColor: themeStyle.textColorSecondary,
				tabBarStyle: {
					backgroundColor: themeStyle.backgroundColor,
					borderTopWidth: 0,
					shadowOpacity: 0,
					elevation: 0,
					height: Platform.OS === "ios" ? 75 : 60,
					paddingBottom: 20, // Add padding at the bottom
					paddingTop: 5, // Add padding at the top
					display: hideTab ? "none" : "flex",
				},
			})}
		>
			<Tab.Screen name="Home" component={ProfileNavigator} />
			<Tab.Screen name="StatsNav" component={StatsNavigator} />
			<Tab.Screen name="WorkoutNav" component={WorkoutNavigator} />
			<Tab.Screen name="Profile" component={Friends} />
		</Tab.Navigator>
	);
}
