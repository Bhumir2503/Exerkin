import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../pages/Home";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Profile") {
						iconName = focused ? "person" : "person-outline";
					} else if (route.name === "Friend") {
						iconName = focused ? "people" : "people-outline";
					} else if (route.name === "Workout") {
						iconName = focused ? "body" : "body-outline";
					} else if (route.name === "Stat") {
						iconName = focused ? "pie-chart" : "pie-chart-outline";
					} else if (route.name === "Setting") {
						iconName = focused ? "settings" : "settings-outline";
					}

					// You can return any component that you like here!
					return (
						<Ionicons name={iconName} size={size} color={color} />
					);
				},
				headerShown: false,
				tabBarActiveTintColor: "#fff",
				tabBarInactiveTintColor: "#fff",
				tabBarStyle: {
					backgroundColor: "#000",
					borderTopWidth: 0,
					shadowOpacity: 0,
					elevation: 0,
					height: 60, // Set height of tab bar
					paddingBottom: 20, // Add padding at the bottom
					paddingTop: 5, // Add padding at the top
				},
			})}
		>
			<Tab.Screen name="Profile" component={Home} />
			<Tab.Screen name="Friend" component={Home} />
			<Tab.Screen name="Workout" component={Home} />
			<Tab.Screen name="Stat" component={Home} />
			<Tab.Screen name="Setting" component={Home} />
		</Tab.Navigator>
	);
}
