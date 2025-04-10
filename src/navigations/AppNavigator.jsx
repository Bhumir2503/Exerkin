import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationState } from "@react-navigation/native";
import { Platform } from "react-native";

import ProfileNavigator from "./ProfileNavigator"; // Ensure this is the correct path to your ProfileNavigator
import WorkoutNavigator from "./WorkoutNavigator";
import Friends from "../pages/Friends/Friends";
import Measurement from "../pages/Measure/Measurement";
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
				subRoute.name == "WorkoutModal" ||
				subRoute.name == "TemplateModal" 
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
					} else if (route.name === "Workout") {
						iconName = focused ? "barbell" : "barbell-outline";
					} else if (route.name === "Measure") {
						iconName = focused ? "scale" : "scale-outline";
					} else if (route.name === "Stat") {
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

					height: Platform.OS === "ios" ? 85 : 60,
					paddingBottom: 20, // Add padding at the bottom
					paddingTop: 5, // Add padding at the top
					display: hideTab ? "none" : "flex",
				},
			})}
		>
			<Tab.Screen name="Home" component={ProfileNavigator} />
			<Tab.Screen name="Stat" component={StatsNavigator} />
			<Tab.Screen name="Workout" component={WorkoutNavigator} />
			<Tab.Screen name="Measure" component={Measurement} />
		</Tab.Navigator>
	);
}
