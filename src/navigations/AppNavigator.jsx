import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationState } from "@react-navigation/native";
import { Platform } from "react-native";

import WorkoutNavigator from "./WorkoutNavigator";
import HomeNavigator from "./HomeNavigator";

import StatsNavigator from "./StatsNavigator";
import MeasurementNavigator from "./MeasurementNavigator";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
	const { themeStyle } = useTheme();

	const state = useNavigationState((state) => state);

	const hideTab = state?.routes?.some((route) =>
		route?.state?.routes?.some(
			(subRoute) =>
				subRoute.name === "SettingScreen" ||
				subRoute.name === "ThemeScreen" ||
				subRoute.name === "EditProfile" ||
				subRoute.name === "TermsOfService" ||
				subRoute.name === "PrivacyPolicy" ||
				subRoute.name === "HelpAndSupport" ||
				subRoute.name == "WorkoutModalScreen" ||
				subRoute.name == "BlueprintModalScreen" ||
				subRoute.name == "EditModal"
		)
	);

	return (
		<Tab.Navigator
			// initialRouteName="Home"
			initialRouteName="Home"
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
			<Tab.Screen name="Home" component={HomeNavigator} />
			<Tab.Screen name="Workout" component={WorkoutNavigator} />
			<Tab.Screen name="Stat" component={StatsNavigator} />
			<Tab.Screen name="Measure" component={MeasurementNavigator} />
		</Tab.Navigator>
	);
}
